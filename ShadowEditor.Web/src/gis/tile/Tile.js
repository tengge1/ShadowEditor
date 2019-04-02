import WGS84 from '../core/WGS84';
import MathUtils from '../utils/MathUtils';

var lonlat = new THREE.Vector3();

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

    // 范围（弧度）
    this._aabb = this._getBox(x, y, z);

    // 中心点
    this._center = new THREE.Vector2();
    this._aabb.getCenter(this._center);

    // 顶点
    this._p1 = MathUtils._lonlatToXYZ(lonlat.set(this._aabb.min.x, this._aabb.min.y, 0));
    this._p2 = MathUtils._lonlatToXYZ(lonlat.set(this._aabb.max.x, this._aabb.min.y, 0));
    this._p3 = MathUtils._lonlatToXYZ(lonlat.set(this._aabb.max.x, this._aabb.max.y, 0));
    this._p4 = MathUtils._lonlatToXYZ(lonlat.set(this._aabb.min.x, this._aabb.max.y, 0));
}

/**
 * 计算包围盒（弧度）
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

    // 墨卡托投影反算
    minY = 2 * Math.atan(Math.exp(minY)) - Math.PI / 2;
    maxY = 2 * Math.atan(Math.exp(maxY)) - Math.PI / 2;

    return new THREE.Box2(
        new THREE.Vector2(minX, minY),
        new THREE.Vector2(maxX, maxY),
    );
};

export default Tile;