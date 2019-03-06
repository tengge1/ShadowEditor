import BaseHelper from './BaseHelper';
import OutlineVertex from './shader/outline_vertex.glsl';
import OutlineFragment from './shader/outline_fragment.glsl';

/**
 * 选择帮助器
 * @param {*} app 
 */
function SelectHelper(app) {
    BaseHelper.call(this, app);
}

SelectHelper.prototype = Object.create(BaseHelper.prototype);
SelectHelper.prototype.constructor = SelectHelper;

SelectHelper.prototype.start = function () {
    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    this.app.on(`afterRender.${this.id}`, this.onAfterRender.bind(this));
};

SelectHelper.prototype.stop = function () {
    this.app.on(`objectSelected.${this.id}`, null);
    this.app.on(`afterRender.${this.id}`, null);
};

SelectHelper.prototype.onObjectSelected = function (obj) {
    if (!obj) {
        this.unselect();
        return;
    }

    if (this.scene === undefined) {
        this.scene = new THREE.Scene();
    }

    // 用于绘制模板的材质，尽量简单，不能使用原材质的原因如下：
    // 由于两个场景光源不一样，使用原材质会不断更新材质，造成严重性能损耗。
    if (this.basicMaterial === undefined) {
        this.basicMaterial = new THREE.MeshBasicMaterial({
            depthTest: false
        });
    }

    // 用于绘制边框的材质
    if (this.outlineMaterial === undefined) {
        this.outlineMaterial = new THREE.ShaderMaterial({
            vertexShader: OutlineVertex,
            fragmentShader: OutlineFragment,
            uniforms: {
                thickness: { // 边界宽度
                    type: 'f',
                    value: 0.05
                },
                color: { // 边界颜色
                    type: 'v3',
                    value: new THREE.Vector3(1.0, 1.0, 1.0),
                },
            },
            depthTest: false
        });
    }

    this.object = obj;
};

SelectHelper.prototype.unselect = function () {
    if (this.object) {
        delete this.object;
    }
};

SelectHelper.prototype.onAfterRender = function () {
    if (!this.object) {
        return;
    }

    var scene = this.scene;
    var camera = this.app.editor.camera;
    var renderer = this.app.editor.renderer;
    var state = renderer.state;
    var context = renderer.context;

    // 将物体添加到当前场景
    var parent = this.object.parent;
    this.scene.add(this.object);

    // 绘制模板
    state.disable(context.DEPTH_TEST);

    state.buffers.color.setMask(false);
    state.buffers.depth.setMask(false);
    state.buffers.stencil.setMask(true);

    state.buffers.color.setLocked(true);
    state.buffers.depth.setLocked(true);
    state.buffers.stencil.setLocked(true);

    state.buffers.stencil.setTest(true);
    state.buffers.stencil.setClear(0x00);
    renderer.clearStencil();
    state.buffers.stencil.setFunc(context.ALWAYS, 1, 0xff);

    this.scene.overrideMaterial = this.basicMaterial;
    renderer.render(scene, camera);

    // 绘制描边
    state.buffers.color.setLocked(false);
    state.buffers.stencil.setLocked(false);

    state.buffers.color.setMask(true);
    state.buffers.stencil.setMask(false);

    state.buffers.stencil.setOp(context.KEEP, context.KEEP, context.REPLACE);
    state.buffers.stencil.setFunc(context.NOTEQUAL, 1, 0xff);

    this.scene.overrideMaterial = this.outlineMaterial;
    renderer.render(scene, camera);

    // 还原原始状态
    state.buffers.depth.setLocked(false);
    state.buffers.depth.setMask(true);

    state.enable(context.DEPTH_TEST);
    state.buffers.stencil.setTest(false);

    // 将物体放回原场景
    if (parent) {
        parent.add(this.object);
    }
};

export default SelectHelper;