import BingTiledLayer from './layer/BingTiledLayer';
import TiledLayerRenderer from './render/TiledLayerRenderer';
import OrbitViewer from './view/OrbitViewer';
import GeoUtils from './utils/GeoUtils';

/**
 * 地球
 * @author tengge / https://github.com/tengge1
 * @param {*} camera 
 * @param {*} renderer 
 * @param {*} options 
 */
function Globe(camera, renderer, options) {
    THREE.Object3D.call(this);

    this.name = L_GLOBE;

    this.isGlobe = true;

    this.camera = camera;
    this.renderer = renderer;
    this.options = options;

    this.lon = 0;
    this.lat = 0;
    this.alt = GeoUtils.zoomToAlt(0);

    this.matrixAutoUpdate = false;

    this.layer = new BingTiledLayer();
    this.tiledLayerRenderer = new TiledLayerRenderer(this);
    this.viewer = new OrbitViewer(this.camera, this.renderer.domElement);

    this.viewer.setPosition(this.lon, this.lat, this.alt);
}

Globe.prototype = Object.create(THREE.Object3D.prototype);
Globe.prototype.constructor = Globe;

Globe.prototype.update = function () {
    this.tiledLayerRenderer.render(this.layer);
    this.viewer.update();
};

Globe.prototype.dispose = function () {
    this.layer.dispose();
    this.tiledLayerRenderer.dispose();
    this.viewer.dispose();

    delete this.layer;
    delete this.tiledLayerRenderer;
    delete this.viewer;

    delete this.camera;
    delete this.renderer;
};

export default Globe;