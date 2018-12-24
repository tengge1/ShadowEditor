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

    if (postProcessing.fxaa && postProcessing.fxaa.enabled) {
        effect = new THREE.ShaderPass(THREE.FXAAShader);
        effect.uniforms['resolution'].value.set(1 / renderer.domElement.width, 1 / renderer.domElement.height);
        composer.addPass(effect);
        effects.push(effect);
    }

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

    if (postProcessing.afterimage && postProcessing.afterimage.enabled) {
        effect = new THREE.AfterimagePass();
        effect.uniforms['damp'].value = postProcessing.afterimage.damp;
        composer.addPass(effect);
        effects.push(effect);
    }

    if (postProcessing.bokeh && postProcessing.bokeh.enabled) {
        effect = new THREE.BokehPass(scene, camera, {
            focus: postProcessing.bokeh.focus,
            aperture: postProcessing.bokeh.aperture / 100000,
            maxblur: postProcessing.bokeh.maxBlur,
            width: renderer.domElement.width,
            height: renderer.domElement.height
        });
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

    return new Promise(resolve => {
        resolve();
    });
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