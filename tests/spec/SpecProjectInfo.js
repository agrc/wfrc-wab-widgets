import ProjectInfo from 'widgets/ProjectInfo/ProjectInfo/ProjectInfo';
import domConstruct from 'dojo/dom-construct';


describe('ProjectInfo', () => {
  let testWidget;

  beforeEach(() => {
    testWidget = new ProjectInfo({
      config: {
        serviceUrl: 'blah'
      }
    }, domConstruct.create('div', {}, window.body));
    testWidget.startup();
  });

  it('creates a valid object', () => {
    expect(testWidget).toEqual(jasmine.any(ProjectInfo));
  });
});
