import _WidgetBase from 'dijit/_WidgetBase';
import declare from 'dojo/_base/declare';
import hash from 'dojo/hash';
import ioQuery from 'dojo/io-query';
import Point from 'esri/geometry/Point';


export default declare([_WidgetBase], {
  // properties passed in via constructor
  // map: esri/map
  map: null,

  // config: Object
  config: null,

  postCreate() {
    console.log('URLParams:postCreate', arguments);

    this.initializeRouter();

    this.inherited(arguments);
  },

  initializeRouter() {
    console.log('URLParams:initializeRouter', arguments);

    const params = ioQuery.queryToObject(hash());

    if (params.scale && params.x && params.y) {
      this.map.setScale(parseInt(params.scale, 10));
      this.map.centerAt(new Point({
        x: parseInt(params.x, 10),
        y: parseInt(params.y, 10),
        spatialReference: { wkid: this.map.spatialReference.wkid }
      })).then(this.wireEvents.bind(this));
    } else {
      this.wireEvents();
    }
  },

  wireEvents() {
    console.log('URLParams:wireEvents', arguments);

    this.own(
      this.map.on('extent-change', this.onMapExtentChange.bind(this))
    );
  },

  onMapExtentChange(event) {
    console.log('URLParams:onMapExtentChange', arguments);

    const center = event.extent.getCenter();
    if (center.x && center.y) {
      const newProperties = Object.assign(ioQuery.queryToObject(hash()), {
        x: Math.round(center.x),
        y: Math.round(center.y),
        scale: Math.round(this.map.getScale())
      });

      return hash(ioQuery.objectToQuery(newProperties), true);
    }
  }
});
