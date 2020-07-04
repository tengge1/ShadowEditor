/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
var ARC_SEGMENTS = 200;

/**
 * 椭圆曲线
 * @param {Object} options 参数
 */
function EllipseCurve(options = {}) {
    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(ARC_SEGMENTS * 3), 3));

    var material = new THREE.LineBasicMaterial({
        color: 0xff0000,
        opacity: 0.35
    });

    THREE.Line.call(this, geometry, material);

    this.name = _t('Ellipse Curve');

    this.castShadow = true;

    Object.assign(this.userData, {
        type: 'EllipseCurve',
        aX: options.aX || 0,
        aY: options.aY || 0,
        xRadius: options.xRadius || 10,
        yRadius: options.yRadius || 5,
        aStartAngle: options.aStartAngle || 0,
        aEndAngle: options.aEndAngle || 2 * Math.PI,
        aClockwise: options.aClockwise || false,
        aRotation: options.aRotation || 0
    });

    this.update();
}

EllipseCurve.prototype = Object.create(THREE.Line.prototype);
EllipseCurve.prototype.constructor = EllipseCurve;

EllipseCurve.prototype.update = function () {
    var curve = new THREE.EllipseCurve(
        this.userData.aX,
        this.userData.aY,
        this.userData.xRadius,
        this.userData.yRadius,
        this.userData.aStartAngle,
        this.userData.aEndAngle,
        this.userData.aClockwise,
        this.userData.aRotation
    );

    var position = this.geometry.attributes.position;

    var point = new THREE.Vector3();

    for (var i = 0; i < ARC_SEGMENTS; i++) {
        var t = i / (ARC_SEGMENTS - 1);
        curve.getPoint(t, point);
        position.setXYZ(i, point.x, point.y, 0); // 椭圆曲线只能输出二维点
    }

    position.needsUpdate = true;
};

export default EllipseCurve;