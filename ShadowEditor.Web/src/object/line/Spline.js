var ARC_SEGMENTS = 200;

/**
 * 曲线
 * @param {*} options 
 */
function Spline(options = {}) {
    var geometry = new THREE.BufferGeometry();
    geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(ARC_SEGMENTS * 3), 3));

    var material = new THREE.LineBasicMaterial({
        color: 0xff0000,
        opacity: 0.35
    });

    THREE.Line.call(this, geometry, material);

    this.name = L_SPLINE;

    this.castShadow = true;

    Object.assign(this.userData, {
        type: 'Spline', // CatmullRomCurve
        points: options.points || [
            new THREE.Vector3(10, 20, 40),
            new THREE.Vector3(0, 30, -10),
            new THREE.Vector3(-40, 10, -20),
        ],
        closed: options.closed || false,
        curveType: options.curveType || 'catmullrom', // centripetal, chordal and catmullrom
        tension: options.tension || 0.5
    });

    this.update();
}

Spline.prototype = Object.create(THREE.Line.prototype);
Spline.prototype.constructor = Spline;

Spline.prototype.update = function () {
    var curve = new THREE.CatmullRomCurve3(
        this.userData.points,
        this.userData.closed,
        this.userData.curveType,
        this.userData.tension
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

export default Spline;