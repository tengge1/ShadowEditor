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

    this.aabb = { // bounding box
        minX: -180, // min longitude
        minY: -90, // min latitude
        maxX: 180, // max longitude
        maxY: 90, // max latitude
    };
}

export default Tile;