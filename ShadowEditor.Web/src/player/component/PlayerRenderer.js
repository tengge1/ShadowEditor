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

    // 后期处理
    var postProcessing = this.scene.userData.postProcessing || {};
    var hasPostProcessing = false;

    for (var i in postProcessing) {
        if (postProcessing[i].enabled) {
            hasPostProcessing = true;
            break;
        }
    }

    var composer = new THREE.EffectComposer(renderer);

    var renderPass = new THREE.RenderPass(scene, camera);
    renderPass.renderToScreen = !hasPostProcessing;
    composer.addPass(renderPass);

    if (postProcessing.dotScreen && postProcessing.dotScreen.enabled) {
        var effect = new THREE.ShaderPass(THREE.DotScreenShader);
        effect.uniforms['scale'].value = postProcessing.dotScreen.scale;
        effect.renderToScreen = true;
        composer.addPass(effect);
    }

    if (postProcessing.rgbShift && postProcessing.rgbShift.enabled) {
        var effect = new THREE.ShaderPass(THREE.RGBShiftShader);
        effect.uniforms['amount'].value = postProcessing.rgbShift.amount;
        effect.renderToScreen = true;
        composer.addPass(effect);
    }

    this.composer = composer;
};

PlayerRenderer.prototype.update = function (clock, deltaTime) {
    this.composer.render();
};

PlayerRenderer.prototype.dispose = function () {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
};

export default PlayerRenderer;