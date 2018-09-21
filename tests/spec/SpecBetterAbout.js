import BetterAbout from 'widgets/BetterAbout/BetterAbout/BetterAbout';
import domConstruct from 'dojo/dom-construct';


describe('BetterAbout', () => {
  let testWidget;

  beforeEach(() => {
    testWidget = new BetterAbout({
      config: {}
    }, domConstruct.create('div', {}, window.body));
    testWidget.startup();
  });

  it('creates a valid object', () => {
    expect(testWidget).toEqual(jasmine.any(BetterAbout));
  });
});
