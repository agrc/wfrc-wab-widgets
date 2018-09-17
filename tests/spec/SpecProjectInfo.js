import ProjectInfo from 'widgets/ProjectInfo/ProjectInfo/ProjectInfo';
import domConstruct from 'dojo/dom-construct';
import EsriMap from 'esri/map';


describe('ProjectInfo', () => {
  let testWidget;

  beforeEach(() => {
    testWidget = new ProjectInfo({
      config: {
        serviceUrl: 'blah'
      },
      map: new EsriMap(domConstruct.create('div', {}, window.body))
    }, domConstruct.create('div', {}, window.body));
    testWidget.startup();
  });

  it('creates a valid object', () => {
    expect(testWidget).toEqual(jasmine.any(ProjectInfo));
  });
});
