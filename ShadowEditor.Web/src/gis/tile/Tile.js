import WGS84 from '../core/WGS84';
import GeoUtils from '../utils/GeoUtils';

/**
 * 瓦片
 * @author tengge / https://github.com/tengge1
 * @param {*} x X坐标
 * @param {*} y Y坐标
 * @param {*} z 层级
 */
function Tile(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;

    this.images = [];

    this._aabb = this._getBox(x, y, z);
    this._center = this._getCenter(this._aabb);
}

/**
 * 获取包围盒
 * @param {*} x X坐标
 * @param {*} y Y坐标
 * @param {*} z 层级
 * @returns {THREE.Box2} 包围盒
 */
Tile.prototype._getBox = function (x, y, z) {
    var size = Math.PI * 2 / 2 ** z;
    var minX = -Math.PI + size * x;
    var maxX = minX + size;
    var maxY = Math.PI - size * y;
    var minY = maxY - size;

    minY = GeoUtils._mercatorLatInvert(minY);
    maxY = GeoUtils._mercatorLatInvert(maxY);

    return new THREE.Box2(
        new THREE.Vector2(minX, minY),
        new THREE.Vector2(maxX, maxY)
    );
};

/**
 * 获取中心点
 * @param {*} aabb 包围盒
 * @returns {THREE.Vector2} 中心点
 */
Tile.prototype._getCenter = function (aabb) {
    var center = new THREE.Vector2();
    return aabb.getCenter(center);
};

export default Tile;