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
 * 创建材质球图片
 * @param {THREE.Material} material 材质
 * @param {Number} width 宽度
 * @param {Number} height 高度
 * @returns {THREE.WebGLRenderTarget} 贴图
 */
function createMaterialImage(material, width = 160, height = 160) {
    var scene = new THREE.Scene();

    var camera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 0, 1000);
    camera.position.z = 80;

    var renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(width, height);

    var light1 = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(light1);

    var light2 = new THREE.DirectionalLight(0xffffff, 0.8);
    scene.add(light2);
    light2.position.set(0, 10, 10);
    light2.lookAt(new THREE.Vector3());

    var geometry = new THREE.SphereBufferGeometry(72, 32, 32);
    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    renderer.setClearColor(0xeeeeee);
    renderer.clear();
    renderer.render(scene, camera);

    geometry.dispose();
    renderer.dispose();

    return renderer.domElement;
}

/**
 * 材质工具类
 */
const MaterialUtils = {
    createMaterialImage: createMaterialImage
};

export default MaterialUtils;