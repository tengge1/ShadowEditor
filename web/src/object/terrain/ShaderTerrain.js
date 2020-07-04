/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import HeightVertexShader from './shader/height_vertex.glsl';
import HeightFragmentShader from './shader/height_fragment.glsl';

/**
 * 着色器地形
 * @param {*} renderer 渲染器
 */
function ShaderTerrain(renderer) {
    var width = renderer.domElement.width; // 画布宽度
    var height = renderer.domElement.height; // 画布高度

    // 地形参数
    var rx = 256, ry = 256, // 分辨率
        animDelta = 0, // 动画间隔
        animDeltaDir = -1, // 动画方向
        // lightVal = 0, // 光源强度
        lightDir = 1; // 光源方向

    // 场景
    var scene = new THREE.Scene();

    // 相机
    var camera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, -10000, 10000);
    camera.position.z = 100;
    scene.add(camera);

    // 高程贴图
    var heightMap = new THREE.WebGLRenderTarget(rx, ry, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBFormat
    });
    heightMap.texture.generateMipmaps = false;

    // 法线贴图
    var normalMap = new THREE.WebGLRenderTarget(rx, ry, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBFormat
    });
    normalMap.texture.generateMipmaps = false;

    // 高光贴图
    var specularMap = new THREE.WebGLRenderTarget(2048, 2048, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBFormat
    });
    specularMap.texture.generateMipmaps = false;

    // 下载纹理
    var loadingManager = new THREE.LoadingManager(() => {
        this.visible = true;
    });

    var textureLoader = new THREE.TextureLoader(loadingManager);

    var diffuseTexture1 = textureLoader.load("assets/textures/terrain/grasslight-big.jpg"); // 漫反射纹理1
    var diffuseTexture2 = textureLoader.load("assets/textures/terrain/backgrounddetailed6.jpg"); // 漫反射纹理2
    var detailTexture = textureLoader.load("assets/textures/terrain/grasslight-big-nm.jpg"); // 细节纹理

    diffuseTexture1.wrapS = diffuseTexture1.wrapT = THREE.RepeatWrapping;
    diffuseTexture2.wrapS = diffuseTexture2.wrapT = THREE.RepeatWrapping;
    detailTexture.wrapS = detailTexture.wrapT = THREE.RepeatWrapping;

    // 创建高程材质
    var heightUniforms = {
        time: { value: 1.0 },
        scale: { value: new THREE.Vector2(1.5, 1.5) },
        offset: { value: new THREE.Vector2(0, 0) }
    };

    var hightMaterial = this.createShaderMaterial(HeightVertexShader, HeightFragmentShader, heightUniforms, false);

    // 创建法线材质
    var normalUniforms = THREE.UniformsUtils.clone(THREE.NormalMapShader.uniforms);
    normalUniforms.height.value = 0.05;
    normalUniforms.resolution.value.set(rx, ry);
    normalUniforms.heightMap.value = heightMap.texture;

    var normalMaterial = this.createShaderMaterial(THREE.NormalMapShader.vertexShader, THREE.NormalMapShader.fragmentShader, normalUniforms, false);

    // 创建地形材质
    var terrainShader = THREE.TerrainShader;

    var terrainUniforms = THREE.UniformsUtils.clone(terrainShader.uniforms);

    terrainUniforms['tDisplacement'].value = heightMap.texture; // 位移贴图
    terrainUniforms['uDisplacementScale'].value = 375; // 位移贴图缩放

    terrainUniforms['tNormal'].value = normalMap.texture; // 法线贴图
    terrainUniforms['uNormalScale'].value = 3.5; // 法线贴图缩放

    terrainUniforms['specular'].value.setHex(0xffffff); // 高光颜色
    terrainUniforms['diffuse'].value.setHex(0xffffff); // 漫反射颜色
    terrainUniforms['shininess'].value = 30; // 光泽

    terrainUniforms['tSpecular'].value = specularMap.texture; // 高光贴图
    terrainUniforms['enableSpecular'].value = true; // 是否启用高光贴图

    terrainUniforms['tDiffuse1'].value = diffuseTexture1; // 漫反射纹理1
    terrainUniforms['enableDiffuse1'].value = true; // 是否启用漫反射纹理1

    terrainUniforms['tDiffuse2'].value = diffuseTexture2; // 漫反射纹理2
    terrainUniforms['enableDiffuse2'].value = true; // 是否启用漫反射纹理2

    terrainUniforms['tDetail'].value = detailTexture; // 细节纹理
    terrainUniforms['uRepeatOverlay'].value.set(6, 6); // 重复叠加次数

    var terrainMaterial = this.createShaderMaterial(terrainShader.vertexShader, terrainShader.fragmentShader, terrainUniforms, true);

    // 贴图生成渲染目标
    var quadTarget = new THREE.Mesh(new THREE.PlaneBufferGeometry(width, height), new THREE.MeshBasicMaterial({ color: 0x000000 }));
    quadTarget.position.z = -500;
    scene.add(quadTarget);

    // 创建网格
    var geometry = new THREE.PlaneBufferGeometry(6000, 6000, 256, 256);
    THREE.BufferGeometryUtils.computeTangents(geometry);

    THREE.Mesh.call(this, geometry, terrainMaterial);

    this.name = _t('Terrain');
    this.position.set(0, -30, 0);
    this.rotation.x = -Math.PI / 2;
    this.scale.set(0.1, 0.1, 0.1);

    // 动画函数
    function update(deltaTime) {
        if (!this.visible) {
            return;
        }

        var fLow = 0.1,
            fHigh = 0.8;

        var lightVal = THREE.Math.clamp(lightVal + 0.5 * deltaTime * lightDir, fLow, fHigh);
        var valNorm = (lightVal - fLow) / (fHigh - fLow);

        terrainUniforms['uNormalScale'].value = THREE.Math.mapLinear(valNorm, 0, 1, 0.6, 3.5);

        animDelta = THREE.Math.clamp(animDelta + 0.00075 * animDeltaDir, 0, 0.05);
        heightUniforms['time'].value += deltaTime * animDelta;
        heightUniforms['offset'].value.x += deltaTime * 0.05;

        // 生成高程贴图
        quadTarget.material = hightMaterial;
        renderer.render(scene, camera, heightMap, true);

        // 生成法线贴图
        quadTarget.material = normalMaterial;
        renderer.render(scene, camera, normalMap, true);
    }

    this.update = update.bind(this);
}

ShaderTerrain.prototype = Object.create(THREE.Mesh.prototype);
ShaderTerrain.prototype.constructor = ShaderTerrain;

/**
 * 创建着色器材质
 * @param {String} vertexShader 顶点着色器
 * @param {String} fragmentShader 片源着色器
 * @param {Object} uniforms 变量
 * @param {Boolean} lights 是否使用光源
 * @returns {THREE.ShaderMaterial} 地形材质
 */
ShaderTerrain.prototype.createShaderMaterial = function (vertexShader, fragmentShader, uniforms, lights) {
    return new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: uniforms,
        lights: lights,
        fog: true
    });
};

export default ShaderTerrain;