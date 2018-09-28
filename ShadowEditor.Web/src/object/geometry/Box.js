/**
 * 正方体
 * @param {*} geometry 几何体
 * @param {*} material 材质
 */
function Box(geometry = new THREE.BoxBufferGeometry(1, 1, 1), material = new THREE.MeshStandardMaterial()) {
    THREE.Mesh.call(this, geometry, material);

    this.name = '正方体';
    this.castShadow = true;
    this.receiveShadow = true;
}

Box.prototype = Object.create(THREE.Mesh.prototype);
Box.prototype.constructor = Box;

export default Box;