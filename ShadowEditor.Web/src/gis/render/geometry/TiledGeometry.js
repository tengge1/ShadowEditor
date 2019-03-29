import WGS84 from '../../core/WGS84';

/**
 * 瓦片几何体
 */
function TiledGeometry() {
    THREE.PlaneBufferGeometry.call(this, WGS84.a, WGS84.a);
}

TiledGeometry.prototype = Object.create(THREE.PlaneBufferGeometry.prototype);
TiledGeometry.prototype.constructor = TiledGeometry;

export default TiledGeometry;