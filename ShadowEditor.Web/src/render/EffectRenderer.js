import BaseRenderer from './BaseRenderer';

/**
 * 特效渲染器
 */
function EffectRenderer() {
    BaseRenderer.call(this);
};

EffectRenderer.prototype = Object.create(BaseRenderer.prototype);
EffectRenderer.prototype.constructor = EffectRenderer;

EffectRenderer.prototype.create = function () {
    return new Promise(resolve => {
        resolve();
    });
};

EffectRenderer.prototype.render = function (scene, camera, renderer) {

};

EffectRenderer.prototype.dispose = function () {

};

export default EffectRenderer;