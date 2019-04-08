import Renderer from './Renderer';
import AtmosphereVertex from './shader/atmosphere_vertex.glsl';
import AtmosphereFragment from './shader/atmosphere_fragment.glsl';
import WGS84 from '../core/WGS84';

/**
 * 大气层渲染器
 * @author tengge / https://github.com/tengge1
 * @param {*} globe 
 */
function AtmosphereRenderer(globe) {
    Renderer.call(this, globe);

    this.program = null;
    this.attributes = {};
    this.uniforms = {};
    this.buffers = {};

    this.indexCount = 0;

    this.initProgram();
    this.initBuffers();
}

AtmosphereRenderer.prototype = Object.create(Renderer.prototype);
AtmosphereRenderer.prototype.constructor = AtmosphereRenderer;

AtmosphereRenderer.prototype.initProgram = function () {
    var gl = this.gl;

    // 顶点着色器
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, AtmosphereVertex);
    gl.compileShader(vertexShader);

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.warn(gl.getShaderInfoLog(vertexShader));
        gl.deleteShader(vertexShader);
        return;
    }

    // 片源着色器
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, AtmosphereFragment);
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
        normal: gl.getAttribLocation(program, 'normal'),
        uv: gl.getAttribLocation(program, 'uv'),
    });

    Object.assign(this.uniforms, {
        modelViewMatrix: gl.getUniformLocation(program, 'modelViewMatrix'),
        projectionMatrix: gl.getUniformLocation(program, 'projectionMatrix'),
    });
};

AtmosphereRenderer.prototype.initBuffers = function () {
    var gl = this.gl;

    var geometry = new THREE.SphereBufferGeometry(WGS84.a * 1.02, 32, 32);
    var attributes = geometry.attributes;
    this.indexCount = geometry.index.count;

    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, attributes.position.array, gl.STATIC_DRAW);

    var normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, attributes.normal.array, gl.STATIC_DRAW);

    var uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, attributes.uv.array, gl.STATIC_DRAW);

    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, geometry.index.array, gl.STATIC_DRAW);

    Object.assign(this.buffers, {
        position: positionBuffer,
        normal: normalBuffer,
        uv: uvBuffer,
        index: indexBuffer,
    });
};

AtmosphereRenderer.prototype.render = function () {
    var gl = this.gl;
    var camera = this.camera;

    gl.useProgram(this.program);

    gl.disable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    gl.uniformMatrix4fv(this.uniforms.modelViewMatrix, false, camera.matrixWorldInverse.elements);
    gl.uniformMatrix4fv(this.uniforms.projectionMatrix, false, camera.projectionMatrix.elements);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.position);
    gl.enableVertexAttribArray(this.attributes.position);
    gl.vertexAttribPointer(this.attributes.position, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.normal);
    gl.enableVertexAttribArray(this.attributes.normal);
    gl.vertexAttribPointer(this.attributes.normal, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.uv);
    gl.enableVertexAttribArray(this.attributes.uv);
    gl.vertexAttribPointer(this.attributes.uv, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.index);
    gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
};

AtmosphereRenderer.prototype.dispose = function () {
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

export default AtmosphereRenderer;