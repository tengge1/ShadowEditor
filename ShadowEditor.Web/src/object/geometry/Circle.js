/**
 * 圆
 * @param {*} geometry 几何体
 * @param {*} material 材质
 */
function Circle(geometry = new THREE.CircleBufferGeometry(1, 32), material = new THREE.MeshStandardMaterial()) {
    THREE.Mesh.call(this, geometry, material);

    this.name = L_CIRCLE;
    this.castShadow = true;
    this.receiveShadow = true;

    this.userData.physics = this.userData.physics || {
        enabled: false,
        type: 'rigidBody',
        shape: 'btBoxShape',
        mass: 1.0,
        inertia: {
            x: 0,
            y: 0,
            z: 0,
        }
    };
}

Circle.prototype = Object.create(THREE.Mesh.prototype);
Circle.prototype.constructor = Circle;

export default Circle;