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

    this._center = new THREE.Vector3();
    this._projScreenMatrix = new THREE.Matrix4();
    this._frustum = new THREE.Frustum();

    this.tiles = [];
}

SphereTileCreator.prototype = Object.create(TileCreator.prototype);
SphereTileCreator.prototype.constructor = SphereTileCreator;

SphereTileCreator.prototype.get = function () {
    this.tiles.length = 0;

    MathUtils.xyzToLonlat(this.camera.position, this._center);
    this._projScreenMatrix.multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse);
    this._frustum.setFromMatrix(this._projScreenMatrix);

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
        // if (tile.x === 1 && tile.y === 0 && tile.z === 1) {
        this.tiles.push(tile);
        // }
    }
};

/**
 * 是否可以使用下一级底图，每三个层级一组
 * 1~4~7~10~13~16~19~22~25
 */
SphereTileCreator.prototype.canFork = function () {
    var xyz = new THREE.Vector3();

    return function (tile) {
        if (tile.z < 1) {
            return true;
        }

        return false;

        // var frustum = this._frustum;

        // if (tile.z >= 5) {
        //     return false;
        // }

        // if (tile._aabb.containsPoint(this._center)) {
        //     return true;
        // } else {
        //     return false;
        // }

        // MathUtils._lonlatToXYZ(tile._center, xyz);

        // var distance = this.camera.position.distanceTo(xyz);

        // var zoom = MathUtils.altToZoom(distance) + 2;

        // return tile.z <= zoom;
    };
}();

SphereTileCreator.prototype.dispose = function () {
    this.tiles.length = 0;
    this.cache.clear();
    TileCreator.prototype.dispose.call(this);
};

export default SphereTileCreator;