/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import SkyBallVertex from './shader/sky_ball_vertex.glsl';
import SkyBallFragment from './shader/sky_ball_fragment.glsl';

/**
 * 天空球
 */
class SkyBall extends THREE.Mesh {
    constructor(url) {
        const geometry = new THREE.SphereBufferGeometry(10000, 64, 64);
        const material = new THREE.ShaderMaterial({
            vertexShader: SkyBallVertex,
            fragmentShader: SkyBallFragment,
            side: THREE.BackSide,
            uniforms: {
                diffuse: {
                    value: new THREE.TextureLoader().load(url)
                }
            }
        });
        super(geometry, material);
    }
}

export default SkyBall;