/**
 * 二十面体
 * @param {*} geometry 几何体
 * @param {*} material 材质
 */
function Icosahedron(geometry = new THREE.IcosahedronBufferGeometry(1, 2), material = new THREE.MeshStandardMaterial()) {
    THREE.Mesh.call(this, geometry, material);

    this.name = '二十面体';
    this.castShadow = true;
    this.receiveShadow = true;

    this.userData.physics = this.userData.physics || {
        enabled: false,
        type: 'rigidBody',
        shape: 'btSphereShape',
        mass: 1,
        inertia: {
            x: 0,
            y: 0,
            z: 0,
        }
    };
}

Icosahedron.prototype = Object.create(THREE.Mesh.prototype);
Icosahedron.prototype.constructor = Icosahedron;

export default Icosahedron;