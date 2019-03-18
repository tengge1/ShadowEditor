/**
 * 地球
 */
function Globe() {
    var geometry = new THREE.BoxBufferGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial();

    THREE.Mesh.call(this, geometry, material);

    this.name = '地球';
}

Globe.prototype = Object.create(THREE.Mesh.prototype);
Globe.prototype.constructor = Globe;

export default Globe;