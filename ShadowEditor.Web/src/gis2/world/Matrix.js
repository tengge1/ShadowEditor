define(["require", "world/Utils", "world/Vertice", "world/Vector"], function(require, Utils, Vertice, Vector) {

  var Matrix = function(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
    this.elements = new Float32Array(16);

    this.setElements(
      (m11 === undefined ? 1 : m11), (m12 === undefined ? 0 : m12), (m13 === undefined ? 0 : m13), (m14 === undefined ? 0 : m14),
      (m21 === undefined ? 0 : m21), (m22 === undefined ? 1 : m22), (m23 === undefined ? 0 : m23), (m24 === undefined ? 0 : m24),
      (m31 === undefined ? 0 : m31), (m32 === undefined ? 0 : m32), (m33 === undefined ? 1 : m33), (m34 === undefined ? 0 : m34),
      (m41 === undefined ? 0 : m41), (m42 === undefined ? 0 : m42), (m43 === undefined ? 0 : m43), (m44 === undefined ? 1 : m44)
    );
  };

  Matrix.prototype = {
    constructor: Matrix,

    setElements: function(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
      var count = arguments.length;
      if (count < 16) {
        throw "invalid arguments:arguments length error";
      }
      for (var i = 0; i < count; i++) {
        if (!Utils.isNumber(arguments[i])) {
          throw "invalid arguments[" + i + "]";
        }
      }
      var values = this.elements;
      values[0] = m11;
      values[4] = m12;
      values[8] = m13;
      values[12] = m14;
      values[1] = m21;
      values[5] = m22;
      values[9] = m23;
      values[13] = m24;
      values[2] = m31;
      values[6] = m32;
      values[10] = m33;
      values[14] = m34;
      values[3] = m41;
      values[7] = m42;
      values[11] = m43;
      values[15] = m44;
      return this;
    },

    setColumnX: function(x, y, z) {
      if (!Utils.isNumber(x)) {
        throw "invalid x";
      }
      if (!Utils.isNumber(y)) {
        throw "invalid y";
      }
      if (!Utils.isNumber(z)) {
        throw "invalid z";
      }
      this.elements[0] = x;
      this.elements[1] = y;
      this.elements[2] = z;
    },

    getColumnX: function() {
      return new Vertice(this.elements[0], this.elements[1], this.elements[2]);
    },

    setColumnY: function(x, y, z) {
      if (!Utils.isNumber(x)) {
        throw "invalid x";
      }
      if (!Utils.isNumber(y)) {
        throw "invalid y";
      }
      if (!Utils.isNumber(z)) {
        throw "invalid z";
      }
      this.elements[4] = x;
      this.elements[5] = y;
      this.elements[6] = z;
    },

    getColumnY: function() {
      return new Vertice(this.elements[4], this.elements[5], this.elements[6]);
    },

    setColumnZ: function(x, y, z) {
      if (!Utils.isNumber(x)) {
        throw "invalid x";
      }
      if (!Utils.isNumber(y)) {
        throw "invalid y";
      }
      if (!Utils.isNumber(z)) {
        throw "invalid z";
      }
      this.elements[8] = x;
      this.elements[9] = y;
      this.elements[10] = z;
    },

    getColumnZ: function() {
      return new Vertice(this.elements[8], this.elements[9], this.elements[10]);
    },

    setColumnTrans: function(x, y, z) {
      if (!Utils.isNumber(x)) {
        throw "invalid x";
      }
      if (!Utils.isNumber(y)) {
        throw "invalid y";
      }
      if (!Utils.isNumber(z)) {
        throw "invalid z";
      }
      this.elements[12] = x;
      this.elements[13] = y;
      this.elements[14] = z;
    },

    getColumnTrans: function() {
      return new Vertice(this.elements[12], this.elements[13], this.elements[14]);
    },

    setLastRowDefault: function() {
      this.elements[3] = 0;
      this.elements[7] = 0;
      this.elements[11] = 0;
      this.elements[15] = 1;
    },

    //对当前矩阵进行转置，并对当前矩阵产生影响
    transpose: function() {
      var result = this.getTransposeMatrix();
      this.setMatrixByOther(result);
    },

    //返回当前矩阵的转置矩阵,不对当前矩阵产生影响
    getTransposeMatrix: function() {
      var result = new Matrix();
      result.elements[0] = this.elements[0];
      result.elements[4] = this.elements[1];
      result.elements[8] = this.elements[2];
      result.elements[12] = this.elements[3];

      result.elements[1] = this.elements[4];
      result.elements[5] = this.elements[5];
      result.elements[9] = this.elements[6];
      result.elements[13] = this.elements[7];

      result.elements[2] = this.elements[8];
      result.elements[6] = this.elements[9];
      result.elements[10] = this.elements[10];
      result.elements[14] = this.elements[11];

      result.elements[3] = this.elements[12];
      result.elements[7] = this.elements[13];
      result.elements[11] = this.elements[14];
      result.elements[15] = this.elements[15];
      return result;
    },

    //对当前矩阵进行取逆操作，并对当前矩阵产生影响
    inverse: function() {
      var result = this.getInverseMatrix();
      this.setMatrixByOther(result);
    },

    //返回当前矩阵的逆矩阵，不对当前矩阵产生影响
    getInverseMatrix: function() {
      var a = this.elements;
      var result = new Matrix();
      var b = result.elements;
      var c = a[0],
        d = a[1],
        e = a[2],
        g = a[3],
        f = a[4],
        h = a[5],
        i = a[6],
        j = a[7],
        k = a[8],
        l = a[9],
        n = a[10],
        o = a[11],
        m = a[12],
        p = a[13],
        r = a[14],
        s = a[15];
      var A = c * h - d * f;
      var B = c * i - e * f;
      var t = c * j - g * f;
      var u = d * i - e * h;
      var v = d * j - g * h;
      var w = e * j - g * i;
      var x = k * p - l * m;
      var y = k * r - n * m;
      var z = k * s - o * m;
      var C = l * r - n * p;
      var D = l * s - o * p;
      var E = n * s - o * r;
      var q = A * E - B * D + t * C + u * z - v * y + w * x;
      if (!q) return null;
      q = 1 / q;
      b[0] = (h * E - i * D + j * C) * q;
      b[1] = (-d * E + e * D - g * C) * q;
      b[2] = (p * w - r * v + s * u) * q;
      b[3] = (-l * w + n * v - o * u) * q;
      b[4] = (-f * E + i * z - j * y) * q;
      b[5] = (c * E - e * z + g * y) * q;
      b[6] = (-m * w + r * t - s * B) * q;
      b[7] = (k * w - n * t + o * B) * q;
      b[8] = (f * D - h * z + j * x) * q;
      b[9] = (-c * D + d * z - g * x) * q;
      b[10] = (m * v - p * t + s * A) * q;
      b[11] = (-k * v + l * t - o * A) * q;
      b[12] = (-f * C + h * y - i * x) * q;
      b[13] = (c * C - d * y + e * x) * q;
      b[14] = (-m * u + p * B - r * A) * q;
      b[15] = (k * u - l * B + n * A) * q;
      return result;
    },

    setMatrixByOther: function(otherMatrix) {
      if (!(otherMatrix instanceof Matrix)) {
        throw "invalid otherMatrix";
      }
      for (var i = 0; i < otherMatrix.elements.length; i++) {
        this.elements[i] = otherMatrix.elements[i];
      }
    },

    /**
     * 将矩阵设置为单位阵
     */
    setUnitMatrix: function() {
      this.setElements(1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1);
    },

    /**
     * 判断矩阵是否为单位阵
     * @returns {boolean}
     */
    isUnitMatrix: function() {
      var values = this.elements;
      for (var i = 0; i < values.length; i++) {
        if (i % 4 === 0) {
          if (values[i] != 1) {
            //斜对角线上的值需要为1
            return false;
          }
        } else {
          if (values[i] !== 0) {
            //非斜对角线上的值需要为0
            return false;
          }
        }
      }
      return true;
    },

    copy: function() {
      return new Matrix(this.elements[0], this.elements[4], this.elements[8], this.elements[12],
        this.elements[1], this.elements[5], this.elements[9], this.elements[13],
        this.elements[2], this.elements[6], this.elements[10], this.elements[14],
        this.elements[3], this.elements[7], this.elements[11], this.elements[15]);
    },

    multiplyMatrix: function(otherMatrix) {
      if (!(otherMatrix instanceof Matrix)) {
        throw "invalid otherMatrix";
      }
      var values1 = this.elements;
      var values2 = otherMatrix.elements;
      var m11 = values1[0] * values2[0] + values1[4] * values2[1] + values1[8] * values2[2] + values1[12] * values2[3];
      var m12 = values1[0] * values2[4] + values1[4] * values2[5] + values1[8] * values2[6] + values1[12] * values2[7];
      var m13 = values1[0] * values2[8] + values1[4] * values2[9] + values1[8] * values2[10] + values1[12] * values2[11];
      var m14 = values1[0] * values2[12] + values1[4] * values2[13] + values1[8] * values2[14] + values1[12] * values2[15];
      var m21 = values1[1] * values2[0] + values1[5] * values2[1] + values1[9] * values2[2] + values1[13] * values2[3];
      var m22 = values1[1] * values2[4] + values1[5] * values2[5] + values1[9] * values2[6] + values1[13] * values2[7];
      var m23 = values1[1] * values2[8] + values1[5] * values2[9] + values1[9] * values2[10] + values1[13] * values2[11];
      var m24 = values1[1] * values2[12] + values1[5] * values2[13] + values1[9] * values2[14] + values1[13] * values2[15];
      var m31 = values1[2] * values2[0] + values1[6] * values2[1] + values1[10] * values2[2] + values1[14] * values2[3];
      var m32 = values1[2] * values2[4] + values1[6] * values2[5] + values1[10] * values2[6] + values1[14] * values2[7];
      var m33 = values1[2] * values2[8] + values1[6] * values2[9] + values1[10] * values2[10] + values1[14] * values2[11];
      var m34 = values1[2] * values2[12] + values1[6] * values2[13] + values1[10] * values2[14] + values1[14] * values2[15];
      var m41 = values1[3] * values2[0] + values1[7] * values2[1] + values1[11] * values2[2] + values1[15] * values2[3];
      var m42 = values1[3] * values2[4] + values1[7] * values2[5] + values1[11] * values2[6] + values1[15] * values2[7];
      var m43 = values1[3] * values2[8] + values1[7] * values2[9] + values1[11] * values2[10] + values1[15] * values2[11];
      var m44 = values1[3] * values2[12] + values1[7] * values2[13] + values1[11] * values2[14] + values1[15] * values2[15];
      return new Matrix(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44);
    },

    /**
     * 计算矩阵与列向量的乘积
     * @param c 四元数组
     * @return {Matrix} 列向量，四元数组
     */
    multiplyColumn: function(c) {
      var valid = Utils.isArray(c) && c.length == 4;
      if (!valid) {
        throw "invalid c";
      }
      var values1 = this.elements;
      var values2 = c;
      var m11 = values1[0] * values2[0] + values1[4] * values2[1] + values1[8] * values2[2] + values1[12] * values2[3];
      var m21 = values1[1] * values2[0] + values1[5] * values2[1] + values1[9] * values2[2] + values1[13] * values2[3];
      var m31 = values1[2] * values2[0] + values1[6] * values2[1] + values1[10] * values2[2] + values1[14] * values2[3];
      var m41 = values1[3] * values2[0] + values1[7] * values2[1] + values1[11] * values2[2] + values1[15] * values2[3];
      return [m11, m21, m31, m41];
    },

    divide: function(a) {
      if (!Utils.isNumber(a)) {
        throw "invalid a:a is not number";
      }
      if (a === 0) {
        throw "invalid a:a is 0";
      }
      if (a !== 0) {
        for (var i = 0, length = this.elements.length; i < length; i++) {
          this.elements[i] /= a;
        }
      }
    },

    worldTranslate: function(x, y, z) {
      if (!Utils.isNumber(x)) {
        throw "invalid x";
      }
      if (!Utils.isNumber(y)) {
        throw "invalid y";
      }
      if (!Utils.isNumber(z)) {
        throw "invalid z";
      }
      this.elements[12] += x;
      this.elements[13] += y;
      this.elements[14] += z;
    },

    localTranslate: function(x, y, z) {
      if (!Utils.isNumber(x)) {
        throw "invalid x";
      }
      if (!Utils.isNumber(y)) {
        throw "invalid y";
      }
      if (!Utils.isNumber(z)) {
        throw "invalid z";
      }
      var localColumn = [x, y, z, 1];
      var worldColumn = this.multiplyColumn(localColumn);
      var origin = this.getPosition();
      this.worldTranslate(worldColumn[0] - origin.x, worldColumn[1] - origin.y, worldColumn[2] - origin.z);
    },

    worldScale: function(scaleX, scaleY, scaleZ) {
      scaleX = (scaleX !== undefined) ? scaleX : 1;
      scaleY = (scaleY !== undefined) ? scaleY : 1;
      scaleZ = (scaleZ !== undefined) ? scaleZ : 1;
      if (!Utils.isNumber(scaleX)) {
        throw "invalid x";
      }
      if (!Utils.isNumber(scaleY)) {
        throw "invalid y";
      }
      if (!Utils.isNumber(scaleZ)) {
        throw "invalid z";
      }
      var m = new Matrix(scaleX, 0, 0, 0,
        0, scaleY, 0, 0,
        0, 0, scaleZ, 0,
        0, 0, 0, 1);
      var result = m.multiplyMatrix(this);
      this.setMatrixByOther(result);
    },

    localScale: function(scaleX, scaleY, scaleZ) {
      var transVertice = this.getColumnTrans();
      this.setColumnTrans(0, 0, 0);
      this.worldScale(scaleX, scaleY, scaleZ);
      this.setColumnTrans(transVertice.x, transVertice.y, transVertice.z);
    },

    worldRotateX: function(radian) {
      if (!Utils.isNumber(radian)) {
        throw "invalid radian";
      }
      var c = Math.cos(radian);
      var s = Math.sin(radian);
      var m = new Matrix(1, 0, 0, 0,
        0, c, -s, 0,
        0, s, c, 0,
        0, 0, 0, 1);
      var result = m.multiplyMatrix(this);
      this.setMatrixByOther(result);
    },

    worldRotateY: function(radian) {
      if (!Utils.isNumber(radian)) {
        throw "invalid radian:not number";
      }
      var c = Math.cos(radian);
      var s = Math.sin(radian);
      var m = new Matrix(c, 0, s, 0,
        0, 1, 0, 0, -s, 0, c, 0,
        0, 0, 0, 1);
      var result = m.multiplyMatrix(this);
      this.setMatrixByOther(result);
    },

    worldRotateZ: function(radian) {
      if (!Utils.isNumber(radian)) {
        throw "invalid radian:not number";
      }
      var c = Math.cos(radian);
      var s = Math.sin(radian);
      var m = new Matrix(c, -s, 0, 0,
        s, c, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1);
      var result = m.multiplyMatrix(this);
      this.setMatrixByOther(result);
    },

    worldRotateByVector: function(radian, vector) {
      if (!Utils.isNumber(radian)) {
        throw "invalid radian:not number";
      }
      if (!(vector instanceof Vector)) {
        throw "invalid vector:not Vector";
      }
      var x = vector.x;
      var y = vector.y;
      var z = vector.z;

      var length, s, c;
      var xx, yy, zz, xy, yz, zx, xs, ys, zs, one_c;

      s = Math.sin(radian);
      c = Math.cos(radian);

      length = Math.sqrt(x * x + y * y + z * z);

      // Rotation matrix is normalized
      x /= length;
      y /= length;
      z /= length;

      xx = x * x;
      yy = y * y;
      zz = z * z;
      xy = x * y;
      yz = y * z;
      zx = z * x;
      xs = x * s;
      ys = y * s;
      zs = z * s;
      one_c = 1.0 - c;

      var m11 = (one_c * xx) + c; //M(0,0)
      var m12 = (one_c * xy) - zs; //M(0,1)
      var m13 = (one_c * zx) + ys; //M(0,2)
      var m14 = 0.0; //M(0,3) 表示平移X

      var m21 = (one_c * xy) + zs; //M(1,0)
      var m22 = (one_c * yy) + c; //M(1,1)
      var m23 = (one_c * yz) - xs; //M(1,2)
      var m24 = 0.0; //M(1,3)  表示平移Y

      var m31 = (one_c * zx) - ys; //M(2,0)
      var m32 = (one_c * yz) + xs; //M(2,1)
      var m33 = (one_c * zz) + c; //M(2,2)
      var m34 = 0.0; //M(2,3)  表示平移Z

      var m41 = 0.0; //M(3,0)
      var m42 = 0.0; //M(3,1)
      var m43 = 0.0; //M(3,2)
      var m44 = 1.0; //M(3,3)

      var mat = new Matrix(m11, m12, m13, m14,
        m21, m22, m23, m24,
        m31, m32, m33, m34,
        m41, m42, m43, m44);
      var result = mat.multiplyMatrix(this);
      this.setMatrixByOther(result);
    },

    localRotateX: function(radian) {
      if (!Utils.isNumber(radian)) {
        throw "invalid radian:not number";
      }
      var transVertice = this.getColumnTrans();
      this.setColumnTrans(0, 0, 0);
      var columnX = this.getColumnX().getVector();
      this.worldRotateByVector(radian, columnX);
      this.setColumnTrans(transVertice.x, transVertice.y, transVertice.z);
    },

    localRotateY: function(radian) {
      if (!Utils.isNumber(radian)) {
        throw "invalid radian:not number";
      }
      var transVertice = this.getColumnTrans();
      this.setColumnTrans(0, 0, 0);
      var columnY = this.getColumnY().getVector();
      this.worldRotateByVector(radian, columnY);
      this.setColumnTrans(transVertice.x, transVertice.y, transVertice.z);
    },

    localRotateZ: function(radian) {
      if (!Utils.isNumber(radian)) {
        throw "invalid radian:not number";
      }
      var transVertice = this.getColumnTrans();
      this.setColumnTrans(0, 0, 0);
      var columnZ = this.getColumnZ().getVector();
      this.worldRotateByVector(radian, columnZ);
      this.setColumnTrans(transVertice.x, transVertice.y, transVertice.z);
    },

    //localVector指的是相对于模型坐标系中的向量
    localRotateByVector: function(radian, localVector) {
      if (!Utils.isNumber(radian)) {
        throw "invalid radian: not number";
      }
      if (!(localVector instanceof Vector)) {
        throw "invalid localVector: not Vector";
      }
      var localColumn = localVector.getArray();
      localColumn.push(1); //四元数组
      var worldColumn = this.multiplyColumn(localColumn); //模型坐标转换为世界坐标
      var worldVector = new Vector(worldColumn[0], worldColumn[1], worldColumn[2]);

      var transVertice = this.getColumnTrans();
      this.setColumnTrans(0, 0, 0);
      this.worldRotateByVector(radian, worldVector);
      this.setColumnTrans(transVertice.x, transVertice.y, transVertice.z);
    }
  };

  return Matrix;
});