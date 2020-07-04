/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import HeightmapFragmentShader from './shader/heightmap_fragment.glsl';
// import SmoothFragmentShader from './shader/smooth_fragment.glsl';
import WaterVertexShader from './shader/water_vertex.glsl';

/**
 * 水
 * @param {THREE.WebGLRenderer} renderer 渲染器
 */
function Water(renderer) {
    var BOUNDS = 512;
    var WIDTH = 128;
    var materialColor = 0x0040C0;

    // 创建几何体
    var geometry = new THREE.PlaneBufferGeometry(BOUNDS, BOUNDS, WIDTH - 1, WIDTH - 1);

    // 创建材质
    var material = new THREE.ShaderMaterial({
        uniforms: THREE.UniformsUtils.merge([
            THREE.ShaderLib['phong'].uniforms, {
                heightmap: {
                    value: null
                }
            }
        ]),
        vertexShader: WaterVertexShader,
        fragmentShader: THREE.ShaderChunk['meshphong_frag']
    });
    material.lights = true;
    // 来自MeshPhongMaterial的属性
    material.color = new THREE.Color(materialColor);
    material.specular = new THREE.Color(0x111111);
    material.shininess = 50;
    // 根据材质的值设置uniforms
    material.uniforms.diffuse.value = material.color;
    material.uniforms.specular.value = material.specular;
    material.uniforms.shininess.value = Math.max(material.shininess, 1e-4);
    material.uniforms.opacity.value = material.opacity;
    // 设置Defines
    material.defines.WIDTH = WIDTH.toFixed(1);
    material.defines.BOUNDS = BOUNDS.toFixed(1);

    var waterUniforms = material.uniforms;

    // 创建网格
    THREE.Mesh.call(this, geometry, material);

    this.name = _t('Water');

    this.rotation.x = -Math.PI / 2;

    this.matrixAutoUpdate = false;
    this.updateMatrix();

    var gpuCompute = new THREE.GPUComputationRenderer(WIDTH, WIDTH, renderer);

    var heightmap0 = gpuCompute.createTexture();
    this.fillTexture(heightmap0, WIDTH);

    var heightmapVariable = gpuCompute.addVariable('heightmap', HeightmapFragmentShader, heightmap0);
    gpuCompute.setVariableDependencies(heightmapVariable, [heightmapVariable]);

    heightmapVariable.material.uniforms.mousePos = {
        value: new THREE.Vector2(10000, 10000)
    };
    heightmapVariable.material.uniforms.mouseSize = {
        value: 20.0
    };
    heightmapVariable.material.uniforms.viscosityConstant = {
        value: 0
    };
    heightmapVariable.material.defines.BOUNDS = BOUNDS.toFixed(1);

    var error = gpuCompute.init();
    if (error !== null) {
        console.error(error);
    }

    // var smoothShader = gpuCompute.createShaderMaterial(SmoothFragmentShader, {
    //     texture: {
    //         value: null
    //     }
    // });

    this.heightmapVariable = heightmapVariable;
    this.gpuCompute = gpuCompute;
    this.waterUniforms = waterUniforms;

    Object.assign(this.userData, {
        type: 'Water'
    });
}

Water.prototype = Object.create(THREE.Mesh.prototype);
Water.prototype.constructor = Water;

Water.prototype.fillTexture = function (texture, WIDTH) {
    var simplex = new THREE.SimplexNoise();

    var waterMaxHeight = 30;

    function noise(x, y) {
        var multR = waterMaxHeight;
        var mult = 0.025;
        var r = 0;
        for (var i = 0; i < 15; i++) {
            r += multR * simplex.noise(x * mult, y * mult);
            multR *= 0.53 + 0.025 * i;
            mult *= 1.25;
        }
        return r;
    }

    var pixels = texture.image.data;
    var p = 0;
    for (var j = 0; j < WIDTH; j++) {
        for (var i = 0; i < WIDTH; i++) {
            var x = i * 128 / WIDTH;
            var y = j * 128 / WIDTH;
            pixels[p + 0] = noise(x, y, 123.4);
            pixels[p + 1] = 0;
            pixels[p + 2] = 0;
            pixels[p + 3] = 1;
            p += 4;
        }
    }
};

Water.prototype.update = function () {
    var heightmapVariable = this.heightmapVariable;
    var gpuCompute = this.gpuCompute;
    var waterUniforms = this.waterUniforms;

    var uniforms = heightmapVariable.material.uniforms;
    uniforms.mousePos.value.set(10000, 10000);

    gpuCompute.compute();

    waterUniforms.heightmap.value = gpuCompute.getCurrentRenderTarget(heightmapVariable).texture;
};

export default Water;