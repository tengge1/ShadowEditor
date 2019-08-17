/**
 * 正方体
 * @param {*} geometry 几何体
 * @param {*} material 材质
 */
function Box(geometry = new THREE.BoxBufferGeometry(1, 1, 1), material = new THREE.MeshStandardMaterial()) {
    THREE.Mesh.call(this, geometry, material);

    this.name = _t('Box');
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

Box.prototype = Object.create(THREE.Mesh.prototype);
Box.prototype.constructor = Box;

export default Box;