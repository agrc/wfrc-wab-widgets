import ProjectInfo from 'widgets/ProjectInfo/ProjectInfo/ProjectInfo';
import domConstruct from 'dojo/dom-construct';
import EsriMap from 'esri/map';


describe('ProjectInfo', () => {
  let testWidget;

  beforeEach(() => {
    testWidget = new ProjectInfo({
      config: {
        serviceUrl: 'blah',
        excludeFields: []
      },
      map: new EsriMap(domConstruct.create('div', {}, window.body))
    }, domConstruct.create('div', {}, window.body));
    testWidget.startup();
  });

  it('creates a valid object', () => {
    expect(testWidget).toEqual(jasmine.any(ProjectInfo));
  });

  describe('setFeatures', () => {
    const feature = {
      attributes: {
        blah: 'asdf'
      },
      geometry: {
        type: 'polyline'
      },
      fields: [{
        name: 'blah',
        alias: 'blah blah'
      }],
      displayField: 'blah'
    };

    it('destroys any previous widgets', () => {
      const widget = { destroy: jasmine.createSpy('destroy') };
      testWidget.detailsWidgets = [widget];

      testWidget.setFeatures([feature, feature]);

      expect(widget.destroy).toHaveBeenCalled();
    });
  });
});
