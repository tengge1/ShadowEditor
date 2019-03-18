import GlobeGeometry from './GlobeGeometry';
import GlobeMaterial from './GlobeMaterial';

/**
 * 地球
 * @param {*} app 
 */
function Globe(app) {
    var lon = 0;
    var lat = 0;
    var zoom = 1;

    var geometry = new GlobeGeometry();
    var material = new GlobeMaterial();

    THREE.Mesh.call(this, geometry, material);

    this.name = '地球';
}

Globe.prototype = Object.create(THREE.Mesh.prototype);
Globe.prototype.constructor = Globe;

export default Globe;