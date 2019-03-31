import TileCreator from './TileCreator';
import Tile from './Tile';
import TiledMaterial from '../render/material/TiledMaterial';
import MathUtils from '../utils/MathUtils';

/**
 * 球形瓦片创建者
 */
function SphereTileCreator() {
    TileCreator.call(this);
    this.cache = new Map();

    this.tiles = [];
}

SphereTileCreator.prototype = Object.create(TileCreator.prototype);
SphereTileCreator.prototype.constructor = SphereTileCreator;

SphereTileCreator.prototype.get = function (camera) {
    this.tiles.length = 0;
    this.fork(0, 0, 0);
    return this.tiles;
};

SphereTileCreator.prototype.fork = function (x, y, z) {
    var id = `${x}_${y}_${z}`;

    var tile = this.cache.get(id);

    if (!tile) {
        tile = new Tile(x, y, z);

        if (z > 0) {
            tile.material = new TiledMaterial(x, y, z);
        }

        this.cache.set(id, tile);
    }

    if (this.canFork(tile)) {
        this.fork(x * 2, y * 2, z + 1);
        this.fork(x * 2 + 1, y * 2, z + 1);
        this.fork(x * 2, y * 2 + 1, z + 1);
        this.fork(x * 2 + 1, y * 2 + 1, z + 1);
    } else {
        this.tiles.push(tile);
    }
};

SphereTileCreator.prototype.canFork = function (tile) {
    return tile.z === 0;
};

SphereTileCreator.prototype.dispose = function () {
    this.tiles.length = 0;
    this.cache.clear();
    TileCreator.prototype.dispose.call(this);
};

export default SphereTileCreator;