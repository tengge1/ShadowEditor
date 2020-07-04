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
 * 天空
 * @param {Obejct} options 选项
 */
function Sky(options = {}) {
    THREE.Object3D.call(this);

    var turbidity = options.turbidity || 10; // 浑浊度
    var rayleigh = options.rayleigh || 2; // 瑞利
    var luminance = options.luminance || 1; // 亮度
    var mieCoefficient = options.mieCoefficient || 0.005;
    var mieDirectionalG = options.mieDirectionalG || 0.8;

    var distance = 400000;

    var sky = new THREE.Sky();
    sky.scale.setScalar(450000);

    this.add(sky);

    var sunSphere = new THREE.Mesh(
        new THREE.SphereBufferGeometry(20000, 16, 8),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
    );

    sunSphere.position.y = -700000;
    sunSphere.visible = false;

    this.add(sunSphere);

    var uniforms = sky.material.uniforms;
    uniforms.turbidity.value = turbidity;
    uniforms.rayleigh.value = rayleigh;
    uniforms.luminance.value = luminance;
    uniforms.mieCoefficient.value = mieCoefficient;
    uniforms.mieDirectionalG.value = mieDirectionalG;
    var theta = Math.PI * (0.49 - 0.5);
    var phi = 2 * Math.PI * (0.25 - 0.5);
    sunSphere.position.x = distance * Math.cos(phi);
    sunSphere.position.y = distance * Math.sin(phi) * Math.sin(theta);
    sunSphere.position.z = distance * Math.sin(phi) * Math.cos(theta);
    sunSphere.visible = true;
    uniforms.sunPosition.value.copy(sunSphere.position);

    this.userData = {
        type: 'Sky',
        turbidity: turbidity,
        rayleigh: rayleigh,
        luminance: luminance,
        mieCoefficient: mieCoefficient,
        mieDirectionalG: mieDirectionalG
    };
}

Sky.prototype = Object.create(THREE.Object3D.prototype);
Sky.prototype.constructor = Sky;

export default Sky;