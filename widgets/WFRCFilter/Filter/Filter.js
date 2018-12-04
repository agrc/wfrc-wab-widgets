import _TemplatedMixin from 'dijit/_TemplatedMixin';
import _WidgetBase from 'dijit/_WidgetBase';
import declare from 'dojo/_base/declare';
import template from 'dojo/text!./Filter.html';


export default declare([_WidgetBase, _TemplatedMixin], {
  baseClass: 'wfrc-filter',
  templateString: template,

  postCreate() {
    console.log('Filter.postCreate');

    this.modes.indeterminate = true;
    this.phasing.indeterminate = true;
  }
});
