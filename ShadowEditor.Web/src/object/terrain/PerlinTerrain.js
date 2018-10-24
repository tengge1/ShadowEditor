/**
 * 柏林地形
 * @param {*} width 地形宽度
 * @param {*} depth 地形高度
 */
function PerlinTerrain(width = 256, depth = 256) {
    // 创建地形几何体
    var geometry = new THREE.PlaneBufferGeometry(1000, 1000, width - 1, depth - 1);
    geometry.rotateX(-Math.PI / 2);

    var vertices = geometry.attributes.position.array;

    var data = this.generateHeight(width, depth);

    for (var i = 0, l = vertices.length; i < l; i++) {
        vertices[i * 3 + 1] = data[i];
    }

    geometry.computeFaceNormals();

    // 创建光照贴图
    var texture = new THREE.CanvasTexture(this.generateTexture(data, width, depth));
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;

    // 创建网格
    THREE.Mesh.call(this, geometry, new THREE.MeshLambertMaterial({ map: texture }));

    this.name = '地形';
    this.position.y = -50;
}

PerlinTerrain.prototype = Object.create(THREE.Mesh.prototype);
PerlinTerrain.prototype.constructor = PerlinTerrain;

PerlinTerrain.prototype.generateHeight = function (width, height) {
    var data = new Uint8Array(width * height);
    var perlin = new ImprovedNoise();
    var quality = 80; // 质量，数越大，起伏越大，质量越高。

    for (var i = 0; i < width; i++) {
        for (var j = 0; j < height; j++) {
            data[i * height + j] = Math.abs(perlin.noise(i / quality, j / quality, 0) * quality);
        }
    }

    return data;
};

PerlinTerrain.prototype.generateTexture = function (data, width, height) {
    // 烘培光照到纹理上
    var canvas, canvasScaled, context, image, imageData, vector3, sun, shade;

    vector3 = new THREE.Vector3(0, 0, 0);

    sun = new THREE.Vector3(1, 1, 1);
    sun.normalize();

    canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    context = canvas.getContext('2d');
    context.fillStyle = '#000';
    context.fillRect(0, 0, width, height);

    image = context.getImageData(0, 0, canvas.width, canvas.height);
    imageData = image.data;

    for (var i = 0, j = 0, l = imageData.length; i < l; i += 4, j++) {
        vector3.x = data[j - 2] - data[j + 2];
        vector3.y = 2;
        vector3.z = data[j - width * 2] - data[j + width * 2];
        vector3.normalize();
        shade = vector3.dot(sun);
        imageData[i] = (96 + shade * 128) * (0.5 + data[j] * 0.007);
        imageData[i + 1] = (32 + shade * 96) * (0.5 + data[j] * 0.007);
        imageData[i + 2] = (shade * 96) * (0.5 + data[j] * 0.007);
    }

    context.putImageData(image, 0, 0);

    return canvas;
};

export default PerlinTerrain;