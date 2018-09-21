import _TemplatedMixin from 'dijit/_TemplatedMixin';
import _WidgetBase from 'dijit/_WidgetBase';
import Comments from './Comments';
import coreFx from 'dojo/fx';
import declare from 'dojo/_base/declare';
import domConstruct from 'dojo/dom-construct';
import SimpleFillSymbol from 'esri/symbols/SimpleFillSymbol';
import SimpleLineSymbol from 'esri/symbols/SimpleLineSymbol';
import SimpleMarkerSymbol from 'esri/symbols/SimpleMarkerSymbol';
import template from 'dojo/text!./Details.html';


const GLOBALID_FIELD_NAME = 'GlobalID';
export default declare([_WidgetBase, _TemplatedMixin], {
  baseClass: 'details',
  templateString: template,
  open: false,
  aliasValuePairs: null,
  selectionSymbols: null,
  originalSymbol: null,
  commentsShown: false,


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

    this.originalSymbol = props.feature.symbol;

    this.inherited(arguments);
  },

  postMixInProperties() {
    console.log('Details:postMixInProperties', arguments);

    this.selectionSymbols = {
      point: new SimpleMarkerSymbol({
        color: this.config.selectionColor
      }),
      polyline: new SimpleLineSymbol({
        color: this.config.selectionColor,
        width: 6,
        style: 'esriSLSSolid',
        type: 'esriSLS'
      }),
      polygon: new SimpleFillSymbol({
        type: 'esriSFS',
        style: 'esriSFSSolid',
        color: this.config.selectionColor
      })
    };
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

  shouldDisplayComments(fields) {
    console.log('Details:shouldDisplayComments', arguments);

    return this.config.commentsEnabled && fields.some(fieldInfo => fieldInfo.name === GLOBALID_FIELD_NAME);
  },

  onTitleEnter() {
    console.log('Details:onTitleEnter', arguments);

    this.highlight();
  },

  highlight() {
    console.log('Details:highlight', arguments);

    this.feature.setSymbol(this.selectionSymbols[this.feature.geometry.type]);
  },

  onTitleLeave() {
    console.log('Details:onTitleLeave', arguments);

    if (!this.open) {
      this.feature.setSymbol(this.originalSymbol);
    }
  },

  expand() {
    console.log('Details:expand', arguments);

    if (this.shouldDisplayComments(this.fields) && !this.commentsShown) {
      this.own(new Comments({
        globalid: this.feature.attributes[GLOBALID_FIELD_NAME],
        config: this.config
      }, this.commentsContainer));

      this.commentsShown = true;
    }

    coreFx.wipeIn({ node: this.body }).play();
  },

  onTitleClick() {
    console.log('Details:onTitleClick', arguments);

    if (this.open) {
      coreFx.wipeOut({ node: this.body }).play();
    } else {
      this.expand();
    }

    this.open = !this.open;
  },

  destroy() {
    console.log('Details:destroy', arguments);

    this.feature.setSymbol(this.originalSymbol);

    this.inherited(arguments);
  }
});
