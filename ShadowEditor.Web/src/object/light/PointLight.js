/**
 * 点光源
 */
function PointLight(color, intensity, distance, decay) {
    THREE.PointLight.call(this, color, intensity, distance, decay);

    var geometry = new THREE.SphereBufferGeometry(0.2, 16, 8);
    var material = new THREE.MeshBasicMaterial({ color: color });
    var mesh = new THREE.Mesh(geometry, material);

    mesh.userData.type = 'helper';

    this.add(mesh);
}

PointLight.prototype = Object.create(THREE.PointLight.prototype);
PointLight.prototype.constructor = PointLight;

export default PointLight;