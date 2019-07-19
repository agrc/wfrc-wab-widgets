import declare from 'dojo/_base/declare';
import BaseWidget from 'jimu/BaseWidget';
import Sherlock from './sherlock/Sherlock';


export default declare([BaseWidget], {
  mainWidget: null,

  postCreate() {
    this.mainWidget = new Sherlock({
      ...this.config,
      map: this.map
    }, this.widgetContainer);
    this.mainWidget.startup();
  }
});
