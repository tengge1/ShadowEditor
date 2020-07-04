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
 * 判断是否是three.js内置类
 * @author tengge / https://github.com/tengge1
 * @param {THREE.Geometry} geometry 几何体
 * @returns {Boolean} 是否是
 */
function isBuildInGeometry(geometry) {
    if (geometry instanceof THREE.BoxBufferGeometry ||
        geometry instanceof THREE.BoxGeometry ||
        geometry instanceof THREE.CircleBufferGeometry ||
        geometry instanceof THREE.CircleGeometry ||
        geometry instanceof THREE.ConeBufferGeometry ||
        geometry instanceof THREE.ConeGeometry ||
        geometry instanceof THREE.CylinderBufferGeometry ||
        geometry instanceof THREE.CylinderGeometry ||
        geometry instanceof THREE.DodecahedronBufferGeometry ||
        geometry instanceof THREE.DodecahedronGeometry ||
        geometry instanceof THREE.ExtrudeBufferGeometry ||
        geometry instanceof THREE.ExtrudeGeometry ||
        geometry instanceof THREE.IcosahedronBufferGeometry ||
        geometry instanceof THREE.IcosahedronGeometry ||
        geometry instanceof THREE.LatheBufferGeometry ||
        geometry instanceof THREE.LatheGeometry ||
        geometry instanceof THREE.OctahedronBufferGeometry ||
        geometry instanceof THREE.OctahedronGeometry ||
        geometry instanceof THREE.ParametricBufferGeometry ||
        geometry instanceof THREE.ParametricGeometry ||
        geometry instanceof THREE.PlaneBufferGeometry ||
        geometry instanceof THREE.PlaneGeometry ||
        geometry instanceof THREE.PolyhedronBufferGeometry ||
        geometry instanceof THREE.PolyhedronGeometry ||
        geometry instanceof THREE.RingBufferGeometry ||
        geometry instanceof THREE.RingGeometry ||
        geometry instanceof THREE.ShapeBufferGeometry ||
        geometry instanceof THREE.ShapeGeometry ||
        geometry instanceof THREE.SphereBufferGeometry ||
        geometry instanceof THREE.SphereGeometry ||
        geometry instanceof THREE.TetrahedronBufferGeometry ||
        geometry instanceof THREE.TetrahedronGeometry ||
        geometry instanceof THREE.TextBufferGeometry ||
        geometry instanceof THREE.TextGeometry ||
        geometry instanceof THREE.TorusBufferGeometry ||
        geometry instanceof THREE.TorusGeometry ||
        geometry instanceof THREE.TorusKnotBufferGeometry ||
        geometry instanceof THREE.TorusKnotGeometry ||
        geometry instanceof THREE.TubeBufferGeometry ||
        geometry instanceof THREE.TubeGeometry
    ) {
        return true;
    }

    return false;
}

/**
 * 几何体工具类
 */
const GeometryUtils = {
    isBuildInGeometry: isBuildInGeometry
};

export default GeometryUtils;