/**
 * 立方体形状帮助器
 * @param {*} x 
 * @param {*} y 
 * @param {*} z 
 */
function BoxShapeHelper(x = 1.0, y = 1.0, z = 1.0) {
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

};

export default BoxShapeHelper;