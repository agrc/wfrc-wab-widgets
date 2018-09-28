import URLParams from 'widgets/URLParams/URLParams/URLParams';
import domConstruct from 'dojo/dom-construct';
import Map from 'esri/map';


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
});
