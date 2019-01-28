var ARC_SEGMENTS = 200;

/**
 * 曲线
 */
function Spline() {
    var geometry = new THREE.BufferGeometry();
    geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(ARC_SEGMENTS * 3), 3));

    var material = new THREE.LineBasicMaterial({
        color: 0xff0000,
        opacity: 0.35
    });

    THREE.Line.call(this, geometry, material);

    this.name = L_SPLINE;

    this.castShadow = true;

    this.updateSplineOutline();
}

Spline.prototype = Object.create(THREE.Line.prototype);
Spline.prototype.constructor = Spline;

Spline.prototype.updateSplineOutline = function () {
    var positions = [
        new THREE.Vector3(10, 20, 40),
        new THREE.Vector3(0, 30, -10),
        new THREE.Vector3(-40, 10, -20),
    ];

    var curve = new THREE.CatmullRomCurve3(positions);
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

export default Spline;