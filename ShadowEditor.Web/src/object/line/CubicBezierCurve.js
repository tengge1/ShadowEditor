var ARC_SEGMENTS = 200;

/**
 * 三次贝塞尔曲线
 * @param {*} options 
 */
function CubicBezierCurve(options = {}) {
    var geometry = new THREE.BufferGeometry();
    geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(ARC_SEGMENTS * 3), 3));

    var material = new THREE.LineBasicMaterial({
        color: 0xff0000,
        opacity: 0.35
    });

    THREE.Line.call(this, geometry, material);

    this.name = '三次贝塞尔曲线';

    this.castShadow = true;

    Object.assign(this.userData, {
        type: 'CubicBezierCurve',
        v0: new THREE.Vector3(-10, 0, 0),
        v1: new THREE.Vector3(-5, 15, 0),
        v2: new THREE.Vector3(20, 15, 0),
        v3: new THREE.Vector3(10, 0, 0),
    });

    this.update();
}

CubicBezierCurve.prototype = Object.create(THREE.Line.prototype);
CubicBezierCurve.prototype.constructor = CubicBezierCurve;

CubicBezierCurve.prototype.update = function () {
    var curve = new THREE.CubicBezierCurve3(
        this.userData.v0,
        this.userData.v1,
        this.userData.v2,
        this.userData.v3
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

export default CubicBezierCurve;