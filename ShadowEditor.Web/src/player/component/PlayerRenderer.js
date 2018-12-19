import PlayerComponent from './PlayerComponent';

/**
 * 播放器渲染器
 * @param {*} app 应用
 */
function PlayerRenderer(app) {
    PlayerComponent.call(this, app);
}

PlayerRenderer.prototype = Object.create(PlayerComponent.prototype);
PlayerRenderer.prototype.constructor = PlayerRenderer;

PlayerRenderer.prototype.create = function (scene, camera, renderer) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;

    var composer = new THREE.EffectComposer(renderer);

    var renderPass = new THREE.RenderPass(scene, camera);
    renderPass.renderToScreen = true;
    composer.addPass(renderPass);

    // var effect = new THREE.ShaderPass(THREE.DotScreenShader);
    // effect.uniforms['scale'].value = 4;
    // effect.renderToScreen = true;
    // composer.addPass(effect);
    // var effect = new THREE.ShaderPass(THREE.RGBShiftShader);
    // effect.uniforms['amount'].value = 0.0015;
    // effect.renderToScreen = true;
    // composer.addPass(effect);

    this.composer = composer;
};

PlayerRenderer.prototype.update = function (clock, deltaTime) {
    this.composer.render();
    // this.renderer.render(this.scene, this.camera);
};

PlayerRenderer.prototype.dispose = function () {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
};

export default PlayerRenderer;