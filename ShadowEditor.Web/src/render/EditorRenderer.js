import BaseRenderer from './BaseRenderer';

/**
 * 编辑器渲染器
 */
function EditorRenderer() {
    BaseRenderer.call(this);
};

EditorRenderer.prototype = Object.create(BaseRenderer.prototype);
EditorRenderer.prototype.constructor = EditorRenderer;

EditorRenderer.prototype.create = function () {
    return new Promise(resolve => {
        resolve();
    });
};

EditorRenderer.prototype.render = function (scene, camera, renderer) {

};

EditorRenderer.prototype.dispose = function () {

};

export default EditorRenderer;