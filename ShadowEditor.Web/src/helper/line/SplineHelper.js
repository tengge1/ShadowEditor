import BaseHelper from '../BaseHelper';

/**
 * 曲线帮助器基类
 * @param {*} app 
 */
function SplineHelper(app) {
    BaseHelper.call(this, app);
}

SplineHelper.prototype = Object.create(BaseHelper.prototype);
SplineHelper.prototype.constructor = SplineHelper;

SplineHelper.prototype.start = function () {
    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
};

SplineHelper.prototype.stop = function () {
    this.app.on(`objectSelected.${this.id}`, null);
};

SplineHelper.prototype.onObjectSelected = function () {

};

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
        mesh.position.copy(n).add(this.object.position);
        this.add(mesh);
    });
};

SplineHelper.prototype.updateObject = function (object) {
    var index = this.children.indexOf(object);
    if (index === -1) {
        console.warn(`SplineHelper: object is not an child.`);
        return;
    }
    this.object.userData.points[index].copy(this.object.position).multiplyScalar(-1).add(object.position);
    this.object.update();
};

SplineHelper.prototype.raycast = function (raycaster, intersects) {
    var list = raycaster.intersectObjects(this.children);
    list.forEach(n => {
        intersects.push(n);
    });
};

export default SplineHelper;