import declare from 'dojo/_base/declare';
import About from './About/Widget';
import utilities from './utilities';


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
  }
});
