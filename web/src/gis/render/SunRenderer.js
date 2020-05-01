import Renderer from './Renderer';
import SunVertex from './shader/sun_vertex.glsl';
import SunFragment from './shader/sun_fragment.glsl';
// import WGS84 from '../core/WGS84';

/**
 * 太阳渲染器
 * @author tengge / https://github.com/tengge1
 * @param {*} globe 地球
 */
function SunRenderer(globe) {
    Renderer.call(this, globe);

    this.program = null;
    this.attributes = {};
    this.uniforms = {};
    this.buffers = {};
    this.texture = null;

    this.indexCount = 0;

    this.initProgram();
    this.initBuffers();
    this.initTextures();
}

SunRenderer.prototype = Object.create(Renderer.prototype);
SunRenderer.prototype.constructor = SunRenderer;

SunRenderer.prototype.initProgram = function () {
    var gl = this.gl;

    // 顶点着色器
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, SunVertex);
    gl.compileShader(vertexShader);

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.warn(gl.getShaderInfoLog(vertexShader));
        gl.deleteShader(vertexShader);
        return;
    }

    // 片源着色器
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, SunFragment);
    gl.compileShader(fragmentShader);

    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.warn(gl.getShaderInfoLog(fragmentShader));
        gl.deleteShader(fragmentShader);
        return;
    }

    // 着色器程序
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.warn("Could not initialise shaders");
        gl.deleteProgram(program);
        return;
    }

    // 使用着色器程序
    gl.useProgram(program);
    this.program = program;

    // 获取attributes和uniform信息
    Object.assign(this.attributes, {
        position: gl.getAttribLocation(program, 'position'),
        uv: gl.getAttribLocation(program, 'uv')
    });

    Object.assign(this.uniforms, {
        modelViewMatrix: gl.getUniformLocation(program, 'modelViewMatrix'),
        projectionMatrix: gl.getUniformLocation(program, 'projectionMatrix'),
        sunPosition: gl.getUniformLocation(program, 'sunPosition'),
        map: gl.getUniformLocation(program, 'map')
    });
};

SunRenderer.prototype.initBuffers = function () {
    var gl = this.gl;

    var geometry = new THREE.PlaneBufferGeometry(0.4, 0.4);
    var attributes = geometry.attributes;
    this.indexCount = geometry.index.count;

    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, attributes.position.array, gl.STATIC_DRAW);

    var uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, attributes.uv.array, gl.STATIC_DRAW);

    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, geometry.index.array, gl.STATIC_DRAW);

    Object.assign(this.buffers, {
        position: positionBuffer,
        uv: uvBuffer,
        index: indexBuffer
    });
};

SunRenderer.prototype.initTextures = function () {
    var gl = this.gl;

    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    var img = document.createElement('img');

    img.onload = () => {
        img.onload = null;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        this.texture = texture;
    };

    img.src = 'assets/textures/lensflare/lensflare0_alpha.png';
};

SunRenderer.prototype.render = function () {
    if (!this.texture) {
        return;
    }

    var gl = this.gl;
    var camera = this.camera;

    gl.useProgram(this.program);

    gl.disable(gl.CULL_FACE);
    gl.cullFace(gl.FRONT);
    gl.frontFace(gl.CCW);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    gl.uniformMatrix4fv(this.uniforms.modelViewMatrix, false, camera.matrixWorldInverse.elements);
    gl.uniformMatrix4fv(this.uniforms.projectionMatrix, false, camera.projectionMatrix.elements);
    gl.uniform3f(this.uniforms.sunPosition, this.globe.sunPosition.x, this.globe.sunPosition.y, this.globe.sunPosition.z);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.uniform1i(this.uniforms.map, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.position);
    gl.enableVertexAttribArray(this.attributes.position);
    gl.vertexAttribPointer(this.attributes.position, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.uv);
    gl.enableVertexAttribArray(this.attributes.uv);
    gl.vertexAttribPointer(this.attributes.uv, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.index);
    gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);

    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
};

SunRenderer.prototype.dispose = function () {
    this.gl.deleteProgram(this.program);

    this.program = null;
    this.attributes = {};
    this.uniforms = {};

    Object.values(this.buffers).forEach(n => {
        this.gl.deleteBuffer(n);
    });

    this.buffers = {};

    Renderer.prototype.dispose.call(this);
};

export default SunRenderer;