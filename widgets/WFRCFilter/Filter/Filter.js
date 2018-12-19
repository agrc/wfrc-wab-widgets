import _TemplatedMixin from 'dijit/_TemplatedMixin';
import _WidgetBase from 'dijit/_WidgetBase';
import declare from 'dojo/_base/declare';
import template from 'dojo/text!./Filter.html';


export default declare([_WidgetBase, _TemplatedMixin], {
  baseClass: 'wfrc-filter',
  templateString: template,

  postMixInProperties() {
    console.log('Filter.postMixInProperties');

    this.nls = this.config.strings[this.config.language];
  },

  postCreate() {
    console.log('Filter.postCreate');

    this.modes.indeterminate = true;
    this.phasing.indeterminate = true;
  },

  init() {
    console.log('Filter.init');

    this.setupParentChildCheckboxes();

    const layers = this.getLayers(this.config.layerNames, this.map);

    this.modes = {
      roads: [
        layers.roadwayPointProjects,
        layers.roadwayLineProjects,
        layers.magRoadwayLineProjects,
        layers.magPointProjects
      ],
      transit: [
        layers.transitPointProjects,
        layers.transitLineProjects,
        layers.magTransitLineProjects
      ],
      bikeped: [
        layers.activeTransportationPointProjects,
        layers.activeTransportationLineProjects
      ]
    };

    Object.keys(this.modes).forEach(mode => {
      const checkbox = this[mode];

      checkbox.addEventListener('change', () => {
        this.modes[mode].forEach(layer => layer.setVisibility(checkbox.checked));
      });
    });
  },

  setupParentChildCheckboxes() {
    console.log('Filter.setupParentChildCheckboxes');

    // loop through each table looking for multiple checkboxes
    this.domNode.querySelectorAll('table').forEach(table => {
      const checkboxes = table.querySelectorAll('input[type="checkbox"]');
      let pauseChildrenChangeEvents = false;
      if (checkboxes.length > 1) {
        const parent = checkboxes[0];
        const children = Array.from(checkboxes).slice(1);

        parent.addEventListener('change', () => {
          pauseChildrenChangeEvents = true;
          children.forEach(child => {
            const changed = child.checked !== parent.checked;
            child.checked = parent.checked;

            if (changed) {
              child.dispatchEvent(new Event('change'));
            }
          });
          pauseChildrenChangeEvents = false;
        });

        children.forEach(child => {
          child.addEventListener('change', () => {
            if (pauseChildrenChangeEvents) {
              return;
            }

            if (children.every(c => c.checked)) {
              parent.checked = true;
              parent.indeterminate = false;
            } else if (children.some(c => c.checked)) {
              parent.indeterminate = true;
              parent.checked = false;
            } else {
              parent.checked = false;
              parent.indeterminate = false;
            }
          });
        });
      }
    });
  },

  getLayers(layerNames, map) {
    console.log('Filter.getLayers');

    const layerNameLookup = {};

    map.itemInfo.itemData.operationalLayers.forEach(layerInfo => {
      layerNameLookup[layerInfo.title] = layerInfo.layerObject;
    });

    const layers = {};

    Object.keys(layerNames).forEach(name => {
      const layer = layerNameLookup[layerNames[name]];

      if (!layer) {
        throw new Error(`Layer: ${layerNames[name]} not found in web map!`);
      }

      layers[name] = layer;
    });

    return layers;
  }
});
