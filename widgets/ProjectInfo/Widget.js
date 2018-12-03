import declare from 'dojo/_base/declare';
import BaseWidget from 'jimu/BaseWidget';
import ProjectInfo from './ProjectInfo/ProjectInfo';
import PanelManager from 'jimu/PanelManager';


export default declare([BaseWidget], {
  mainWidget: null,

  postCreate() {
    this.mainWidget = new ProjectInfo({
      config: this.config,
      map: this.map
    }, this.widgetContainer);

    this.map.on('click', this.onMapClick.bind(this));
  },

  onMapClick() {
    // auto-open this widget's panel and close all others except BetterAbout
    const panelManager = PanelManager.getInstance();

    panelManager.panels.forEach(panel => {
      if (panel.config.id === this.id) {
        if (panel.state === 'closed') {
          panelManager.openPanel(panel);
        }
      } else if (panel.windowState !== 'maximized') {
        panelManager.closePanel(panel);
      }
    });
  }
});
