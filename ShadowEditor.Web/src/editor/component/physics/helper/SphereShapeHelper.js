/**
 * 立方体帮助器
 * @param {*} object 物体
 */
function SphereShapeHelper(object) {
    this.object = object;

    var geometry = this.object.geometry;
    geometry.computeBoundingSphere();

    var sphere = geometry.boundingSphere;

    geometry = new THREE.SphereBufferGeometry(sphere.radius);
    var material = new THREE.MeshBasicMaterial({
        color: 0xffff00
    });

    material.wireframe = true;
    material.depthTest = false;

    THREE.Mesh.call(this, geometry, material);

    this.update();
}

SphereShapeHelper.prototype = Object.create(THREE.Mesh.prototype);
SphereShapeHelper.prototype.constructor = SphereShapeHelper;

SphereShapeHelper.prototype.update = function () {
    this.object.geometry.computeBoundingSphere();

    this.position.copy(this.object.position);
    this.rotation.copy(this.object.rotation);
    this.scale.copy(this.object.scale);
};

export default SphereShapeHelper;