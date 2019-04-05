import WGS84 from '../core/WGS84';
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
    this._centerZoom = 0;
    this._projScreenMatrix = new THREE.Matrix4();
    this._frustum = new THREE.Frustum();

    this.tiles = [];
}

SphereTileCreator.prototype = Object.create(TileCreator.prototype);
SphereTileCreator.prototype.constructor = SphereTileCreator;

SphereTileCreator.prototype.get = function () {
    this.tiles.length = 0;

    MathUtils.xyzToLonlat(this.camera.position, this._center);

    this._centerZoom = ~~MathUtils.altToZoom(this.camera.position.length() - WGS84.a);

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
        this.tiles.push(tile);
    }
};

/**
 * 是否可以使用下一级底图，每三个层级一组
 * 1~4~7~10~13~16~19~22~25
 */
SphereTileCreator.prototype.canFork = function () {
    var xyz = new THREE.Vector3();

    return function (tile) {
        if (tile.z > this._centerZoom) { // this._centerZoom: { min: 0 }
            return false;
        }

        // 判断tile是否在视野范围内
        // var intersect = false;

        // debugger

        // return false;

        return true;
    };
}();

SphereTileCreator.prototype.dispose = function () {
    this.tiles.length = 0;
    this.cache.clear();
    TileCreator.prototype.dispose.call(this);
};

export default SphereTileCreator;