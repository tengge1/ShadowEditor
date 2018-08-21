import BaseEvent from '../BaseEvent';

/**
 * 渲染事件
 * @param {*} app 
 */
function RenderEvent(app) {
    BaseEvent.call(this, app);
}

RenderEvent.prototype = Object.create(BaseEvent.prototype);
RenderEvent.prototype.constructor = RenderEvent;

RenderEvent.prototype.start = function () {
    this.app.on(`render.${this.id}`, this.onRender.bind(this));
    this.app.on(`materialChanged.${this.id}`, this.onRender.bind(this));
    this.app.on(`sceneGraphChanged.${this.id}`, this.onRender.bind(this));
    this.app.on(`cameraChanged.${this.id}`, this.onRender.bind(this));
};

RenderEvent.prototype.stop = function () {
    this.app.on(`render.${this.id}`, null);
    this.app.on(`materialChanged.${this.id}`, null);
    this.app.on(`sceneGraphChanged.${this.id}`, null);
    this.app.on(`cameraChanged.${this.id}`, null);
};

RenderEvent.prototype.onRender = function () {
    var editor = this.app.editor;
    var sceneHelpers = editor.sceneHelpers;
    var scene = editor.scene;
    var camera = editor.camera;
    var renderer = editor.renderer;

    sceneHelpers.updateMatrixWorld();
    scene.updateMatrixWorld();

    // 渲染场景
    renderer.render(scene, camera);

    // 渲染外轮廓（有个黑边，不好看）
    // var effect = new THREE.OutlineEffect(renderer);
    // effect.render(scene, camera);

    // 渲染帮助器
    renderer.render(sceneHelpers, camera);

    // 为选中的Mesh渲染边框
    // if (editor.selected && editor.selected instanceof THREE.Mesh) {
    //     var state = renderer.state;

    //     // 设置模板缓冲区掩码和填充值
    //     state.buffers.stencil.setClear(0x00); // 设置清除模板缓冲填充值

    //     // ============================================ 正常绘制 ===========================================

    //     renderer.render(scene, camera);

    //     // ============================================ 绘制轮廓 ===========================================

    //     // 记录原来缩放，并放大一点
    //     if (box1.oldScale == null) {
    //         box1.oldScale = box1.scale.clone();
    //     }
    //     if (box2.oldScale == null) {
    //         box2.oldScale = box2.scale.clone();
    //     }
    //     box1.scale.set(1.1, 1.1, 1.1);
    //     box2.scale.set(1.1, 1.1, 1.1);

    //     // 记录原来颜色，并设置轮廓颜色
    //     if (box1.material.oldColor == null) {
    //         box1.material.oldColor = box1.material.color.clone();
    //     }
    //     if (box2.material.oldColor == null) {
    //         box2.material.oldColor = box2.material.color.clone();
    //     }
    //     box1.material.color.setRGB(1.0, 1.0, 0.0);
    //     box2.material.color.setRGB(1.0, 1.0, 0.0);
    //     box1.material.needsUpdate = true;
    //     box2.material.needsUpdate = true;

    //     // 模板测试
    //     state.buffers.depth.setMask(false);
    //     state.buffers.stencil.setMask(0x00);

    //     state.buffers.stencil.setTest(true); // 开启模板测试
    //     state.buffers.stencil.setOp(context.KEEP, context.REPLACE, context.REPLACE); // 模板测试通过时替换，不通过时保留
    //     state.buffers.stencil.setFunc(context.NOTEQUAL, 1, 0xff);

    //     renderer.render(scene, camera);

    //     // 恢复原来的缩放和颜色
    //     box1.scale.copy(box1.oldScale);
    //     box2.scale.copy(box2.oldScale);
    //     box1.material.color.copy(box1.material.oldColor);
    //     box2.material.color.copy(box2.material.oldColor);
    //     box1.material.needsUpdate = true;
    //     box2.material.needsUpdate = true;
    // }
};

export default RenderEvent;