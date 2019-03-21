var ID = -1;

/**
 * 渲染器
 * @param {*} camera 
 * @param {*} renderer 
 */
function Renderer(camera, renderer) {
    this.camera = camera;
    this.renderer = renderer;
    this.id = `${this.constructor.name}${ID--}`;
}

Renderer.prototype.render = function (layer) {

};

Renderer.prototype.dispose = function () {
    delete this.camera;
    delete this.render;
};

export default Renderer;