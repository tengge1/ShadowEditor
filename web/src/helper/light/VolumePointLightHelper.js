/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
/**
 * 具有一定体积的点光源帮助器
 * @author tengge / https://github.com/tengge1
 * @param {THREE.PointLight} light 点光源
 * @param {Number} sphereSize 发射尺寸
 * @param {Object} color 颜色
 */
function VolumePointLightHelper(light, sphereSize, color) {
    THREE.PointLightHelper.call(this, light, sphereSize, color);

    var geometry = new THREE.SphereBufferGeometry(2, 4, 2);
    var material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        visible: false
    });

    this.picker = new THREE.Mesh(geometry, material);
    this.picker.name = 'picker';
    this.add(this.picker);
}

VolumePointLightHelper.prototype = Object.create(THREE.PointLightHelper.prototype);
VolumePointLightHelper.prototype.constructor = VolumePointLightHelper;

VolumePointLightHelper.prototype.raycast = function (raycaster, intersects) {
    var intersect = raycaster.intersectObject(this.picker)[0];
    if (intersect) {
        intersect.object = this.light;
        intersects.push(intersect);
    }
};

VolumePointLightHelper.prototype.dispose = function () {
    this.remove(this.picker);

    this.picker.geometry.dispose();
    this.picker.material.dispose();
    delete this.picker;

    THREE.PointLightHelper.prototype.dispose.call(this);
};

export default VolumePointLightHelper;