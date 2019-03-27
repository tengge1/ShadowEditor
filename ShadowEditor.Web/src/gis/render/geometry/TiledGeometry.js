import WGS84 from '../../core/WGS84';

/**
 * 瓦片几何体
 */
function TiledGeometry() {
    THREE.SphereBufferGeometry.call(this, WGS84.a, 16, 16);

    this.groups = [{
        start: 0,
        count: 1440,
        materialIndex: 0
    }];
}

TiledGeometry.prototype = Object.create(THREE.SphereBufferGeometry.prototype);
TiledGeometry.prototype.constructor = TiledGeometry;

export default TiledGeometry;