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
 * 点光源帮助器
 */
class PointLightHelper extends THREE.Object3D {
    constructor(color) {
        super();

        this.name = _t('Helper');

        var geometry = new THREE.SphereBufferGeometry(0.2, 16, 8);
        var material = new THREE.MeshBasicMaterial({
            color
        });
        var mesh = new THREE.Mesh(geometry, material);

        // 帮助器
        mesh.name = _t('Helper');
        mesh.userData.type = 'helper';

        this.add(mesh);

        // 光晕
        var textureLoader = new THREE.TextureLoader();
        var textureFlare0 = textureLoader.load('assets/textures/lensflare/lensflare0.png');
        var textureFlare3 = textureLoader.load('assets/textures/lensflare/lensflare3.png');

        // 光晕
        var lensflare = new THREE.Lensflare();
        lensflare.addElement(new THREE.LensflareElement(textureFlare0, 40, 0.01, new THREE.Color(color)));
        lensflare.addElement(new THREE.LensflareElement(textureFlare3, 60, 0.2));
        lensflare.addElement(new THREE.LensflareElement(textureFlare3, 35, 0.4));
        lensflare.addElement(new THREE.LensflareElement(textureFlare3, 60, 0.6));
        lensflare.addElement(new THREE.LensflareElement(textureFlare3, 45, 0.8));

        lensflare.name = _t('Halo');
        lensflare.userData.type = 'lensflare';

        this.add(lensflare);
    }
}

export default PointLightHelper;