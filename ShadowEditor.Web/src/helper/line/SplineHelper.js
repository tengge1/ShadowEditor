import BaseHelper from '../BaseHelper';

/**
 * 曲线帮助器基类
 * @param {*} spline 
 */
function SplineHelper(spline) {
    BaseHelper.call(this, spline);
    this.update();
}

SplineHelper.prototype = Object.create(BaseHelper.prototype);
SplineHelper.prototype.constructor = SplineHelper;

SplineHelper.prototype.update = function () {
    while (this.children.length) {
        this.remove(this.children[0]);
    }

    this.object.userData.points.forEach(n => {
        var geometry = new THREE.BoxBufferGeometry(1, 1, 1);
        var material = new THREE.MeshBasicMaterial({
            color: 0xff0000
        });
        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(n);
        this.add(mesh);
    });
};

SplineHelper.prototype.updateObject = function (object) {
    var index = this.children.indexOf(object);
    if (index === -1) {
        console.warn(`SplineHelper: object is not an child.`);
        return;
    }
    this.object.userData.points[index].copy(object.position);
    this.object.update();
};

SplineHelper.prototype.raycast = function (raycaster, intersects) {
    var list = raycaster.intersectObjects(this.children);
    list.forEach(n => {
        intersects.push(n);
    });
};

export default SplineHelper;