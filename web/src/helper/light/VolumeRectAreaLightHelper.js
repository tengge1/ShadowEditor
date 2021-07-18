/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import RectAreaLightHelper from './RectAreaLightHelper';

/**
 * 具有一定体积的矩形光帮助器
 * @author tengge / https://github.com/tengge1
 * @param {THREE.RectAreaLight} light 矩形光
 * @param {Object} color 颜色
 */
class VolumeRectAreaLightHelper extends RectAreaLightHelper {
    constructor(light, color) {
        super(light, color);
        // TODO: three.js bugs： 未设置矩形光帮助器矩阵
        this.matrix = light.matrixWorld;
        this.matrixAutoUpdate = false;

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

        super.dispose();
    }
}

export default VolumeRectAreaLightHelper;