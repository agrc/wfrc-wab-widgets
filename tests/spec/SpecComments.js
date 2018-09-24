/* eslint-disable no-magic-numbers */
import Comments from 'widgets/ProjectInfo/ProjectInfo/Comments';
import domConstruct from 'dojo/dom-construct';
import fieldsJson from 'dojo/text!tests/data/fields.json';


describe('Comments', () => {
  let testWidget;

  beforeEach(() => {
    testWidget = new Comments({
      fields: JSON.parse(fieldsJson),
      config: { commentsTableUrl: 'blah' }
    }, domConstruct.create('div', {}, window.body));
    testWidget.startup();
  });

  it('creates a valid object', () => {
    expect(testWidget).toEqual(jasmine.any(Comments));
  });

  describe('addComment', () => {
    it('adds a new ExistingComment widget', () => {
      testWidget.addComment({ Comment: 'test' });

      expect(testWidget.commentsContainer.children.length).toBe(1);
    });

    it('increments the comment count', () => {
      testWidget.numComments.textContent = 0;
      testWidget.addComment({ Comment: 'test' });
      testWidget.addComment({ Comment: 'test' });

      expect(testWidget.numComments.textContent).toBe('2');
    });
  });
});
