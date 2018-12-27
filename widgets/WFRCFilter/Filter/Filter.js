import _TemplatedMixin from 'dijit/_TemplatedMixin';
import _WidgetBase from 'dijit/_WidgetBase';
import declare from 'dojo/_base/declare';
import template from 'dojo/text!./Filter.html';


const landUseLayers = ['centers', 'generalLandUse'];

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

    // modes
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

    const onModeCheckboxChange = (mode) => {
      this.modes[mode].forEach(layer => layer.setVisibility(this[mode].checked));
    };

    Object.keys(this.modes).forEach(mode => {
      const checkbox = this[mode];

      checkbox.addEventListener('change', onModeCheckboxChange.bind(this, [mode]));
    });

    // phases
    const phaseCheckboxes = Array.from(this.domNode.getElementsByClassName('phasing-checkbox'));
    const onPhaseCheckboxChange = () => {
      const checkedPhaseIndexes = phaseCheckboxes.filter(box => box.checked).map(box => parseInt(box.value, 10));

      Object.keys(this.config.phases).forEach(phaseLayerKey => {
        // apply phasing filter to land use layers only if the byPhasing checkbox is checked
        if (landUseLayers.indexOf(phaseLayerKey) > -1 && !this.byPhasing.checked) {
          return;
        }

        const info = this.config.phases[phaseLayerKey];

        layers[phaseLayerKey].setDefinitionExpression(this.getPhaseQuery(info, checkedPhaseIndexes));
      });
    };

    phaseCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', onPhaseCheckboxChange);
    });

    // make map layers reflect initial state of filter controls
    onPhaseCheckboxChange();
    Object.keys(this.modes).forEach(onModeCheckboxChange);

    const singleLayerMappings = [
      // checkbox, associated layer
      [this.centers, layers.centers],
      [this.generalLandUse, layers.generalLandUse]
    ];
    singleLayerMappings.forEach(mapping => this.wireCheckboxToLayer(...mapping));

    this.byPhasing.addEventListener('change', () => {
      if (this.byPhasing.checked) {
        onPhaseCheckboxChange();
      } else {
        landUseLayers.forEach(key => {
          const layer = layers[key];
          layer.setDefinitionExpression(layer.defaultDefinitionExpression);
        });
      }
    });
  },

  wireCheckboxToLayer(checkbox, layer) {
    console.log('Filter.wirecheckboxToLayer', arguments);

    checkbox.addEventListener('change', () => layer.setVisibility(checkbox.checked));
  },

  getPhaseQuery(phaseInfo, checkedPhaseIndexes) {
    // translate the phase info into a definition query taking into account the selected phases
    console.log('Filter.getPhaseQuery');

    const filterPhase = (_, i) => {
      return checkedPhaseIndexes.includes(i);
    };

    const joinTxt = ', ';
    const dedup = (inStatement) => {
      return [... new Set(inStatement.split(joinTxt))].join(joinTxt);
    };

    return `${phaseInfo[0]} IN (${dedup(phaseInfo.slice(1).filter(filterPhase).join(joinTxt))})`;
  },

  setupParentChildCheckboxes() {
    console.log('Filter.setupParentChildCheckboxes');

    // loop through each table looking for multiple checkboxes
    this.domNode.querySelectorAll('table').forEach(table => {
      const checkboxes = table.querySelectorAll('input[type="checkbox"]');
      let pauseChildrenChangeEvents = false;
      if (checkboxes.length > 1) {
        const parent = checkboxes[0];
        const children = Array.from(checkboxes).slice(1).filter(checkbox => checkbox !== this.byPhasing);

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
