import declare from 'dojo/_base/declare';
import BaseWidget from 'jimu/BaseWidget';
import ProjectInfo from './ProjectInfo/ProjectInfo';


export default declare([BaseWidget], {
  mainWidget: null,

  postCreate() {
    this.mainWidget = new ProjectInfo({
      config: this.config,
      map: this.map
    }, this.widgetContainer);
  }
});
