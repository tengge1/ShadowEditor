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
    var effects = [];

    var postProcessing = this.scene.userData.postProcessing || {};

    var composer = new THREE.EffectComposer(renderer);

    var effect = new THREE.RenderPass(scene, camera);
    composer.addPass(effect);
    effects.push(effect);

    if (postProcessing.dotScreen && postProcessing.dotScreen.enabled) {
        effect = new THREE.ShaderPass(THREE.DotScreenShader);
        effect.uniforms['scale'].value = postProcessing.dotScreen.scale;
        composer.addPass(effect);
        effects.push(effect);
    }

    if (postProcessing.rgbShift && postProcessing.rgbShift.enabled) {
        effect = new THREE.ShaderPass(THREE.RGBShiftShader);
        effect.uniforms['amount'].value = postProcessing.rgbShift.amount;
        composer.addPass(effect);
        effects.push(effect);
    }

    for (var i = 0; i < effects.length; i++) {
        if (i === effects.length - 1) {
            effects[i].renderToScreen = true;
        } else {
            effects[i].renderToScreen = false;
        }
    }

    this.composer = composer;
};

PlayerRenderer.prototype.setEffects = function () {

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