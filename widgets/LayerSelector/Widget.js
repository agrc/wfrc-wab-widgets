import declare from 'dojo/_base/declare';
import BaseWidget from 'jimu/BaseWidget';
import LayerSelector from './layer-selector/LayerSelector';
import { applyFactories } from './utilities';
import aspect from 'dojo/aspect';
import topic from 'dojo/topic';


export default declare([BaseWidget], {
  mainWidget: null,

  postCreate() {
    console.log('LayerSelector:postCreate');

    this.config = applyFactories(this.config);

    this.mainWidget = new LayerSelector({
      ...this.config,
      map: this.map
    });
    this.mainWidget.startup();

    if (window.URLParams && window.URLParams.basemap) {
      const radioButtons = this.mainWidget.domNode.querySelectorAll(`input[value='${window.URLParams.basemap}']`);
      if (radioButtons.length === 1) {
        radioButtons[0].click();
      }
    }

    aspect.after(this.mainWidget, '_updateMap', this.onChange.bind(this), true);
  },

  onChange(layerItem) {
    console.log('LayerSelector:onChange', arguments);

    if (layerItem.get('selected') && layerItem.layerType === 'baselayer') {
      topic.publish('url-params-on-layer-selector-change', layerItem.name);
    }
  }
});
