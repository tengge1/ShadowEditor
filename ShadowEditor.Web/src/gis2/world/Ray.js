define(["world/Vertice", "world/Vector"], function(Vertice, Vector) {
    /**
     * 射线
     * @param position 射线起点 World.Vertice类型
     * @param direction 射线方向 World.Vector类型
     * @constructor
     */
    var Ray = function(position, direction) {
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
    Ray.prototype.constructor = Ray;
    Ray.prototype.setVertice = function(position) {
        if (!(position instanceof Vertice)) {
            throw "invalid position";
        }
        this.vertice = position.getCopy();
        return this;
    };
    Ray.prototype.setVector = function(direction) {
        if (!(direction instanceof Vector)) {
            throw "invalid direction";
        }
        this.vector = direction.getCopy();
        this.vector.normalize();
        return this;
    };
    Ray.prototype.getCopy = function() {
        var rayCopy = new Ray(this.vertice, this.vector);
        return rayCopy;
    };
    Ray.prototype.rotateVertice = function(vertice) {
    };

    return Ray;
});