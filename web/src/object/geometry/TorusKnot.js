/**
 * 纽结
 * @param {THREE.TorusKnotBufferGeometry} geometry 几何体
 * @param {THREE.MeshStandardMaterial} material 材质
 */
function TorusKnot(geometry = new THREE.TorusKnotBufferGeometry(2, 0.8, 64, 12, 2, 3), material = new THREE.MeshStandardMaterial()) {
    THREE.Mesh.call(this, geometry, material);

    this.name = _t('Torus Knot');
    this.castShadow = true;
    this.receiveShadow = true;

    this.userData.physics = this.userData.physics || {
        enabled: true,
        type: 'rigidBody',
        shape: 'btBoxShape',
        mass: 1,
        inertia: {
            x: 0,
            y: 0,
            z: 0
        }
    };
}

TorusKnot.prototype = Object.create(THREE.Mesh.prototype);
TorusKnot.prototype.constructor = TorusKnot;

export default TorusKnot;