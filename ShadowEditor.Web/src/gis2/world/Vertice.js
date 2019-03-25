define(["require", "world/Utils", "world/Vector"], function(require, Utils) {

  var Vertice = function(x, y, z) {
    x = x !== undefined ? x : 0;
    y = y !== undefined ? y : 0;
    z = z !== undefined ? z : 0;
    if (!Utils.isNumber(x)) {
      throw "invalid x";
    }
    if (!Utils.isNumber(y)) {
      throw "invalid y";
    }
    if (!Utils.isNumber(z)) {
      throw "invalid z";
    }
    this.x = x;
    this.y = y;
    this.z = z;
  };

  Vertice.prototype = {
    constructor: Vertice,

    _requireVector: function(){
      return require("world/Vector");
    },

    minus: function(otherVertice) {
      var Vector = this._requireVector();
      if (!(otherVertice instanceof Vertice)) {
        throw "invalid otherVertice";
      }
      var x = this.x - otherVertice.x;
      var y = this.y - otherVertice.y;
      var z = this.z - otherVertice.z;
      return new Vector(x, y, z);
    },

    plus: function(otherVector) {
      var Vector = this._requireVector();
      if (!(otherVector instanceof Vector)) {
        throw "invalid otherVector";
      }
      var x = this.x + otherVector.x;
      var y = this.y + otherVector.y;
      var z = this.z + otherVector.z;
      return new Vertice(x, y, z);
    },

    getVector: function() {
      var Vector = this._requireVector();
      return new Vector(this.x, this.y, this.z);
    },

    getArray: function() {
      return [this.x, this.y, this.z];
    },

    getCopy: function() {
      return new Vertice(this.x, this.y, this.z);
    },

    getOpposite: function() {
      return new Vertice(-this.x, -this.y, -this.z);
    }
  };

  return Vertice;
});