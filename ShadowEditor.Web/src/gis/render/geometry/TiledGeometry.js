/**
 * 瓦片几何体
 */
function TiledGeometry() {
    THREE.PlaneBufferGeometry.call(this, 1, 1, 16, 16);
}

TiledGeometry.prototype = Object.create(THREE.PlaneBufferGeometry.prototype);
TiledGeometry.prototype.constructor = TiledGeometry;

export default TiledGeometry;