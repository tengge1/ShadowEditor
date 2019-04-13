import WGS84 from '../core/WGS84';
import TileCreator from './TileCreator';
import Tile from './Tile';
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
}

SphereTileCreator.prototype = Object.create(TileCreator.prototype);
SphereTileCreator.prototype.constructor = SphereTileCreator;

SphereTileCreator.prototype.get = function (tiles) {
    tiles.length = 0;

    this._centerZoom = ~~GeoUtils.altToZoom(this.camera.position.length() - WGS84.a) + 3;

    this.fork(0, 0, 1, tiles);
    this.fork(1, 0, 1, tiles);
    this.fork(0, 1, 1, tiles);
    this.fork(1, 1, 1, tiles);

    // 排序
    tiles = tiles.sort((a, b) => {
        if (a.z > b.z) {
            return 1;
        } else if (a.z < b.z) {
            return -1;
        } else {
            return 0;
        }
    });

    // 获取图层数据
    tiles.forEach(tile => {
        tile.images.length = 0;
        this.globe.layerList.forEach(n => {
            var image = n.get(tile.x, tile.y, tile.z);
            if (image) {
                tile.images.push(image);
            }
        });
    });

    return tiles;
};

/**
 * 从1层级进行四分，返回满足要求的瓦片
 * @param {*} x 
 * @param {*} y 
 * @param {*} z 
 * @param {*} tiles 
 */
SphereTileCreator.prototype.fork = function (x, y, z, tiles) {
    var tile = this.getTile(x, y, z);

    if (!this.isVisible(tile)) {
        return;
    }

    tiles.push(tile);

    if (tile.z > this._centerZoom) {
        return;
    }

    this.fork(x * 2, y * 2, z + 1, tiles);
    this.fork(x * 2 + 1, y * 2, z + 1, tiles);
    this.fork(x * 2, y * 2 + 1, z + 1, tiles);
    this.fork(x * 2 + 1, y * 2 + 1, z + 1, tiles);
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
    return this.globe.viewer.aabb.intersectsBox(tile._aabb);
};

SphereTileCreator.prototype.dispose = function () {
    this.cache.clear();
    TileCreator.prototype.dispose.call(this);
};

export default SphereTileCreator;