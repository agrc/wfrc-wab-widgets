import _TemplatedMixin from 'dijit/_TemplatedMixin';
import _WidgetBase from 'dijit/_WidgetBase';
import coreFx from 'dojo/fx';
import declare from 'dojo/_base/declare';
import domConstruct from 'dojo/dom-construct';
import template from 'dojo/text!./Details.html';


export default declare([_WidgetBase, _TemplatedMixin], {
  baseClass: 'details',
  templateString: template,
  open: false,
  aliasValuePairs: null,


  // properties passed in via the constructor
  // feature: Object
  //      esri feature object
  feature: null,

  // fields: Object[]
  //      array of field objects from FeatureLayer.fields
  fields: null,

  // displayField: String
  //      the name of the field to use as the title
  displayField: null,

  // config: Object
  config: null,

  constructor(props) {
    console.log('Details:constructor', arguments);

    Object.assign(this, props.feature.attributes);

    this.title = props.feature.attributes[props.displayField];

    this.aliasValuePairs = this.getAliasValuePairs(
      props.feature.attributes, props.fields, props.config.excludeFields, props.displayField);

    this.inherited(arguments);
  },

  getAliasValuePairs(attributes, fields, excludeFields, displayField) {
    console.log('Details:getAliasValuePairs', arguments);

    const aliasLookup = {};
    fields.forEach(field => {
      aliasLookup[field.name] = field.alias;
    });

    return Object.keys(attributes)
      .filter(fieldName => !excludeFields.concat([displayField]).includes(fieldName))
      .map(fieldName => [aliasLookup[fieldName], attributes[fieldName]]);
  },

  postCreate() {
    console.log('Details:postCreate', arguments);

    this.aliasValuePairs.forEach(([alias, value]) => {
      const tr = domConstruct.create('tr', {}, this.table);
      domConstruct.create('td', {
        innerHTML: alias,
        className: 'alias'
      }, tr);
      domConstruct.create('td', {
        innerHTML: value,
        className: 'value'
      }, tr);
    });

    this.inherited(arguments);
  },

  onTitleClick() {
    console.log('Details:onTitleClick', arguments);

    if (this.open) {
      coreFx.wipeOut({ node: this.body }).play();
    } else {
      coreFx.wipeIn({ node: this.body }).play();
    }

    this.open = !this.open;
  }
});
