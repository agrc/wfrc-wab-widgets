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
      config: { excludeFields: ['OBJECTID', 'GlobalID'] }
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
});
