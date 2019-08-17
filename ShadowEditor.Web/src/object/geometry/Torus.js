/**
 * 轮胎
 * @param {*} geometry 几何体
 * @param {*} material 材质
 */
function Torus(geometry = new THREE.TorusBufferGeometry(2, 1, 32, 32, Math.PI * 2), material = new THREE.MeshStandardMaterial()) {
    THREE.Mesh.call(this, geometry, material);

    this.name = _t('Torus');
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

Torus.prototype = Object.create(THREE.Mesh.prototype);
Torus.prototype.constructor = Torus;

export default Torus;