import WWMath from './util/WWMath';
import Vec3 from './geom/Vec3';

/**
 * Multiplies this matrix by a look at viewing matrix for the specified globe.
 * <p>
 * A look at viewing matrix places the center of the screen at the specified lookAtPosition. By default the viewer is
 * looking straight down at the look at position from the specified range, with the globe's normal vector coming out of
 * the screen and north pointing toward the top of the screen.
 * <p>
 * Range specifies the distance between the look at position and the viewer's eye point. Range values may be any positive
 * real number. A range of 0 places the eye point at the look at point, while a positive range moves the eye point away
 * from but still looking at the look at point.
 * <p>
 * Heading specifies the viewer's azimuth, or its angle relative to North. Heading values range from -180 degrees to 180
 * degrees. A heading of 0 degrees looks North, 90 degrees looks East, +-180 degrees looks South, and -90 degrees looks
 * West.
 * <p>
 * Tilt specifies the viewer's angle relative to the surface. Tilt values range from -180 degrees to 180 degrees. A tilt
 * of 0 degrees looks straight down at the globe's surface, 90 degrees looks at the horizon, and 180 degrees looks
 * straight up. Tilt values greater than 180 degrees cause the viewer to turn upside down, and are therefore rarely used.
 * <p>
 * Roll specifies the viewer's angle relative to the horizon. Roll values range from -180 degrees to 180 degrees. A roll
 * of 0 degrees orients the viewer so that up is pointing to the top of the screen, at 90 degrees up is pointing to the
 * right, at +-180 degrees up is pointing to the bottom, and at -90 up is pointing to the left.
 *
 * @param {Position} lookAtPosition The viewer's geographic look at position relative to the specified globe.
 * @param {Number} range The distance between the eye point and the look at point, in model coordinates.
 * @param {Number} heading The viewer's angle relative to north, in degrees.
 * @param {Number} tilt The viewer's angle relative to the surface, in degrees.
 * @param {Number} roll The viewer's angle relative to the horizon, in degrees.
 * @param {Globe} globe The globe the viewer is looking at.
 * @returns {THREE.Matrix4} result
 */
THREE.Matrix4.prototype.multiplyByLookAtModelview = function (lookAtPosition, range, heading, tilt, roll, globe) {
    // Translate the eye point along the positive z axis while keeping the look at point in the center of the viewport.
    this.makeTranslation(0, 0, -range); // 别忘了转置
    // Transform the origin to the local coordinate system at the look at position, and rotate the viewer by the
    // specified heading, tilt and roll.
    this.multiplyByFirstPersonModelview(lookAtPosition, heading, tilt, roll, globe);
    return this;
};

/**
 * Multiplies this matrix by a first person viewing matrix for the specified globe.
 * <p>
 * A first person viewing matrix places the viewer's eye at the specified eyePosition. By default the viewer is looking
 * straight down at the globe's surface from the eye position, with the globe's normal vector coming out of the screen
 * and north pointing toward the top of the screen.
 * <p>
 * Heading specifies the viewer's azimuth, or its angle relative to North. Heading values range from -180 degrees to 180
 * degrees. A heading of 0 degrees looks North, 90 degrees looks East, +-180 degrees looks South, and -90 degrees looks
 * West.
 * <p>
 * Tilt specifies the viewer's angle relative to the surface. Tilt values range from -180 degrees to 180 degrees. A tilt
 * of 0 degrees looks straight down at the globe's surface, 90 degrees looks at the horizon, and 180 degrees looks
 * straight up. Tilt values greater than 180 degrees cause the viewer to turn upside down, and are therefore rarely used.
 * <p>
 * Roll specifies the viewer's angle relative to the horizon. Roll values range from -180 degrees to 180 degrees. A roll
 * of 0 degrees orients the viewer so that up is pointing to the top of the screen, at 90 degrees up is pointing to the
 * right, at +-180 degrees up is pointing to the bottom, and at -90 up is pointing to the left.
 *
 * @param {Position} eyePosition The viewer's geographic eye position relative to the specified globe.
 * @param {Number} heading The viewer's angle relative to north, in degrees.
 * @param {Number} tilt The viewer's angle relative to the surface, in degrees.
 * @param {Number} roll The viewer's angle relative to the horizon, in degrees.
 * @param {Globe} globe The globe the viewer is looking at.
 */
THREE.Matrix4.prototype.multiplyByFirstPersonModelview = function () {
    var eyePoint = new Vec3(0, 0, 0);
    var xAxis = new Vec3(0, 0, 0);
    var yAxis = new Vec3(0, 0, 0);
    var zAxis = new Vec3(0, 0, 0);
    var mat4 = new THREE.Matrix4();
    return function (eyePosition, heading, tilt, roll, globe) {
        // Roll. Rotate the eye point in a counter-clockwise direction about the z axis. Note that we invert the sines used
        // in the rotation matrix in order to produce the counter-clockwise rotation. We invert only the cosines since
        // sin(-a) = -sin(a) and cos(-a) = cos(a).
        var c = Math.cos(roll * THREE.Math.DEG2RAD);
        var s = Math.sin(roll * THREE.Math.DEG2RAD);
        mat4.set(
            c, s, 0, 0,
            -s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        );
        this.multiply(mat4);

        // Tilt. Rotate the eye point in a counter-clockwise direction about the x axis. Note that we invert the sines used
        // in the rotation matrix in order to produce the counter-clockwise rotation. We invert only the cosines since
        // sin(-a) = -sin(a) and cos(-a) = cos(a).
        c = Math.cos(tilt * THREE.Math.DEG2RAD);
        s = Math.sin(tilt * THREE.Math.DEG2RAD);
        mat4.set(
            1, 0, 0, 0,
            0, c, s, 0,
            0, -s, c, 0,
            0, 0, 0, 1
        );
        this.multiply(mat4);

        // Heading. Rotate the eye point in a clockwise direction about the z axis again. This has a different effect than
        // roll when tilt is non-zero because the viewer is no longer looking down the z axis.
        c = Math.cos(heading * THREE.Math.DEG2RAD);
        s = Math.sin(heading * THREE.Math.DEG2RAD);
        mat4.set(
            c, -s, 0, 0,
            s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        );
        this.multiply(mat4);

        // Compute the eye point in model coordinates. This point is mapped to the origin in the look at transform below.
        globe.computePointFromPosition(eyePosition.latitude, eyePosition.longitude, eyePosition.altitude, eyePoint);
        var ex = eyePoint[0];
        var ey = eyePoint[1];
        var ez = eyePoint[2];

        // Transform the origin to the local coordinate system at the eye point.
        WWMath.localCoordinateAxesAtPoint(eyePoint, globe, xAxis, yAxis, zAxis);
        var xx = xAxis[0];
        var xy = xAxis[1];
        var xz = xAxis[2];
        var yx = yAxis[0];
        var yy = yAxis[1];
        var yz = yAxis[2];
        var zx = zAxis[0];
        var zy = zAxis[1];
        var zz = zAxis[2];

        mat4.set(
            xx, xy, xz, -xx * ex - xy * ey - xz * ez,
            yx, yy, yz, -yx * ex - yy * ey - yz * ez,
            zx, zy, zz, -zx * ex - zy * ey - zz * ez,
            0, 0, 0, 1
        );

        this.multiply(mat4);

        return this;
    };
}();