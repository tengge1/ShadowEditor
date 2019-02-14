import BaseHelper from '../BaseHelper';

/**
 * 曲线帮助器基类
 * @param {*} app 
 */
function SplineHelper(app) {
    BaseHelper.call(this, app);
    this.box = [];
}

SplineHelper.prototype = Object.create(BaseHelper.prototype);
SplineHelper.prototype.constructor = SplineHelper;

SplineHelper.prototype.start = function () {
    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

SplineHelper.prototype.stop = function () {
    this.app.on(`objectSelected.${this.id}`, null);
    this.app.on(`objectChanged.${this.id}`, null);
};

SplineHelper.prototype.onObjectSelected = function (object) {
    if (object === null) {
        this.onCancelSelectLine();
    } else if (object.userData && (
        object.userData.type === 'LineCurve' ||
        object.userData.type === 'CatmullRomCurve' ||
        object.userData.type === 'QuadraticBezierCurve' ||
        object.userData.type === 'CubicBezierCurve'
    )) {
        this.onSelectLine(object);
    }
};

SplineHelper.prototype.onObjectChanged = function (obj) {
    if (!obj.userData || !(obj.userData.type === 'helper')) {
        return;
    }

    var object = obj.userData.object;

    var index = this.box.indexOf(obj);

    if (index > -1) {
        object.userData.points[index].copy(object.position).multiplyScalar(-1).add(obj.position);
        object.update();
    }
};

SplineHelper.prototype.onSelectLine = function (object) {
    var scene = this.app.editor.sceneHelpers;

    this.onCancelSelectLine();

    var geometry = new THREE.BoxBufferGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({
        color: 0xff0000
    });

    object.userData.points.forEach(n => {
        var mesh = new THREE.Mesh(geometry, material);

        mesh.position.copy(n);

        Object.assign(mesh.userData, {
            type: 'helper',
            object: object
        });

        scene.add(mesh);
        this.box.push(mesh);
    });
};

SplineHelper.prototype.onCancelSelectLine = function () {
    var scene = this.app.editor.sceneHelpers;

    this.box.forEach(n => {
        scene.remove(n);
        delete n.userData.object;
    });

    this.box.length = 0;
};

export default SplineHelper;