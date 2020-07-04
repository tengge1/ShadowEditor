/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import vertexShader from './shader/hemisphere_vertex.glsl';
import fragmentShader from './shader/hemisphere_fragment.glsl';

/**
 * 半球光帮助器
 */
class HemisphereLightHelper extends THREE.Object3D {
    constructor(skyColor, groundColor) {
        super();

        this.name = _t('Helper');

        var uniforms = {
            topColor: { value: new THREE.Color(skyColor) },
            bottomColor: { value: new THREE.Color(groundColor) },
            offset: { value: 33 },
            exponent: { value: 0.6 }
        };

        var skyGeo = new THREE.SphereBufferGeometry(4000, 32, 15);
        var skyMat = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: uniforms,
            side: THREE.BackSide
        });

        var sky = new THREE.Mesh(skyGeo, skyMat);
        sky.name = _t('Sky');
        sky.userData.type = 'sky';

        this.add(sky);
    }
}

export default HemisphereLightHelper;