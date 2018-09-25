import URLParams from 'widgets/URLParams/URLParams/URLParams';
import domConstruct from 'dojo/dom-construct';


describe('URLParams', () => {
  let testWidget;

  beforeEach(() => {
    testWidget = new URLParams({
      config: {}
    }, domConstruct.create('div', {}, window.body));
    testWidget.startup();
  });

  it('creates a valid object', () => {
    expect(testWidget).toEqual(jasmine.any(URLParams));
  });
});
