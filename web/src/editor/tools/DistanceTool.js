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
import UnscaledText from '../../object/text/UnscaledText';

/**
 * 距离测量工具
 */
class DistanceTool extends BaseTool {
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
            this.lines = [];
            this.world = new THREE.Vector3();

            app.require('line').then(() => {
                app.on(`mousedown.${this.id}`, this.onMouseDown);
                app.on(`gpuPick.${this.id}`, this.onGpuPick);
                app.on(`dblclick.${this.id}`, this.onDblClick);
            });
        } else {
            this.positions.length = 0;
            app.on(`mousedown.${this.id}`, this.onMouseDown);
            app.on(`gpuPick.${this.id}`, this.onGpuPick);
            app.on(`dblclick.${this.id}`, this.onDblClick);
        }
        app.editor.gpuPickNum++;
    }

    stop() {
        app.editor.gpuPickNum--;
        app.on(`mousedown.${this.id}`, null);
        app.on(`gpuPick.${this.id}`, null);
        app.on(`dblclick.${this.id}`, null);

        this.positions.length = 0;
        delete this.line;
    }

    clear() {
        while (this.lines.length) {
            let line = this.lines[0];
            app.editor.sceneHelpers.remove(line);
        }

        this.lines.length = 0;
    }

    onMouseDown() {
        if (!this.line) {
            let { width, height } = app.editor.renderer.domElement;
            let geometry1 = new THREE.LineGeometry();
            let material = new THREE.LineMaterial({
                color: 0xffff00,
                linewidth: 4,
                resolution: new THREE.Vector2(width, height)
            });
            this.line = new THREE.Line2(geometry1, material);
            this.line.texts = [];
            this.lines.push(this.line);
            app.editor.sceneHelpers.add(this.line);
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
        let geometry = this.line.geometry;
        geometry.setPositions(this.positions);
        geometry.maxInstancedCount = this.positions.length / 3 - 1;

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

        if (this.positions.length === 6 && this.line.texts.length === 0) { // 前两个点
            let text1 = new UnscaledText(_t('Start Point'), {
                domWidth: domElement.width,
                domHeight: domElement.height
            });
            this.offsetText(text1);
            text1.position.fromArray(this.positions);
            let text2 = new UnscaledText(_t('{{dist}}m', { dist: 0 }), {
                domWidth: domElement.width,
                domHeight: domElement.height
            });
            this.offsetText(text2);
            text2.position.fromArray(this.positions, 3);
            this.line.texts.push(text1, text2);
            app.editor.sceneHelpers.add(text1);
            app.editor.sceneHelpers.add(text2);
        } else if (this.line.texts.length < this.positions.length / 3) { // 增加点了
            let text1 = new UnscaledText(_t('{{dist}}m', { dist }), {
                domWidth: domElement.width,
                domHeight: domElement.height
            });
            this.offsetText(text1);
            text1.position.fromArray(this.positions, this.positions.length - 3);
            this.line.texts.push(text1);
            app.editor.sceneHelpers.add(text1);
        } else { // 更新最后一个点坐标
            let text1 = this.line.texts[this.line.texts.length - 1];
            this.offsetText(text1);
            text1.position.fromArray(this.positions, this.positions.length - 3);
            text1.setText(_t('{{dist}}m', { dist }));
        }
    }

    offsetText(text) {
        // 避免文字被遮挡
        text.material.depthTest = false;
        // text.material.polygonOffset = true;
        // text.material.polygonOffsetFactor = -10;
        // text.material.polygonOffsetUnits = -10;
    }

    onDblClick() {
        this.stop();
        this.call(`end`, this);
    }
}

export default DistanceTool;