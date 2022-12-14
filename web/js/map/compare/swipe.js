import React from 'react';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import lodashRound from 'lodash/round';
import lodashEach from 'lodash/each';
import { getRenderPixel } from 'ol/render';

import util from '../../util/util';
import { getCompareDates } from '../../modules/compare/selectors';
import { COMPARE_MOVE_START } from '../../util/constants';

const { events } = util;

let swipeOffset = null;
let line = null;
let layersSideA = [];
let layersSideB = [];
let mapCase;
let listenerObj;
let percentSwipe = null;
const SWIPE_PADDING = 30;
let dragging = false;

const restore = function(event) {
  const ctx = event.context;
  ctx.restore();
};

const applyListenersA = function(layer) {
  layer.on('prerender', this.clipA);
  layer.on('postrender', restore);
};
const applyListenersB = function(layer) {
  layer.on('prerender', this.clipB);
  layer.on('postrender', restore);
};

export default class Swipe {
  constructor(
    olMap,
    store,
    eventListenerStringObj,
    valueOverride,
  ) {
    listenerObj = eventListenerStringObj;
    this.map = olMap;
    percentSwipe = valueOverride / 100;
    this.create(store);
    window.addEventListener('resize', () => {
      if (document.querySelector('.ab-swipe-line')) {
        this.destroy();
        this.create(store);
      }
    });
  }

  create(store) {
    const state = store.getState();
    const { dateA, dateB } = getCompareDates(state);
    this.dateA = dateA;
    this.dateB = dateB;
    line = addLineOverlay(this.map, this.dateA, this.dateB, this.updateExtents);
    this.update(store);
  }

  destroy = () => {
    mapCase.removeChild(line);
    lodashEach(layersSideA, (layer) => {
      layer.un('prerender', this.clipA);
      layer.un('postrender', restore);
    });
    lodashEach(layersSideB, (layer) => {
      layer.un('prerender', this.clipB);
      layer.un('postrender', restore);
    });
    layersSideA = [];
    layersSideB = [];
  }

  getSwipeOffset = () => swipeOffset;

  update(store) {
    const state = store.getState();
    const { dateA, dateB } = getCompareDates(state);

    if (dateA !== this.dateA || dateB !== this.dateB) {
      this.destroy();
      this.create(store);
    } else {
      const layerGroups = this.map.getLayers().getArray();
      layersSideA = layerGroups[0].getLayersArray();
      layersSideB = layerGroups[1].getLayersArray();
      layersSideA.forEach((l) => {
        this.applyEventListeners(l, applyListenersA);
      });
      layersSideB.forEach((l) => {
        this.applyEventListeners(l, applyListenersB);
      });
    }
  }

  applyEventListeners(layer, callback) {
    const layers = layer.get('layers');
    if (layers) {
      lodashEach(layers.getArray(), (l) => {
        this.applyEventListeners(l, callback);
      });
    } else {
      callback.call(this, layer);
    }
  }

  /**
   * Set Clip/Mask for the "A" side of a comparison.
   * We must mask the "A" side for circumstances where the B side has no
   * active layer group(s) or those layer(s) are transparent
   * @param {Object} event | OL Precompose event object
   */
  clipA = (event) => {
    // const ctx = event.context;
    // const viewportWidth = event.frameState.size[0];
    // const canvasWidth = ctx.canvas.width;
    // const canvasHeight = ctx.canvas.height;
    // const width = canvasWidth * (1 - swipeOffset / viewportWidth);
    // const rotationA = event.frameState.viewState.rotation;

    // // console.log(`A: viewportWidth: ${viewportWidth} | canvasWidth: ${canvasWidth} | canvasHeight: ${canvasHeight} | rotationA: ${rotationA}`);

    // ctx.save(); // saves the current canvas state
    // ctx.rect(0, 0, width, canvasHeight);
    // ctx.clip(); // turns the current path into the clipping region

    const ctx = event.context;
    const mapSize = this.map.getSize();
    const width = mapSize[0] * percentSwipe;
    const topLeft = getRenderPixel(event, [width, 0]);
    const topRight = getRenderPixel(event, [mapSize[0], 0]);
    const bottomLeft = getRenderPixel(event, [width, mapSize[1]]);
    const bottomRight = getRenderPixel(event, mapSize);

    console.log(`topLeft: ${topLeft}`);
    console.log(`topRight: ${topRight}`);
    console.log(`bottomLeft: ${bottomLeft}`);
    console.log(`bottomRight: ${bottomRight}`);

    ctx.save();
    // Construct our clipping mask counterclockwise!
    ctx.beginPath();

    // starting position
    console.log(`starting position: ${topLeft[0]}, ${bottomRight[1]}`);
    ctx.moveTo(topLeft[0], bottomRight[1]);

    // bottom left
    console.log(topLeft[0], 0);
    ctx.lineTo(topLeft[0], 0);

    // bottom right
    console.log(topRight[0], 0);
    ctx.lineTo(topRight[0], 0);

    // top left
    console.log(0, bottomRight[1]);
    ctx.lineTo(0, bottomRight[1]);

    ctx.closePath();
    ctx.clip();
  }

  /**
   * Set Clip/Mask for the "B" side of a comparison.
   * The "B" side exists on top of the "A" side so it must be clipped
   * to allow the "A" side to show.
   * @param {Object} event | OL Precompose event object
   */
  clipB = (event) => {
    const ctx = event.context;
    const mapSize = this.map.getSize();
    const width = mapSize[0] * percentSwipe;
    const topLeft = getRenderPixel(event, [width, 0]);
    const topRight = getRenderPixel(event, [mapSize[0], 0]);
    const bottomLeft = getRenderPixel(event, [width, mapSize[1]]);
    const bottomRight = getRenderPixel(event, mapSize);

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(topLeft[0], topLeft[1]);
    ctx.lineTo(bottomLeft[0], bottomLeft[1]);
    ctx.lineTo(bottomRight[0], bottomRight[1]);
    ctx.lineTo(topRight[0], topRight[1]);
    ctx.closePath();
    ctx.clip();
  }
}

/**
 * Add Swiper
 * @param {Object} map | OL map object
 * @param {String} dateA | YYYY-MM-DD
 * @param {String} dateB | YYYY-MM-DD
 */
const addLineOverlay = function(map, dateA, dateB) {
  const lineCaseEl = document.createElement('div');
  const draggerEl = document.createElement('div');
  const draggerCircleEl = document.createElement('div');
  const firstLabel = document.createElement('span');
  const secondLabel = document.createElement('span');
  const windowWidth = window.innerWidth;
  mapCase = map.getTargetElement();
  draggerCircleEl.className = 'swipe-dragger-circle';
  firstLabel.className = 'ab-swipe-span left-label';
  secondLabel.className = 'ab-swipe-span right-label';

  const dateElA = document.createElement('span');
  const dateElB = document.createElement('span');
  dateElA.className = 'monospace';
  dateElB.className = 'monospace';

  const isSameDate = dateA === dateB;
  const dateAText = 'A';
  const dateBText = 'B';
  firstLabel.appendChild(document.createTextNode(dateAText));
  secondLabel.appendChild(document.createTextNode(dateBText));

  if (!isSameDate) {
    firstLabel.className += ' show-date-label';
    secondLabel.className += ' show-date-label';
    dateElA.appendChild(document.createTextNode(`: ${dateA}`));
    dateElB.appendChild(document.createTextNode(`: ${dateB}`));

    firstLabel.appendChild(dateElA);
    secondLabel.appendChild(dateElB);
  }

  draggerEl.className = 'ab-swipe-dragger';
  lineCaseEl.className = 'ab-swipe-line';
  lineCaseEl.appendChild(firstLabel);
  lineCaseEl.appendChild(secondLabel);
  draggerEl.appendChild(draggerCircleEl);
  ReactDOM.render(<FontAwesomeIcon icon="arrows-alt-h" />, draggerCircleEl);
  lineCaseEl.appendChild(draggerEl);
  mapCase.appendChild(lineCaseEl);
  swipeOffset = percentSwipe
    ? windowWidth * percentSwipe
    : swipeOffset || windowWidth / 2;
  lineCaseEl.style.transform = `translateX( ${swipeOffset}px)`;

  // Add event listeners to Elements
  [lineCaseEl, draggerEl].forEach((el) => {
    el.addEventListener(
      'mousedown',
      () => {
        listenerObj = {
          type: 'default',
          start: 'mousedown',
          move: 'mousemove',
          end: 'mouseup',
        };
        dragLine(listenerObj, lineCaseEl, map);
      },
      true,
    );

    el.addEventListener(
      'touchstart',
      () => {
        listenerObj = {
          type: 'touch',
          start: 'touchstart',
          move: 'touchmove',
          end: 'touchend',
        };
        dragLine(listenerObj, lineCaseEl, map);
      },
      true,
    );
  });

  return lineCaseEl;
};

const dragLine = function(listenerObj, lineCaseEl, map) {
  function move(evt) {
    if (!dragging) {
      dragging = true;
      events.trigger(COMPARE_MOVE_START);
    }
    const windowWidth = window.innerWidth;
    if (listenerObj.type === 'default') evt.preventDefault();
    evt.stopPropagation();

    if (listenerObj.type === 'touch') {
      swipeOffset = evt.touches[0].pageX;
    } else {
      swipeOffset = evt.clientX;
    }
    // Prevent swiper from being swiped off screen
    swipeOffset = swipeOffset > windowWidth - SWIPE_PADDING
      ? windowWidth - SWIPE_PADDING
      : swipeOffset < SWIPE_PADDING
        ? SWIPE_PADDING
        : swipeOffset;
    percentSwipe = swipeOffset / windowWidth;
    lineCaseEl.style.transform = `translateX( ${swipeOffset}px)`;
    map.render();
  }

  function end(evt) {
    dragging = false;
    events.trigger(
      'compare:moveend',
      lodashRound((swipeOffset / mapCase.offsetWidth) * 100, 0),
    );
    window.removeEventListener(listenerObj.move, move);
    window.removeEventListener(listenerObj.end, end);
  }

  window.addEventListener(listenerObj.move, move);
  window.addEventListener(listenerObj.end, end);
};
