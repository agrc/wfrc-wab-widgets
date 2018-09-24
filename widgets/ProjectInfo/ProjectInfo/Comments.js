import _TemplatedMixin from 'dijit/_TemplatedMixin';
import _WidgetBase from 'dijit/_WidgetBase';
import coreFx from 'dojo/fx';
import declare from 'dojo/_base/declare';
import domConstruct from 'dojo/dom-construct';
import esriRequest from 'esri/request';
import ExistingComment from './ExistingComment';
import template from 'dojo/text!./Comments.html';


export default declare([_WidgetBase, _TemplatedMixin], {
  baseClass: 'comments',
  templateString: template,
  newCommentFormOpen: false,


  // properties passed in via constructor

  // globalid: string
  //      the globalid of the feature that the comments are related to
  globalid: null,

  // config: object
  //      the config object from config.json
  config: null,

  constructor() {
    console.log('Comments:constructor', arguments);
  },

  postCreate() {
    console.log('Comments:postCreate', arguments);

    this.getInputs().forEach(input => {
      input.addEventListener('input', this.updateCharCount.bind(this));
      input.parentElement.getElementsByTagName('span')[0].textContent = input.maxLength;
    });

    this.loadExistingComments();

    this.inherited(arguments);
  },

  loadExistingComments() {
    console.log('Comments:loadExistingComments', arguments);

    const onSuccess = response => {
      response.features
        // show newest comments first
        .sort((feature1, feature2) => (feature1.attributes.CommentDT < feature2.attributes.CommentDT) ? 1 : -1)
        .forEach(feature => this.addComment(feature.attributes));
    };
    const onFailure = error => {
      this.loadExistingErrorMessage.textContent = `Failed to load existing comments: ${error.message}`;
    };

    esriRequest({
      url: `${this.config.commentsTableUrl}/query`,
      content: {
        f: 'json',
        where: `GUID = '${this.globalid}'`,
        outFields: '*'
      },
      handleAs: 'json'
    }).then(onSuccess, onFailure);
  },

  addComment(attributes, top = false) {
    console.log('Comments:addComment', arguments);

    const existingComment = new ExistingComment(attributes,
      domConstruct.create('div', {}, this.commentsContainer, (top) ? 'first' : 'last'));
    existingComment.startup();
  },

  getInputs() {
    console.log('Details:getInputs', arguments);

    const inputs = Array.from(this.newCommentForm.getElementsByTagName('input'));
    const textarea = Array.from(this.newCommentForm.getElementsByTagName('textarea'));

    return inputs.concat(textarea);
  },

  updateCharCount(event) {
    console.log('Comments:updateCharCount', arguments);

    const input = event.target;
    const span = input.parentElement.getElementsByTagName('span')[0];
    span.textContent = parseInt(input.maxLength, 10) - input.value.length;

    this.submitBtn.disabled = (this.Comment.value.length === 0);
  },

  toggleNewCommentForm() {
    console.log('Comments:toggleNewCommentForm', arguments);

    if (this.newCommentFormOpen) {
      coreFx.wipeOut({ node: this.newCommentForm }).play();
    } else {
      coreFx.wipeIn({ node: this.newCommentForm }).play();
    }

    this.newCommentFormOpen = !this.newCommentFormOpen;
  },

  submitComment() {
    console.log('Comments:submitComment', arguments);

    this.submitErrorMessage.textContent = '';

    const attributes = {
      CommentDT: new Date(),
      GUID: this.globalid
    };
    this.getInputs().forEach(input => {
      attributes[input.dataset.dojoAttachPoint] = input.value;
    });

    const onSuccess = response => {
      const result = response.addResults[0];

      if (result.success) {
        this.addComment(attributes, true);
        this.clearForm();
      } else {
        this.onFailure({ message: result.error.description });
      }
    };

    const onFailure = error => {
      this.submitErrorMessage.textContent = error.message;
    };

    esriRequest({
      url: `${this.config.commentsTableUrl}/addFeatures`,
      content: {
        f: 'json',
        features: JSON.stringify([{
          attributes
        }])
      },
      handleAs: 'json'
    }, { usePost: true }).then(onSuccess, onFailure);
  },

  clearForm() {
    console.log('Comments:clearForm', arguments);

    this.getInputs().forEach(input => {
      input.value = '';
      input.dispatchEvent(new Event('input'));
    });

    this.toggleNewCommentForm();
  }
});
