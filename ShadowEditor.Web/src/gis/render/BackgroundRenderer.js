import Renderer from './Renderer';
import BackgroundVertex from './shader/background_vertex.glsl';
import BackgroundFragment from './shader/background_fragment.glsl';
import WGS84 from '../core/WGS84';

/**
 * 背景渲染器
 * @author tengge / https://github.com/tengge1
 * @param {*} globe 
 */
function BackgroundRenderer(globe) {
    Renderer.call(this, globe);

    this.program = null;
    this.attributes = {};
    this.uniforms = {};
    this.buffers = {};

    this.indexCount = 0;
    this.modelMatrix = new THREE.Matrix4();

    this.initProgram();
    this.initBuffers();
}

BackgroundRenderer.prototype = Object.create(Renderer.prototype);
BackgroundRenderer.prototype.constructor = BackgroundRenderer;

BackgroundRenderer.prototype.initProgram = function () {
    var gl = this.gl;

    // 顶点着色器
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, BackgroundVertex);
    gl.compileShader(vertexShader);

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.warn(gl.getShaderInfoLog(vertexShader));
        gl.deleteShader(vertexShader);
        return;
    }

    // 片源着色器
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, BackgroundFragment);
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
    });

    Object.assign(this.uniforms, {
        modelMatrix: gl.getUniformLocation(program, 'modelMatrix'),
        modelViewMatrix: gl.getUniformLocation(program, 'modelViewMatrix'),
        projectionMatrix: gl.getUniformLocation(program, 'projectionMatrix'),

        tCube: gl.getUniformLocation(program, 'tCube'),
        tFlip: gl.getUniformLocation(program, 'tFlip'),
    });
};

BackgroundRenderer.prototype.initBuffers = function () {
    var gl = this.gl;

    var geometry = new THREE.BoxBufferGeometry(1, 1, 1);
    var attributes = geometry.attributes;
    this.indexCount = geometry.index.count;

    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, attributes.position.array, gl.STATIC_DRAW);

    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, geometry.index.array, gl.STATIC_DRAW);

    Object.assign(this.buffers, {
        position: positionBuffer,
        index: indexBuffer,
    });
};

BackgroundRenderer.prototype.render = function () {
    var gl = this.gl;
    var camera = this.camera;

    this.modelMatrix.copyPosition(this.camera.matrixWorld);

    gl.useProgram(this.program);

    gl.disable(gl.CULL_FACE);
    gl.disable(gl.DEPTH_TEST);

    gl.uniformMatrix4fv(this.uniforms.modelMatrix, false, this.modelMatrix.elements);
    gl.uniformMatrix4fv(this.uniforms.modelViewMatrix, false, camera.matrixWorldInverse.elements);
    gl.uniformMatrix4fv(this.uniforms.projectionMatrix, false, camera.projectionMatrix.elements);

    gl.uniform1f(this.uniforms.tFlip, -1);

    // if (!n.texture && n.loaded) {
    //     var texture = gl.createTexture();
    //     gl.bindTexture(gl.TEXTURE_2D, texture);
    //     gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    //     gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, n.image);

    //     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    //     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

    //     gl.bindTexture(gl.TEXTURE_2D, null);

    //     n.texture = texture;
    // texImage2D(34069 + i, 0, glInternalFormat, glFormat, glType, cubeImage[ i ]);
    // glFormat: RGBFormat, glType: UnsignedByteType, 
    // }

    // if (n.texture) {
    //     gl.activeTexture(gl.TEXTURE0);
    //     gl.bindTexture(gl.TEXTURE_2D, n.texture);
    //     gl.uniform1i(this.uniforms.map, 0);
    // }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.position);
    gl.enableVertexAttribArray(this.attributes.position);
    gl.vertexAttribPointer(this.attributes.position, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.index);
    gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
};

BackgroundRenderer.prototype.dispose = function () {
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

export default BackgroundRenderer;