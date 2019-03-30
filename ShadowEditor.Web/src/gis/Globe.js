import BingTiledLayer from './layer/BingTiledLayer';
import TiledLayerRenderer from './render/TiledLayerRenderer';
import OrbitViewer from './view/OrbitViewer';
import MathUtils from './utils/MathUtils';

/**
 * 地球
 * @param {*} camera 
 * @param {*} renderer 
 */
function Globe(camera, renderer) {
    THREE.Object3D.call(this);

    this.name = L_GLOBE;

    this.camera = camera;
    this.renderer = renderer;

    this.lon = 0;
    this.lat = 0;
    this.alt = MathUtils.zoomToAlt(0);

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