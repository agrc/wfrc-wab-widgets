import domConstruct from 'dojo/dom-construct';
import Map from 'esri/map';
import URLParams from 'widgets/URLParams/URLParams/URLParams';


describe('URLParams', () => {
  let testWidget;

  beforeEach(() => {
    testWidget = new URLParams({
      config: {},
      map: new Map(domConstruct.create('div'))
    }, domConstruct.create('div', {}, window.body));
    testWidget.startup();
  });

  it('creates a valid object', () => {
    expect(testWidget).toEqual(jasmine.any(URLParams));
  });

  describe('setParams', () => {
    it('sets the new parameters in the URL', () => {
      const key = 'someKey';
      const value = 'someValue';

      expect(testWidget.setParams({ [key]: value })).toContain(`${key}=${value}`);
    });

    it('preserves other parameters', () => {
      const key = 'someKey';
      const value = 'someValue';

      expect(testWidget.setParams({ [key]: value })).toContain(`${key}=${value}`);
      expect(testWidget.setParams({ another: 'blah' })).toContain(`${key}=${value}`);
    });
  });
});
