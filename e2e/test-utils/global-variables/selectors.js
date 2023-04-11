module.exports = (page) => ({
  // animations
  createGifIcon: page.locator('#wv-animation-widget-file-video-icon'),
  createGifButton: page.locator('.gif-dialog .button-text'),
  gifPreviewStartDate: page.locator('.gif-download-grid .grid-child:nth-child(2) span'),
  gifPreviewEndDate: page.locator('.gif-download-grid .grid-child:nth-child(4) span'),
  gifPreviewFrameRateValue: page.locator('.gif-download-grid .grid-child:nth-child(6) span'),
  gifPreviewEndResolutionSelector: page.locator('.gif-selector-case #gif-resolution'),
  gifPreviewEndResolutionOption250: page.locator('#gif-resolution option[value="1"]'),
  gifPreviewEndResolutionOption500: page.locator('#gif-resolution option[value="2"]'),
  gifDownloadIcon: page.locator('.animation-gif-dialog-wrapper .wv-button.gray'),
  gifDownloadButton: page.locator('.animation-gif-dialog-wrapper .wv-button'),
  gifResults: page.locator('.gif-results-dialog-case img'),
  animationWidget: page.locator('#wv-animation-widget'),
  animationButtonCase: page.locator('#timeline-header .animate-button'),
  animationButton: page.locator('.animate-button'),
  playButton: page.locator('#play-button'),
  animateYearUp: page.locator('.wv-date-range-selector > div > div:nth-child(2) > div > svg > .uparrow'),
  animateYearDown: page.locator('.wv-date-range-selector > div > div > div:nth-child(3) > svg > .downarrow'),
  yearStartInput: page.locator('#year-animation-widget-start'),
  monthStartInput: page.locator('#month-animation-widget-start'),
  dayStartInput: page.locator('#day-animation-widget-start'),
  hourStartInput: page.locator('#hour-animation-widget-start'),
  minuteStartInput: page.locator('#minute-animation-widget-start'),
  yearEndInput: page.locator('#year-animation-widget-end'),
  monthEndInput: page.locator('#month-animation-widget-end'),
  dayEndInput: page.locator('#day-animation-widget-end'),
  hourEndInput: page.locator('#hour-animation-widget-end'),
  minuteEndInput: page.locator('#minute-animation-widget-end'),
  animationIntervalSelector: page.locator('#wv-animation-widget #current-interval'),
  animationFrameSlider: page.locator('#wv-animation-widget .rc-slider'),
  rotationDialogOkButton: page.locator('#image_download_notify_rotate .accept-notify'),
  arcticRotationResetButton: page.locator('.wv-map-reset-rotation'),

  // mobile animations
  mobileAnimateButton: page.locator('.mobile-animate-button'),
  mobileAnimationWidget: page.locator('.wv-animation-widget-wrapper-mobile'),
  closeMobileAnimation: page.locator('#mobile-animation-close'),
  mobileAnimationPortraitView: page.locator('#collapsed-animate-widget-phone-portrait'),
  mobileDatePickerSpanText: page.locator('.mobile-date-picker-select-btn-text span'),

  // sidebar, layers
  sidebarContainer: page.locator('#products-holder'),
  infoButton: page.locator('.wv-layers-info'),
  optionsButton: page.locator('.wv-layers-options'),
  infoDialog: page.locator('.layer-info-modal'),
  optionsDialog: page.locator('.layer-settings-modal'),
  addLayers: page.locator('#layers-add'),
  dataDownloadTabButton: page.locator('#download-sidebar-tab'),
  eventsSidebarTabButton: page.locator('#events-sidebar-tab'),
  groupCheckbox: page.locator('#group-overlays-checkbox'),
  viirsFiresCheckbox: page.locator('#VIIRS_NOAA20_Thermal_Anomalies_375m_All-checkbox'),
  firesGroup: page.locator('#active-Fires_and_Thermal_Anomalies'),
  firesLayer: page.locator('#active-VIIRS_NOAA20_Thermal_Anomalies_375m_All'),
  firesRemove: page.locator('#close-activeVIIRS_NOAA20_Thermal_Anomalies_375m_All'),
  aodGroup: page.locator('#active-Aerosol_Optical_Depth'),
  aodGroupHeader: page.locator('#active-Aerosol_Optical_Depth .layer-group-header'),
  firesGroupHeader: page.locator('#active-Fires_and_Thermal_Anomalies .layer-group-header'),
  overlaysGroup: page.locator('#active-overlays'),
  overlaysGroupHeader: page.locator('#active-overlays .layer-group-header'),
  baselayersGroup: page.locator('#active-baselayers'),
  baselayersGroupHeader: page.locator('#active-baselayers .layer-group-header'),
  groupOptionsBtn: page.locator('.layer-group-more-options > button'),
  groupHide: page.locator('.layer-group-more-options #hide-all'),
  groupShow: page.locator('.layer-group-more-options #show-all'),
  groupRemove: page.locator('.layer-group-more-options #remove-group'),
  layerVisible: page.locator('li.layer-visible'),
  layerHidden: page.locator('li.layer-hidden'),
  groupedOverlaysAllLayers: page.locator('.layer-container > ul .item.productsitem'),
  sidebarButton: page.locator('#accordion-toggler-button'),
  sidebarContent: page.locator('#products-holder'),

  // compare
  swipeButton: page.locator('#compare-swipe-button'),
  opacityButton: page.locator('#compare-opacity-button'),
  spyButton: page.locator('#compare-spy-button'),
  aTab: page.locator('.ab-tabs-case .ab-tab.first-tab'),
  bTab: page.locator('.ab-tabs-case .ab-tab.second-tab'),
  swipeDragger: page.locator('.ab-swipe-line .ab-swipe-dragger'),
  compareButton: page.locator('#compare-toggle-button'),
  compareButtonText: page.locator('#compare-toggle-button > span'),
  compareMobileSelectToggle: page.locator('.comparison-mobile-select-toggle'),
  ModisTrueColorLayerA: page.locator('#active-MODIS_Terra_CorrectedReflectance_TrueColor'),
  ModisTrueColorLayerB: page.locator('#activeB-MODIS_Terra_CorrectedReflectance_TrueColor'),
  toggleButton: page.locator('#toggleIconHolder'),
  collapsedToggleButton: page.locator('#accordion-toggler-button'),

  // measure
  measureBtn: page.locator('#wv-measure-button'),
  measureMenu: page.locator('#measure_menu'),
  measureDistanceBtn: page.locator('#measure-distance-button'),
  measureAreaBtn: page.locator('#measure-area-button'),
  clearMeasurementsBtn: page.locator('#clear-measurements-button'),
  unitOfMeasureToggle: page.locator('.measure-unit-toggle .custom-control-label'),
  measurementTooltip: page.locator('.tooltip-measure'),
  geoMeasurementTooltip: page.locator('#wv-map-geographic .tooltip-measure'),
  arcticMeasurementTooltip: page.locator('#wv-map-arctic .tooltip-measure'),
  downloadGeojsonBtn: page.locator('#download-geojson-button'),
  downloadShapefileBtn: page.locator('#download-shapefiles-button'),

  // timeline
  timelineContainer: page.locator('.timeline-container'),
  timelineHeader: page.locator('#timeline-header'),
  mobileDatePickerSelectButton: page.locator('.mobile-date-picker-select-btn'),
  dragger: page.locator('.timeline-dragger'),
  draggerA: page.locator('.timeline-dragger.draggerA'),
  draggerB: page.locator('.timeline-dragger.draggerB'),
  dayDown: page.locator('.input-wrapper-day > div.date-arrows.date-arrow-down'),
  dayUp: page.locator('.input-wrapper-day > div.date-arrows.date-arrow-up'),
  monthDown: page.locator('.input-wrapper-month > div.date-arrows.date-arrow-down'),
  monthUp: page.locator('.input-wrapper-month > div.date-arrows.date-arrow-up'),
  yearDown: page.locator('.input-wrapper-year > div.date-arrows.date-arrow-down'),
  yearUp: page.locator('.input-wrapper-year > div.date-arrows.date-arrow-up'),
  datePickerWheel: page.locator('.datepicker-modal .datepicker-wheel'),
  dateSelectorDayInput: page.locator('#date-selector-main .input-wrapper-day input'),
  dateSelectorMonthInput: page.locator('#date-selector-main .input-wrapper-month input'),
  dateSelectorYearInput: page.locator('#date-selector-main .input-wrapper-year input'),
  dateSelectorHourInput: page.locator('#date-selector-main .input-wrapper-hour input'),
  dateSelectorMinuteInput: page.locator('#date-selector-main .input-wrapper-minute input'),
  mobileDatePickerSelectBtn: page.locator('.mobile-date-picker-select-btn'),
  rightArrow: page.locator('#right-arrow-group'),
  mobileDatePickerHeader: page.locator('.datepicker .datepicker-header .datepicker-header'),

  // layers
  layersModalCloseButton: page.locator('.custom-layer-dialog .modal-header .close'),
  aerosolOpticalDepth: page.locator('#legacy-all #layer-category-item-legacy-all-aerosol-optical-depth'),
  layersSearchField: page.locator('input#layers-search-input'),
  categoriesNav: page.locator('#categories-nav'),
  allCategoryHeader: page.locator('#legacy-all h3'),
  layersAll: page.locator('.layers-all-layer'),
  layerBrowseList: page.locator('.layer-list-container.browse'),
  layerBrowseDetail: page.locator('.layer-detail-container.browse'),
  layerSearchList: page.locator('.layer-list-container.search'),
  layersSearchRow: page.locator('.search-row.layers-all-layer'),
  layerPickerBackButton: page.locator('#layer-search .back-button'),
  layerDetails: page.locator('.layer-detail-container'),
  layerDetailsDateRange: page.locator('.source-metadata .layer-date-range'),
  layerDetailHeader: page.locator('.layer-detail-container .layers-all-header'),
  layerResultsCountText: page.locator('.header-filter-container .results-text'),
  addToMapButton: page.locator('.layer-detail-container .add-to-map-btn'),
  aodMeasurement: page.locator('#layer-category-item-atmosphere-aerosol-optical-depth'),
  aodAllMeasurement: page.locator('#layer-category-item-legacy-all-aerosol-optical-depth'),
  aodMeasurementContents: page.locator('#accordion-atmosphere-aerosol-optical-depth .measure-row-contents'),
  aodAllMeasurementContents: page.locator('#accordion-legacy-all-aerosol-optical-depth'),
  aodTabContentAquaMODIS: page.locator('#aerosol-optical-depth-aqua-modis'),
  aodCheckbox: page.locator('#MODIS_Aqua_Aerosol-checkbox'),
  aodCheckboxMODIS: page.locator('#MODIS_Combined_Value_Added_AOD-checkbox'),
  aodCheckboxMAIAC: page.locator('#MODIS_Combined_MAIAC_L2G_AerosolOpticalDepth-checkbox'),
  aodCheckboxAquaMODIS: page.locator('#MODIS_Aqua_Aerosol-checkbox'),
  aquaTerraMODISTab: page.locator('#aqua-terra-modis-0-source-Nav'),
  aquaModisTab: page.locator('#aqua-modis-1-source-Nav'),
  correctedReflectanceCheckboxContainer: page.locator('#checkbox-case-MODIS_Aqua_CorrectedReflectance_TrueColor'),
  correctedReflectanceChecked: page.locator('#checkbox-case-MODIS_Aqua_CorrectedReflectance_TrueColor .wv-checkbox.checked'),
  weldReflectanceCheckboxContainer: page.locator('#checkbox-case-Landsat_WELD_CorrectedReflectance_TrueColor_Global_Monthly'),
  weldUnavailableTooltipIcon: page.locator('#checkbox-case-Landsat_WELD_CorrectedReflectance_TrueColor_Global_Monthly #availability-info'),
  availableFilterCheckbox: page.locator('#coverage-facet .sui-multi-checkbox-facet__option-input-wrapper:first-of-type'),
  availableFilterCheckboxInput: page.locator('#coverage-facet .sui-multi-checkbox-facet__option-input-wrapper:first-of-type input'),
  availableFilterTextEl: page.locator('#coverage-facet .sui-multi-checkbox-facet__option-input-wrapper:first-of-type > span'),
  coverageTooltipIcon: page.locator('#coverage-facet svg.facet-tooltip'),
  scienceDisciplinesTab: page.locator('#categories-nav .nav-item:nth-child(2)'),
  aodSidebarLayer: page.locator('#active-MODIS_Combined_Value_Added_AOD'),
  aodMAIACSidebarLayer: page.locator('#active-MODIS_Combined_MAIAC_L2G_AerosolOpticalDepth'),
  filterButton: page.locator('.btn.filter-button'),
  resetButton: page.locator('.btn.clear-filters'),
  applyButton: page.locator('.btn.apply-facets'),
  collapsedLayerButton: page.locator('#accordion-toggler-button'),
  layerCount: page.locator('.layer-count.mobile'),
  layerContainer: page.locator('.layer-container.sidebar-panel'),
  sourceMetadataCollapsed: page.locator('.source-metadata.overflow'),
  sourceMetadataExpanded: page.locator('.source-metadata'),
  aquaTerraModisHeader: page.locator('#aboutaerosolopticaldepthaod'),
  maiacHeader: page.locator('#aerosol-optical-depth-aqua-terra-modis h3:last-of-type'),
  sourceTabs: page.locator('.source-nav-item'),
  aodSearchRow: page.locator('#MODIS_Aqua_Aerosol-search-row'),
  aodSearchCheckbox: page.locator('#MODIS_Aqua_Aerosol-search-row > .wv-checkbox'),
  availableFacetLabel: page.locator('#coverage-facet .sui-multi-checkbox-facet label:nth-child(1)'),
  categoryAtmosphereLabel: page.locator('#categories-facet [for="example_facet_CategoryAtmosphere"]'),
  categoryFacetCollapseToggle: page.locator('#categories-facet .facet-collapse-toggle'),
  categoryFacetChoicesContainer: page.locator('#categories-facet .sui-multi-checkbox-facet'),
  measurementTemperatureLabel: page.locator('#measurements-facet [for="example_facet_MeasurementsTemperature"]'),
  measurementFacetChoices: page.locator('#measurements-facet .sui-multi-checkbox-facet > label'),
  measurementMoreButton: page.locator('#measurements-facet .sui-facet-view-more'),
  sourcesMERRALabel: page.locator('#sources-facet [for="example_facet_SourceMERRA-2"]'),
  layerFilterButton: page.locator('#layer-filter-button'),

  // map
  geographicMap: page.locator('#wv-map-geographic'),
  arcticMap: page.locator('#wv-map-arctic'),
  antarcticMap: page.locator('#wv-map-antarctic'),
  zoomInButton: page.locator('.wv-map-zoom-in'),
  zoomOutButton: page.locator('.wv-map-zoom-out'),
  mapScaleMetric: page.locator('.wv-map-scale-metric'),
  mapScaleImperial: page.locator('.wv-map-scale-imperial'),
  mapRotateLeft: page.locator('.wv-map-rotate-left'),
  mapRotateReset: page.locator('.wv-map-reset-rotation'),
  mapRotateRight: page.locator('.wv-map-rotate-right'),

  // ui toolbar
  locationSearchToolbarButton: page.locator('#wv-location-search-button'),
  shareToolbarButton: page.locator('#wv-share-button'),
  projToolbarButton: page.locator('#wv-proj-button'),
  snapshotToolbarButton: page.locator('#wv-image-button'),
  infoToolbarButton: page.locator('#wv-info-button'),

  // share
  shareToolbar: page.locator('#toolbar_share'),
  shareLinkInput: page.locator('#permalink-content-link'),
  shareEmbedInput: page.locator('#permalink-content-embed'),
  embedLinkButton: page.locator('#wv-embed-link-button'),

  // Location Search
  locationSearchComponent: page.locator('.location-search-component'),
  locationSearchMobileDialog: page.locator('#toolbar_location_search_mobile'),
  locationSearchMinimizeButton: page.locator('.location-search-minimize-button'),
  tooltipCoordinatesContainer: page.locator('.tooltip-coordinates-container'),
  tooltipCoordinatesTitle: page.locator('.tooltip-coordinates-title'),
  tooltipCoordinates: page.locator('.tooltip-coordinates'),
  tooltipCoordinatesMinimizeButton: page.locator('.minimize-coordinates-tooltip'),
  tooltipCoordinatesCloseButton: page.locator('.close-coordinates-tooltip'),
  coordinatesMapMarker: page.locator('.coordinates-map-marker'),

  // Context Menu
  contextMenu: page.locator('#context-menu'),
  contextMenuCopy: page.locator('#copy-coordinates-to-clipboard-button'),
  contextMenuAddMarker: page.locator('#context-menu-add-marker'),
  contextMenuDistance: page.locator('#context-menu-measure-distance'),
  contextMenuArea: page.locator('#context-menu-measure-area'),
  contentMenuChangeUnits: page.locator('#context-menu-change-units'),

  // marker
  selectedMarker: page.locator('.marker.selected'),

  // events
  eventsTab: page.locator('#events-sidebar-tab'),
  icebergEvent: page.locator('#wv-events #sidebar-event-EONET_2703'),
  listOfEvents: page.locator('#wv-events ul.map-item-list'),
  eventIcons: page.locator('.marker .event-icon'),
  firstEvent: page.locator('#wv-events ul.map-item-list .item:first-child h4'),
  secondEvent: page.locator('#wv-events #sidebar-event-EONET_99999'),
  selectedFirstEvent: page.locator('#wv-events ul.map-item-list .item-selected:first-child h4'),
  trackMarker: page.locator('.track-marker'),
  layersTab: page.locator('#layers-sidebar-tab'),
  sidebarEvent: page.locator('#sidebar-event-EONET_3931'),
  thermAnomSNPPday: page.locator('#active-VIIRS_SNPP_Thermal_Anomalies_375m_Night'),
  thermAnomSNPPnight: page.locator('#active-VIIRS_SNPP_Thermal_Anomalies_375m_Day'),
  thermAnomVIIRSday: page.locator('#active-VIIRS_NOAA20_Thermal_Anomalies_375m_Day'),
  thermAnomVIIRSnight: page.locator('#active-VIIRS_NOAA20_Thermal_Anomalies_375m_Night'),
  notifyMessage: page.locator('.wv-alert .alert-content'),
  filterIcons: page.locator('.filter-icons > .event-icon'),
  dustHazeIcon: page.locator('.filter-icons > #filter-dust-and-haze'),
  volcanoesIcon: page.locator('.filter-icons > #filter-volcanoes'),
  wildfiresIcon: page.locator('.filter-icons > #filter-wildfires'),
  filterDates: page.locator('.filter-dates'),
  filterModalApply: page.locator('#filter-apply-btn'),
  filterModalCancel: page.locator('#filter-cancel-btn'),
  dustSwitch: page.locator('#dustHaze-switch'),
  manmadeSwitch: page.locator('#manmade-switch'),
  seaLakeIceSwitch: page.locator('#seaLakeIce-switch'),
  severeStormsSwitch: page.locator('#severeStorms-switch'),
  snowSwitch: page.locator('#snow-switch'),
  volcanoesSwitch: page.locator('#volcanoes-switch'),
  watercolorSwitch: page.locator('#waterColor-switch'),
  wildfiresSwitch: page.locator('#wildfires-switch'),
  mapExtentFilterCheckbox: page.locator('#map-extent-filter'),
  startInputYear: page.locator('#year-event-filter-start'),
  startInputMonth: page.locator('#month-event-filter-start'),
  startInputDay: page.locator('#day-event-filter-start'),
  endInputYear: page.locator('#year-event-filter-end'),
  endInputMonth: page.locator('#month-event-filter-end'),
  endInputDay: page.locator('#day-event-filter-end'),

  // globals
  dataTab: page.locator('#download-sidebar-tab'),
  yearlyResolutionTooltip: page.locator('#zoom-years'),
  timelineSetToYears: page.locator('#current-zoom.zoom-years'),
  modalCloseButton: page.locator('.modal-header .close'),
  notificationDismissButton: page.locator('.wv-alert .close-alert .fa-times'),
  overlayLayerItems: page.locator('#overlays li'),
  resolutionTooltip: page.locator('#zoom-btn-container'),
  globalSelectInput: page.locator('#image-global-cb'),
  bboxTopCoords: page.locator('#wv-image-top'),
  bboxBottomCoords: page.locator('#wv-image-bottom'),
  imageResolution: page.locator('#wv-image-resolution'),
  imageFormat: page.locator('#wv-image-format'),
  imageWorldFile: page.locator('#wv-image-worldfile'),
  imageMaxSize: page.locator('.wv-image-max-size')
})
