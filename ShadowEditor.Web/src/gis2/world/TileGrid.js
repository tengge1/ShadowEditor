define(["world/Utils", "world/Math"], function(Utils) {

  var TileGrid = function(level, row, column) {
    if (!Utils.isNonNegativeInteger(level)) {
      throw "invalid level";
    }
    if (!Utils.isNonNegativeInteger(row)) {
      throw "invalid row";
    }
    if (!Utils.isNonNegativeInteger(column)) {
      throw "invalid column";
    }
    this.level = level;
    this.row = row;
    this.column = column;
  };
  TileGrid.prototype._requireMath = function(){
    return require("world/Math");
  };
  TileGrid.prototype.equals = function(other) {
    return other instanceof TileGrid && this.level == other.level && this.row == other.row && this.column == other.column;
  };
  TileGrid.prototype.getLeft = function() {
    var MathUtils = this._requireMath();
    return MathUtils.getTileGridByBrother(this.level, this.row, this.column, MathUtils.LEFT);
  };
  TileGrid.prototype.getRight = function() {
    var MathUtils = this._requireMath();
    return MathUtils.getTileGridByBrother(this.level, this.row, this.column, MathUtils.RIGHT);
  };
  TileGrid.prototype.getTop = function() {
    var MathUtils = this._requireMath();
    return MathUtils.getTileGridByBrother(this.level, this.row, this.column, MathUtils.TOP);
  };
  TileGrid.prototype.getBottom = function() {
    var MathUtils = this._requireMath();
    return MathUtils.getTileGridByBrother(this.level, this.row, this.column, MathUtils.BOTTOM);
  };
  TileGrid.prototype.getParent = function() {
    var MathUtils = this._requireMath();
    return MathUtils.getTileGridAncestor(this.level - 1, this.level, this.row, this.column);
  };
  TileGrid.prototype.getAncestor = function(ancestorLevel) {
    var MathUtils = this._requireMath();
    return MathUtils.getTileGridAncestor(ancestorLevel, this.level, this.row, this.column);
  };

  return TileGrid;
});