import BingTiledLayer from './layer/BingTiledLayer';
import TiledLayerRenderer from './render/TiledLayerRenderer';
import MathUtils from './utils/MathUtils';

/**
 * 地球
 * @param {*} camera 
 * @param {*} renderer 
 */
function Globe(camera, renderer) {
    THREE.Object3D.call(this);

    this.camera = camera;
    this.renderer = renderer;

    this.lon = 0; // 经度
    this.lat = 0; // 纬度
    this.alt = 10000; // 海拔（米）

    this.tiledLayerRenderer = new TiledLayerRenderer(this);
}

Globe.prototype = Object.create(THREE.Object3D.prototype);
Globe.prototype.constructor = Globe;

Globe.prototype.create = function () {
    this.layer = new BingTiledLayer();
    this.tiledLayerRenderer = new TiledLayerRenderer(this);
};

Globe.prototype.update = function () {
    this.tiledLayerRenderer.render(this.layer);
};

Globe.prototype.dispose = function () {
    this.layer.dispose();
    this.tiledLayerRenderer.dispose();
    delete this.layer;
    delete this.tiledLayerRenderer;
    delete this.camera;
    delete this.renderer;
};

export default Globe;