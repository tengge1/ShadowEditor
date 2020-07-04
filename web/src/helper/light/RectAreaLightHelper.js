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
 * @author abelnation / http://github.com/abelnation
 * @author Mugen87 / http://github.com/Mugen87
 * @author WestLangley / http://github.com/WestLangley
 *
 *  This helper must be added as a child of the light
 */

function RectAreaLightHelper(light, color) {

    this.type = 'RectAreaLightHelper';

    this.light = light;

    this.color = color; // optional hardwired color for the helper

    var positions = [1, 1, 0, - 1, 1, 0, - 1, - 1, 0, 1, - 1, 0, 1, 1, 0];

    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.computeBoundingSphere();

    var material = new THREE.LineBasicMaterial({ fog: false });

    THREE.Line.call(this, geometry, material);

    //

    var positions2 = [1, 1, 0, - 1, 1, 0, - 1, - 1, 0, 1, 1, 0, - 1, - 1, 0, 1, - 1, 0];

    var geometry2 = new THREE.BufferGeometry();
    geometry2.setAttribute('position', new THREE.Float32BufferAttribute(positions2, 3));
    geometry2.computeBoundingSphere();

    this.add(new THREE.Mesh(geometry2, new THREE.MeshBasicMaterial({ side: THREE.BackSide, fog: false })));

    this.update();

}

RectAreaLightHelper.prototype = Object.create(THREE.Line.prototype);
RectAreaLightHelper.prototype.constructor = RectAreaLightHelper;

RectAreaLightHelper.prototype.update = function () {

    this.scale.set(0.5 * this.light.width, 0.5 * this.light.height, 1);

    if (this.color !== undefined) {

        this.material.color.set(this.color);
        this.children[0].material.color.set(this.color);

    } else {

        this.material.color.copy(this.light.color).multiplyScalar(this.light.intensity);

        // prevent hue shift
        var c = this.material.color;
        var max = Math.max(c.r, c.g, c.b);
        if (max > 1) c.multiplyScalar(1 / max);

        this.children[0].material.color.copy(this.material.color);

    }

};

RectAreaLightHelper.prototype.dispose = function () {

    this.geometry.dispose();
    this.material.dispose();
    this.children[0].geometry.dispose();
    this.children[0].material.dispose();

};

export default RectAreaLightHelper;
