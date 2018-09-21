/* eslint-disable no-magic-numbers */
import Details from 'widgets/ProjectInfo/ProjectInfo/Details';
import domConstruct from 'dojo/dom-construct';
import featureJson from 'dojo/text!tests/data/feature.json';
import fieldsJson from 'dojo/text!tests/data/fields.json';


describe('Details', () => {
  let testWidget;
  const feature = JSON.parse(featureJson);
  feature.setSymbol = () => {};
  const fields = JSON.parse(fieldsJson);

  beforeEach(() => {
    testWidget = new Details({
      feature,
      fields,
      displayField: 'ProjName',
      config: {
        excludeFields: ['OBJECTID', 'GlobalID'],
        commentsEnabled: true
      }
    }, domConstruct.create('div', {}, document.body));
  });

  afterEach(() => {
    testWidget.destroy();
  });

  it('creates a valid object', () => {
    expect(testWidget).toEqual(jasmine.any(Details));
  });

  describe('getAliasValuePairs', () => {
    it('returns the appropriate aliases and values', () => {
      const pairs = testWidget.getAliasValuePairs(
        feature.attributes, fields, testWidget.config.excludeFields, 'ProjName');

      expect(pairs.length).toBe(7);

      expect(pairs).toContain(['Project From', 'Mountain View Corridor']);
    });
  });

  describe('shouldDisplayComments', () => {
    it('returns true/false based on the presence of the global id field', () => {
      expect(testWidget.shouldDisplayComments(fields)).toBe(true);
      expect(testWidget.shouldDisplayComments([{
        name: 'MyField'
      }])).toBe(false);
    });

    it('honors config values', () => {
      testWidget.config.commentsEnabled = true;

      expect(testWidget.shouldDisplayComments(fields)).toBe(true);

      testWidget.config.commentsEnabled = false;

      expect(testWidget.shouldDisplayComments(fields)).toBe(false);
    });
  });
});
