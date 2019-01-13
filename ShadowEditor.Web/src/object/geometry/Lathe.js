var points = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(4, 0),
    new THREE.Vector2(3.5, 0.5),
    new THREE.Vector2(1, 0.75),
    new THREE.Vector2(0.8, 1),
    new THREE.Vector2(0.8, 4),
    new THREE.Vector2(1, 4.2),
    new THREE.Vector2(1.4, 4.8),
    new THREE.Vector2(2, 5),
    new THREE.Vector2(2.5, 5.4),
    new THREE.Vector2(3, 12)
];

/**
 * 酒杯
 * @param {*} geometry 几何体
 * @param {*} material 材质
 */
function Lathe(geometry = new THREE.LatheBufferGeometry(points, 20, 0, 2 * Math.PI), material = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide })) {
    THREE.Mesh.call(this, geometry, material);

    this.name = '酒杯';
    this.castShadow = true;
    this.receiveShadow = true;

    this.userData.physics = this.userData.physics || {
        enabled: false,
        type: 'rigidBody',
        shape: 'btBoxShape',
        mass: 1,
        inertia: {
            x: 0,
            y: 0,
            z: 0,
        }
    };
}

Lathe.prototype = Object.create(THREE.Mesh.prototype);
Lathe.prototype.constructor = Lathe;

export default Lathe;