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
 * 二十面体
 * @param {THREE.IcosahedronBufferGeometry} geometry 几何体
 * @param {THREE.MeshStandardMaterial} material 材质
 */
function Icosahedron(geometry = new THREE.IcosahedronBufferGeometry(1, 2), material = new THREE.MeshStandardMaterial()) {
    THREE.Mesh.call(this, geometry, material);

    this.name = _t('Icosahedron');
    this.castShadow = true;
    this.receiveShadow = true;

    this.userData.physics = this.userData.physics || {
        enabled: true,
        type: 'rigidBody',
        shape: 'btSphereShape',
        mass: 1,
        inertia: {
            x: 0,
            y: 0,
            z: 0
        }
    };
}

Icosahedron.prototype = Object.create(THREE.Mesh.prototype);
Icosahedron.prototype.constructor = Icosahedron;

export default Icosahedron;