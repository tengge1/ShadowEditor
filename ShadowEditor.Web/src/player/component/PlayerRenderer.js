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

    if (postProcessing.smaa && postProcessing.smaa.enabled) {
        effect = new THREE.SMAAPass(renderer.domElement.width * renderer.getPixelRatio(), renderer.domElement.height * renderer.getPixelRatio());
        composer.addPass(effect);
        effects.push(effect);
    }

    if (postProcessing.ssaa && postProcessing.ssaa.enabled) {
        effect = new THREE.SSAARenderPass(scene, camera);
        effect.unbiased = postProcessing.ssaa.unbiased;
        effect.sampleLevel = postProcessing.ssaa.sampleLevel;
        composer.addPass(effect);
        effects.push(effect);
    }

    if (postProcessing.sao && postProcessing.sao.enabled) {
        effect = new THREE.SAOPass(scene, camera, false, true);
        effect.params.output = postProcessing.sao.output;
        effect.params.saoBias = postProcessing.sao.saoBias;
        effect.params.saoIntensity = postProcessing.sao.saoIntensity;
        effect.params.saoScale = postProcessing.sao.saoScale;
        effect.params.saoKernelRadius = postProcessing.sao.saoKernelRadius;
        effect.params.saoMinResolution = postProcessing.sao.saoMinResolution;
        effect.params.saoBlur = postProcessing.sao.saoBlur;
        effect.params.saoBlurRadius = postProcessing.sao.saoBlurRadius;
        effect.params.saoBlurStdDev = postProcessing.sao.saoBlurStdDev;
        effect.params.saoBlurDepthCutoff = postProcessing.sao.saoBlurDepthCutoff;
        composer.addPass(effect);
        effects.push(effect);
    }

    if (postProcessing.ssao && postProcessing.ssao.enabled) {
        effect = new THREE.SSAOPass(scene, camera, renderer.domElement.width, renderer.domElement.height);
        effect.output = postProcessing.ssao.output;
        effect.kernelRadius = postProcessing.ssao.kernelRadius;
        effect.minDistance = postProcessing.ssao.minDistance;
        effect.maxDistance = postProcessing.ssao.maxDistance;
        composer.addPass(effect);
        effects.push(effect);
    }

    if (postProcessing.pixel && postProcessing.pixel.enabled) {
        effect = new THREE.ShaderPass(THREE.PixelShader);
        effect.uniforms.resolution.value = new THREE.Vector2(renderer.domElement.width, renderer.domElement.height);
        effect.uniforms.resolution.value.multiplyScalar(window.devicePixelRatio);
        effect.uniforms.pixelSize.value = postProcessing.pixel.pixelSize;
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

    if (postProcessing.halftone && postProcessing.halftone.enabled) {
        effect = new THREE.HalftonePass(
            renderer.domElement.width,
            renderer.domElement.height, {
                shape: postProcessing.halftone.shape,
                radius: postProcessing.halftone.radius,
                rotateR: postProcessing.halftone.rotateR * (Math.PI / 180),
                rotateB: postProcessing.halftone.rotateB * (Math.PI / 180),
                rotateG: postProcessing.halftone.rotateG * (Math.PI / 180),
                scatter: postProcessing.halftone.scatter,
                blending: postProcessing.halftone.blending,
                blendingMode: postProcessing.halftone.blendingMode,
                greyscale: postProcessing.halftone.greyscale,
            });
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

    if (postProcessing.glitch && postProcessing.glitch.enabled) {
        effect = new THREE.GlitchPass();
        effect.goWild = postProcessing.glitch.wild;
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