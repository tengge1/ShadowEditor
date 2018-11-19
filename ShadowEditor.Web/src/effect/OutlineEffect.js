import BaseEffect from './BaseEffect';

/**
 * 轮廓特效
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function OutlineEffect(app) {
    BaseEffect.call(this, app);

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
    var camera = this.app.editor.camera;
    var renderer = this.app.editor.renderer;

    var composer = new THREE.EffectComposer(renderer);

    var renderPass = new THREE.RenderPass(scene, camera);
    composer.addPass(renderPass);

    var outlinePass = new THREE.OutlinePass(new THREE.Vector2(renderer.domElement.width, renderer.domElement.height), scene, camera);
    outlinePass.edgeStrength = params.edgeStrength;
    outlinePass.edgeGlow = params.edgeGlow;
    outlinePass.edgeThickness = params.edgeThickness;
    outlinePass.pulsePeriod = params.pulsePeriod;
    outlinePass.usePatternTexture = true;
    outlinePass.visibleEdgeColor.set(params.visibleEdgeColor);
    outlinePass.hiddenEdgeColor.set(params.hiddenEdgeColor);
    composer.addPass(outlinePass);

    var loader = new THREE.TextureLoader();

    loader.load('assets/textures/tri_pattern.jpg', texture => {
        outlinePass.patternTexture = texture;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
    });

    var effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
    effectFXAA.uniforms['resolution'].value.set(1 / renderer.domElement.width, 1 / renderer.domElement.height);
    effectFXAA.renderToScreen = true;
    composer.addPass(effectFXAA);

    this.outlinePass = outlinePass;
    this.composer = composer;
};

OutlineEffect.prototype = Object.create(BaseEffect.prototype);
OutlineEffect.prototype.constructor = OutlineEffect;

OutlineEffect.prototype.render = function (obj) {
    if (this.app.editor.selected) {
        this.outlinePass.selectedObjects = [this.app.editor.selected];
    } else {
        this.outlinePass.selectedObjects = [];
    }

    this.composer.render();
};

export default OutlineEffect;