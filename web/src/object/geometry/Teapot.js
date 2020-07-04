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
 * 茶壶
 * @param {THREE.TeapotBufferGeometry} geometry 几何体
 * @param {THREE.MeshStandardMaterial} material 材质
 */
function Teapot(geometry = new THREE.TeapotBufferGeometry(3, 10, true, true, true, true, true), material = new THREE.MeshStandardMaterial()) {
    THREE.Mesh.call(this, geometry, material);

    // 修改TeapotBufferGeometry类型错误问题，原来是BufferGeometry
    geometry.type = 'TeapotBufferGeometry';

    // 修复TeapotBufferGeometry缺少parameters参数问题
    geometry.parameters = {
        size: 3,
        segments: 10,
        bottom: true,
        lid: true,
        body: true,
        fitLid: true,
        blinn: true
    };

    this.name = _t('Teapot');
    this.castShadow = true;
    this.receiveShadow = true;

    this.userData.physics = this.userData.physics || {
        enabled: true,
        type: 'rigidBody',
        shape: 'btBoxShape',
        mass: 1,
        inertia: {
            x: 0,
            y: 0,
            z: 0
        }
    };
}

Teapot.prototype = Object.create(THREE.Mesh.prototype);
Teapot.prototype.constructor = Teapot;

export default Teapot;