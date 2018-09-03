import declare from 'dojo/_base/declare';
import _WidgetBase from 'dijit/_WidgetBase';
import _TemplatedMixin from 'dijit/_TemplatedMixin';
import template from 'dojo/text!./ProjectInfo.html';
import strings from 'dojo/i18n!./nls/strings';


export default declare([_WidgetBase, _TemplatedMixin], {
  templateString: template,

  postMixInProperties() {
    this.nls = strings;
  },

  postCreate() {
    console.log('ProjectInfo.postCreate');
  }
});
