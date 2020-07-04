/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import BaseRenderer from './BaseRenderer';
import PackageManager from '../package/PackageManager';

/**
 * 特效渲染器
 */
function EffectRenderer() {
    BaseRenderer.call(this);

    this.packageManager = new PackageManager();
    this.require = this.packageManager.require.bind(this.packageManager);

    this.ready = false;

    this.effectNames = ['fxaa', 'smaa', 'ssaa', 'taa', 'sao', 'ssao', 'pixel', 'dotScreen', 'rgbShift', 'afterimage', 'halftone', 'bokeh', 'glitch'];
}

EffectRenderer.prototype = Object.create(BaseRenderer.prototype);
EffectRenderer.prototype.constructor = EffectRenderer;

/**
 * 特效渲染器初始化，特效配置修改后需要重新调用该函数
 * @param {*} scenes 场景数组，使用第一个场景的特效配置
 * @param {*} camera 相机
 * @param {*} renderer 渲染器
 */
EffectRenderer.prototype.create = async function (scenes, camera, renderer) {
    if (!Array.isArray(scenes)) {
        scenes = [scenes];
    }

    this.scenes = scenes;
    this.camera = camera;
    this.renderer = renderer;

    var postProcessing = scenes[0].userData.postProcessing || {};
    this.ready = false;

    // 快速近似抗锯齿
    if (postProcessing.fxaa && postProcessing.fxaa.enabled) {
        await this.require(['CopyShader', 'FXAAShader', 'EffectComposer', 'RenderPass', 'ShaderPass']);
    }

    // 多重采样抗锯齿
    if (postProcessing.smaa && postProcessing.smaa.enabled) {
        await this.require(['CopyShader', 'SMAAShader', 'EffectComposer', 'RenderPass', 'ShaderPass', 'SMAAPass']);
    }

    // 全屏抗锯齿
    if (postProcessing.ssaa && postProcessing.ssaa.enabled) {
        await this.require(['CopyShader', 'EffectComposer', 'RenderPass', 'ShaderPass', 'SSAARenderPass']);
    }

    // 时间抗锯齿
    if (postProcessing.taa && postProcessing.taa.enabled) {
        await this.require(['CopyShader', 'EffectComposer', 'RenderPass', 'ShaderPass', 'SSAARenderPass', 'TAARenderPass']);
    }

    // 可扩展环境光遮挡
    if (postProcessing.sao && postProcessing.sao.enabled) {
        await this.require(['CopyShader', 'SAOShader', 'DepthLimitedBlurShader', 'UnpackDepthRGBAShader', 'EffectComposer', 'RenderPass', 'ShaderPass', 'SAOPass']);
    }

    // 屏幕空间环境光遮蔽
    if (postProcessing.ssao && postProcessing.ssao.enabled) {
        await this.require(['CopyShader', 'SSAOShader', 'EffectComposer', 'RenderPass', 'ShaderPass', 'SSAOPass']);
    }

    // 像素特效
    if (postProcessing.pixel && postProcessing.pixel.enabled) {
        await this.require(['CopyShader', 'PixelShader', 'EffectComposer', 'RenderPass', 'ShaderPass']);
    }

    // 点阵化
    if (postProcessing.dotScreen && postProcessing.dotScreen.enabled) {
        await this.require(['CopyShader', 'DotScreenShader', 'EffectComposer', 'RenderPass', 'ShaderPass']);
    }

    // 颜色偏移
    if (postProcessing.rgbShift && postProcessing.rgbShift.enabled) {
        await this.require(['CopyShader', 'RGBShiftShader', 'EffectComposer', 'RenderPass', 'ShaderPass']);
    }

    // 残影特效
    if (postProcessing.afterimage && postProcessing.afterimage.enabled) {
        await this.require(['CopyShader', 'AfterimageShader', 'EffectComposer', 'RenderPass', 'ShaderPass', 'AfterimagePass']);
    }

    // 半色调特效
    if (postProcessing.halftone && postProcessing.halftone.enabled) {
        await this.require(['HalftoneShader', 'HalftonePass']);
    }

    // 背景虚化特效
    if (postProcessing.bokeh && postProcessing.bokeh.enabled) {
        await this.require(['CopyShader', 'BokehShader', 'EffectComposer', 'RenderPass', 'ShaderPass', 'BokehPass']);
    }

    // 毛刺特效
    if (postProcessing.glitch && postProcessing.glitch.enabled) {
        await this.require(['CopyShader', 'DigitalGlitch', 'EffectComposer', 'RenderPass', 'ShaderPass', 'GlitchPass']);
    }

    this._createPostProcessing(scenes, camera, renderer);

    this.ready = true;
};

EffectRenderer.prototype._createPostProcessing = function (scenes, camera, renderer) {
    let scene = scenes[0];
    let postProcessing = scene.userData.postProcessing || {};

    if (this.composer) {
        this.dispose();
    }

    // 判断是否需要启用特效渲染器
    var keys = Object.keys(postProcessing);
    var useEffect = false;
    var i;

    for (i = 0; i < keys.length; i++) {
        var key = keys[i];

        if (this.effectNames.indexOf(key) > -1 && postProcessing[key].enabled) { // 需要特效
            useEffect = true;
            break;
        }
    }

    if (!useEffect) {
        return;
    }

    var effects = [],
        effect;

    var composer = new THREE.EffectComposer(renderer);

    scenes.forEach((n, i) => {
        effect = new THREE.RenderPass(n, camera);
        effect.clear = i === 0;
        composer.addPass(effect);
        effects.push(effect);
    });

    // 快速近似抗锯齿
    if (postProcessing.fxaa && postProcessing.fxaa.enabled) {
        effect = new THREE.ShaderPass(THREE.FXAAShader);
        effect.uniforms['resolution'].value.set(1 / renderer.domElement.width, 1 / renderer.domElement.height);
        composer.addPass(effect);
        effects.push(effect);
    }

    // 多重采样抗锯齿
    if (postProcessing.smaa && postProcessing.smaa.enabled) {
        effect = new THREE.SMAAPass(renderer.domElement.width * renderer.getPixelRatio(), renderer.domElement.height * renderer.getPixelRatio());
        composer.addPass(effect);
        effects.push(effect);
    }

    // 全屏抗锯齿
    if (postProcessing.ssaa && postProcessing.ssaa.enabled) {
        effect = new THREE.SSAARenderPass(scene, camera);
        effect.unbiased = postProcessing.ssaa.unbiased;
        effect.sampleLevel = postProcessing.ssaa.sampleLevel;
        composer.addPass(effect);
        effects.push(effect);
    }

    // 时间抗锯齿
    if (postProcessing.taa && postProcessing.taa.enabled) {
        effect = new THREE.TAARenderPass(scene, camera);
        effect.unbiased = postProcessing.taa.unbiased;
        effect.sampleLevel = postProcessing.taa.sampleLevel;
        composer.addPass(effect);
        effects.push(effect);
    }

    // 可扩展环境光遮挡
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

    // 屏幕空间环境光遮蔽
    if (postProcessing.ssao && postProcessing.ssao.enabled) {
        effect = new THREE.SSAOPass(scene, camera, renderer.domElement.width, renderer.domElement.height);
        effect.output = postProcessing.ssao.output;
        effect.kernelRadius = postProcessing.ssao.kernelRadius;
        effect.minDistance = postProcessing.ssao.minDistance;
        effect.maxDistance = postProcessing.ssao.maxDistance;
        composer.addPass(effect);
        effects.push(effect);
    }

    // 像素特效
    if (postProcessing.pixel && postProcessing.pixel.enabled) {
        effect = new THREE.ShaderPass(THREE.PixelShader);
        effect.uniforms.resolution.value = new THREE.Vector2(renderer.domElement.width, renderer.domElement.height);
        effect.uniforms.resolution.value.multiplyScalar(window.devicePixelRatio);
        effect.uniforms.pixelSize.value = postProcessing.pixel.pixelSize;
        composer.addPass(effect);
        effects.push(effect);
    }

    // 点阵化
    if (postProcessing.dotScreen && postProcessing.dotScreen.enabled) {
        effect = new THREE.ShaderPass(THREE.DotScreenShader);
        effect.uniforms['scale'].value = postProcessing.dotScreen.scale;
        composer.addPass(effect);
        effects.push(effect);
    }

    // 颜色偏移
    if (postProcessing.rgbShift && postProcessing.rgbShift.enabled) {
        effect = new THREE.ShaderPass(THREE.RGBShiftShader);
        effect.uniforms['amount'].value = postProcessing.rgbShift.amount;
        composer.addPass(effect);
        effects.push(effect);
    }

    // 残影特效
    if (postProcessing.afterimage && postProcessing.afterimage.enabled) {
        effect = new THREE.AfterimagePass();
        effect.uniforms['damp'].value = postProcessing.afterimage.damp;
        composer.addPass(effect);
        effects.push(effect);
    }

    // 半色调特效
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
            greyscale: postProcessing.halftone.greyscale
        });
        composer.addPass(effect);
        effects.push(effect);
    }

    // 背景虚化特效
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

    // 毛刺特效
    if (postProcessing.glitch && postProcessing.glitch.enabled) {
        effect = new THREE.GlitchPass();
        effect.goWild = postProcessing.glitch.wild;
        composer.addPass(effect);
        effects.push(effect);
    }

    for (i = 0; i < effects.length; i++) {
        if (i === effects.length - 1) {
            effects[i].renderToScreen = true;
        } else {
            effects[i].renderToScreen = false;
        }
    }

    this.composer = composer;
};

/**
 * 渲染特效
 */
EffectRenderer.prototype.render = function () {
    if (this.composer && this.ready) { // 使用特效渲染器
        this.composer.render();
    } else { // 未设置特效
        this.scenes.forEach(n => {
            this.renderer.render(n, this.camera);
        });
    }
};

EffectRenderer.prototype.dispose = function () {
    if (this.composer) {
        this.composer.reset();
        this.composer.passes.length = 0;
        this.composer = null;
    }
};

export default EffectRenderer;