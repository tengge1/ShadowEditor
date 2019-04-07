import Renderer from './Renderer';
import TiledLayerRenderer from './TiledLayerRenderer';

/**
 * 所有渲染器
 * @author tengge / https://github.com/tengge1
 * @param {*} globe 
 */
function Renderers(globe) {
    Renderer.call(this, globe);

    this.tiledLayerRenderer = new TiledLayerRenderer(this.globe);
}

Renderers.prototype = Object.create(Renderer.prototype);
Renderers.prototype.constructor = Renderers;

Renderers.prototype.render = function () {
    this.tiledLayerRenderer.render();
};

Renderers.prototype.dispose = function () {
    this.tiledLayerRenderer.dispose();
    delete this.tiledLayerRenderer;

    Renderer.prototype.dispose.call(this);
};

export default Renderers;