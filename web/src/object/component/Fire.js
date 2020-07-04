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
 * 火焰
 * @param {THREE.Camera} camera 相机
 * @param {Object} options 参数
 */
function Fire(camera, options = {}) {
    THREE.Object3D.call(this);

    VolumetricFire.texturePath = 'assets/textures/VolumetricFire/';

    var width = options.width || 2;
    var height = options.height || 4;
    var depth = options.depth || 2;
    var sliceSpacing = options.sliceSpacing || 0.5;

    var fire = new VolumetricFire(
        width,
        height,
        depth,
        sliceSpacing,
        camera
    );

    this.add(fire.mesh);

    fire.mesh.name = _t('Fire');

    this.name = _t('Fire');
    this.position.y = 2;

    Object.assign(this.userData, {
        type: 'Fire',
        fire: fire,
        width: width,
        height: height,
        depth: depth,
        sliceSpacing: sliceSpacing
    });
}

Fire.prototype = Object.create(THREE.Object3D.prototype);
Fire.prototype.constructor = Fire;

export default Fire;