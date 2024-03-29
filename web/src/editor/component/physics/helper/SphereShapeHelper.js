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
 * 球体帮助器
 * @param {*} object 物体
 */
class SphereShapeHelper extends THREE.Mesh {
    constructor(object) {
        super();
        this.object = object;

        var geometry = this.object.geometry;
        geometry.computeBoundingSphere();

        var sphere = geometry.boundingSphere;

        geometry = new THREE.SphereBufferGeometry(sphere.radius);
        var material = new THREE.MeshBasicMaterial({
            color: 0xffff00
        });

        material.wireframe = true;
        material.depthTest = false;

        THREE.Mesh.call(this, geometry, material);

        this.update();
    }

    update() {
        this.object.geometry.computeBoundingSphere();

        this.position.copy(this.object.position);
        this.rotation.copy(this.object.rotation);
        this.scale.copy(this.object.scale);
    }
}

export default SphereShapeHelper;