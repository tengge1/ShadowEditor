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

    this._centerZoom = 0;

    this.tiles = [];
}

SphereTileCreator.prototype = Object.create(TileCreator.prototype);
SphereTileCreator.prototype.constructor = SphereTileCreator;

SphereTileCreator.prototype.get = function () {
    this.tiles.length = 0;

    this._centerZoom = ~~GeoUtils.altToZoom(this.camera.position.length() - WGS84.a) + 3;

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
 * 2、当前视锥与该瓦片的包围盒相交。
 * @param {*} tile 
 */
SphereTileCreator.prototype.isVisible = function (tile) {
    if (!tile.material.loaded) {
        return false;
    }

    return this.globe.viewer.aabb.intersectsBox(tile._aabb);
};

SphereTileCreator.prototype.dispose = function () {
    this.tiles.length = 0;
    this.cache.clear();
    TileCreator.prototype.dispose.call(this);
};

export default SphereTileCreator;