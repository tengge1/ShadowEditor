/**
* 三维对象的基类
*/
ZeroGIS.Object3D = function (args) {
    this.id = ++ZeroGIS.idCounter;
    this.matrix = new ZeroGIS.Matrix();
    this.parent = null;
    this.vertices = [];
    this.vertexBuffer = null;
    this.indices = [];
    this.indexBuffer = null;
    this.textureCoords = [];
    this.textureCoordBuffer = null;
    this.material = null;
    this.visible = true;
    if (args && args.material) {
        this.material = args.material;
    }
    this.createVerticeData(args);
};

ZeroGIS.Object3D.prototype = {
    constructor: ZeroGIS.Object3D,

    /**
     * 根据传入的参数生成vertices和indices，然后通过调用setBuffers初始化buffer
     * @param params 传入的参数
     */
    createVerticeData: function (params) {
        /*var infos = {
            vertices:vertices,
            indices:indices
        };
        this.setBuffers(infos);*/
    },

    /**
     * 设置buffer，由createVerticeData函数调用
     * @param infos 包含vertices和indices信息，由createVerticeData传入参数
     */
    setBuffers: function (infos) {
        if (infos) {
            this.vertices = infos.vertices || [];
            this.indices = infos.indices || [];
            this.textureCoords = infos.textureCoords || [];
            if (this.vertices.length > 0 && this.indices.length > 0) {
                if (!(gl.isBuffer(this.vertexBuffer))) {
                    this.vertexBuffer = gl.createBuffer();
                }
                gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

                if (!(gl.isBuffer(this.indexBuffer))) {
                    this.indexBuffer = gl.createBuffer();
                }
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
            }

            //使用纹理
            if (this.material instanceof ZeroGIS.TextureMaterial) {
                if (this.textureCoords.length > 0) { //提供了纹理坐标
                    if (!(gl.isBuffer(this.textureCoordBuffer))) {
                        this.textureCoordBuffer = gl.createBuffer();
                    }
                    gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textureCoords), gl.STATIC_DRAW);
                }
            }
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    },

    setShaderMatrix: function (camera) {
        // if (!(camera instanceof PerspectiveCamera)) {
        //   throw "invalid camera : not World.PerspectiveCamera";
        // }
        camera.viewMatrix = (camera.viewMatrix instanceof ZeroGIS.Matrix) ? camera.viewMatrix : camera.getViewMatrix();
        var mvMatrix = camera.viewMatrix.multiplyMatrix(this.matrix);
        gl.uniformMatrix4fv(gl.shaderProgram.uMVMatrix, false, mvMatrix.elements);
        gl.uniformMatrix4fv(gl.shaderProgram.uPMatrix, false, camera.projMatrix.elements);
    },

    draw: function (camera) {
        // if (!(camera instanceof PerspectiveCamera)) {
        //   throw "invalid camera : not World.PerspectiveCamera";
        // }
        if (this.visible) {
            if (this.material instanceof ZeroGIS.TextureMaterial && this.material.loaded) {
                gl.enableVertexAttribArray(gl.shaderProgram.aTextureCoord);
                gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
                gl.vertexAttribPointer(gl.shaderProgram.aTextureCoord, 2, gl.FLOAT, false, 0, 0);

                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, this.material.texture);
                gl.uniform1i(gl.shaderProgram.uSampler, 0);

                this.setShaderMatrix(camera);

                //往shader中对vertex赋值
                gl.enableVertexAttribArray(gl.shaderProgram.aVertexPosition);
                gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
                gl.vertexAttribPointer(gl.shaderProgram.aVertexPosition, 3, gl.FLOAT, false, 0, 0);

                //设置索引，但不用往shader中赋值
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
                //绘图
                gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);

                gl.bindBuffer(gl.ARRAY_BUFFER, null);
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
                gl.bindTexture(gl.TEXTURE_2D, null);
            }
        }
    },

    //释放显存中的buffer资源
    releaseBuffers: function () {
        //释放显卡中的资源
        if (gl.isBuffer(this.vertexBuffer)) {
            gl.deleteBuffer(this.vertexBuffer);
        }
        if (gl.isBuffer(this.indexBuffer)) {
            gl.deleteBuffer(this.indexBuffer);
        }
        if (gl.isBuffer(this.textureCoordBuffer)) {
            gl.deleteBuffer(this.textureCoordBuffer);
        }
        this.vertexBuffer = null;
        this.indexBuffer = null;
        this.textureCoordBuffer = null;
    },

    destroy: function () {
        this.parent = null;
        this.releaseBuffers();
        if (this.material instanceof ZeroGIS.TextureMaterial) {
            this.material.releaseTexture();
            this.material = null;
        }
    },

    //需要子类重写
    getPosition: function () {
        var position = this.matrix.getColumnTrans();
        return position;
    },

    //需要子类重写
    setPosition: function (x, y, z) {
        this.matrix.setColumnTrans(x, y, z);
    },

    worldTranslate: function (x, y, z) {
        this.matrix.worldTranslate(x, y, z);
    },

    localTranslate: function (x, y, z) {
        this.matrix.localTranslate(x, y, z);
    },

    worldScale: function (scaleX, scaleY, scaleZ) {
        this.matrix.worldScale(scaleX, scaleY, scaleZ);
    },

    localScale: function (scaleX, scaleY, scaleZ) {
        this.matrix.localScale(scaleX, scaleY, scaleZ);
    },

    worldRotateX: function (radian) {
        this.matrix.worldRotateX(radian);
    },

    worldRotateY: function (radian) {
        this.matrix.worldRotateY(radian);
    },

    worldRotateZ: function (radian) {
        this.matrix.worldRotateZ(radian);
    },

    worldRotateByVector: function (radian, vector) {
        this.matrix.worldRotateByVector(radian, vector);
    },

    localRotateX: function (radian) {
        this.matrix.localRotateX(radian);
    },

    localRotateY: function (radian) {
        this.matrix.localRotateY(radian);
    },

    localRotateZ: function (radian) {
        this.matrix.localRotateZ(radian);
    },

    //localVector指的是相对于模型坐标系中的向量
    localRotateByVector: function (radian, localVector) {
        this.matrix.localRotateByVector(radian, localVector);
    },

    getXAxisDirection: function () {
        var columnX = this.matrix.getColumnX(); //Vertice
        var directionX = columnX.getVector(); //Vector
        directionX.normalize();
        return directionX;
    },

    getYAxisDirection: function () {
        var columnY = this.matrix.getColumnY();
        var directionY = columnY.getVector();
        directionY.normalize();
        return directionY;
    },

    getZAxisDirection: function () {
        var columnZ = this.matrix.getColumnZ();
        var directionZ = columnZ.getVector();
        directionZ.normalize();
        return directionZ;
    }
};
