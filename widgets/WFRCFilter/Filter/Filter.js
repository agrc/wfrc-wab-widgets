import _TemplatedMixin from 'dijit/_TemplatedMixin';
import _WidgetBase from 'dijit/_WidgetBase';
import declare from 'dojo/_base/declare';
import template from 'dojo/text!./Filter.html';
import Tooltip from 'dijit/Tooltip';
import landUseLegendTemplate from 'dojo/text!./LandUseLegend.html';
import centersLegendTemplate from 'dojo/text!./CentersLegend.html';
import dojoString from 'dojo/string';
import topic from 'dojo/topic';


const landUseLayers = ['centers', 'generalLandUse'];

export default declare([_WidgetBase, _TemplatedMixin], {
  baseClass: 'wfrc-filter',
  templateString: template,

  postMixInProperties() {
    console.log('Filter.postMixInProperties');

    this.nls = this.config.strings[this.config.language];

    this.inherited(arguments);
  },

  postCreate() {
    console.log('Filter.postCreate');

    this.modes.indeterminate = true;
    this.phasing.indeterminate = true;
    this.childrenCheckboxes = [this.byPhasing];
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

    const onModeCheckboxChange = (changedMode) => {
      this.modes[changedMode].forEach(layer => layer.setVisibility(this[changedMode].checked));

      const visibleModes = Object.keys(this.modes).filter(mode => this[mode].checked);
      topic.publish('url-params-on-filter-change', { modes: visibleModes });
    };

    Object.keys(this.modes).forEach(mode => {
      const checkbox = this[mode];

      checkbox.addEventListener('change', onModeCheckboxChange.bind(this, [mode]));
    });

    // phases
    const phaseCheckboxes = Array.from(this.domNode.getElementsByClassName('phasing-checkbox'));
    const onPhaseCheckboxChange = () => {
      const checkedPhaseIndexes = phaseCheckboxes.filter(box => box.checked).map(box => parseInt(box.value, 10));
      topic.publish('url-params-on-filter-change', { phaseIndexes: checkedPhaseIndexes });

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

    const singleLayerMappings = [
      // checkbox, associated layer
      [this.centers, layers.centers],
      [this.generalLandUse, layers.generalLandUse],
      [this.existingBikeped, layers.existingActiveTransportationNetwork],
      [this.neighboringLandUse, layers.neighboringLandUse],
      [this.planningBoundaries, layers.boundaries],
      [this.neighboringProjects, [layers.neighboringPoints, layers.neighboringLines]]
    ];
    singleLayerMappings.forEach(mapping => this.wireCheckboxToLayer(...mapping));

    // pick up URLParam values if any
    if (window.URLParams) {
      if (window.URLParams.modes) {
        console.log('modes', window.URLParams.modes);
        Object.keys(this.modes).forEach(mode => {
          this[mode].checked = window.URLParams.modes.includes(mode);
        });
      }

      if (window.URLParams.phaseIndexes) {
        console.log('phaseIndexes', window.URLParams.phaseIndexes);
        phaseCheckboxes.forEach(checkbox => {
          checkbox.checked = window.URLParams.phaseIndexes.includes(checkbox.value);
        });
      }
    }

    // make map layers reflect initial state of filter controls
    onPhaseCheckboxChange();
    Object.keys(this.modes).forEach(onModeCheckboxChange);

    // land use filter by phasing checkbox
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

    // store checkboxes that are initially checked for use in resetFilters
    this.checkboxesCheckedByDefault = Array.from(this.domNode.querySelectorAll('input[checked]'));

    // legend popups
    const landUseTooltip = new Tooltip({
      connectId: this.generalLandUseLegend,
      label: dojoString.substitute(landUseLegendTemplate, this),
      showDelay: 100,
      position: ['below']
    });
    landUseTooltip.startup();
    const centersTooltip = new Tooltip({
      connectId: this.centersLegend,
      label: dojoString.substitute(centersLegendTemplate, this),
      showDelay: 100,
      position: ['above']
    });
    centersTooltip.startup();
  },

  wireCheckboxToLayer(checkbox, layer) {
    console.log('Filter.wirecheckboxToLayer', arguments);

    const updateVisibility = () => {
      if (Array.isArray(layer)) {
        layer.forEach(l => l.setVisibility(checkbox.checked));
      } else {
        layer.setVisibility(checkbox.checked);
      }
    };

    checkbox.addEventListener('change', updateVisibility);

    // set layer to match initial state of checkbox
    updateVisibility();
  },

  getPhaseQuery(phaseInfo, checkedPhaseIndexes) {
    // translate the phase info into a definition query taking into account the selected phases
    console.log('Filter.getPhaseQuery');

    if (checkedPhaseIndexes.length === 0) {
      return '1 = 2';
    }

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

        // store list of children checkboxes for use in resetFilters
        this.childrenCheckboxes = this.childrenCheckboxes.concat(children);

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
  },

  resetFilters() {
    // summary:
    //    reset filter controls to default values
    console.log('Filter.resetFilters');

    this.childrenCheckboxes.forEach(checkbox => {
      checkbox.checked = this.checkboxesCheckedByDefault.indexOf(checkbox) > -1;

      checkbox.dispatchEvent(new Event('change'));
    });
  }
});
