var ARC_SEGMENTS = 200;

/**
 * 曲线
 * @param {*} points 
 */
function Spline(points) {
    var geometry = new THREE.BufferGeometry();
    geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(ARC_SEGMENTS * 3), 3));

    var material = new THREE.LineBasicMaterial({
        color: 0xff0000,
        opacity: 0.35
    });

    THREE.Line.call(this, geometry, material);

    this.name = L_SPLINE;

    this.castShadow = true;

    this.userData.points = points || [
        new THREE.Vector3(10, 20, 40),
        new THREE.Vector3(0, 30, -10),
        new THREE.Vector3(-40, 10, -20),
    ];

    this.update();
}

Spline.prototype = Object.create(THREE.Line.prototype);
Spline.prototype.constructor = Spline;

Spline.prototype.update = function () {
    var curve = new THREE.CatmullRomCurve3(this.userData.points);
    curve.curveType = 'catmullrom';

    var position = this.geometry.attributes.position;

    var point = new THREE.Vector3();

    for (var i = 0; i < ARC_SEGMENTS; i++) {
        var t = i / (ARC_SEGMENTS - 1);
        curve.getPoint(t, point);
        position.setXYZ(i, point.x, point.y, point.z);
    }

    position.needsUpdate = true;
};

// ------------------------- 帮助器 ------------------------------

Spline.prototype.createHelper = function () {
    var points = this.userData.points;

    var obj3d = new THREE.Object3D();
    obj3d.object = this;
    obj3d.update = this.updateHelper.bind(this);

    var geometry = new THREE.BoxBufferGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({
        color: 0xff0000
    });

    points.forEach(n => {
        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(n);
        obj3d.add(mesh);
    });

    this.helper = obj3d;

    return obj3d;
};

Spline.prototype.updateHelper = function () {
    this.userData.points.length = 0;

    this.helper.children.forEach(n => {
        this.userData.points.push(n.position);
    });

    this.update();
};

export default Spline;