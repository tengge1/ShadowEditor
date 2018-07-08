var ID = -1;

/**
 * 粒子基类
 * @param {*} camera 相机
 * @param {*} renderer 渲染器
 * @param {*} options 选项
 */
function BaseParticle(camera, renderer, options) {
    this.camera = camera;
    this.renderer = renderer;
    this.options = options;

    this.id = 'BaseParticle' + ID--;

    // 需要放入场景的物体
    this.mesh = null;
};

BaseParticle.prototype.update = function (elapsed) {

};

export default BaseParticle;