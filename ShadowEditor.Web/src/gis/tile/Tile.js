import WGS84 from '../core/WGS84';
import GeoUtils from '../utils/GeoUtils';

var mat4 = new THREE.Matrix4();
mat4.makeRotationX(-Math.PI / 2);

/**
 * 瓦片
 * @author tengge / https://github.com/tengge1
 * @param {*} x 
 * @param {*} y 
 * @param {*} z 
 */
function Tile(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;

    this._aabb = this._getBox(x, y, z);
    this._center = this._getCenter(this._aabb);
    this._vertices = this._getVertices(this._aabb, this._center);
}

/**
 * 获取包围盒
 * @param {*} x 
 * @param {*} y 
 * @param {*} z 
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
        new THREE.Vector2(maxX, maxY),
    );
};

/**
 * 获取中心点
 * @param {*} aabb 
 */
Tile.prototype._getCenter = function (aabb) {
    var center = new THREE.Vector2();
    return aabb.getCenter(center);
};

/**
 * 获取顶点
 */
Tile.prototype._getVertices = function () {
    var lonlat = new THREE.Vector3();

    return function (aabb, center) {
        var p0 = GeoUtils._lonlatToXYZ(lonlat.set(center.x, center.y, 0)); // 中心点
        var p1 = GeoUtils._lonlatToXYZ(lonlat.set(aabb.min.x, aabb.min.y, 0)); // 左下
        var p2 = GeoUtils._lonlatToXYZ(lonlat.set(aabb.max.x, aabb.min.y, 0)); // 右下
        var p3 = GeoUtils._lonlatToXYZ(lonlat.set(aabb.max.x, aabb.max.y, 0)); // 右上
        var p4 = GeoUtils._lonlatToXYZ(lonlat.set(aabb.min.x, aabb.max.y, 0)); // 左上

        // p0.applyMatrix4(mat4);
        // p1.applyMatrix4(mat4);
        // p2.applyMatrix4(mat4);
        // p3.applyMatrix4(mat4);
        // p4.applyMatrix4(mat4);

        return [p0, p1, p2, p3, p4];
    };
}();

export default Tile;