var ID = -1;

/**
 * 渲染器
 * @author tengge / https://github.com/tengge1
 * @param {*} globe 地球
 */
function Renderer(globe) {
    this.globe = globe;

    this.id = `${this.constructor.name}${ID--}`;

    this.camera = this.globe.camera;
    this.renderer = this.globe.renderer;
    this.gl = this.renderer.getContext();
}

Renderer.prototype.render = function (layer) { // eslint-disable-line

};

Renderer.prototype.dispose = function () {
    delete this.camera;
    delete this.render;
    delete this.gl;
    delete this.globe;
};

export default Renderer;