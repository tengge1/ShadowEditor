import BaseEvent from './BaseEvent';
import PickVertexShader from './shader/pick_vertex.glsl';
import PickFragmentShader from './shader/pick_fragment.glsl';
import MeshUtils from '../utils/MeshUtils';

let maxHexColor = 1;

/**
 * 使用GPU进行碰撞
 * @author tengge / https://github.com/tengge1
 */
function GPUPickEvent() {
    BaseEvent.call(this);

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
        return;
    }
    this.offsetX = event.offsetX;
    this.offsetY = event.offsetY;
};

GPUPickEvent.prototype.onAfterRender = function () {
    let { scene, camera, renderer } = app.editor;
    const { width, height } = renderer.domElement;

    if (this.init === undefined) {
        this.init = true;
        this.renderTarget = new THREE.WebGLRenderTarget(width, height);
        this.pixel = new Uint8Array(4);
    }

    // 记录旧属性
    const oldOverrideMaterial = scene.overrideMaterial;
    const oldRenderTarget = renderer.getRenderTarget();

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
        maxHexColor++;
        n.material = n.pickMaterial = material;
    });

    // 绘制并读取像素
    renderer.setRenderTarget(this.renderTarget);
    renderer.render(scene, camera);
    renderer.readRenderTargetPixels(this.renderTarget, this.offsetX, height - this.offsetY, 1, 1, this.pixel);

    // 还原原来材质，并获取选中物体
    let red = this.pixel[0] / 255,
        green = this.pixel[1] / 255,
        blue = this.pixel[2] / 255;

    let selected = null;

    scene.traverseVisible(n => {
        if (!(n instanceof THREE.Mesh)) {
            return;
        }
        if (n.pickMaterial) {
            let color = n.pickMaterial.uniforms.pickColor.value;
            if (Math.abs(red - color.r) < 0.001 &&
                Math.abs(green - color.g) < 0.001 &&
                Math.abs(blue - color.b) < 0.001) {
                selected = n;
            }
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

    // 还原原来的属性
    scene.overrideMaterial = oldOverrideMaterial;
    renderer.setRenderTarget(oldRenderTarget);
};

export default GPUPickEvent;