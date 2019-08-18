var ARC_SEGMENTS = 200;

/**
 * 二次贝塞尔曲线
 * @param {*} options 
 */
function QuadraticBezierCurve(options = {}) {
    var geometry = new THREE.BufferGeometry();
    geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(ARC_SEGMENTS * 3), 3));

    var material = new THREE.LineBasicMaterial({
        color: 0xff0000,
        opacity: 0.35
    });

    THREE.Line.call(this, geometry, material);

    this.name = _t('Quadratic Bezier Curve');

    this.castShadow = true;

    Object.assign(this.userData, {
        type: 'QuadraticBezierCurve',
        points: options.points || [
            new THREE.Vector3(-10, 0, 0),
            new THREE.Vector3(20, 15, 0),
            new THREE.Vector3(10, 0, 0)
        ]
    });

    this.update();
}

QuadraticBezierCurve.prototype = Object.create(THREE.Line.prototype);
QuadraticBezierCurve.prototype.constructor = QuadraticBezierCurve;

QuadraticBezierCurve.prototype.update = function () {
    var curve = new THREE.QuadraticBezierCurve3(
        this.userData.points[0],
        this.userData.points[1],
        this.userData.points[2]
    );

    var position = this.geometry.attributes.position;

    var point = new THREE.Vector3();

    for (var i = 0; i < ARC_SEGMENTS; i++) {
        var t = i / (ARC_SEGMENTS - 1);
        curve.getPoint(t, point);
        position.setXYZ(i, point.x, point.y, point.z);
    }

    position.needsUpdate = true;
};

export default QuadraticBezierCurve;