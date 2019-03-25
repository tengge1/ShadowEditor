import Utils from './Utils';
import MathUtils from './Math';

var TileGrid = function (level, row, column) {
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

TileGrid.prototype.equals = function (other) {
    return other instanceof TileGrid && this.level == other.level && this.row == other.row && this.column == other.column;
};

TileGrid.prototype.getLeft = function () {
    return MathUtils.getTileGridByBrother(this.level, this.row, this.column, MathUtils.LEFT);
};

TileGrid.prototype.getRight = function () {
    return MathUtils.getTileGridByBrother(this.level, this.row, this.column, MathUtils.RIGHT);
};

TileGrid.prototype.getTop = function () {
    return MathUtils.getTileGridByBrother(this.level, this.row, this.column, MathUtils.TOP);
};

TileGrid.prototype.getBottom = function () {
    return MathUtils.getTileGridByBrother(this.level, this.row, this.column, MathUtils.BOTTOM);
};

TileGrid.prototype.getParent = function () {
    return MathUtils.getTileGridAncestor(this.level - 1, this.level, this.row, this.column);
};

TileGrid.prototype.getAncestor = function (ancestorLevel) {
    return MathUtils.getTileGridAncestor(ancestorLevel, this.level, this.row, this.column);
};

export default TileGrid;