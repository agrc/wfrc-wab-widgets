import declare from 'dojo/_base/declare';
import BaseWidget from 'jimu/BaseWidget';
import URLParams from './URLParams/URLParams';


export default declare([BaseWidget], {
  mainWidget: null,

  onOpen() {
    this.mainWidget = new URLParams({
      config: this.config,
      map: this.map
    });
  }
});
