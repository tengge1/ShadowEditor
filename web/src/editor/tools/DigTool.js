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

/**
 * 挖坑工具
 * @param {*} app 应用程序
 */
function DigTool(app) {
    BaseTool.call(this, app);
    this.points = [];
}

DigTool.prototype = Object.create(BaseTool.prototype);
DigTool.prototype.constructor = DigTool;

DigTool.prototype.start = function () {
    app.on(`intersect.${this.id}`, this.onRaycast.bind(this));
    app.on(`dblclick.${this.id}`, this.onDblClick.bind(this));
    app.on(`beforeRender.${this.id}`, this.onBeforeRender.bind(this));
    app.on(`afterRender.${this.id}`, this.onAfterRender.bind(this));
};

DigTool.prototype.stop = function () {
    app.on(`intersect.${this.id}`, null);
    app.on(`dblclick.${this.id}`, null);
    app.on(`beforeRender.${this.id}`, null);
    app.on(`afterRender.${this.id}`, null);
};

DigTool.prototype.onRaycast = function (obj) {
    this.points.push(obj.point);
};

DigTool.prototype.onDblClick = function () {
    this.call('end');

    if (this.scene === undefined) {
        this.scene = new THREE.Scene();
    }

    // var xys = this.points.map(n => {
    //     return {
    //         x: n.x,
    //         y: n.z
    //     };
    // });

    // if (!THREE.ShapeUtils.isClockWise(xys)) {
    //     this.points.reverse();
    // }

    var geometry = new THREE.BufferGeometry();

    var vertices = [];

    this.points.forEach(n => {
        vertices.push(n.x, n.y, n.z);
    });

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    var material = new THREE.MeshBasicMaterial();
    material.polygonOffset = true;
    material.polygonOffsetFactor = -1;

    var mesh = new THREE.Mesh(geometry, material);

    this.scene.add(mesh);

    this.points.length = 0;
};

DigTool.prototype.onBeforeRender = function () {
    if (!this.scene || this.scene.children.length === 0) {
        return;
    }

    var renderer = app.editor.renderer;
    var context = renderer.getContext();
    var state = renderer.state;

    state.buffers.color.setMask(false);
    state.buffers.depth.setMask(false);
    state.buffers.stencil.setMask(0xff);

    state.buffers.stencil.setTest(true);
    state.buffers.stencil.setFunc(context.ALWAYS, 1, 0xff);
    state.buffers.stencil.setOp(context.KEEP, context.KEEP, context.REPLACE);

    renderer.render(this.scene, app.editor.camera);

    state.buffers.color.setMask(0xff);
    state.buffers.depth.setMask(0xff);
    state.buffers.stencil.setMask(0x0);
    state.buffers.stencil.setFunc(context.NOTEQUAL, 1, 0xff);
};

DigTool.prototype.onAfterRender = function () {
    if (!this.scene || this.scene.children.length === 0) {
        return;
    }

    var renderer = app.editor.renderer;
    // var context = renderer.getContext();
    var state = renderer.state;

    state.buffers.stencil.setMask(0xff);
    state.buffers.stencil.setTest(false);
    renderer.clearStencil();
};

export default DigTool;