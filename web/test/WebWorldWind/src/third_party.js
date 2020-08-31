import WWMath from './util/WWMath';

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
    var eyePoint = new THREE.Vector3();
    var xAxis = new THREE.Vector3();
    var yAxis = new THREE.Vector3();
    var zAxis = new THREE.Vector3();
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
        var ex = eyePoint.x;
        var ey = eyePoint.y;
        var ez = eyePoint.z;

        // Transform the origin to the local coordinate system at the eye point.
        WWMath.localCoordinateAxesAtPoint(eyePoint, globe, xAxis, yAxis, zAxis);
        var xx = xAxis.x;
        var xy = xAxis.y;
        var xz = xAxis.z;
        var yx = yAxis.x;
        var yy = yAxis.y;
        var yz = yAxis.z;
        var zx = zAxis.x;
        var zy = zAxis.y;
        var zz = zAxis.z;

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

/**
* Returns this viewing matrix's eye point.
* <p>
* This method assumes that this matrix represents a viewing matrix. If this does not represent a viewing matrix the
* results are undefined.
* <p>
* In model coordinates, a viewing matrix's eye point is the point the viewer is looking from and maps to the center of
* the screen.
*
* @param {THREE.Matrix4} mat4 A pre-allocated {@link THREE.Vector3} in which to return the extracted values.
* @return {THREE.Vector3} The specified result argument containing the viewing matrix's eye point, in model coordinates.
*/
THREE.Vector3.prototype.copyEyePoint = function (mat4) {
    // The eye point of a modelview matrix is computed by transforming the origin (0, 0, 0, 1) by the matrix's inverse.
    // This is equivalent to transforming the inverse of this matrix's translation components in the rightmost column by
    // the transpose of its upper 3x3 components.
    var elem = mat4.elements;

    this.x = -(elem[0] * elem[12]) - elem[1] * elem[13] - elem[2] * elem[14];
    this.y = -(elem[4] * elem[12]) - elem[5] * elem[13] - elem[6] * elem[14];
    this.z = -(elem[8] * elem[12]) - elem[9] * elem[13] - elem[10] * elem[14];

    return this;
};

/**
 * Extracts and returns a new matrix whose upper 3x3 entries are identical to those of this matrix,
 * and whose fourth row and column are 0 except for a 1 in the diagonal position.
 * @param {THREE.Matrix4} target the result.
 * @returns {THREE.Matrix4} The upper 3x3 matrix of this matrix.
 */
THREE.Matrix4.prototype.upper3By3 = function (target) {
    if (!target) {
        target = new THREE.Matrix4();
    }
    var a = target.elements, b = this.elements;

    a[0] = b[0];
    a[1] = b[1];
    a[2] = b[2];

    a[4] = b[4];
    a[5] = b[5];
    a[6] = b[6];

    a[8] = b[8];
    a[9] = b[9];
    a[10] = b[10];

    return target;
};

THREE.Frustum.prototype.applyMatrix4 = function (mat4) {
    this.planes.forEach(n => {
        n.applyMatrix4(mat4);
    });
    return this;
};

THREE.Frustum.prototype.normalize = function (mat4) {
    this.planes.forEach(n => {
        n.normalize(mat4);
    });
    return this;
};


/**
 * Sets this matrix to a screen projection matrix for the specified viewport dimensions.
 * <p>
 * A screen projection matrix is an orthographic projection that assumes that points in model coordinates
 * represent a screen point and a depth. Screen projection matrices therefore map model coordinates directly
 * into screen coordinates without modification. A point's xy coordinates are interpreted as literal screen
 * coordinates and must be in the viewport to be visible. A point's z coordinate is interpreted as a depth value
 * that ranges from 0 to 1. Additionally, the screen projection matrix preserves the depth value returned by
 * [DrawContext.project]{@link DrawContext#project}.
 *
 * @param {Number} viewportWidth The viewport width, in screen coordinates.
 * @param {Number} viewportHeight The viewport height, in screen coordinates.
 */
THREE.Matrix4.prototype.setToScreenProjection = function (viewportWidth, viewportHeight) {
    // Taken from Mathematics for 3D Game Programming and Computer Graphics, Second Edition, equation 4.57.
    // Simplified to assume that the viewport origin is (0, 0).
    //
    // The third row of this projection matrix is configured so that points with z coordinates representing
    // depth values ranging from 0 to 1 are not modified after transformation into window coordinates. This
    // projection matrix maps z values in the range [0, 1] to the range [-1, 1] by applying the following
    // function to incoming z coordinates:
    //
    // zp = z0 * 2 - 1
    //
    // Where 'z0' is the point's z coordinate and 'zp' is the projected z coordinate. The GPU then maps the
    // projected z coordinate into window coordinates in the range [0, 1] by applying the following function:
    //
    // zw = zp * 0.5 + 0.5
    //
    // The result is that a point's z coordinate is effectively passed to the GPU without modification.

    var elems = this.elements;
    // Row 1
    elems[0] = 2 / viewportWidth;
    elems[1] = 0;
    elems[2] = 0;
    elems[3] = -1;
    // Row 2
    elems[4] = 0;
    elems[5] = 2 / viewportHeight;
    elems[6] = 0;
    elems[7] = -1;
    // Row 3
    elems[8] = 0;
    elems[9] = 0;
    elems[10] = 2;
    elems[11] = -1;
    // Row 4
    elems[12] = 0;
    elems[13] = 0;
    elems[14] = 0;
    elems[15] = 1;

    return this;
};

/**
 * Sets this matrix to one that flips and shifts the y-axis.
 * <p>
 * The resultant matrix maps Y=0 to Y=1 and Y=1 to Y=0. All existing values are overwritten. This matrix is
 * usually used to change the coordinate origin from an upper left coordinate origin to a lower left coordinate
 * origin. This is typically necessary to align the coordinate system of images (top-left origin) with that of
 * OpenGL (bottom-left origin).
 * @returns {THREE.Matrix4} This matrix set to values described above.
 */
THREE.Matrix4.prototype.setToUnitYFlip = function () {
    var elem = this.elements;

    elem[0] = 1;
    elem[1] = 0;
    elem[2] = 0;
    elem[3] = 0;
    elem[4] = 0;
    elem[5] = -1;
    elem[6] = 0;
    elem[7] = 0;
    elem[8] = 0;
    elem[9] = 0;
    elem[10] = 1;
    elem[11] = 0;
    elem[12] = 0;
    elem[13] = 1;
    elem[14] = 0;
    elem[15] = 1;

    return this;
};
