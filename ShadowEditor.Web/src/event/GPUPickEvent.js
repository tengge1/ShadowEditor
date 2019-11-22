import BaseEvent from './BaseEvent';
import PickVertexShader from './shader/pick_vertex.glsl';
import PickFragmentShader from './shader/pick_fragment.glsl';
import DepthVertexShader from './shader/depth_vertex.glsl';
import DepthFragmentShader from './shader/depth_fragment.glsl';
import MeshUtils from '../utils/MeshUtils';

let maxHexColor = 1;

/**
 * 使用GPU选取物体和计算鼠标世界坐标
 * @author tengge / https://github.com/tengge1
 */
function GPUPickEvent() {
    BaseEvent.call(this);

    this.isIn = false;
    this.offsetX = 0;
    this.offsetY = 0;
    this.selected = null;

    this.onMouseMove = this.onMouseMove.bind(this);
    this.onAfterRender = this.onAfterRender.bind(this);
}

GPUPickEvent.prototype = Object.create(BaseEvent.prototype);
GPUPickEvent.prototype.constructor = GPUPickEvent;

GPUPickEvent.prototype.start = function () {
    app.on(`mousemove.${this.id}`, this.onMouseMove);
    app.on(`afterRender.${this.id}`, this.onAfterRender);
};

GPUPickEvent.prototype.stop = function () {
    app.on(`mousemove.${this.id}`, null);
    app.on(`afterRender.${this.id}`, null);
};

GPUPickEvent.prototype.onMouseMove = function (event) {
    if (event.target !== app.editor.renderer.domElement) {
        this.isIn = false;
        if (this.selected) {
            this.selected = null;
            app.call(`gpuPick`, this, null);
        }
        return;
    }
    this.isIn = true;
    this.offsetX = event.offsetX;
    this.offsetY = event.offsetY;
};

/**
 * 由于需要较高性能，所以尽量不要拆分函数。
 */
GPUPickEvent.prototype.onAfterRender = function () {
    if (!this.isIn) {
        return;
    }
    let { scene, camera, renderer } = app.editor;
    const { width, height } = renderer.domElement;

    if (this.init === undefined) {
        this.init = true;
        this.depthMaterial = new THREE.ShaderMaterial({
            vertexShader: DepthVertexShader,
            fragmentShader: DepthFragmentShader
        });
        this.renderTarget = new THREE.WebGLRenderTarget(width, height);
        this.pixel = new Uint8Array(4);
        this.world = new THREE.Vector3();
    }

    // 记录旧属性
    const oldBackground = scene.background;
    const oldOverrideMaterial = scene.overrideMaterial;
    const oldRenderTarget = renderer.getRenderTarget();

    // ---------------------------- 1. 使用GPU判断选中的物体 -----------------------------------

    scene.background = null; // 有背景图，可能导致提取的颜色不准
    scene.overrideMaterial = null;
    renderer.setRenderTarget(this.renderTarget);

    // 更换选取材质
    scene.traverseVisible(n => {
        if (!(n instanceof THREE.Mesh)) {
            return;
        }
        n.oldMaterial = n.material;
        if (n.pickMaterial) {
            n.material = n.pickMaterial;
            return;
        }
        let material = new THREE.ShaderMaterial({
            vertexShader: PickVertexShader,
            fragmentShader: PickFragmentShader,
            uniforms: {
                pickColor: {
                    value: new THREE.Color(maxHexColor)
                }
            }
        });
        n.pickColor = maxHexColor;
        maxHexColor++;
        n.material = n.pickMaterial = material;
    });

    // 绘制并读取像素
    renderer.clear(); // 一定要清缓冲区，renderer没开启自动清空缓冲区
    renderer.render(scene, camera);
    renderer.readRenderTargetPixels(this.renderTarget, this.offsetX, height - this.offsetY, 1, 1, this.pixel);

    // 还原原来材质，并获取选中物体
    const currentColor = this.pixel[0] * 0xffff + this.pixel[1] * 0xff + this.pixel[2];

    let selected = null;

    scene.traverseVisible(n => {
        if (!(n instanceof THREE.Mesh)) {
            return;
        }
        if (n.pickMaterial && n.pickColor === currentColor) {
            selected = n;
        }
        if (n.oldMaterial) {
            n.material = n.oldMaterial;
            delete n.oldMaterial;
        }
    });

    // TODO: 物体移除时，this.selected要清空
    if (selected !== this.selected) {
        this.selected = selected;
        if (!selected) {
            app.call(`gpuPick`, this, null);
        } else if (app.options.selectMode === 'whole') { // 选择整体
            app.call(`gpuPick`, this, MeshUtils.partToMesh(selected));
        } else { // 选择部分
            app.call(`gpuPick`, this, selected);
        }
    }

    // ------------------------- 2. 使用GPU反算世界坐标 ----------------------------------

    scene.overrideMaterial = this.material;

    renderer.clear();
    renderer.render(scene, camera);
    renderer.readRenderTargetPixels(this.renderTarget, this.offsetX, height - this.offsetY, 1, 1, this.pixel);

    let depth = (this.pixel[0] * 65535 + this.pixel[1] * 255 + this.pixel[2]) / 0xffffff;

    if (this.pixel[3] === 0) {
        depth = -depth;
    }

    this.world.set(
        this.offsetX / width * 2 - 1,
        - this.offsetY / height * 2 + 1,
        depth
    );
    this.world.unproject(camera);

    // console.log(`${this.pixel[0]}, ${this.pixel[1]}, ${this.pixel[2]}, ${depth}, ${this.world.x}, ${this.world.y}, ${this.world.z}`);

    // 还原原来的属性
    scene.background = oldBackground;
    scene.overrideMaterial = oldOverrideMaterial;
    renderer.setRenderTarget(oldRenderTarget);
};

export default GPUPickEvent;