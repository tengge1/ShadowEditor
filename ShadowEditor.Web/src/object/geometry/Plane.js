import PhysicsData from '../../physics/PhysicsData';

/**
 * 平板
 * @param {*} geometry 几何体
 * @param {*} material 材质
 */
function Plane(geometry = new THREE.PlaneBufferGeometry(50, 50), material = new THREE.MeshStandardMaterial()) {
    THREE.Mesh.call(this, geometry, material);

    this.name = '平板';
    this.rotation.x = -Math.PI / 2;
    this.castShadow = true;
    this.receiveShadow = true;

    this.userData.physics = Object.assign({}, PhysicsData, {
        shape: 'btStaticPlaneShape',
        mass: 1
    });
}

Plane.prototype = Object.create(THREE.Mesh.prototype);
Plane.prototype.constructor = Plane;

export default Plane;