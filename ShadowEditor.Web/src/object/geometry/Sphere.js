/**
 * 球体
 * @param {*} geometry 几何体
 * @param {*} material 材质
 */
function Sphere(geometry = new THREE.SphereBufferGeometry(1, 32, 16, 0, Math.PI * 2, 0, Math.PI), material = new THREE.MeshStandardMaterial()) {
    THREE.Mesh.call(this, geometry, material);

    this.name = _t('Sphere');
    this.castShadow = true;
    this.receiveShadow = true;

    this.userData.physics = this.userData.physics || {
        enabled: false,
        type: 'rigidBody',
        shape: 'btSphereShape',
        mass: 0,
        inertia: {
            x: 0,
            y: 0,
            z: 0,
        }
    };
}

Sphere.prototype = Object.create(THREE.Mesh.prototype);
Sphere.prototype.constructor = Sphere;

export default Sphere;