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
 * 具有一定体积的平行光帮助器
 * @author tengge / https://github.com/tengge1
 * @param {THREE.DirectionalLight} light 平行光
 * @param {Number} size 尺寸
 * @param {THREE.Color} color 颜色
 */
class VolumeDirectionalLightHelper extends THREE.DirectionalLightHelper {
    constructor(light, size, color) {
        super(light, size, color);

        var geometry = new THREE.SphereBufferGeometry(2, 4, 2);
        var material = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            visible: false
        });

        this.picker = new THREE.Mesh(geometry, material);
        this.picker.name = 'picker';
        this.add(this.picker);
    }

    raycast(raycaster, intersects) {
        var intersect = raycaster.intersectObject(this.picker)[0];
        if (intersect) {
            intersect.object = this.light;
            intersects.push(intersect);
        }
    }

    dispose() {
        this.remove(this.picker);

        this.picker.geometry.dispose();
        this.picker.material.dispose();
        delete this.picker;

        super.dispose.call(this);
    }
}

export default VolumeDirectionalLightHelper;