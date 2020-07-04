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
 * 球体
 * @param {THREE.SphereBufferGeometry} geometry 几何体
 * @param {THREE.MeshStandardMaterial} material 材质
 */
function Sphere(geometry = new THREE.SphereBufferGeometry(1, 32, 16, 0, Math.PI * 2, 0, Math.PI), material = new THREE.MeshStandardMaterial()) {
    THREE.Mesh.call(this, geometry, material);

    this.name = _t('Sphere');
    this.castShadow = true;
    this.receiveShadow = true;

    this.userData.physics = this.userData.physics || {
        enabled: true,
        type: 'rigidBody',
        shape: 'btSphereShape',
        mass: 0,
        inertia: {
            x: 0,
            y: 0,
            z: 0
        }
    };
}

Sphere.prototype = Object.create(THREE.Mesh.prototype);
Sphere.prototype.constructor = Sphere;

export default Sphere;