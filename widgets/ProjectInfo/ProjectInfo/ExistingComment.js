import _TemplatedMixin from 'dijit/_TemplatedMixin';
import _WidgetBase from 'dijit/_WidgetBase';
import declare from 'dojo/_base/declare';
import template from 'dojo/text!./ExistingComment.html';


export default declare([_WidgetBase, _TemplatedMixin], {
  templateString: template,

  constructor(props) {
    console.log('ExistingComment:constructor', arguments);

    this.prettyDate = new Date(props.CommentDT).toLocaleString();
  }
});
