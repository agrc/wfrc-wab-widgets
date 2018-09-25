import _WidgetBase from 'dijit/_WidgetBase';
import declare from 'dojo/_base/declare';


export default declare([_WidgetBase], {
  constructor() {
    console.log('URLParams:constructor', arguments);

    this.inherited(arguments);
  }
});
