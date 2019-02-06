import BaseHelper from '../BaseHelper';

/**
 * 曲线帮助器基类
 * @param {*} spline 
 */
function SplineHelper(spline) {
    BaseHelper.call(this, spline);

    this.points = [];

    this.update();
}

SplineHelper.prototype = Object.create(BaseHelper.prototype);
SplineHelper.prototype.constructor = SplineHelper;

SplineHelper.prototype.update = function () {
    for (var i = 0; i < this.points.length; i++) {
        this.remove(this.points[i]);
    }
    this.points.length = 0;

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

SplineHelper.prototype.updateObject = function () {

};

export default SplineHelper;