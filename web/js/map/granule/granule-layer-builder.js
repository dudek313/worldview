import OlLayerGroup from 'ol/layer/Group';
import { throttle as lodashThrottle } from 'lodash';
import OlCollection from 'ol/Collection';
import { DEFAULT_NUM_GRANULES } from '../../modules/layers/constants';
import { updateGranuleLayerState } from '../../modules/layers/actions';
import { getGranuleLayer } from '../../modules/layers/selectors';
import {
  startLoading,
  stopLoading,
  LOADING_GRANULES,
} from '../../modules/loading/actions';
import { FULL_MAP_EXTENT, CRS } from '../../modules/map/constants';
import { openBasicContent } from '../../modules/modal/actions';
import { getCacheOptions } from '../../modules/layers/util';
import { getGranulesUrl as getGranulesUrlSelector } from '../../modules/smart-handoff/selectors';
import {
  getParamsForGranuleRequest,
  isWithinBounds,
  isWithinDateRange,
  transformGranuleData,
  datelineShiftGranules,
  transformGranulesForProj,
} from './util';
import util from '../../util/util';

const { toISOStringSeconds } = util;

export default function granuleLayerBuilder(cache, store, createLayerWMTS) {
  const getGranuleUrl = getGranulesUrlSelector(store.getState());
  const baseGranuleUrl = getGranuleUrl();
  const CMR_AJAX_OPTIONS = {
    url: baseGranuleUrl,
    cache: 'force-cache',
    headers: { 'Client-Id': 'Worldview' },
    traditional: true,
    dataType: 'json',
    timeout: 30 * 1000,
  };

  function dispathCMRErrorDialog (title) {
    const bodyText = `The Common Metadata Repository (CMR) service that
    provides metadata for this granule layer, ${title}, is currently unavailable.
    Please try again later.`;
    const modalHeader = 'Granules unavailable at this time.';
    store.dispatch(openBasicContent(modalHeader, bodyText));
  }

  const throttleDispathCMRErrorDialog = lodashThrottle(
    dispathCMRErrorDialog.bind(this),
    CMR_AJAX_OPTIONS.timeout,
    { leading: true, trailing: false },
  );

  const showLoading = () => {
    store.dispatch(startLoading(LOADING_GRANULES));
  };

  const hideLoading = () => {
    store.dispatch(stopLoading(LOADING_GRANULES));
  };

  /**
   * Query CMR to get dates
   * @param {object} def - Layer specs
   * @param {object} selectedDate - current selected date (Note: may not return this date, but this date will be the max returned)
   * @returns {array} granule dates
  */
  const getQueriedGranuleDates = async (def, selectedDate) => {
    const {
      title,
    } = def;
    const state = store.getState();
    const { proj: { selected: { crs } } } = state;
    const getGranulesUrl = getGranulesUrlSelector(state);
    const paramsArray = getParamsForGranuleRequest(def, selectedDate, crs);
    let data = [];
    let nrtData = [];
    try {
      showLoading();
      const promises = paramsArray.map((params) => {
        const requestUrl = getGranulesUrl(params);
        return fetch(requestUrl, CMR_AJAX_OPTIONS);
      });
      const responses = await Promise.allSettled(promises);
      const fulfilledResponses = responses.filter(({ status }) => status === 'fulfilled').map(({ value }) => value);
      const [response, nrtResponse] = fulfilledResponses;
      const jsonRequests = [response?.json(), nrtResponse?.json()];
      const jsonResponses = await Promise.allSettled(jsonRequests);
      const [responseJson, nrtResponseJson] = jsonResponses.filter(({ status }) => status === 'fulfilled').map(({ value }) => value);
      data = responseJson?.feed?.entry || [];
      nrtData = nrtResponseJson?.feed?.entry || [];
    } catch (e) {
      console.error(e);
      throttleDispathCMRErrorDialog(title);
    } finally {
      hideLoading();
    }

    const transformedData = [...data, ...nrtData].map((entry) => {
      const date = toISOStringSeconds(entry.time_start);

      return transformGranuleData(entry, date, crs);
    });
    const dedupedData = transformedData.reduce((acc, granule) => {
      const { date } = granule;
      const dateIndex = acc.findIndex((g) => g.date === date);
      if (dateIndex >= 0) return acc;
      return [...acc, granule];
    }, []);

    return dedupedData;
  };

  /**
   * Create collection of granule TileLayers from range of granule times
   * @param {array} granueDates - array of dates (already sorted)
   * @param {object} def - Layer specs
   * @param {object} attributes - Layer specs
   * @returns {array} collection of OpenLayers TileLayers
  */
  const createGranuleTileLayers = (granules, def, attributes) => {
    const { period, id } = def;
    const { group, proj } = attributes;

    return granules.map((granule) => {
      const { date, polygon, shifted } = granule;
      const granuleISOKey = `${id}:${proj}:${date}::${group}:${shifted ? 'shifted' : ''}`;
      let tileLayer = cache.getItem(granuleISOKey);
      if (tileLayer) {
        return tileLayer;
      }
      const granuleISODate = new Date(date);
      const options = {
        date: granuleISODate,
        polygon,
        shifted,
      };
      tileLayer = createLayerWMTS(def, options, null, store.getState());

      attributes.key = granuleISOKey;
      attributes.date = granuleISODate;
      tileLayer.wv = attributes;
      cache.setItem(granuleISOKey, tileLayer, getCacheOptions(period, granuleISODate));
      tileLayer.setVisible(false);
      return tileLayer;
    });
  };

  /**
   * Check if date is within a range
   * @param {Date} date - date to check
   * @param {array} ranges - array of date ranges
   * @returns {boolean} - true if date is within a range
  */
  const isWithinRanges = (date, ranges) => {
    if (!ranges) return;

    return ranges.some(([start, end]) => date >= new Date(start) && date <= new Date(end));
  };

  /**
   * Identify gaps between date ranges
   * @param {array} ranges - array of date ranges
   * @returns {array} - array of date ranges
  */
  const identifyGaps = (ranges) => {
    if (!ranges) return [];
    const MAX_TIME = 8.64e15;

    const gaps = ranges.reduce((acc, [start, end]) => {
      acc.at(-1)[1] = new Date(start);

      return [...acc, [new Date(end), new Date(MAX_TIME)]];
    }, [[new Date(-MAX_TIME), new Date(MAX_TIME)]]);

    return gaps;
  };

  /**
   * Get granuleCount number of granules that have visible imagery based on
   * predetermined longitude bounds.
   *
   * @param {Array} availableGranules - available granules to be filtered
   * @param {number} granuleCount - number of granules to filter down to
   * @param {Date} leadingEdgeDate - timeline date
   * @returns {array}
  */
  const getVisibleGranules = (availableGranules, granuleCount, leadingEdgeDate, granuleDateRanges) => {
    const { proj: { selected: { crs } } } = store.getState();
    const visibleGranules = [];
    const invisibleGranules = [];
    const availableCount = availableGranules?.length;
    if (!availableCount) return { visibleGranules, invisibleGranules };
    const count = granuleCount > availableCount ? availableCount : granuleCount;
    const sortedAvailableGranules = availableGranules.sort((a, b) => new Date(b.date) - new Date(a.date));
    let totalLength = visibleGranules.length + invisibleGranules.length;
    for (let i = 0; totalLength < count; i += 1) {
      const item = sortedAvailableGranules[i];
      if (!item) break;
      const { date } = item;
      const dateDate = new Date(date);
      leadingEdgeDate.setSeconds(59); // force currently selected time to be 59 seconds. This is to compensate for the inability to select seconds in the timeline
      const isWithinRange = isWithinRanges(leadingEdgeDate, granuleDateRanges); // check if currently selected time is within a date range
      const granuleIsWithinRange = isWithinRanges(dateDate, granuleDateRanges) ?? true; // check if the current granule is within a date range, defaults to true
      const gaps = identifyGaps(granuleDateRanges); // identify gaps between date ranges
      const currentlySelectedGap = !isWithinRange ? gaps.find(([start, end]) => leadingEdgeDate >= start && leadingEdgeDate <= end) : null; // get the gap that the currently selected time is within
      const granuleIsWithinSelectedGap = currentlySelectedGap ? dateDate >= currentlySelectedGap[0] && dateDate <= currentlySelectedGap[1] : true; // check if the current granule is within the currently selected gap

      if (dateDate <= leadingEdgeDate && isWithinRange && granuleIsWithinRange && isWithinBounds(crs, item)) {
        visibleGranules.unshift(item);
      } else if (dateDate <= leadingEdgeDate && !granuleIsWithinRange && isWithinBounds(crs, item) && granuleIsWithinSelectedGap) {
        invisibleGranules.unshift(item);
      }

      totalLength = visibleGranules.length + invisibleGranules.length;
    }

    if (totalLength < granuleCount) {
      console.warn('Could not find enough matching granules', `${totalLength}/${granuleCount}`);
    }
    return { visibleGranules, invisibleGranules };
  };

  /**
   * @method getGranuleAttributes
   * @param {object} def
   * @param {object} options
   * @returns {object} granuleAttributes
   */
  const getGranuleAttributes = async (def, options) => {
    const state = store.getState();
    const { proj: { selected: { crs } } } = state;
    const { granuleCount, date, group } = options;
    const { count: currentCount } = getGranuleLayer(state, def.id) || {};
    const count = currentCount || granuleCount || def.count || DEFAULT_NUM_GRANULES;
    const { granuleDateRanges } = def;

    // get granule dates waiting for CMR query and filtering (if necessary)
    const availableGranules = await getQueriedGranuleDates(def, date, group);
    const { visibleGranules, invisibleGranules } = getVisibleGranules(availableGranules, count, date, granuleDateRanges);
    const transformedVisibleGranules = transformGranulesForProj(visibleGranules, crs);
    const transformedInvisibleGranules = transformGranulesForProj(invisibleGranules, crs);

    return {
      count,
      granuleDates: [...transformedVisibleGranules.map((g) => g.date), ...transformedInvisibleGranules.map((g) => g.date)],
      visibleGranules: transformedVisibleGranules,
      invisibleGranules: transformedInvisibleGranules,
      granuleDateRanges,
    };
  };

  /**
   * @method createGranuleLayer
   * @param {object} def - Layer specs
   * @param {object} attributes
   * @param {object} options
   * @returns {object} - Granule layer
  */
  const createGranuleLayer = async (def, attributes, options) => {
    const {
      animation: { isPlaying },
      proj: { selected: { crs, maxExtent } },
    } = store.getState();
    const { id, startDate, endDate } = def;
    const { date, group } = attributes;
    const granuleLayer = new OlLayerGroup();
    granuleLayer.wv = { ...attributes };

    const dateInRange = isWithinDateRange(date, startDate, endDate);
    if (!dateInRange) {
      return granuleLayer;
    }

    const granuleAttributes = await getGranuleAttributes(def, options);
    const { visibleGranules, invisibleGranules } = granuleAttributes;
    const shouldShift = def.shiftadjacentdays ?? true; // defaults to true
    const shiftedVisibleGranules = shouldShift ? datelineShiftGranules(visibleGranules, date, crs) : visibleGranules;
    const shiftedInvisibleGranules = shouldShift ? datelineShiftGranules(invisibleGranules, date, crs) : invisibleGranules;
    const tileLayers = new OlCollection(createGranuleTileLayers(shiftedVisibleGranules, def, attributes));
    granuleLayer.setLayers(tileLayers);
    granuleLayer.setExtent(crs === CRS.GEOGRAPHIC ? FULL_MAP_EXTENT : maxExtent);
    granuleLayer.set('granuleGroup', true);
    granuleLayer.set('layerId', `${id}-${group}`);
    granuleLayer.wv = {
      ...attributes,
      ...granuleAttributes,
      visibleGranules: shiftedVisibleGranules,
      invisibleGranules: shiftedInvisibleGranules,
    };

    // Don't update during animation due to the performance hit
    if (!isPlaying) {
      store.dispatch(updateGranuleLayerState(granuleLayer));
    }

    return granuleLayer;
  };

  return {
    getGranuleLayer: createGranuleLayer,
  };
}
