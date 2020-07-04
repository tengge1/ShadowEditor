/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import Earcut from '../../utils/Earcut';

/**
 * 多边形
 */
class Polygon extends THREE.Mesh {
    constructor() {
        let geometry = new THREE.BufferGeometry();
        geometry.setAttributes('position', new THREE.Float32BufferAttribute([], 3));

        let material = new THREE.MeshBasicMaterial();
        super(geometry, material);

        this.data = [];
    }

    addPoint(x, y, z) {
        this.data.push([x, y, z]);
        this.update();
    }

    update() {
        let vertices = Earcut.triangulate(this.data, null, 3);
        geometry.setAttributes('position', new THREE.Float32BufferAttribute(vertices, 3));
    }
}

export default Polygon;