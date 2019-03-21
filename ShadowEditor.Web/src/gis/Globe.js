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
}

Globe.prototype.create = function () {
    this.layer = new BingTiledLayer();
    this.tiledLayerRenderer = new TiledLayerRenderer(this.camera, this.renderer);
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