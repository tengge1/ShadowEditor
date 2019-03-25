/**
* 3D顶点
*/
ZeroGIS.Vertice = function (x, y, z) {
    x = x !== undefined ? x : 0;
    y = y !== undefined ? y : 0;
    z = z !== undefined ? z : 0;
    if (!ZeroGIS.Utils.isNumber(x)) {
        throw "invalid x";
    }
    if (!ZeroGIS.Utils.isNumber(y)) {
        throw "invalid y";
    }
    if (!ZeroGIS.Utils.isNumber(z)) {
        throw "invalid z";
    }
    this.x = x;
    this.y = y;
    this.z = z;
};

ZeroGIS.Vertice.prototype = {
    constructor: ZeroGIS.Vertice,

    minus: function (otherVertice) {
        if (!(otherVertice instanceof ZeroGIS.Vertice)) {
            throw "invalid otherVertice";
        }
        var x = this.x - otherVertice.x;
        var y = this.y - otherVertice.y;
        var z = this.z - otherVertice.z;
        return new ZeroGIS.Vector(x, y, z);
    },

    plus: function (otherVector) {
        if (!(otherVector instanceof ZeroGIS.Vector)) {
            throw "invalid otherVector";
        }
        var x = this.x + otherVector.x;
        var y = this.y + otherVector.y;
        var z = this.z + otherVector.z;
        return new ZeroGIS.Vertice(x, y, z);
    },

    getVector: function () {
        return new ZeroGIS.Vector(this.x, this.y, this.z);
    },

    getArray: function () {
        return [this.x, this.y, this.z];
    },

    getCopy: function () {
        return new ZeroGIS.Vertice(this.x, this.y, this.z);
    },

    getOpposite: function () {
        return new ZeroGIS.Vertice(-this.x, -this.y, -this.z);
    }
};
