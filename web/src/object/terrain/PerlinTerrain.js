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
 * 柏林地形
 * @param {Number} width 地形宽度
 * @param {Number} depth 地形深度
 * @param {Number} widthSegments 宽度分段
 * @param {Number} depthSegments 深度分段
 * @param {Number} quality 地形质量
 */
function PerlinTerrain(width = 1000, depth = 1000, widthSegments = 256, depthSegments = 256, quality = 80) {
    // 创建地形几何体
    var geometry = new THREE.PlaneBufferGeometry(width, depth, widthSegments - 1, depthSegments - 1);
    geometry.rotateX(-Math.PI / 2);

    var vertices = geometry.attributes.position.array;

    var data = this.generateHeight(widthSegments, depthSegments, quality);

    for (var i = 0, l = vertices.length; i < l; i++) {
        vertices[i * 3 + 1] = data[i]; // 给顶点数组y分量赋值（地面高度）
    }

    geometry.computeFaceNormals();

    // 创建光照贴图
    var texture = new THREE.CanvasTexture(this.generateTexture(data, widthSegments, depthSegments));
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;

    // 创建网格
    THREE.Mesh.call(this, geometry, new THREE.MeshLambertMaterial({ map: texture }));

    this.name = _t('Terrain');

    this.position.y = -50;

    Object.assign(this.userData, {
        type: 'PerlinTerrain',
        width: width,
        depth: depth,
        widthSegments: widthSegments,
        depthSegments: depthSegments,
        quality: quality
    });
}

PerlinTerrain.prototype = Object.create(THREE.Mesh.prototype);
PerlinTerrain.prototype.constructor = PerlinTerrain;

/**
 * 生成高程数据
 * @param {Number} width 宽度
 * @param {Number} height 高度
 * @param {Number} quality 质量
 * @returns {Uint8Array} 高程数据
 */
PerlinTerrain.prototype.generateHeight = function (width, height, quality) {
    var data = new Uint8Array(width * height);
    var perlin = new THREE.ImprovedNoise();

    for (var i = 0; i < width; i++) {
        for (var j = 0; j < height; j++) {
            data[i * height + j] = Math.abs(perlin.noise(i / quality, j / quality, 0) * quality);
        }
    }

    return data;
};

/**
 * 将光照烘培到贴图上
 * @param {Uint8Array} data 高程数据
 * @param {Number} width 宽度
 * @param {Number} height 高度
 * @returns {HTMLCanvasElement} 光照贴图
 */
PerlinTerrain.prototype.generateTexture = function (data, width, height) {
    // 创建ImageData
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    var context = canvas.getContext('2d');
    context.fillStyle = '#000';
    context.fillRect(0, 0, width, height);

    var image = context.getImageData(0, 0, canvas.width, canvas.height);
    var imageData = image.data;

    // 计算光照强度
    var sun = new THREE.Vector3(1, 1, 1);
    sun.normalize();

    var vector3 = new THREE.Vector3(0, 0, 0);
    var shade;

    for (var i = 0, j = 0, l = imageData.length; i < l; i += 4, j++) { // i-像素RGBA分量索引，j-高程数据索引
        vector3.x = data[j - 2] - data[j + 2];
        vector3.y = 2;
        vector3.z = data[j - width * 2] - data[j + width * 2];
        vector3.normalize();
        shade = vector3.dot(sun);
        imageData[i] = (96 + shade * 128) * (0.5 + data[j] * 0.007);
        imageData[i + 1] = (32 + shade * 96) * (0.5 + data[j] * 0.007);
        imageData[i + 2] = shade * 96 * (0.5 + data[j] * 0.007);
    }

    // 将光照强度写入canvas
    context.putImageData(image, 0, 0);

    return canvas;
};

export default PerlinTerrain;