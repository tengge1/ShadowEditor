import Layer from './Layer';

/**
 * 瓦片图层
 */
function TiledLayer() {
    Layer.call(this);

    this.tree = rbush();
}

TiledLayer.prototype = Object.create(Layer.prototype);
TiledLayer.prototype.constructor = TiledLayer;

TiledLayer.prototype.add = function (tile) {
    var item = Object.assign({}, tile.aabb, {
        data: tile
    });

    this.tree.insert(item);
};

TiledLayer.prototype.remove = function (tile) {
    this.tree.remove(tile);
};

TiledLayer.prototype.clear = function () {
    this.tree.clear();
};

TiledLayer.prototype.all = function () {
    return this.tree.all();
};

TiledLayer.prototype.search = function (aabb) {
    return this.tree.search(aabb);
};

TiledLayer.prototype.collide = function (aabb) {
    return tree.collides({ minX: 40, minY: 20, maxX: 80, maxY: 70 });
};

TiledLayer.prototype.dispose = function () {

};

export default TiledLayer;