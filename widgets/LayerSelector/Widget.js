import declare from 'dojo/_base/declare';
import BaseWidget from 'jimu/BaseWidget';
import LayerSelector from './layer-selector/LayerSelector';
import { applyFactories } from './utilities';


export default declare([BaseWidget], {
  mainWidget: null,

  postCreate() {
    console.log('LayerSelector:postCreate');

    this.config = applyFactories(this.config);

    this.mainWidget = new LayerSelector(Object.assign({
      map: this.map
    }, this.config));
    this.mainWidget.startup();
  }
});
