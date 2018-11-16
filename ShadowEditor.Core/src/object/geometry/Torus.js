/**
 * 轮胎
 * @param {*} geometry 几何体
 * @param {*} material 材质
 */
function Torus(geometry = new THREE.TorusBufferGeometry(2, 1, 32, 32, Math.PI * 2), material = new THREE.MeshStandardMaterial()) {
    THREE.Mesh.call(this, geometry, material);

    this.name = '轮胎';
    this.castShadow = true;
    this.receiveShadow = true;
}

Torus.prototype = Object.create(THREE.Mesh.prototype);
Torus.prototype.constructor = Torus;

export default Torus;