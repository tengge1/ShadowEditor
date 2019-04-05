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
        tile.material = new TiledMaterial(x, y, z);
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
 * 判断是否可以使用下个层级底图
 * @param {*} tile 
 */
SphereTileCreator.prototype.canFork = function (tile) {
    if (tile.z === 0) {
        return true;
    }

    if (tile.z > this._centerZoom) {
        return false;
    }

    if (!tile.material.loaded) {
        return false;
    }

    return this.isVisible(tile);
};

/**
 * 判断瓦片是否可见：1、瓦片至少有一个点的法线与相机方向的夹角是锐角；2、瓦片至少有一个点在视锥内.
 * @param {*} tile 
 */
SphereTileCreator.prototype.isVisible = function (tile) {
    var intersect = false;
    var face = false;

    for (var i = 0, l = tile._vertices.length; i < l; i++) {
        var vertice = tile._vertices[i];

        if (!intersect) {
            intersect = this._frustum.containsPoint(vertice);
        }
        if (!face) {
            face = this.camera.position.dot(vertice) > 0;
        }
        if (intersect && face) {
            break;
        }
    }

    return intersect && face;
};

SphereTileCreator.prototype.dispose = function () {
    this.tiles.length = 0;
    this.cache.clear();
    TileCreator.prototype.dispose.call(this);
};

export default SphereTileCreator;