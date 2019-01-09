/**
 * 立方体帮助器
 * @param {*} object 
 */
function BoxShapeHelper(object) {
    this.object = object;

    var geometry = this.object.geometry;
    geometry.computeBoundingBox();

    var box = geometry.boundingBox;
    box.applyMatrix4(this.object.matrixWorld);

    var x = box.max.x - box.min.x;
    var y = box.max.y - box.min.y;
    var z = box.max.z - box.min.z;

    var geometry = new THREE.BoxBufferGeometry(x, y, z);
    var material = new THREE.MeshBasicMaterial({
        color: 0xffff00
    });

    material.wireframe = true;
    material.wireframeLinewidth = 10;
    material.polygonOffset = true;
    material.polygonOffsetFactor = -1;
    material.polygonOffsetUnits = -1;

    THREE.Mesh.call(this, geometry, material);
};

BoxShapeHelper.prototype = Object.create(THREE.Mesh.prototype);
BoxShapeHelper.prototype.constructor = BoxShapeHelper;

BoxShapeHelper.prototype.update = function () {
    this.position.copy(this.object.position);
    this.rotation.copy(this.object.rotation);
    this.scale.copy(this.object.scale);
};

export default BoxShapeHelper;