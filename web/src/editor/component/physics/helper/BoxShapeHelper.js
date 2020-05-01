/**
 * 立方体帮助器
 * @param {*} object 物体
 */
function BoxShapeHelper(object) {
    this.object = object;

    var geometry = this.object.geometry;
    geometry.computeBoundingBox();

    var box = geometry.boundingBox;

    var x = box.max.x - box.min.x;
    var y = box.max.y - box.min.y;
    var z = box.max.z - box.min.z;

    var center = new THREE.Vector3();
    box.getCenter(center);

    geometry = new THREE.BoxBufferGeometry(x, y, z);
    geometry.translate(center.x, center.y, center.z);

    var material = new THREE.MeshBasicMaterial({
        color: 0xffff00
    });

    material.wireframe = true;
    material.depthTest = false;

    THREE.Mesh.call(this, geometry, material);

    this.update();
}

BoxShapeHelper.prototype = Object.create(THREE.Mesh.prototype);
BoxShapeHelper.prototype.constructor = BoxShapeHelper;

BoxShapeHelper.prototype.update = function () {
    this.object.geometry.computeBoundingBox();

    this.position.copy(this.object.position);
    this.rotation.copy(this.object.rotation);
    this.scale.copy(this.object.scale);
};

export default BoxShapeHelper;