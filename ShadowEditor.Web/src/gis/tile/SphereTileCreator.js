import WGS84 from '../core/WGS84';
import TileCreator from './TileCreator';
import Tile from './Tile';
import TiledMaterial from '../render/material/TiledMaterial';
import GeoUtils from '../utils/GeoUtils';

/**
 * 球形瓦片创建者
 * @author tengge / https://github.com/tengge1
 * @param {*} globe 
 */
function SphereTileCreator(globe) {
    TileCreator.call(this, globe);

    this.cache = new Map();

    this._center = new THREE.Vector3();
    this._centerZoom = 0;
    // this._box = new THREE.Box2();
    // this._projScreenMatrix = new THREE.Matrix4();
    // this._frustum = new THREE.Frustum();

    this.tiles = [];
}

SphereTileCreator.prototype = Object.create(TileCreator.prototype);
SphereTileCreator.prototype.constructor = SphereTileCreator;

SphereTileCreator.prototype.get = function () {
    this.tiles.length = 0;

    GeoUtils._xyzToLonlat(this.camera.position, this._center);
    this._centerZoom = ~~GeoUtils.altToZoom(this.camera.position.length() - WGS84.a) + 2;

    // this._projScreenMatrix.multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse);
    // this._frustum.setFromMatrix(this._projScreenMatrix);

    this.fork(0, 0, 1);
    this.fork(1, 0, 1);
    this.fork(0, 1, 1);
    this.fork(1, 1, 1);

    this.tiles = this.tiles.sort((a, b) => {
        if (a.z > b.z) {
            return 1;
        } else if (a.z < b.z) {
            return -1;
        } else {
            return 0;
        }
    });

    return this.tiles;
};

/**
 * 从1层级进行四分，返回满足要求的瓦片
 * @param {*} x 
 * @param {*} y 
 * @param {*} z 
 */
SphereTileCreator.prototype.fork = function (x, y, z) {
    var tile = this.getTile(x, y, z);

    if (!this.isVisible(tile)) {
        return;
    }

    this.tiles.push(tile);

    if (tile.z > this._centerZoom) {
        return;
    }

    this.fork(x * 2, y * 2, z + 1);
    this.fork(x * 2 + 1, y * 2, z + 1);
    this.fork(x * 2, y * 2 + 1, z + 1);
    this.fork(x * 2 + 1, y * 2 + 1, z + 1);
};

/**
 * 获取一个瓦片
 * @param {*} x 
 * @param {*} y 
 * @param {*} z 
 */
SphereTileCreator.prototype.getTile = function (x, y, z) {
    var id = `${x}_${y}_${z}`;

    var tile = this.cache.get(id);

    if (!tile) {
        tile = new Tile(x, y, z);
        tile.material = new TiledMaterial(x, y, z, this.options);
        this.cache.set(id, tile);
    }

    return tile;
};

/**
 * 判断瓦片是否可见：
 * 1、材质上的底图已经下载完；
 * 2、瓦片至少有一个点的法线与相机方向的夹角是锐角；
 * 3、瓦片至少有一个点在视锥内。
 * @param {*} tile 
 */
SphereTileCreator.prototype.isVisible = function (tile) {
    if (!tile.material.loaded) {
        return false;
    }

    var intersect = this._center.x >= tile._aabb.min.x &&
        this._center.x <= tile._aabb.max.x &&
        this._center.y >= tile._aabb.min.y &&
        this._center.y <= tile._aabb.max.y;

    return intersect;



    // var face = false;

    // for (var i = 0, l = tile._vertices.length; i < l; i++) {
    //     var vertice = tile._vertices[i];
    //     face = this.camera.position.dot(vertice) > 0;
    //     if (face) {
    //         break;
    //     }
    // }

    // return intersect && face;
};

SphereTileCreator.prototype.dispose = function () {
    this.tiles.length = 0;
    this.cache.clear();
    TileCreator.prototype.dispose.call(this);
};

export default SphereTileCreator;