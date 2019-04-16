import _WidgetBase from 'dijit/_WidgetBase';
import declare from 'dojo/_base/declare';
import hash from 'dojo/hash';
import ioQuery from 'dojo/io-query';
import Point from 'esri/geometry/Point';
import Query from 'esri/tasks/query';
import topic from 'dojo/topic';


export default declare([_WidgetBase], {
  // properties passed in via constructor
  // map: esri/map
  map: null,

  // config: Object
  config: null,

  constructor(/* props */) {
    window.URLParams = {};

    this.inherited(arguments);
  },

  postCreate() {
    console.log('URLParams:postCreate', arguments);

    this.initializeRouter();

    this.inherited(arguments);
  },

  initializeRouter() {
    console.log('URLParams:initializeRouter', arguments);

    const params = ioQuery.queryToObject(hash());

    if (params.guid && params.layerid) {
      const layer = this.map.getLayer(params.layerid);

      const query = new Query();
      query.returnGeometry = true;
      query.where = `GlobalID = '${params.guid}'`;

      layer.selectFeatures(query).then(features => {
        if (features.length > 0) {
          const feature = features[0];
          feature.fields = layer.fields;
          feature.displayField = layer.displayField;
          feature.layerID = layer.id;

          // to be picked up by ProjectInfo widget
          window.URLParams.project = feature;

          this.map.setExtent(feature.geometry.getExtent(), true);
        }

        this.wireEvents();
      });
    } else if (params.scale && params.x && params.y) {
      this.map.setScale(parseInt(params.scale, 10));
      this.map.centerAt(new Point({
        x: parseInt(params.x, 10),
        y: parseInt(params.y, 10),
        spatialReference: { wkid: this.map.spatialReference.wkid }
      })).then(this.wireEvents.bind(this));
    } else {
      this.wireEvents();
    }

    if (params.clickx && params.clicky) {
      // to be picked up by ProjectInfo
      window.URLParams.clickpoint = {
        x: params.clickx,
        y: params.clicky
      };
    }

    if (params.infopanel) {
      // to be picked up by BetterAbout
      window.URLParams.infopanel = params.infopanel;
    }

    if (params.basemap) {
      // to be picked up by LayerSelector
      window.URLParams.basemap = params.basemap;
    }

    // both of these to be picked up by WFRCFilter
    if (params.modes) {
      window.URLParams.modes = (typeof params.modes === 'string') ? [params.modes] : params.modes;
    }
    if (params.phaseIndexes) {
      window.URLParams.phaseIndexes = params.phaseIndexes;
    }
  },

  wireEvents() {
    console.log('URLParams:wireEvents', arguments);

    this.own(
      this.map.on('extent-change', this.onMapExtentChange.bind(this)),
      topic.subscribe('url-params-on-project-click', this.setProjectParams.bind(this)),
      this.map.on('click', this.removeParams.bind(this, ['guid', 'layerid'])),
      topic.subscribe('url-params-on-infopanel-open', this.setParams.bind(this, { infopanel: 'open' })),
      topic.subscribe('url-params-on-infopanel-close', this.setParams.bind(this, { infopanel: 'closed' })),
      topic.subscribe('url-params-on-map-click', this.setClickParams.bind(this)),
      topic.subscribe('url-params-on-layer-selector-change', this.setBaseMap.bind(this)),
      topic.subscribe('url-params-on-filter-change', this.setFilterParams.bind(this))
    );
  },

  setFilterParams(filterParams) {
    console.log('URLParams:setFilterParams', arguments);

    this.setParams({
      ...filterParams
    });
  },

  setBaseMap(basemap) {
    console.log('URLParams:setBaseMap', arguments);

    this.setParams({ basemap });
  },

  setClickParams(mapPoint) {
    console.log('URLParams:setClickParams');

    this.setParams({
      clickx: mapPoint.x,
      clicky: mapPoint.y
    });
  },

  onMapExtentChange(event) {
    console.log('URLParams:onMapExtentChange', arguments);

    const center = event.extent.getCenter();
    if (center.x && center.y) {
      this.setParams({
        x: Math.round(center.x),
        y: Math.round(center.y),
        scale: Math.round(this.map.getScale())
      });
    }
  },

  setProjectParams(config) {
    // config contains url and guid
    console.log('URLParams:setProjectParams', arguments);

    this.setParams(config);
    this.removeParams(['x', 'y', 'scale', 'clickx', 'clicky']);
  },

  setParams(params) {
    // sets the params in the URL without messing with other ones
    console.log('URLParams:setParams');

    const newParams = Object.assign(ioQuery.queryToObject(hash()), params);

    return hash(ioQuery.objectToQuery(newParams), true);
  },

  removeParams(params) {
    // params: string[]
    console.log('URLParams:removeParams', arguments);

    const newParams = ioQuery.queryToObject(hash());

    params.forEach(param => delete newParams[param]);

    return hash(ioQuery.objectToQuery(newParams), true);
  }
});
