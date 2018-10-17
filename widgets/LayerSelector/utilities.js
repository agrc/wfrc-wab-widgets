import ArcGISDynamicMapServiceLayer from 'esri/layers/ArcGISDynamicMapServiceLayer';
import ArcGISImageServiceLayer from 'esri/layers/ArcGISImageServiceLayer';
import ArcGISTiledMapServiceLayer from 'esri/layers/ArcGISTiledMapServiceLayer';
import FeatureLayer from 'esri/layers/FeatureLayer';
import KMLLayer from 'esri/layers/KMLLayer';
import LabelLayer from 'esri/layers/LabelLayer';
import RasterLayer from 'esri/layers/RasterLayer';
import StreamLayer from 'esri/layers/StreamLayer';
import TiledMapServiceLayer from 'esri/layers/TiledMapServiceLayer';
import VectorTileLayer from 'esri/layers/VectorTileLayer';
import WCSLayer from 'esri/layers/WCSLayer';
import WebTiledLayer from 'esri/layers/WebTiledLayer';
import WFSLayer from 'esri/layers/WFSLayer';
import WMSLayer from 'esri/layers/WMSLayer';
import WMTSLayer from 'esri/layers/WMTSLayer';


const factoryLookup = {
  ArcGISDynamicMapServiceLayer: ArcGISDynamicMapServiceLayer,
  ArcGISImageServiceLayer: ArcGISImageServiceLayer,
  ArcGISTiledMapServiceLayer: ArcGISTiledMapServiceLayer,
  FeatureLayer: FeatureLayer,
  KMLLayer: KMLLayer,
  LabelLayer: LabelLayer,
  RasterLayer: RasterLayer,
  StreamLayer: StreamLayer,
  TiledMapServiceLayer: TiledMapServiceLayer,
  VectorTileLayer: VectorTileLayer,
  WCSLayer: WCSLayer,
  WebTiledLayer: WebTiledLayer,
  WFSLayer: WFSLayer,
  WMSLayer: WMSLayer,
  WMTSLayer: WMTSLayer
};


export default {
  applyFactories(config) {
    console.log('LayerSelector:utilities:applyFactories');

    const convert = layer => {
      if (typeof layer === String) {
        return layer;
      }

      return Object.assign(layer, {
        Factory: factoryLookup[layer.Factory]
      });
    };

    const baseLayers = Array.from(config.baseLayers);
    config.baseLayers = baseLayers.map(convert);

    const overlays = Array.from(config.overlays);
    config.overlays = overlays.map(convert);

    return config;
  }
};
