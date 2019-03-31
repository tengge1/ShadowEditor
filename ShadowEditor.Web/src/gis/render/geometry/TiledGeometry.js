/**
 * 瓦片几何体
 * @author tengge / https://github.com/tengge1
 */
function TiledGeometry() {
    THREE.PlaneBufferGeometry.call(this, 1, 1, 16, 16);
}

TiledGeometry.prototype = Object.create(THREE.PlaneBufferGeometry.prototype);
TiledGeometry.prototype.constructor = TiledGeometry;

export default TiledGeometry;