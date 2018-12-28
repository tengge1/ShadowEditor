import BaseEffect from './BaseEffect';

/**
 * 轮廓特效
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function OutlineEffect(app) {
    BaseEffect.call(this, app);

    this.init();
    this.app.on(`sceneLoaded.${this.id}`, this.onSceneLoaded.bind(this));
    this.app.on(`postProcessingChanged.${this.id}`, this.onPostProcessingChanged.bind(this));
};

OutlineEffect.prototype = Object.create(BaseEffect.prototype);
OutlineEffect.prototype.constructor = OutlineEffect;

OutlineEffect.prototype.init = function () {
    var params = {
        edgeStrength: 10,
        edgeGlow: 0.4,
        edgeThickness: 1.8,
        pulsePeriod: 2,
        usePatternTexture: true,
        visibleEdgeColor: '#ffffff',
        hiddenEdgeColor: '#190a05',
    };

    var scene = this.app.editor.scene;
    var sceneHelpers = this.app.editor.sceneHelpers;
    var camera = this.app.editor.camera;
    var renderer = this.app.editor.renderer;

    if (this.composer) {
        this.composer.reset();
    }

    var composer = new THREE.EffectComposer(renderer);
    composer.passes.length = 0;

    var effects = [];
    var postProcessing = this.app.editor.scene.userData.postProcessing || {};

    var effect = new THREE.RenderPass(scene, camera);
    effect.clear = true;
    composer.addPass(effect);
    effects.push(effect);

    effect = new THREE.RenderPass(sceneHelpers, camera);
    effect.clear = false;
    composer.addPass(effect);
    effects.push(effect);

    effect = new THREE.OutlinePass(new THREE.Vector2(renderer.domElement.width, renderer.domElement.height), scene, camera);
    effect.edgeStrength = 10;
    effect.edgeGlow = 0.4;
    effect.edgeThickness = 1.8;
    effect.pulsePeriod = 2;
    effect.visibleEdgeColor.set('#ffffff');
    effect.hiddenEdgeColor.set('#190a05');
    composer.addPass(effect);
    effects.push(effect);

    this.outlinePass = effect;

    // 后期处理
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
        effect = new THREE.SSAARenderPass(this.app.editor.scene, this.app.editor.camera);
        effect.unbiased = postProcessing.ssaa.unbiased;
        effect.sampleLevel = postProcessing.ssaa.sampleLevel;
        composer.addPass(effect);
        effects.push(effect);
    }

    if (postProcessing.sao && postProcessing.sao.enabled) {
        effect = new THREE.SAOPass(this.app.editor.scene, this.app.editor.camera, false, true);
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
};

OutlineEffect.prototype.render = function (obj) {
    if (this.app.editor.selected) {
        this.outlinePass.selectedObjects = [this.app.editor.selected];
    } else {
        this.outlinePass.selectedObjects = [];
    }

    this.composer.render();
};

OutlineEffect.prototype.onSceneLoaded = function () {
    this.init();
};

OutlineEffect.prototype.onPostProcessingChanged = function () {
    this.init();
};

export default OutlineEffect;