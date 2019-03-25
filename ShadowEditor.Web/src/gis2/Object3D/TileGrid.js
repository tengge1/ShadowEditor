/**
* 瓦片网格
*/
ZeroGIS.TileGrid = function (level, row, column) {
    if (!ZeroGIS.Utils.isNonNegativeInteger(level)) {
        throw "invalid level";
    }
    if (!ZeroGIS.Utils.isNonNegativeInteger(row)) {
        throw "invalid row";
    }
    if (!ZeroGIS.Utils.isNonNegativeInteger(column)) {
        throw "invalid column";
    }
    this.level = level;
    this.row = row;
    this.column = column;
};

ZeroGIS.TileGrid.prototype.equals = function (other) {
    return other instanceof ZeroGIS.TileGrid && this.level == other.level && this.row == other.row && this.column == other.column;
};

ZeroGIS.TileGrid.prototype.getLeft = function () {
    return ZeroGIS.MathUtils.getTileGridByBrother(this.level, this.row, this.column, ZeroGIS.MathUtils.LEFT);
};

ZeroGIS.TileGrid.prototype.getRight = function () {
    return ZeroGIS.MathUtils.getTileGridByBrother(this.level, this.row, this.column, ZeroGIS.MathUtils.RIGHT);
};

ZeroGIS.TileGrid.prototype.getTop = function () {
    return ZeroGIS.MathUtils.getTileGridByBrother(this.level, this.row, this.column, ZeroGIS.MathUtils.TOP);
};

ZeroGIS.TileGrid.prototype.getBottom = function () {
    return ZeroGIS.MathUtils.getTileGridByBrother(this.level, this.row, this.column, ZeroGIS.MathUtils.BOTTOM);
};

ZeroGIS.TileGrid.prototype.getParent = function () {
    return ZeroGIS.MathUtils.getTileGridAncestor(this.level - 1, this.level, this.row, this.column);
};

ZeroGIS.TileGrid.prototype.getAncestor = function (ancestorLevel) {
    return ZeroGIS.MathUtils.getTileGridAncestor(ancestorLevel, this.level, this.row, this.column);
};