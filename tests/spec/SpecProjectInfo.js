import ProjectInfo from 'widgets/ProjectInfo/ProjectInfo/ProjectInfo';
import domConstruct from 'dojo/dom-construct';
import EsriMap from 'esri/map';
import configJson from 'dojo/text!widgets/ProjectInfo/config.json';


describe('ProjectInfo', () => {
  let testWidget;

  beforeEach(() => {
    testWidget = new ProjectInfo({
      config: JSON.parse(configJson),
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

  describe('sortFeatures', () => {
    it('sorts features accordining to config', () => {
      const feature1 = { layerName: 'layer1' };
      const feature4 = { layerName: 'layer4' };
      const feature2 = { layerName: 'layer2' };
      const feature3 = { layerName: 'layer3' };
      const features = [feature1, feature4, feature2, feature3];
      const expected = [feature1, feature2, feature3, feature4];
      testWidget.config.layerSortOrder = ['layer1', 'layer2', 'layer3', 'layer4'];

      expect(testWidget.sortFeatures(features)).toEqual(expected);
    });
  });
});
