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

    // show spinner
    this.spinner.className = this.spinner.className.replace(' hidden', '');

    if (this.detailsWidgets) {
      this.detailsWidgets.forEach(widget => widget.destroy());
      this.detailsWidgets = null;
    }

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
          feature.layerName = layer.name;

          return feature;
        });
      };
    };

    // query all feature layers and then flatten into a single array of features
    Promise.all(this.featureLayers.map(layer => {
      if (layer.visible) {
        // return an empty array if there is a problem with selectFeatures
        return layer.selectFeatures(query).then(getAddMetaToFeatureFunction(layer), () => []);
      }

      return [];
    })).then(featureSets => this.setFeatures(featureSets.reduce((acc, val) => acc.concat(val), [])));
  },

  getTolerance(pixelTolerance) {
    console.log('ProjectInfo:getTolerance', arguments);

    const pixelWidth = this.map.extent.getWidth() / this.map.width;

    return pixelTolerance * pixelWidth;
  },

  setFeatures(features) {
    console.log('ProjectInfo:setFeatures', arguments);

    features = this.sortFeatures(features);

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

    // hide spinner
    this.spinner.className += ' hidden';
  },

  sortFeatures(features) {
    // sorts the features according to the featureLayerOrder in the config
    console.log('ProjectInfo:sortFeatures', arguments);

    const order = this.config.layerSortOrder;

    return features.sort((first, second) => {
      const firstIndex = order.indexOf(first.layerName);
      const secondIndex = order.indexOf(second.layerName);

      if (firstIndex < secondIndex) {
        return -1;
      } else if (firstIndex === secondIndex) {
        return 0;
      }

      return 1;
    });
  }
});
