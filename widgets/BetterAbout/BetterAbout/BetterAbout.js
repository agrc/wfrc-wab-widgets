import _TemplatedMixin from 'dijit/_TemplatedMixin';
import _WidgetBase from 'dijit/_WidgetBase';
import declare from 'dojo/_base/declare';
import strings from 'dojo/i18n!./nls/strings';
import template from 'dojo/text!./BetterAbout.html';


export default declare([_WidgetBase, _TemplatedMixin], {
  baseClass: 'better-about',
  templateString: template,

  postMixInProperties() {
    console.log('BetterAbout:postMixInProperties', arguments);

    this.nls = strings;

    this.inherited(arguments);
  }
});
