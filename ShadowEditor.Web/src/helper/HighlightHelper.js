import BaseHelper from './BaseHelper';
import MaskVertex from './shader/mask_vertex.glsl';
import MaskFragment from './shader/mask_fragment.glsl';
import EdgeVertex from './shader/edge_vertex.glsl';
import EdgeFragment from './shader/edge_fragment.glsl';

/**
 * 高亮帮助器（同时为选中和鼠标放上去的物体设置边框）
 * @author tengge / https://github.com/tengge1
 * @param {*} app 应用程序
 */
function HighlightHelper(app) {
    BaseHelper.call(this, app);

    this.hoveredObject = null;
    this.selectedObject = null;
    this.hideObjects = [];

    this.onGpuPick = this.onGpuPick.bind(this);
    this.onObjectSelected = this.onObjectSelected.bind(this);
    this.onObjectRemoved = this.onObjectRemoved.bind(this);
    this.onAfterRender = this.onAfterRender.bind(this);
    this.onOptionChange = this.onOptionChange.bind(this);
}

HighlightHelper.prototype = Object.create(BaseHelper.prototype);
HighlightHelper.prototype.constructor = HighlightHelper;

HighlightHelper.prototype.start = function () {
    app.on(`gpuPick.${this.id}`, this.onGpuPick);
    app.on(`objectSelected.${this.id}`, this.onObjectSelected);
    app.on(`objectRemoved.${this.id}`, this.onObjectRemoved);
    app.on(`afterRender.${this.id}`, this.onAfterRender);
    app.on(`optionChange.${this.id}`, this.onOptionChange);
};

HighlightHelper.prototype.stop = function () {
    app.on(`gpuPick.${this.id}`, null);
    app.on(`objectSelected.${this.id}`, null);
    app.on(`objectRemoved.${this.id}`, null);
    app.on(`afterRender.${this.id}`, null);
    app.on(`optionChange.${this.id}`, null);
};

HighlightHelper.prototype.onGpuPick = function (object) {
    this.hoveredObject = object;
};

HighlightHelper.prototype.onObjectSelected = function (object) {
    if (!object) {
        this.selectedObject = null;
        return;
    }

    // 禁止选中场景和相机
    if (object === app.editor.scene || object === app.editor.camera) {
        return;
    }

    this.selectedObject = object;
};

HighlightHelper.prototype.onObjectRemoved = function (object) {
    if (object === this.hoveredObject) {
        this.hoveredObject = null;
    }
    if (object === this.selectedObject) {
        this.selectedObject = null;
    }
};

HighlightHelper.prototype.onAfterRender = function () {
    if (!this.hoveredObject && !this.selectedObject) {
        // TODO: this.object.parent为null时表示该物体被移除
        return;
    }

    let renderer = app.editor.renderer;

    if (!this.init) {
        this.init = true;
        let size = new THREE.Vector2();

        renderer.getDrawingBufferSize(size);

        let width = size.x * 2;
        let height = size.y * 2;

        this.scene = new THREE.Scene();

        this.camera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 0, 1);
        this.camera.position.z = 1;
        this.camera.lookAt(new THREE.Vector3());

        this.quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(width, height), null);
        this.quad.frustumCulled = false;
        this.scene.add(this.quad);

        let params = {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
            antialias: true
        };

        this.maskBuffer = new THREE.WebGLRenderTarget(width, height, params);
        this.maskBuffer.texture.generateMipmaps = false;

        this.edgeBuffer = new THREE.WebGLRenderTarget(width, height, params);
        this.edgeBuffer.texture.generateMipmaps = false;

        this.maskMaterial = new THREE.ShaderMaterial({
            vertexShader: MaskVertex,
            fragmentShader: MaskFragment,
            depthTest: false
        });

        this.edgeMaterial = new THREE.ShaderMaterial({
            vertexShader: EdgeVertex,
            fragmentShader: EdgeFragment,
            uniforms: {
                maskTexture: {
                    value: this.maskBuffer.texture
                },
                texSize: {
                    value: new THREE.Vector2(width, height)
                },
                color: {
                    value: new THREE.Color(app.options.selectedColor)
                },
                thickness: {
                    type: 'f',
                    value: app.options.selectedThickness
                },
                transparent: true
            },
            depthTest: false
        });

        this.copyMaterial = new THREE.ShaderMaterial({
            vertexShader: THREE.FXAAShader.vertexShader,
            fragmentShader: THREE.FXAAShader.fragmentShader,
            uniforms: {
                tDiffuse: {
                    value: this.edgeBuffer.texture
                },
                resolution: {
                    value: new THREE.Vector2(1 / width, 1 / height)
                }
            },
            transparent: true,
            depthTest: false
        });
    }

    let renderScene = app.editor.scene;
    let renderCamera = app.editor.view === 'perspective' ? app.editor.camera : app.editor.orthCamera;

    let scene = this.scene;
    let camera = this.camera;

    // 记录原始状态
    const oldOverrideMaterial = renderScene.overrideMaterial;
    const oldBackground = renderScene.background;

    const oldAutoClear = renderer.autoClear;
    const oldClearColor = renderer.getClearColor();
    const oldClearAlpha = renderer.getClearAlpha();
    const oldRenderTarget = renderer.getRenderTarget();

    // 绘制蒙版
    this.hideObjects.length = 0;
    this.hideNoHighlightObjects(renderScene, renderScene);

    renderScene.overrideMaterial = this.maskMaterial;
    renderScene.background = null;

    renderer.autoClear = false;
    renderer.setRenderTarget(this.maskBuffer);
    renderer.setClearColor(0xffffff);
    renderer.setClearAlpha(1);
    renderer.clear();

    renderer.render(renderScene, renderCamera);

    this.showNoHighlightObjects(renderScene);
    this.hideObjects.length = 0;

    // 绘制边框
    this.quad.material = this.edgeMaterial;

    renderScene.overrideMaterial = null;

    renderer.setRenderTarget(this.edgeBuffer);
    renderer.clear();
    renderer.render(scene, camera);

    // 与原场景叠加
    this.quad.material = this.copyMaterial;

    renderer.setRenderTarget(null);
    renderer.render(scene, camera);

    // 还原原始状态
    renderScene.overrideMaterial = oldOverrideMaterial;
    renderScene.background = oldBackground;

    renderer.autoClear = oldAutoClear;
    renderer.setClearColor(oldClearColor);
    renderer.setClearAlpha(oldClearAlpha);
    renderer.setRenderTarget(oldRenderTarget);
};

HighlightHelper.prototype.hideNoHighlightObjects = function (obj, root) {
    if (obj === this.selectedObject || obj === this.hoveredObject) {
        let current = obj.parent;
        while (current && current !== root) {
            let index = this.hideObjects.indexOf(current);
            this.hideObjects.splice(index, 1);
            current.visible = current.userData.oldVisible;
            delete current.userData.oldVisible;
            current = current.parent;
        }
        return;
    }

    if (obj !== root) {
        obj.userData.oldVisible = obj.visible;
        obj.visible = false;
        this.hideObjects.push(obj);
    }

    for (let child of obj.children) {
        if (child instanceof THREE.Light) {
            continue;
        }
        this.hideNoHighlightObjects(child, root);
    }
};

HighlightHelper.prototype.showNoHighlightObjects = function () {
    this.hideObjects.forEach(n => {
        n.visible = n.userData.oldVisible;
        delete n.userData.oldVisible;
    });
};

HighlightHelper.prototype.onOptionChange = function (name, value) {
    if (!this.edgeMaterial) {
        return;
    }
    if (name === 'selectedColor') {
        this.edgeMaterial.uniforms.color.value.set(value);
    } else if (name === 'selectedThickness') {
        this.edgeMaterial.uniforms.thickness.value = value;
    }
};

export default HighlightHelper;