import declare from 'dojo/_base/declare';
import BaseWidget from 'jimu/BaseWidget';
import Sherlock from './sherlock/Sherlock';
import MapService from './sherlock/providers/MapService';


export default declare([BaseWidget], {
  mainWidget: null,

  postCreate() {
    const provider = new MapService(this.config.serviceUrl, this.config.searchField);
    this.mainWidget = new Sherlock({
      provider,
      map: this.map,
      appendToBody: false,
      ...this.config
    }, this.widgetContainer);
    this.mainWidget.startup();
  }
});
