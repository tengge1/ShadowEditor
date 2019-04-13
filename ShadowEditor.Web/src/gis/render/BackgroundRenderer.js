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
    this.texture = null;

    this.indexCount = 0;
    this.modelMatrix = new THREE.Matrix4();

    this.initProgram();
    this.initBuffers();
    this.initTextures();
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

    var geometry = new THREE.BoxBufferGeometry(WGS84.a * 5, WGS84.a * 5, WGS84.a * 5);
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

BackgroundRenderer.prototype.initTextures = function () {
    var gl = this.gl;

    var urls = [
        'assets/textures/MilkyWay/dark-s_px.jpg',
        'assets/textures/MilkyWay/dark-s_nx.jpg',
        'assets/textures/MilkyWay/dark-s_py.jpg',
        'assets/textures/MilkyWay/dark-s_ny.jpg',
        'assets/textures/MilkyWay/dark-s_pz.jpg',
        'assets/textures/MilkyWay/dark-s_nz.jpg',
    ];

    // 创建立方体纹理
    var texture = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);

    var promises = urls.map(n => {
        return this.createImage(n);
    });

    Promise.all(promises).then(imgs => {
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, imgs[0]);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, imgs[1]);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, imgs[2]);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, imgs[3]);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, imgs[4]);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, imgs[5]);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);

        this.texture = texture;
    });
};

BackgroundRenderer.prototype.createImage = function (url) {
    var img = document.createElement('img');
    img.src = url;

    return new Promise(resolve => {
        img.onload = () => {
            img.onload = null;
            resolve(img);
        };
    });
};

BackgroundRenderer.prototype.render = function () {
    if (!this.texture) {
        return;
    }

    var gl = this.gl;
    var camera = this.camera;

    this.modelMatrix.copyPosition(this.camera.matrixWorld);

    gl.useProgram(this.program);

    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.FRONT);
    gl.frontFace(gl.CCW);
    gl.disable(gl.DEPTH_TEST);

    gl.uniformMatrix4fv(this.uniforms.modelMatrix, false, this.modelMatrix.elements);
    gl.uniformMatrix4fv(this.uniforms.modelViewMatrix, false, camera.matrixWorldInverse.elements);
    gl.uniformMatrix4fv(this.uniforms.projectionMatrix, false, camera.projectionMatrix.elements);

    gl.uniform1f(this.uniforms.tFlip, -1);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
    gl.uniform1i(this.uniforms.tCube, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.position);
    gl.enableVertexAttribArray(this.attributes.position);
    gl.vertexAttribPointer(this.attributes.position, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.index);
    gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);

    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
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