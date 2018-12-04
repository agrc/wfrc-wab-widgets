import Filter from 'widgets/WFRCFilter/Filter/Filter';
import domConstruct from 'dojo/dom-construct';


describe('Filter', () => {
  let testWidget;

  beforeEach(() => {
    testWidget = new Filter({}, domConstruct.create('div', {}, document.body));
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
  });
});
