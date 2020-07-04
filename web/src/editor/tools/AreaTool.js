/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import BaseTool from './BaseTool';
import Earcut from '../../utils/Earcut';
import UnscaledText from '../../object/text/UnscaledText';

/**
 * 面积测量工具
 */
class AreaTool extends BaseTool {
    constructor() {
        super();

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onGpuPick = this.onGpuPick.bind(this);
        this.onDblClick = this.onDblClick.bind(this);
    }

    start() {
        if (!this.init) {
            this.init = true;
            this.positions = [];
            this.polygons = [];
            this.world = new THREE.Vector3();
        }
        app.editor.gpuPickNum++;
        this.positions.length = 0;
        app.on(`mousedown.${this.id}`, this.onMouseDown);
        app.on(`gpuPick.${this.id}`, this.onGpuPick);
        app.on(`dblclick.${this.id}`, this.onDblClick);
    }

    stop() {
        app.on(`mousedown.${this.id}`, null);
        app.on(`gpuPick.${this.id}`, null);
        app.on(`dblclick.${this.id}`, null);

        app.editor.gpuPickNum--;
        this.positions.length = 0;
        delete this.polygon;
    }

    clear() {
        while (this.polygons.length) {
            let polygon = this.polygons[0];
            app.editor.sceneHelpers.remove(polygon);
        }

        this.polygons.length = 0;
    }

    onMouseDown() {
        if (!this.polygon) {
            let geometry = new THREE.BufferGeometry();
            let material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
            this.polygon = new THREE.Mesh(geometry, material);
            this.polygon.texts = [];
            this.polygons.push(this.polygon);
            app.editor.sceneHelpers.add(this.polygon);
        }

        if (this.positions.length === 0) {
            this.positions.push(this.world.x, this.world.y, this.world.z);
            this.positions.push(this.world.x, this.world.y, this.world.z);
        } else {
            this.positions.push(this.world.x, this.world.y, this.world.z);
        }

        this.update();
    }

    onGpuPick(obj) {
        if (!obj.point) {
            return;
        }

        this.world.copy(obj.point);

        if (this.positions.length === 0) {
            return;
        }

        this.positions.splice(this.positions.length - 3, 3);
        this.positions.push(this.world.x, this.world.y, this.world.z);

        this.update();
    }

    update() {
        let vertices = Earcut.triangulate(this.positions, null, 3);
        this.polygon.geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

        let dist = 0;

        for (let i = 3; i < this.positions.length; i += 3) {
            dist += Math.sqrt(
                (this.positions[i] - this.positions[i - 3]) ** 2 +
                (this.positions[i + 1] - this.positions[i - 2]) ** 2 +
                (this.positions[i + 2] - this.positions[i - 1]) ** 2
            );
        }

        dist = dist.toFixed(2);

        let domElement = app.editor.renderer.domElement;

        if (this.positions.length === 6 && this.polygon.texts.length === 0) { // 前两个点
            let text1 = new UnscaledText(_t('Start Point'), {
                domWidth: domElement.width,
                domHeight: domElement.height
            });
            text1.position.fromArray(this.positions);
            let text2 = new UnscaledText(_t('{{dist}}m', { dist: 0 }), {
                domWidth: domElement.width,
                domHeight: domElement.height
            });
            text2.position.fromArray(this.positions, 3);
            this.polygon.texts.push(text1, text2);
            app.editor.sceneHelpers.add(text1);
            app.editor.sceneHelpers.add(text2);
        } else if (this.polygon.texts.length < this.positions.length / 3) { // 增加点了
            let text1 = new UnscaledText(_t('{{dist}}m', { dist }), {
                domWidth: domElement.width,
                domHeight: domElement.height
            });
            text1.position.fromArray(this.positions, this.positions.length - 3);
            this.polygon.texts.push(text1);
            app.editor.sceneHelpers.add(text1);
        } else { // 更新最后一个点坐标
            let text1 = this.polygon.texts[this.polygon.texts.length - 1];
            text1.position.fromArray(this.positions, this.positions.length - 3);
            text1.setText(_t('{{dist}}m', { dist }));
        }
    }

    onDblClick() {
        this.stop();
        this.call(`end`, this);
    }
}

export default AreaTool;