import Renderer from './Renderer';
import SphereTileCreator from '../tile/SphereTileCreator';
import TiledVertex from './shader/tiled_vertex.glsl';
import TiledFragment from './shader/tiled_fragment.glsl';
// import WGS84 from '../core/WGS84';

/**
 * 瓦片图层渲染器
 * @author tengge / https://github.com/tengge1
 * @param {*} globe 地球
 */
function TiledLayerRenderer(globe) {
    Renderer.call(this, globe);

    this.creator = new SphereTileCreator(this.globe);

    this.geometry = new THREE.PlaneBufferGeometry(1, 1, 16, 16);
    this.modelMatrix = new THREE.Matrix4();

    this.program = null;
    this.attributes = {};
    this.uniforms = {};
    this.buffers = {};

    this.tiles = [];

    this.initProgram();
    this.initBuffers();
}

TiledLayerRenderer.prototype = Object.create(Renderer.prototype);
TiledLayerRenderer.prototype.constructor = TiledLayerRenderer;

TiledLayerRenderer.prototype.initProgram = function () {
    var gl = this.gl;

    // 顶点着色器
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, TiledVertex);
    gl.compileShader(vertexShader);

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.warn(gl.getShaderInfoLog(vertexShader));
        gl.deleteShader(vertexShader);
        return;
    }

    // 片源着色器
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, TiledFragment);
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
        uv: gl.getAttribLocation(program, 'uv')
    });

    Object.assign(this.uniforms, {
        modelMatrix: gl.getUniformLocation(program, 'modelMatrix'),
        viewMatrix: gl.getUniformLocation(program, 'viewMatrix'),
        projectionMatrix: gl.getUniformLocation(program, 'projectionMatrix'),
        x: gl.getUniformLocation(program, 'x'),
        y: gl.getUniformLocation(program, 'y'),
        z: gl.getUniformLocation(program, 'z'),
        map: gl.getUniformLocation(program, 'map')
    });
};

TiledLayerRenderer.prototype.initBuffers = function () {
    var gl = this.gl;
    var geometry = this.geometry;
    var attributes = geometry.attributes;

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
        index: indexBuffer
    });
};

TiledLayerRenderer.prototype.render = function () {
    this.creator.get(this.tiles);
    this.renderMesh();
    this.renderer.state.reset();
};

TiledLayerRenderer.prototype.renderMesh = function () {
    var gl = this.gl;
    var camera = this.camera;

    gl.useProgram(this.program);

    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CW);

    gl.enable(gl.DEPTH_TEST);
    // gl.depthFunc(gl.LEQUAL);
    // gl.depthMask(true);
    gl.disable(gl.BLEND);

    gl.uniformMatrix4fv(this.uniforms.modelMatrix, false, this.modelMatrix.elements);
    gl.uniformMatrix4fv(this.uniforms.viewMatrix, false, camera.matrixWorldInverse.elements);
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

    // x, y, z
    this.tiles.forEach(tile => {
        tile.images.forEach(n => {
            gl.uniform1i(this.uniforms.x, n._x);
            gl.uniform1i(this.uniforms.y, n._y);
            gl.uniform1i(this.uniforms.z, n._z);

            if (!n.texture) {
                var texture = gl.createTexture();
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, n);

                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

                n.texture = texture;
            }

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, n.texture);
            gl.uniform1i(this.uniforms.map, 0);

            gl.drawElements(gl.TRIANGLES, this.geometry.index.count, gl.UNSIGNED_SHORT, 0);
        });
    });

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
};

TiledLayerRenderer.prototype.dispose = function () {
    this.gl.deleteProgram(this.program);

    this.program = null;
    this.attributes = {};
    this.uniforms = {};

    Object.values(this.buffers).forEach(n => {
        this.gl.deleteBuffer(n);
    });

    this.buffers = {};

    this.creator.dispose();

    Renderer.prototype.dispose.call(this);
};

export default TiledLayerRenderer;