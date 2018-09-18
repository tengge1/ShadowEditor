import UI from '../../ui/UI';
import AddObjectCommand from '../../command/AddObjectCommand';
import TerrainVertexShader from './shader/terrain_vertex.glsl';
import TerrainFragmentShader from './shader/terrain_fragment.glsl';

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
                html: '创建地形2',
                onClick: this.createTerrain2.bind(this)
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

// ---------------------------- 创建地形2 ----------------------------------------

TerrainMenu.prototype.createTerrain2 = function () {
    var rx = 256, ry = 256;

    this.animDelta = 0;
    this.animDeltaDir = -1;
    this.lightVal = 0;
    this.lightDir = 1;

    var width = this.app.viewport.container.dom.clientWidth;
    var height = this.app.viewport.container.dom.clientHeight;

    this.sceneRenderTarget = new THREE.Scene();
    this.cameraOrtho = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, -10000, 10000);
    this.cameraOrtho.position.z = 100;
    this.sceneRenderTarget.add(this.cameraOrtho);

    var pars = {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBFormat
    };

    var heightMap = new THREE.WebGLRenderTarget(rx, ry, pars);
    heightMap.texture.generateMipmaps = false;
    this.heightMap = heightMap;

    var normalMap = new THREE.WebGLRenderTarget(rx, ry, pars);
    normalMap.texture.generateMipmaps = false;
    this.normalMap = normalMap;

    var uniformsNoise = {
        time: { value: 1.0 },
        scale: { value: new THREE.Vector2(1.5, 1.5) },
        offset: { value: new THREE.Vector2(0, 0) }
    };

    this.uniformsNoise = uniformsNoise;

    var uniformsNormal = THREE.UniformsUtils.clone(THREE.NormalMapShader.uniforms);
    uniformsNormal.height.value = 0.05;
    uniformsNormal.resolution.value.set(rx, ry);
    uniformsNormal.heightMap.value = heightMap.texture;

    // TEXTURES
    var terrain;

    var loadingManager = new THREE.LoadingManager(function () {
        terrain.visible = true;
    });

    var textureLoader = new THREE.TextureLoader(loadingManager);
    var specularMap = new THREE.WebGLRenderTarget(2048, 2048, pars);
    specularMap.texture.generateMipmaps = false;

    var diffuseTexture1 = textureLoader.load("assets/textures/terrain/grasslight-big.jpg");
    var diffuseTexture2 = textureLoader.load("assets/textures/terrain/backgrounddetailed6.jpg");
    var detailTexture = textureLoader.load("assets/textures/terrain/grasslight-big-nm.jpg");

    diffuseTexture1.wrapS = diffuseTexture1.wrapT = THREE.RepeatWrapping;
    diffuseTexture2.wrapS = diffuseTexture2.wrapT = THREE.RepeatWrapping;
    detailTexture.wrapS = detailTexture.wrapT = THREE.RepeatWrapping;
    specularMap.texture.wrapS = specularMap.texture.wrapT = THREE.RepeatWrapping;

    // TERRAIN SHADER
    var terrainShader = THREE.ShaderTerrain["terrain"];

    var uniformsTerrain = THREE.UniformsUtils.clone(terrainShader.uniforms);
    uniformsTerrain['tNormal'].value = normalMap.texture;
    uniformsTerrain['uNormalScale'].value = 3.5;
    uniformsTerrain['tDisplacement'].value = heightMap.texture;
    uniformsTerrain['tDiffuse1'].value = diffuseTexture1;
    uniformsTerrain['tDiffuse2'].value = diffuseTexture2;
    uniformsTerrain['tSpecular'].value = specularMap.texture;
    uniformsTerrain['tDetail'].value = detailTexture;
    uniformsTerrain['enableDiffuse1'].value = true;
    uniformsTerrain['enableDiffuse2'].value = true;
    uniformsTerrain['enableSpecular'].value = true;
    uniformsTerrain['diffuse'].value.setHex(0xffffff);
    uniformsTerrain['specular'].value.setHex(0xffffff);
    uniformsTerrain['shininess'].value = 30;
    uniformsTerrain['uDisplacementScale'].value = 375;
    uniformsTerrain['uRepeatOverlay'].value.set(6, 6);

    this.uniformsTerrain = uniformsTerrain;

    var params = [
        ['heightmap', TerrainFragmentShader, TerrainVertexShader, uniformsNoise, false],
        ['normal', THREE.NormalMapShader.fragmentShader, THREE.NormalMapShader.vertexShader, uniformsNormal, false],
        ['terrain', terrainShader.fragmentShader, terrainShader.vertexShader, uniformsTerrain, true]
    ];

    this.mlib = {};

    for (var i = 0; i < params.length; i++) {
        var material = new THREE.ShaderMaterial({
            uniforms: params[i][3],
            vertexShader: params[i][2],
            fragmentShader: params[i][1],
            lights: params[i][4],
            fog: true
        });
        this.mlib[params[i][0]] = material;
    }

    var plane = new THREE.PlaneBufferGeometry(width, height);
    this.quadTarget = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({ color: 0x000000 }));
    this.quadTarget.position.z = -500;

    this.sceneRenderTarget.add(this.quadTarget);

    // TERRAIN MESH
    var geometryTerrain = new THREE.PlaneBufferGeometry(6000, 6000, 256, 256);
    THREE.BufferGeometryUtils.computeTangents(geometryTerrain);

    var terrain = new THREE.Mesh(geometryTerrain, this.mlib['terrain']);
    terrain.name = '地形2';
    terrain.position.set(0, -30, 0);
    terrain.rotation.x = -Math.PI / 2;
    terrain.scale.set(0.1, 0.1, 0.1);
    terrain.visible = false;

    this.terrain2 = terrain;

    this.app.editor.execute(new AddObjectCommand(terrain));

    this.app.on(`animate.Terrain2`, this.onTerrain2Animate.bind(this));
};

TerrainMenu.prototype.onTerrain2Animate = function (clock, deltaTime) {
    var terrain = this.terrain2;
    var renderer = this.app.editor.renderer;

    if (terrain.visible) {
        var fLow = 0.1, fHigh = 0.8;
        this.lightVal = THREE.Math.clamp(this.lightVal + 0.5 * deltaTime * this.lightDir, fLow, fHigh);
        var valNorm = (this.lightVal - fLow) / (fHigh - fLow);

        this.uniformsTerrain['uNormalScale'].value = THREE.Math.mapLinear(valNorm, 0, 1, 0.6, 3.5);

        if (true) {
            this.animDelta = THREE.Math.clamp(this.animDelta + 0.00075 * this.animDeltaDir, 0, 0.05);
            this.uniformsNoise['time'].value += deltaTime * this.animDelta;
            // this.uniformsNoise['offset'].value.x += deltaTime * 0.05;
            // this.uniformsTerrain['uOffset'].value.x = 4 * this.uniformsNoise['offset'].value.x;

            this.quadTarget.material = this.mlib['heightmap'];
            renderer.render(this.sceneRenderTarget, this.cameraOrtho, this.heightMap, true);
            this.quadTarget.material = this.mlib['normal'];
            renderer.render(this.sceneRenderTarget, this.cameraOrtho, this.normalMap, true);
        }
    }
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