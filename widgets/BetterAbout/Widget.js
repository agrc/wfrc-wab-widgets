import declare from 'dojo/_base/declare';
import BaseWidget from 'jimu/BaseWidget';
import BetterAbout from './BetterAbout/BetterAbout';


export default declare([BaseWidget], {
  mainWidget: null,

  postCreate() {
    this.mainWidget = new BetterAbout({
      config: this.config,
      map: this.map
    }, this.widgetContainer);
  }
});
