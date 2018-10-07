import PhysicsData from '../../physics/PhysicsData';

/**
 * 球体
 * @param {*} geometry 几何体
 * @param {*} material 材质
 */
function Sphere(geometry = new THREE.SphereBufferGeometry(1, 32, 16, 0, Math.PI * 2, 0, Math.PI), material = new THREE.MeshStandardMaterial()) {
    THREE.Mesh.call(this, geometry, material);

    this.name = '球体';
    this.castShadow = true;
    this.receiveShadow = true;

    // this.userData.physics = Object.assign({}, PhysicsData, {
    //     shape: 'btSphereShape',
    // });
}

Sphere.prototype = Object.create(THREE.Mesh.prototype);
Sphere.prototype.constructor = Sphere;

export default Sphere;