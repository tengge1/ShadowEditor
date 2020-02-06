import Renderer from './Renderer';
import BackgroundRenderer from './BackgroundRenderer';
import SunRenderer from './SunRenderer';
import TiledLayerRenderer from './TiledLayerRenderer';
import AtmosphereRenderer from './AtmosphereRenderer';

/**
 * 所有渲染器
 * @author tengge / https://github.com/tengge1
 * @param {*} globe 地球
 */
function Renderers(globe) {
    Renderer.call(this, globe);

    this.renderers = [
        new BackgroundRenderer(this.globe),
        new SunRenderer(this.globe),
        new TiledLayerRenderer(this.globe)
        //new AtmosphereRenderer(this.globe),
    ];
}

Renderers.prototype = Object.create(Renderer.prototype);
Renderers.prototype.constructor = Renderers;

Renderers.prototype.render = function () {
    this.renderers.forEach(n => {
        n.render();
    });
};

Renderers.prototype.dispose = function () {
    this.renderers.forEach(n => {
        n.dispose();
    });

    this.renderers.length = 0;

    Renderer.prototype.dispose.call(this);
};

export default Renderers;