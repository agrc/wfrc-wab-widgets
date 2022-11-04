/* eslint-disable max-len */
import { applyFactories } from 'widgets/LayerSelector/utilities';
import FeatureLayer from 'esri/layers/FeatureLayer';


describe('LayerSelector', () => {
  describe('applyFactories', () => {
    it('translates factory text to their corresponding class objects', () => {
      const inputConfig = {
        quadWord: 'blah',
        baseLayers: ['hello', 'have', 'a', 'nice', 'day'],
        overlays: ['Overlay', {
          id: 'Land Ownership',
          Factory: 'FeatureLayer',
          url: 'https://gis.trustlands.utah.gov/server/rest/services/Ownership/UT_SITLA_Ownership_LandOwnership_WM/FeatureServer/0'
        }, 'AddressPoints']
      };

      const expectedOutput = {
        quadWord: 'blah',
        baseLayers: ['hello', 'have', 'a', 'nice', 'day'],
        overlays: ['Overlay', {
          id: 'Land Ownership',
          Factory: FeatureLayer,
          url: 'https://gis.trustlands.utah.gov/server/rest/services/Ownership/UT_SITLA_Ownership_LandOwnership_WM/FeatureServer/0'
        }, 'AddressPoints']
      };

      expect(applyFactories(inputConfig)).toEqual(expectedOutput);
    });
  });
});
