/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import vertexShader from './shader/smoke_vertex.glsl';
import fragmentShader from './shader/smoke_fragment.glsl';

/**
 * 烟
 * @author yomotsu / http://yomotsu.net
 * ported from http://webgl-fire.appspot.com/html/fire.html
 *
 * https://www.youtube.com/watch?v=jKRHmQmduDI
 * https://graphics.ethz.ch/teaching/former/imagesynthesis_06/miniprojects/p3/
 * https://www.iusb.edu/math-compsci/_prior-thesis/YVanzine_thesis.pdf
 * @param {THREE.Camera} camera 相机
 * @param {THREE.WebGLRenderer} renderer 渲染器
 * @param {Object} options 选项
 */
function Smoke(camera, renderer, options = {}) {
    var particleCount = options.particleCount || 32;
    var size = options.size || 3;
    var lifetime = options.lifetime || 10;

    // 几何体
    var geometry = new THREE.BufferGeometry();

    var position = new Float32Array(particleCount * 3);
    var shift = new Float32Array(particleCount);

    for (var i = 0; i < particleCount; i++) {
        position[i * 3 + 0] = THREE.Math.randFloat(-0.5, 0.5);
        position[i * 3 + 1] = 2.4;
        position[i * 3 + 3] = THREE.Math.randFloat(-0.5, 0.5);
        shift[i] = Math.random() * 1;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(position, 3));
    geometry.setAttribute('shift', new THREE.BufferAttribute(shift, 1));

    // 材质
    var texture = new THREE.TextureLoader().load('assets/textures/VolumetricFire/smoke.png');

    var uniforms = {
        time: { type: 'f', value: 0 },
        size: { type: 'f', value: size },
        texture: { type: 't', value: texture },
        lifetime: { type: 'f', value: lifetime },
        projection: { type: 'f', value: Math.abs(renderer.domElement.height / (2 * Math.tan(THREE.Math.degToRad(camera.fov)))) }
    };

    var material = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: uniforms,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false
    });

    THREE.Points.call(this, geometry, material);

    this.sortParticles = true;

    this.name = _t('Smoke');

    Object.assign(this.userData, {
        type: 'Smoke',
        particleCount: particleCount,
        size: size,
        lifetime: lifetime
    });
}

Smoke.prototype = Object.create(THREE.Points.prototype);
Smoke.prototype.constructor = Smoke;

Smoke.prototype.update = function (elapsed) {
    this.material.uniforms.time.value = elapsed;
};

export default Smoke;