/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
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
    this.waitTime = 10; // 10毫秒检测一次，提升性能
    this.oldTime = 0;

    this.selectMode = 'whole';

    this.onMouseMove = this.onMouseMove.bind(this);
    this.onAfterRender = this.onAfterRender.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onStorageChanged = this.onStorageChanged.bind(this);
}

GPUPickEvent.prototype = Object.create(BaseEvent.prototype);
GPUPickEvent.prototype.constructor = GPUPickEvent;

GPUPickEvent.prototype.start = function () {
    app.on(`mousemove.${this.id}`, this.onMouseMove);
    app.on(`afterRender.${this.id}`, this.onAfterRender);
    app.on(`resize.${this.id}`, this.onResize);
    app.on(`storageChanged.${this.id}`, this.onStorageChanged);

    this.selectMode = app.storage.selectMode;
};

GPUPickEvent.prototype.stop = function () {
    app.on(`mousemove.${this.id}`, null);
    app.on(`afterRender.${this.id}`, null);
    app.on(`resize.${this.id}`, null);
    app.on(`storageChanged.${this.id}`, null);

    this.selectMode = 'whole';
};

GPUPickEvent.prototype.onMouseMove = function (event) {
    if (event.target !== app.editor.renderer.domElement) { // 鼠标不在画布上
        this.isIn = false;
        app.call(`gpuPick`, this, {
            object: null,
            point: null,
            distance: 0
        });
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
    if (!this.isIn || app.editor.gpuPickNum === 0) {
        return;
    }

    // 间隔一段时间执行一次，提高性能
    let now = new Date().getTime();
    if (now - this.oldTime < this.waitTime) {
        return;
    }
    this.oldTime = now;

    let { scene, renderer } = app.editor;
    const camera = app.editor.view === 'perspective' ? app.editor.camera : app.editor.orthCamera;

    const { width, height } = renderer.domElement;

    if (this.init === undefined) {
        this.init = true;
        this.depthMaterial = new THREE.ShaderMaterial({
            vertexShader: DepthVertexShader,
            fragmentShader: DepthFragmentShader,
            uniforms: {
                far: {
                    value: camera.far
                }
            }
        });

        this.renderTarget = new THREE.WebGLRenderTarget(width, height);
        this.pixel = new Uint8Array(4);

        this.nearPosition = new THREE.Vector3(); // 鼠标屏幕位置在near处的相机坐标系中的坐标
        this.farPosition = new THREE.Vector3(); // 鼠标屏幕位置在far处的相机坐标系中的坐标
        this.world = new THREE.Vector3(); // 通过插值计算世界坐标

        this.line = new THREE.Line3(this.nearPosition, this.farPosition);
        this.plane = new THREE.Plane().setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 1, 0), new THREE.Vector3());
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

    // ------------------------- 2. 使用GPU反算世界坐标 ----------------------------------

    scene.overrideMaterial = this.depthMaterial; // 注意：this.material为undifined，写在这也不会报错，不要写错了。

    renderer.clear();
    renderer.render(scene, camera);
    renderer.readRenderTargetPixels(this.renderTarget, this.offsetX, height - this.offsetY, 1, 1, this.pixel);

    let cameraDepth = 0;

    const deviceX = this.offsetX / width * 2 - 1;
    const deviceY = - this.offsetY / height * 2 + 1;

    // TODO: nearPosition和farPosition命名反了
    this.nearPosition.set(deviceX, deviceY, 1); // 屏幕坐标系：(0, 0, 1)
    this.nearPosition.applyMatrix4(camera.projectionMatrixInverse); // 相机坐标系：(0, 0, -far)

    this.farPosition.set(deviceX, deviceY, -1); // 屏幕坐标系：(0, 0, -1)
    this.farPosition.applyMatrix4(camera.projectionMatrixInverse); // 相机坐标系：(0, 0, -near)

    if (this.pixel[2] !== 0 || this.pixel[1] !== 0 || this.pixel[0] !== 0) { // 鼠标位置存在物体
        let hex = (this.pixel[0] * 65535 + this.pixel[1] * 255 + this.pixel[2]) / 0xffffff;

        if (this.pixel[3] === 0) {
            hex = -hex;
        }

        cameraDepth = -hex * camera.far; // 相机坐标系中鼠标所在点的深度（注意：相机坐标系中的深度值为负值）

        const t = (cameraDepth - this.nearPosition.z) / (this.farPosition.z - this.nearPosition.z);

        this.world.set(
            this.nearPosition.x + (this.farPosition.x - this.nearPosition.x) * t,
            this.nearPosition.y + (this.farPosition.y - this.nearPosition.y) * t,
            cameraDepth
        );
        this.world.applyMatrix4(camera.matrixWorld);
    } else { // 鼠标位置不存在物体，则与y=0的平面的交点
        this.nearPosition.applyMatrix4(camera.matrixWorld); // 世界坐标系近点
        this.farPosition.applyMatrix4(camera.matrixWorld); // 世界坐标系远点
        this.line.set(this.nearPosition, this.farPosition);
        this.plane.intersectLine(this.line, this.world);
    }

    // 还原原来的属性
    scene.background = oldBackground;
    scene.overrideMaterial = oldOverrideMaterial;
    renderer.setRenderTarget(oldRenderTarget);

    // ------------------------------- 3. 输出碰撞结果 --------------------------------------------

    if (selected && this.selectMode === 'whole') { // 选择整体
        selected = MeshUtils.partToMesh(selected);
    }

    app.call(`gpuPick`, this, {
        object: selected, // 碰撞到的物体，没碰到为null
        point: this.world, // 碰撞点坐标，没碰到物体与y=0平面碰撞
        distance: cameraDepth // 相机到碰撞点距离
    });
};

GPUPickEvent.prototype.onResize = function () {
    if (!this.renderTarget) {
        return;
    }
    const { width, height } = app.editor.renderer.domElement;
    this.renderTarget.setSize(width, height);
};

GPUPickEvent.prototype.onStorageChanged = function (name, value) {
    if (name === 'selectMode') {
        this.selectMode = value;
    }
};

export default GPUPickEvent;