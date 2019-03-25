define(["world/Vertice", "world/Vector"], function(Vertice, Vector) {
  var Line = function(position, direction) {
    if (!(position instanceof Vertice)) {
      throw "invalid position";
    }
    if (!(direction instanceof Vector)) {
      throw "invalid direction";
    }
    this.vertice = position.getCopy();
    this.vector = direction.getCopy();
    this.vector.normalize();
  };
  Line.prototype.constructor = Line;
  Line.prototype.setVertice = function(position) {
    if (!(position instanceof Vertice)) {
      throw "invalid position";
    }
    this.vertice = position.getCopy();
    return this;
  };
  Line.prototype.setVector = function(direction) {
    if (!(direction instanceof Vector)) {
      throw "invalid direction";
    }
    this.vector = direction.getCopy();
    this.vector.normalize();
    return this;
  };
  Line.prototype.getCopy = function() {
    var lineCopy = new Line(this.vertice, this.vector);
    return lineCopy;
  };
  return Line;
});