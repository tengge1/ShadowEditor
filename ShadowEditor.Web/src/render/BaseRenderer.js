var ID = -1;

/**
 * 基本渲染器
 * @author tengge / https://github.com/tengge1
 */
function BaseRenderer() {
    this.id = `${this.constructor.name}${ID--}`;
}

BaseRenderer.prototype.create = function (scenes, camera, renderer, selected) {
    return new Promise(resolve => {
        resolve();
    });
};

BaseRenderer.prototype.render = function () {

};

BaseRenderer.prototype.dispose = function () {

};

export default BaseRenderer;