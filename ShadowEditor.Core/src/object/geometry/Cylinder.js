/**
 * 圆柱体
 * @param {*} geometry 几何体
 * @param {*} material 材质
 */
function Cylinder(geometry = new THREE.CylinderBufferGeometry(1, 1, 2, 32, 1, false), material = new THREE.MeshStandardMaterial()) {
    THREE.Mesh.call(this, geometry, material);

    this.name = '圆柱体';
    this.castShadow = true;
    this.receiveShadow = true;
}

Cylinder.prototype = Object.create(THREE.Mesh.prototype);
Cylinder.prototype.constructor = Cylinder;

export default Cylinder;