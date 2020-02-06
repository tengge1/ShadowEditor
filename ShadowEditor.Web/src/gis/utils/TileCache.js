/**
 * 瓦片缓存
 */
function TileCache() {
    this.cache = new Map();
}

TileCache.prototype.get = function (x, y, z) {
    var cache = this.cache.get(z);

    if (!cache) {
        return cache;
    }

    cache = cache.get(y);

    if (!cache) {
        return cache;
    }

    return cache.get(x);
};

TileCache.prototype.set = function (x, y, z, data) {
    var zcache = this.cache.get(z);

    if (!zcache) {
        zcache = new Map();
        this.cache.set(z, zcache);
    }

    var ycache = zcache.get(y);

    if (!ycache) {
        ycache = new Map();
        zcache.set(y, ycache);
    }

    ycache.set(x, data);
};

TileCache.prototype.clear = function () {
    this.cache.clear();
};

export default TileCache;