/**
 * 瓦片
 * @param {*} x 
 * @param {*} y 
 * @param {*} z 
 */
function Tile(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;

    this.id = `${this.x}_${this.y}_${this.z}`;

    this.aabb = {
        minX: -180,
        minY: -90,
        maxX: 180,
        maxY: 90,
    };
}

export default Tile;