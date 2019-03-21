import declare from 'dojo/_base/declare';
import About from './About/Widget';
import utilities from './utilities';
import topic from 'dojo/topic';
import PanelManager from 'jimu/PanelManager';


const panelManager = PanelManager.getInstance();
export default declare([About], {
  constructor() {
    console.log('BetterAbout:constructor', arguments);

    this.baseClass = `${this.baseClass} better-about`;

    this.inherited(arguments);
  },

  onOpen() {
    console.log('BetterAbout:onOpen', arguments);

    this.inherited(arguments);

    utilities.dialogitizeImages(this.domNode);

    if (window.URLParams && window.URLParams.infopanel && window.URLParams.infopanel === 'closed') {
      // find panel id of parent panel for this widget
      let id;
      panelManager.panels.forEach(panel => {
        if (panel.uri === this.panel.uri) {
          id = panel.id;
        }
      });

      if (id) {
        panelManager.minimizePanel(id);
        console.log('minimized');
      } else {
        console.error(`no matching panel found for ${this.panel.url}`);
      }
    }
  },

  onMaximize() {
    console.log('BetterAbout:onMaximize');

    // for URLParams widget
    topic.publish('url-params-on-infopanel-open', null);
  },

  onMinimize() {
    console.log('BetterAbout:onMinimize');

    // for URLParams widget
    topic.publish('url-params-on-infopanel-close', null);
  }
});
