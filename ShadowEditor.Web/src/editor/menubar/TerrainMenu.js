import UI from '../../ui/UI';
import AddObjectCommand from '../../command/AddObjectCommand';
import ShaderTerrain from '../../object/terrain/ShaderTerrain';

/**
 * 地形菜单
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function TerrainMenu(options) {
    UI.Control.call(this, options);
    this.app = options.app;
}

TerrainMenu.prototype = Object.create(UI.Control.prototype);
TerrainMenu.prototype.constructor = TerrainMenu;

TerrainMenu.prototype.render = function () {
    var container = UI.create({
        xtype: 'div',
        parent: this.parent,
        cls: 'menu',
        children: [{
            xtype: 'div',
            cls: 'title',
            html: '地形'
        }, {
            xtype: 'div',
            cls: 'options',
            children: [{
                xtype: 'div',
                cls: 'option',
                html: '创建地形',
                onClick: this.createTerrain.bind(this)
            }, {
                xtype: 'div',
                cls: 'option',
                html: '创建着色器地形',
                onClick: this.createShaderTerrain.bind(this)
            }, {
                xtype: 'div',
                cls: 'option',
                html: '升高地形',
                onClick: this.raiseTerrain.bind(this)
            }, {
                xtype: 'div',
                cls: 'option',
                html: '降低地形',
                onClick: this.reduceTerrain.bind(this)
            }, {
                xtype: 'div',
                cls: 'option',
                html: '批量种树',
                onClick: this.plantTrees.bind(this)
            }]
        }]
    });

    container.render();
}

// ---------------------------- 创建地形 -----------------------------------

TerrainMenu.prototype.createTerrain = function () {
    var worldWidth = 256,
        worldDepth = 256,
        worldHalfWidth = worldWidth / 2,
        worldHalfDepth = worldDepth / 2;

    var data = this.generateHeight(worldWidth, worldDepth);
    var geometry = new THREE.PlaneBufferGeometry(7500, 7500, worldWidth - 1, worldDepth - 1);
    geometry.rotateX(-Math.PI / 2);
    var vertices = geometry.attributes.position.array;
    for (var i = 0, j = 0, l = vertices.length; i < l; i++ , j += 3) {
        vertices[j + 1] = data[i] * 10;
    }
    geometry.computeFaceNormals(); // needed for helper

    var texture = new THREE.CanvasTexture(this.generateTexture(data, worldWidth, worldDepth));
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;

    var mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ map: texture }));
    mesh.name = '地形';
    mesh.scale.set(0.01, 0.01, 0.01);

    var editor = this.app.editor;
    editor.execute(new AddObjectCommand(mesh));
};

TerrainMenu.prototype.generateHeight = function (width, height) {
    var size = width * height,
        data = new Uint8Array(size),
        perlin = new ImprovedNoise(),
        quality = 1,
        z = Math.random();

    for (var j = 0; j < 4; j++) {
        for (var i = 0; i < size; i++) {
            var x = i % width, y = ~~(i / width);
            data[i] += Math.abs(perlin.noise(x / quality, y / quality, 0) * quality);
        }
        quality *= 5;
    }

    return data;
};

TerrainMenu.prototype.generateTexture = function (data, width, height) {
    // bake lighting into texture
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

    // Scaled 4x
    canvasScaled = document.createElement('canvas');
    canvasScaled.width = width * 4;
    canvasScaled.height = height * 4;

    context = canvasScaled.getContext('2d');
    context.scale(4, 4);
    context.drawImage(canvas, 0, 0);

    image = context.getImageData(0, 0, canvasScaled.width, canvasScaled.height);
    imageData = image.data;

    for (var i = 0, l = imageData.length; i < l; i += 4) {
        var v = ~ ~(Math.random() * 5);
        imageData[i] += v;
        imageData[i + 1] += v;
        imageData[i + 2] += v;
    }

    context.putImageData(image, 0, 0);
    return canvasScaled;
};

// ---------------------------- 创建着色器地形 ----------------------------------------

TerrainMenu.prototype.createShaderTerrain = function () {
    var dom = this.app.viewport.container.dom;

    var terrain = new ShaderTerrain(this.app.editor.renderer, dom.clientWidth, dom.clientHeight);

    this.app.editor.execute(new AddObjectCommand(terrain));

    this.app.on(`animate.Terrain2`, (clock, deltaTime) => {
        terrain.update(deltaTime);
    });
};

// ---------------------------- 升高地形 -----------------------------------

TerrainMenu.prototype.raiseTerrain = function () {

};

// ---------------------------- 降低地形 ------------------------------------

TerrainMenu.prototype.reduceTerrain = function () {

};

// ----------------------------- 批量种树 --------------------------------------

TerrainMenu.prototype.plantTrees = function () {

};

export default TerrainMenu;