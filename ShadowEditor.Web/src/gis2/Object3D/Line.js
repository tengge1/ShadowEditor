/**
* 线
*/
ZeroGIS.Line = function (position, direction) {
    if (!(position instanceof ZeroGIS.Vertice)) {
        throw "invalid position";
    }
    if (!(direction instanceof ZeroGIS.Vector)) {
        throw "invalid direction";
    }
    this.vertice = position.getCopy();
    this.vector = direction.getCopy();
    this.vector.normalize();
};

ZeroGIS.Line.prototype.constructor = ZeroGIS.Line;

ZeroGIS.Line.prototype.setVertice = function (position) {
    if (!(position instanceof ZeroGIS.Vertice)) {
        throw "invalid position";
    }
    this.vertice = position.getCopy();
    return this;
};

ZeroGIS.Line.prototype.setVector = function (direction) {
    if (!(direction instanceof ZeroGIS.Vector)) {
        throw "invalid direction";
    }
    this.vector = direction.getCopy();
    this.vector.normalize();
    return this;
};

ZeroGIS.Line.prototype.getCopy = function () {
    var lineCopy = new ZeroGIS.Line(this.vertice, this.vector);
    return lineCopy;
};
