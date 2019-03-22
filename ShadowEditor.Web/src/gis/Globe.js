import BingTiledLayer from './layer/BingTiledLayer';
import TiledLayerRenderer from './render/TiledLayerRenderer';

/**
 * 地球
 * @param {*} camera 
 * @param {*} renderer 
 */
function Globe(camera, renderer) {
    this.camera = camera;
    this.renderer = renderer;

    this.lon = 0; // 经度
    this.lat = 0; // 纬度
    this.alt = 10000; // 海拔（米）
}

Globe.prototype.create = function () {
    // 设置相机位置


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