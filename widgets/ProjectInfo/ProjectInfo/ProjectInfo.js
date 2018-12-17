import _TemplatedMixin from 'dijit/_TemplatedMixin';
import _WidgetBase from 'dijit/_WidgetBase';
import declare from 'dojo/_base/declare';
import Details from './Details';
import domConstruct from 'dojo/dom-construct';
import Query from 'esri/tasks/query';
import template from 'dojo/text!./ProjectInfo.html';


export default declare([_WidgetBase, _TemplatedMixin], {
  baseClass: 'project-info',
  templateString: template,
  featureLayers: null,

  postMixInProperties() {
    console.log('ProjectInfo:postMixInProperties', arguments);

    this.nls = this.config.strings[this.config.language];

    this.inherited(arguments);
  },

  postCreate() {
    console.log('ProjectInfo.postCreate');

    this.featureLayers = this.map.graphicsLayerIds.map(id => this.map.getLayer(id)).filter(layer => layer.url);

    this.own(this.map.on('click', this.onMapClick.bind(this)));

    if (window.URLParams && window.URLParams.project) {
      this.setFeatures([window.URLParams.project]);
    }
  },

  onMapClick(clickEvent) {
    console.log('ProjectInfo.onMapClick', clickEvent);

    const query = new Query();
    query.geometry = clickEvent.mapPoint;
    query.distance = this.getTolerance(this.config.clickPixelTolerance);
    query.units = 'meters';

    // return function that adds the fields and displayField properties
    // to the feature objects for use in the Details Widget
    const getAddMetaToFeatureFunction = function (layer) {
      return function (featureSet) {
        return featureSet.map(feature => {
          feature.fields = layer.fields;
          feature.displayField = layer.displayField;
          feature.layerID = layer.id;

          return feature;
        });
      };
    };

    // query all feature layers and then flatten into a single array of features
    Promise.all(this.featureLayers.map(layer => {
      return layer.selectFeatures(query).then(getAddMetaToFeatureFunction(layer));
    })).then(featureSets => this.setFeatures(featureSets.reduce((acc, val) => acc.concat(val), [])));
  },

  getTolerance(pixelTolerance) {
    console.log('ProjectInfo:getTolerance', arguments);

    const pixelWidth = this.map.extent.getWidth() / this.map.width;

    return pixelTolerance * pixelWidth;
  },

  setFeatures(features) {
    console.log('ProjectInfo:setFeatures', arguments);

    if (this.detailsWidgets) {
      this.detailsWidgets.forEach(widget => widget.destroy());
      this.detailsWidgets = null;
    }

    if (features.length > 0) {
      this.instructions.className = 'hidden';

      this.detailsWidgets = features.map(feature => {
        return new Details({
          feature,
          fields: feature.fields,
          displayField: feature.displayField,
          layerID: feature.layerID,
          config: this.config,
          nls: this.nls
        }, domConstruct.create('div', {}, this.detailsContainer));
      });

      // if there's only one feature then set it to open automatically
      if (features.length === 1) {
        this.detailsWidgets[0].expand();
        this.detailsWidgets[0].highlight();
      }
    } else {
      this.instructions.className = '';
    }
  }
});
