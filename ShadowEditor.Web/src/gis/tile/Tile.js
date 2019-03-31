import MathUtils from '../utils/MathUtils';

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

    this._aabb = MathUtils._getTileMercatorBox(x, y, z);
    this._center = new THREE.Vector2(
        (this._aabb.minX + this._aabb.maxX) / 2,
        (this._aabb.minY + this._aabb.maxY) / 2,
    );
}

export default Tile;