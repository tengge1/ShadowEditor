import Renderer from './Renderer';

/**
 * 大气层渲染器
 * @author tengge / https://github.com/tengge1
 * @param {*} globe 
 */
function AtmosphereRenderer(globe) {
    Renderer.call(this, globe);
}

AtmosphereRenderer.prototype = Object.create(Renderer.prototype);
AtmosphereRenderer.prototype.constructor = AtmosphereRenderer;

AtmosphereRenderer.prototype.render = function (layer) {

};

AtmosphereRenderer.prototype.dispose = function () {
    Renderer.prototype.dispose.call(this);
};

export default AtmosphereRenderer;