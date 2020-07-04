/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import BasePostProcessing from './BasePostProcessing';

// Use a smaller size for some of the god-ray render targets for better performance.
var godrayRenderTargetResolutionMultiplier = 1.0 / 4.0;
var bgColor = 0x000511;
var sunColor = 0xffee00;

var screenSpacePosition = new THREE.Vector3();

/**
 * 神光特效
 */
class GodRays extends BasePostProcessing {
    init(scene, camera, renderer) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;

        this.postprocessing = {};

        this.materialDepth = new THREE.MeshDepthMaterial();
        this.materialScene = new THREE.MeshBasicMaterial({ color: 0x000000 });
        this.sunPosition = new THREE.Vector3(0, 1000, - 1000);

        return new Promise(resolve => {
            app.require('GodRaysShader').then(() => {
                this.initPostprocessing();
                resolve();
            });
        });
    }

    initPostprocessing() {
        let renderTargetWidth = this.renderer.domElement.width;
        let renderTargetHeight = this.renderer.domElement.height;

        let postprocessing = this.postprocessing;

        postprocessing.scene = new THREE.Scene();

        postprocessing.camera = new THREE.OrthographicCamera(- 0.5, 0.5, 0.5, - 0.5, - 10000, 10000);
        postprocessing.camera.position.z = 100;

        postprocessing.scene.add(postprocessing.camera);

        var pars = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat };
        postprocessing.rtTextureColors = new THREE.WebGLRenderTarget(renderTargetWidth, renderTargetHeight, pars);

        // Switching the depth formats to luminance from rgb doesn't seem to work. I didn't
        // investigate further for now.
        // pars.format = LuminanceFormat;

        // I would have this quarter size and use it as one of the ping-pong render
        // targets but the aliasing causes some temporal flickering

        postprocessing.rtTextureDepth = new THREE.WebGLRenderTarget(renderTargetWidth, renderTargetHeight, pars);
        postprocessing.rtTextureDepthMask = new THREE.WebGLRenderTarget(renderTargetWidth, renderTargetHeight, pars);

        // The ping-pong render targets can use an adjusted resolution to minimize cost

        var adjustedWidth = renderTargetWidth * godrayRenderTargetResolutionMultiplier;
        var adjustedHeight = renderTargetHeight * godrayRenderTargetResolutionMultiplier;
        postprocessing.rtTextureGodRays1 = new THREE.WebGLRenderTarget(adjustedWidth, adjustedHeight, pars);
        postprocessing.rtTextureGodRays2 = new THREE.WebGLRenderTarget(adjustedWidth, adjustedHeight, pars);

        // god-ray shaders

        var godraysMaskShader = THREE.GodRaysDepthMaskShader;
        postprocessing.godrayMaskUniforms = THREE.UniformsUtils.clone(godraysMaskShader.uniforms);
        postprocessing.materialGodraysDepthMask = new THREE.ShaderMaterial({

            uniforms: postprocessing.godrayMaskUniforms,
            vertexShader: godraysMaskShader.vertexShader,
            fragmentShader: godraysMaskShader.fragmentShader

        });

        var godraysGenShader = THREE.GodRaysGenerateShader;
        postprocessing.godrayGenUniforms = THREE.UniformsUtils.clone(godraysGenShader.uniforms);
        postprocessing.materialGodraysGenerate = new THREE.ShaderMaterial({

            uniforms: postprocessing.godrayGenUniforms,
            vertexShader: godraysGenShader.vertexShader,
            fragmentShader: godraysGenShader.fragmentShader

        });

        var godraysCombineShader = THREE.GodRaysCombineShader;
        postprocessing.godrayCombineUniforms = THREE.UniformsUtils.clone(godraysCombineShader.uniforms);
        postprocessing.materialGodraysCombine = new THREE.ShaderMaterial({

            uniforms: postprocessing.godrayCombineUniforms,
            vertexShader: godraysCombineShader.vertexShader,
            fragmentShader: godraysCombineShader.fragmentShader

        });

        var godraysFakeSunShader = THREE.GodRaysFakeSunShader;
        postprocessing.godraysFakeSunUniforms = THREE.UniformsUtils.clone(godraysFakeSunShader.uniforms);
        postprocessing.materialGodraysFakeSun = new THREE.ShaderMaterial({

            uniforms: postprocessing.godraysFakeSunUniforms,
            vertexShader: godraysFakeSunShader.vertexShader,
            fragmentShader: godraysFakeSunShader.fragmentShader

        });

        postprocessing.godraysFakeSunUniforms.bgColor.value.setHex(bgColor);
        postprocessing.godraysFakeSunUniforms.sunColor.value.setHex(sunColor);

        postprocessing.godrayCombineUniforms.fGodRayIntensity.value = 0.75;

        postprocessing.quad = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(1.0, 1.0),
            postprocessing.materialGodraysGenerate
        );
        postprocessing.quad.position.z = - 9900;
        postprocessing.scene.add(postprocessing.quad);
    }

    getStepSize(filterLen, tapsPerPass, pass) {

        return filterLen * Math.pow(tapsPerPass, - pass);

    }

    filterGodRays(inputTex, renderTarget, stepSize) {
        let postprocessing = this.postprocessing;

        postprocessing.scene.overrideMaterial = postprocessing.materialGodraysGenerate;

        postprocessing.godrayGenUniforms["fStepSize"].value = stepSize;
        postprocessing.godrayGenUniforms["tInput"].value = inputTex;

        this.renderer.setRenderTarget(renderTarget);
        this.renderer.render(postprocessing.scene, postprocessing.camera);
        postprocessing.scene.overrideMaterial = null;

    }

    render() {
        let { scene, camera, renderer, postprocessing, sunPosition, materialDepth } = this;

        // Find the screenspace position of the sun

        screenSpacePosition.copy(sunPosition).project(camera);

        screenSpacePosition.x = (screenSpacePosition.x + 1) / 2;
        screenSpacePosition.y = (screenSpacePosition.y + 1) / 2;

        // Give it to the god-ray and sun shaders

        postprocessing.godrayGenUniforms["vSunPositionScreenSpace"].value.x = screenSpacePosition.x;
        postprocessing.godrayGenUniforms["vSunPositionScreenSpace"].value.y = screenSpacePosition.y;

        postprocessing.godraysFakeSunUniforms["vSunPositionScreenSpace"].value.x = screenSpacePosition.x;
        postprocessing.godraysFakeSunUniforms["vSunPositionScreenSpace"].value.y = screenSpacePosition.y;

        // -- Draw scene objects --

        // Colors

        scene.overrideMaterial = null;
        renderer.setRenderTarget(postprocessing.rtTextureColors);
        renderer.render(scene, camera);
        renderer.render(app.editor.sceneHelpers, camera);

        // Depth

        scene.overrideMaterial = materialDepth;
        renderer.setRenderTarget(postprocessing.rtTextureDepth);
        renderer.clear();
        renderer.render(scene, camera);

        //

        postprocessing.godrayMaskUniforms["tInput"].value = postprocessing.rtTextureDepth.texture;

        postprocessing.scene.overrideMaterial = postprocessing.materialGodraysDepthMask;
        renderer.setRenderTarget(postprocessing.rtTextureDepthMask);
        renderer.render(postprocessing.scene, postprocessing.camera);

        // -- Render god-rays --

        // Maximum length of god-rays (in texture space [0,1]X[0,1])

        var filterLen = 1.0;

        // Samples taken by filter

        var TAPS_PER_PASS = 6.0;

        // Pass order could equivalently be 3,2,1 (instead of 1,2,3), which
        // would start with a small filter support and grow to large. however
        // the large-to-small order produces less objectionable aliasing artifacts that
        // appear as a glimmer along the length of the beams

        // pass 1 - render into first ping-pong target
        this.filterGodRays(postprocessing.rtTextureDepthMask.texture, postprocessing.rtTextureGodRays2, this.getStepSize(filterLen, TAPS_PER_PASS, 1.0));

        // pass 2 - render into second ping-pong target
        this.filterGodRays(postprocessing.rtTextureGodRays2.texture, postprocessing.rtTextureGodRays1, this.getStepSize(filterLen, TAPS_PER_PASS, 2.0));

        // pass 3 - 1st RT
        this.filterGodRays(postprocessing.rtTextureGodRays1.texture, postprocessing.rtTextureGodRays2, this.getStepSize(filterLen, TAPS_PER_PASS, 3.0));

        // final pass - composite god-rays onto colors

        postprocessing.godrayCombineUniforms["tColors"].value = postprocessing.rtTextureColors.texture;
        postprocessing.godrayCombineUniforms["tGodRays"].value = postprocessing.rtTextureGodRays2.texture;

        postprocessing.scene.overrideMaterial = postprocessing.materialGodraysCombine;

        renderer.setRenderTarget(null);
        renderer.render(postprocessing.scene, postprocessing.camera);
        postprocessing.scene.overrideMaterial = null;
    }

    dispose() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
    }
}

export default GodRays;