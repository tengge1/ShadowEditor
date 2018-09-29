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
}

Icosahedron.prototype = Object.create(THREE.Mesh.prototype);
Icosahedron.prototype.constructor = Icosahedron;

export default Icosahedron;