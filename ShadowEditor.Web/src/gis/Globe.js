import GlobeGeometry from './GlobeGeometry';
import GlobeMaterial from './GlobeMaterial';

/**
 * 地球
 */
function Globe() {
    var geometry = new GlobeGeometry();
    var material = new GlobeMaterial();

    THREE.Mesh.call(this, geometry, material);

    this.name = '地球';
}

Globe.prototype = Object.create(THREE.Mesh.prototype);
Globe.prototype.constructor = Globe;

export default Globe;