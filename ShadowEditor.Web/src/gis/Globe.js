import GlobeGeometry from './GlobeGeometry';
import GlobeMaterial from './GlobeMaterial';

/**
 * 地球
 * @param {*} app 
 */
function Globe(app) {
    this.app = app;
}

Globe.prototype.start = function () {
    var renderer = this.app.editor.renderer;

    var geometry = new GlobeGeometry();
    var material = new GlobeMaterial();

    var gl = renderer.context;

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, material.vertexShader);
    gl.compileShader(vertexShader);

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, material.fragmentShader);
    gl.compileShader(fragmentShader);

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    var positionAttr = gl.getAttribLocation(program, 'position');
    var normalAttr = gl.getAttribLocation(program, 'normal');
    var uvAttr = gl.getAttribLocation(program, 'uv');

    // gl.enableVertexAttribArray(positionAttr);
    // gl.enableVertexAttribArray(normalAttr);
    // gl.enableVertexAttribArray(uvAttr);

    var modelViewMatrixUniform = gl.getUniformLocation(program, 'modelViewMatrix');
    var projectionMatrixUniform = gl.getUniformLocation(program, 'projectionMatrix');

    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, geometry.attributes.position.array, gl.STATIC_DRAW);

    var normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, geometry.attributes.normal.array, gl.STATIC_DRAW);

    var uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, geometry.attributes.uv.array, gl.STATIC_DRAW);

    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, geometry.index.array, gl.STATIC_DRAW);

    // gl.bindBuffer(gl.ARRAY_BUFFER, null);
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    this.program = program;

    this.positionAttr = positionAttr;
    this.normalAttr = normalAttr;
    this.uvAttr = uvAttr;

    this.modelViewMatrixUniform = modelViewMatrixUniform;
    this.projectionMatrixUniform = projectionMatrixUniform;

    this.positionBuffer = positionBuffer;
    this.normalBuffer = normalBuffer;
    this.uvBuffer = uvBuffer;
    this.indexBuffer = indexBuffer;

    this.app.on(`afterRender`, this.onAfterRender.bind(this));
};

Globe.prototype.onAfterRender = function () {
    var scene = this.scene;
    var camera = this.app.editor.camera;
    var renderer = this.app.editor.renderer;

    var gl = renderer.context;

    renderer.state.useProgram(this.program);

    gl.uniformMatrix4fv(this.modelViewMatrixUniform, false, camera.matrixWorldInverse.elements);
    gl.uniformMatrix4fv(this.projectionMatrixUniform, false, camera.projectionMatrix.elements);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.enableVertexAttribArray(this.positionAttr);
    gl.vertexAttribPointer(this.positionAttr, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    gl.enableVertexAttribArray(this.normalAttr);
    gl.vertexAttribPointer(this.normalAttr, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
    gl.enableVertexAttribArray(this.uvAttr);
    gl.vertexAttribPointer(this.uvAttr, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
};

export default Globe;