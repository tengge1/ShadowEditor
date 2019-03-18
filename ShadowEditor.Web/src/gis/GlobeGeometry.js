/**
 * 地球几何体
 */
function GlobeGeometry() {
    THREE.PlaneBufferGeometry.call(this, 1, 1, 256, 256);
}

GlobeGeometry.prototype = Object.create(THREE.PlaneBufferGeometry.prototype);
GlobeGeometry.prototype.constructor = GlobeGeometry;

export default GlobeGeometry;