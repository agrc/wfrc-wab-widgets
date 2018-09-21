/* eslint-disable no-magic-numbers */
import Comments from 'widgets/ProjectInfo/ProjectInfo/Comments';
import domConstruct from 'dojo/dom-construct';
import fieldsJson from 'dojo/text!tests/data/fields.json';


describe('Comments', () => {
  let testWidget;

  beforeEach(() => {
    testWidget = new Comments({
      fields: JSON.parse(fieldsJson)
    }, domConstruct.create('div', {}, window.body));
    testWidget.startup();
  });

  it('creates a valid object', () => {
    expect(testWidget).toEqual(jasmine.any(Comments));
  });
});
