var ID = -1;

/**
 * 渲染器
 * @param {*} globe 
 */
function Renderer(globe) {
    this.globe = globe;
    this.camera = this.globe.camera;
    this.renderer = this.globe.renderer;
    this.id = `${this.constructor.name}${ID--}`;
}

Renderer.prototype.render = function (layer) {

};

Renderer.prototype.dispose = function () {
    delete this.camera;
    delete this.render;
    delete this.globe;
};

export default Renderer;