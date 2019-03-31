import TileCreator from './TileCreator';
import Tile from './Tile';
import TiledMaterial from '../render/material/TiledMaterial';
import MathUtils from '../utils/MathUtils';

/**
 * 球形瓦片创建者
 * @author tengge / https://github.com/tengge1
 * @param {*} camera 
 */
function SphereTileCreator(camera) {
    TileCreator.call(this, camera);
    this.cache = new Map();

    this.center = new THREE.Vector3();

    this.tiles = [];
}

SphereTileCreator.prototype = Object.create(TileCreator.prototype);
SphereTileCreator.prototype.constructor = SphereTileCreator;

SphereTileCreator.prototype.get = function () {
    this.tiles.length = 0;

    MathUtils._xyzToLonlat(this.camera.position, this.center);
    this.center.z = 0;

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
    var distance = MathUtils._getDistance(this.center.x, this.center.y, tile._center.x, tile._center.y);

    return tile.z <= 1;
};

SphereTileCreator.prototype.dispose = function () {
    this.tiles.length = 0;
    this.cache.clear();
    TileCreator.prototype.dispose.call(this);
};

export default SphereTileCreator;