import Filter from 'widgets/WFRCFilter/Filter/Filter';
import domConstruct from 'dojo/dom-construct';
import configJson from 'dojo/text!widgets/WFRCFilter/config.json';


describe('Filter', () => {
  let testWidget;
  const centersTitle = 'Centers';
  const centersLayer = {};
  const mockMap = {
    itemInfo: {
      itemData: {
        operationalLayers: [{
          title: centersTitle,
          layerObject: centersLayer
        }, {
          title: 'Boundaries',
          layerObject: {}
        }]
      }
    }
  };

  beforeEach(() => {
    testWidget = new Filter({
      config: JSON.parse(configJson),
      map: mockMap
    }, domConstruct.create('div', {}, document.body));
  });

  afterEach(() => {
    testWidget.destroy();
  });

  it('creates a valid object', () => {
    expect(testWidget).toEqual(jasmine.any(Filter));
  });

  describe('parent/child checkboxes', () => {
    let parent;
    let children;

    beforeEach(() => {
      testWidget.setupParentChildCheckboxes();

      const table = testWidget.domNode.querySelectorAll('table')[0];
      const checkboxes = Array.from(table.querySelectorAll('input'));
      parent = checkboxes[0];
      children = checkboxes.slice(1);

      // uncheck all boxes to begin
      checkboxes.forEach(box => {
        box.checked = false;
      });
      parent.indeterminate = false;
    });

    it('select all children', () => {
      children.forEach(child => {
        child.checked = true;
        child.dispatchEvent(new Event('change'));
      });

      expect(parent.checked).toBe(true);
      expect(parent.indeterminate).toBe(false);
    });

    it('select one child', () => {
      children[0].checked = true;
      children[0].dispatchEvent(new Event('change'));

      expect(parent.checked).toBe(false);
      expect(parent.indeterminate).toBe(true);
    });

    it('unselect all children', () => {
      children.forEach(child => {
        child.checked = false;
        child.dispatchEvent(new Event('change'));
      });

      expect(parent.checked).toBe(false);
      expect(parent.indeterminate).toBe(false);
    });

    it('select parent', () => {
      parent.checked = true;
      parent.dispatchEvent(new Event('change'));

      expect(children.every(child => child.checked)).toBe(true);
    });

    it('unselect parent', () => {
      children[0].checked = true;
      parent.checked = false;
      parent.dispatchEvent(new Event('change'));

      expect(children.every(child => !child.checked)).toBe(true);
    });

    it('checking parent fires child change events', () => {
      const changeSpy = jasmine.createSpy();

      children[0].addEventListener('change', changeSpy);

      parent.checked = true;
      parent.dispatchEvent(new Event('change'));

      expect(changeSpy).toHaveBeenCalled();
    });
  });

  describe('getLayers', () => {
    it('returns the correct layer objects', () => {
      const config = {
        layerNames: {
          boundaries: 'Boundaries',
          centers: centersTitle
        }
      };

      const result = testWidget.getLayers(config.layerNames, mockMap);

      expect(Object.keys(result).length).toBe(2);
      expect(result.centers).toBe(centersLayer);
    });

    it('throws error if there is no matching layer in web map', () => {
      const config = {
        layerNames: {
          boundaries: 'BadLayerName',
          centers: centersTitle
        }
      };

      expect(() => {
        testWidget.getLayers(config.layerNames, mockMap);
      }).toThrow(new Error('Layer: BadLayerName not found in web map!'));
    });
  });

  describe('getPhaseQuery', () => {
    const tests = [
      [['FCPhase', 1, 2, 3, 4], [0, 1, 2], 'FCPhase IN (1, 2, 3)'],
      [['FCPhase', 1, 2, 3, 'NULL'], [1, 3], 'FCPhase IN (2, NULL)'],
      [['DraftPhase', 1, '1, 12', '1, 12, 123'], [0, 1], 'DraftPhase IN (1, 12)'],
      [['DraftPhase', 1, '1, 12', '1, 12, 123'], [1], 'DraftPhase IN (1, 12)'],
      [['FCPhase', 1, 2, 3], [0, 1, 2, 3], 'FCPhase IN (1, 2, 3)'],
      [['FCPhase', 1, 2, 3], [3], 'FCPhase IN ()']
    ];

    tests.forEach(([info, indexes, expected]) => {
      it('returns the appropriate definition queries', () => {
        expect(testWidget.getPhaseQuery(info, indexes)).toEqual(expected);
      });
    });
  });
});
