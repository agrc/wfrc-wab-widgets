import declare from 'dojo/_base/declare';
import _WidgetBase from 'dijit/_WidgetBase';
import _TemplatedMixin from 'dijit/_TemplatedMixin';
import template from 'dojo/text!./ProjectInfo.html';
import strings from 'dojo/i18n!./nls/strings';
import Query from 'esri/tasks/query';
import SimpleMarkerSymbol from 'esri/symbols/SimpleMarkerSymbol';
import SimpleLineSymbol from 'esri/symbols/SimpleLineSymbol';


export default declare([_WidgetBase, _TemplatedMixin], {
  baseClass: 'project-info',
  templateString: template,
  featureLayers: null,
  selectionSymbols: null,

  postMixInProperties() {
    this.nls = strings;

    this.selectionSymbols = {
      esriGeometryPoint: new SimpleMarkerSymbol({
        color: this.config.selectionColor
      }),
      esriGeometryPolyline: new SimpleLineSymbol({
        color: this.config.selectionColor,
        width: 6,
        style: 'esriSLSSolid',
        type: 'esriSLS'
      })
    };

    this.inherited(arguments);
  },

  postCreate() {
    console.log('ProjectInfo.postCreate');

    this.featureLayers = this.map.graphicsLayerIds.map(id => this.map.getLayer(id)).filter(layer => layer.url);

    this.featureLayers.forEach(layer => layer.setSelectionSymbol(this.selectionSymbols[layer.geometryType]));

    this.own(this.map.on('click', this.onMapClick.bind(this)));
  },

  onMapClick(clickEvent) {
    console.log('ProjectInfo.onMapClick', clickEvent);

    const query = new Query();
    query.returnGeometry = true;
    query.geometry = clickEvent.mapPoint;
    query.outFields = ['*'];
    query.distance = this.getTolerance(this.config.clickPixelTolerance);
    query.units = 'meters';

    Promise.all(this.featureLayers.map(layer => layer.selectFeatures(query))).then(featureSets => {
      const features = featureSets.reduce((sum, next) => sum.concat(next), []);
      console.log('features', features);
    });
  },

  getTolerance(pixelTolerance) {
    console.log('ProjectInfo:getTolerance', arguments);

    const pixelWidth = this.map.extent.getWidth() / this.map.width;

    return pixelTolerance * pixelWidth;
  }
});
