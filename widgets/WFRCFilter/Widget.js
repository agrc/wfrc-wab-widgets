import declare from 'dojo/_base/declare';
import BaseWidget from 'jimu/BaseWidget';
import Filter from './Filter/Filter';


export default declare([BaseWidget], {
  mainWidget: null,

  postCreate() {
    this.mainWidget = new Filter({
      config: this.config,
      map: this.map
    }, this.widgetContainer);

    this.mainWidget.init();
  }
});
