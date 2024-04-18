/* eslint-disable max-len */
import { applyFactories } from 'widgets/LayerSelector/utilities';
import VectorTileLayer from 'esri/layers/VectorTileLayer';


describe('LayerSelector', () => {
  describe('applyFactories', () => {
    it('translates factory text to their corresponding class objects', () => {
      const inputConfig = {
        quadWord: 'blah',
        baseLayers: ['hello', 'have', 'a', 'nice', 'day'],
        overlays: ['Overlay', {
          id: 'Land Ownership',
          Factory: 'VectorTileLayer',
          url: 'https://gis.trustlands.utah.gov/hosting/rest/services/Hosted/Land_Ownership_WM_VectorTile/VectorTileServer'
        }, 'AddressPoints']
      };

      const expectedOutput = {
        quadWord: 'blah',
        baseLayers: ['hello', 'have', 'a', 'nice', 'day'],
        overlays: ['Overlay', {
          id: 'Land Ownership',
          Factory: VectorTileLayer,
          url: 'https://gis.trustlands.utah.gov/hosting/rest/services/Hosted/Land_Ownership_WM_VectorTile/VectorTileServer'
        }, 'AddressPoints']
      };

      expect(applyFactories(inputConfig)).toEqual(expectedOutput);
    });
  });
});
