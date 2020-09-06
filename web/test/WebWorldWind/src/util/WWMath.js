/*
 * Copyright 2003-2006, 2009, 2017, United States Government, as represented by the Administrator of the
 * National Aeronautics and Space Administration. All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import Angle from '../geom/Angle';
import Rectangle from '../geom/Rectangle';

/**
 * Provides math constants and functions.
 * @exports WWMath
 */
var WWMath = {

    /**
     * Returns a number within the range of a specified minimum and maximum.
     * @param {Number} value The value to clamp.
     * @param {Number} minimum The minimum value to return.
     * @param {Number} maximum The maximum value to return.
     * @returns {Number} The minimum value if the specified value is less than the minimum, the maximum value if
     * the specified value is greater than the maximum, otherwise the value specified is returned.
     */
    clamp: function (value, minimum, maximum) {
        return value < minimum ? minimum : value > maximum ? maximum : value;
    },

    /**
     * Computes a number between two numbers.
     * @param amount {Number} The relative distance between the numbers at which to compute the new number. This
     * should normally be a number between 0 and 1 but whatever number is specified is applied.
     * @param {Number} value1 The first number.
     * @param {Number} value2 The second number.
     * @returns {Number} the computed value.
     */
    interpolate: function (amount, value1, value2) {
        return (1 - amount) * value1 + amount * value2;
    },

    /**
     * Returns the cube root of a specified value.
     * @param {Number} x The value whose cube root is computed.
     * @returns {Number} The cube root of the specified number.
     */
    cbrt: function (x) {
        // Use the built-in version if it exists. cbrt() is defined in ECMA6.
        if (typeof Math.cbrt === 'function') {
            return Math.cbrt(x);
        } else {
            return Math.pow(x, 1 / 3);
        }
    },

    /**
     * Computes the Cartesian intersection point of a specified line with an ellipsoid.
     * @param {Line} line The line for which to compute the intersection.
     * @param {Number} equatorialRadius The ellipsoid's major radius.
     * @param {Number} polarRadius The ellipsoid's minor radius.
     * @param {THREE.Vector3} result A pre-allocated THREE.Vector3 instance in which to return the computed point.
     * @returns {boolean} true if the line intersects the ellipsoid, otherwise false
     * @deprecated utilize the Globe.intersectsLine method attached implementation
     */
    computeEllipsoidalGlobeIntersection: function (line, equatorialRadius, polarRadius, result) {
        // Taken from "Mathematics for 3D Game Programming and Computer Graphics, Second Edition", Section 5.2.3.
        //
        // Note that the parameter n from in equations 5.70 and 5.71 is omitted here. For an ellipsoidal globe this
        // parameter is always 1, so its square and its product with any other value simplifies to the identity.

        var vx = line.direction.x,
            vy = line.direction.y,
            vz = line.direction.z,
            sx = line.origin.x,
            sy = line.origin.y,
            sz = line.origin.z,
            m = equatorialRadius / polarRadius, // ratio of the x semi-axis length to the y semi-axis length
            m2 = m * m,
            r2 = equatorialRadius * equatorialRadius, // nominal radius squared
            a = vx * vx + m2 * vy * vy + vz * vz,
            b = 2 * (sx * vx + m2 * sy * vy + sz * vz),
            c = sx * sx + m2 * sy * sy + sz * sz - r2,
            d = b * b - 4 * a * c, // discriminant
            t;

        if (d < 0) {
            return false;
        }
        else {
            t = (-b - Math.sqrt(d)) / (2 * a);
            result.x = sx + vx * t;
            result.y = sy + vy * t;
            result.z = sz + vz * t;
            return true;
        }
    },

    /**
     * Computes the Cartesian intersection point of a specified line with a triangle.
     * @param {Line} line The line for which to compute the intersection.
     * @param {THREE.Vector3} vertex0 The triangle's first vertex.
     * @param {THREE.Vector3} vertex1 The triangle's second vertex.
     * @param {THREE.Vector3} vertex2 The triangle's third vertex.
     * @param {THREE.Vector3} result A pre-allocated THREE.Vector3 instance in which to return the computed point.
     * @returns {boolean} true if the line intersects the triangle, otherwise false
     */
    computeTriangleIntersection: function (line, vertex0, vertex1, vertex2, result) {
        // Taken from Moller and Trumbore
        // https://www.cs.virginia.edu/~gfx/Courses/2003/ImageSynthesis/papers/Acceleration/Fast%20MinimumStorage%20RayTriangle%20Intersection.pdf

        var vx = line.direction.x,
            vy = line.direction.y,
            vz = line.direction.z,
            sx = line.origin.x,
            sy = line.origin.y,
            sz = line.origin.z,
            EPSILON = 0.00001;

        // find vectors for two edges sharing point a: vertex1 - vertex0 and vertex2 - vertex0
        var edge1x = vertex1.x - vertex0.x,
            edge1y = vertex1.y - vertex0.y,
            edge1z = vertex1.z - vertex0.z,
            edge2x = vertex2.x - vertex0.x,
            edge2y = vertex2.y - vertex0.y,
            edge2z = vertex2.z - vertex0.z;

        // Compute cross product of line direction and edge2
        var px = vy * edge2z - vz * edge2y,
            py = vz * edge2x - vx * edge2z,
            pz = vx * edge2y - vy * edge2x;

        // Get determinant
        var det = edge1x * px + edge1y * py + edge1z * pz; // edge1 dot p
        if (det > -EPSILON && det < EPSILON) { // if det is near zero then ray lies in plane of triangle
            return false;
        }

        var inv_det = 1.0 / det;

        // Compute distance for vertex A to ray origin: origin - vertex0
        var tx = sx - vertex0.x,
            ty = sy - vertex0.y,
            tz = sz - vertex0.z;

        // Calculate u parameter and test bounds: 1/det * t dot p
        var u = inv_det * (tx * px + ty * py + tz * pz);
        if (u < -EPSILON || u > 1 + EPSILON) {
            return false;
        }

        // Prepare to test v parameter: t cross edge1
        var qx = ty * edge1z - tz * edge1y,
            qy = tz * edge1x - tx * edge1z,
            qz = tx * edge1y - ty * edge1x;

        // Calculate v parameter and test bounds: 1/det * dir dot q
        var v = inv_det * (vx * qx + vy * qy + vz * qz);
        if (v < -EPSILON || u + v > 1 + EPSILON) {
            return false;
        }

        // Calculate the point of intersection on the line: t = 1/det * edge2 dot q
        var t = inv_det * (edge2x * qx + edge2y * qy + edge2z * qz);
        if (t < 0) {
            return false;
        } else {
            result.x = sx + vx * t;
            result.y = sy + vy * t;
            result.z = sz + vz * t;
            return true;
        }
    },

    computeIndexedTrianglesIntersection: function (line, points, indices, results) {
        var v0 = new THREE.Vector3(),
            v1 = new THREE.Vector3(),
            v2 = new THREE.Vector3(),
            iPoint = new THREE.Vector3();

        for (var i = 0, len = indices.length; i < len; i += 3) {
            var i0 = 3 * indices[i],
                i1 = 3 * indices[i + 1],
                i2 = 3 * indices[i + 2];

            v0.x = points[i0];
            v0.y = points[i0 + 1];
            v0.z = points[i0 + 2];

            v1.x = points[i1];
            v1.y = points[i1 + 1];
            v1.z = points[i1 + 2];

            v2.x = points[i2];
            v2.y = points[i2 + 1];
            v2.z = points[i2 + 2];

            if (WWMath.computeTriangleIntersection(line, v0, v1, v2, iPoint)) {
                results.push(iPoint);
                iPoint = new THREE.Vector3();
            }
        }

        return results.length > 0;
    },

    /**
     * Computes the absolute value of a specified value.
     * @param {Number} a The value whose absolute value to compute.
     * @returns {Number} The absolute value of the specified number.
     */
    fabs: function (a) {
        return a >= 0 ? a : -a;
    },

    /**
     * Computes the floating-point modulus of a specified number.
     * @param {Number} number The number whose modulus to compute.
     * @param {Number} modulus The modulus.
     * @returns {Number} The remainder after dividing the number by the modulus: number % modulus.
     */
    fmod: function (number, modulus) {
        return modulus === 0 ? 0 : number - Math.floor(number / modulus) * modulus;
    },

    /**
     * Returns the fractional part of a specified number
     * @param {Number} number The number whose fractional part to compute.
     * @returns {Number} The fractional part of the specified number: number - floor(number).
     */
    fract: function (number) {
        return number - Math.floor(number);
    },

    /**
     * Returns the integer modulus of a specified number. This differs from the % operator in that
     * the result is always positive when the modulus is positive. For example -1 % 10 = -1,
     * whereas mod(-1, 10) = 1.
     * @param {Number} number The number whose modulus to compute.
     * @param {Number} modulus The modulus.
     * @returns {Number} The remainder after dividing the number by the modulus.
     */
    mod: function (number, modulus) {
        return (number % modulus + modulus) % modulus;
    },

    /**
     * Returns the maximum of two specified numbers.
     * @param {Number} value1 The first value to compare.
     * @param {Number} value2 The second value to compare.
     * @returns {Number} The maximum of the two specified values.
     */
    max: function (value1, value2) {
        return value1 > value2 ? value1 : value2;
    },

    /**
     * Computes the axes of a local coordinate system on the specified globe, placing the resultant axes in the specified
     * axis arguments.
     *
     * Upon return the specified axis arguments contain three orthogonal axes identifying the X, Y, and Z axes. Each
     * axis has unit length.
     *
     * The local coordinate system is defined such that the Z axis maps to the globe's surface normal at the point, the
     * Y axis maps to the north pointing tangent, and the X axis maps to the east pointing tangent.
     *
     * @param {THREE.Vector3} origin The local coordinate system origin, in model coordinates.
     * @param {Globe} globe The globe the coordinate system is relative to.
     * @param {THREE.Vector3} xAxisResult A pre-allocated THREE.Vector3 in which to return the computed X axis.
     * @param {THREE.Vector3} yAxisResult A pre-allocated THREE.Vector3 in which to return the computed Y axis.
     * @param {THREE.Vector3} zAxisResult A pre-allocated THREE.Vector3 in which to return the computed Z axis.
     */
    localCoordinateAxesAtPoint: function (origin, globe, xAxisResult, yAxisResult, zAxisResult) {
        var x = origin.x,
            y = origin.y,
            z = origin.z;

        // Compute the z axis from the surface normal in model coordinates. This axis is used to determine the other two
        // axes, and is the only constant in the computations below.
        globe.surfaceNormalAtPoint(x, y, z, zAxisResult);

        // Compute the y axis from the north pointing tangent in model coordinates. This axis is known to be orthogonal to
        // the z axis, and is therefore used to compute the x axis.
        globe.northTangentAtPoint(x, y, z, yAxisResult);

        // Compute the x axis as the cross product of the y and z axes. This ensures that the x and z axes are orthogonal.
        xAxisResult.set(yAxisResult.x, yAxisResult.y, yAxisResult.z);
        xAxisResult.cross(zAxisResult);
        xAxisResult.normalize();

        // Re-compute the y axis as the cross product of the z and x axes. This ensures that all three axes are orthogonal.
        // Though the initial y axis computed above is likely to be very nearly orthogonal, we re-compute it using cross
        // products to reduce the effect of floating point rounding errors caused by working with Earth sized coordinates.
        yAxisResult.set(zAxisResult.x, zAxisResult.y, zAxisResult.z);
        yAxisResult.cross(xAxisResult);
        yAxisResult.normalize();
    },

    /**
     * Computes the distance to a globe's horizon from a viewer at a given altitude.
     *
     * Only the globe's ellipsoid is considered; terrain height is not incorporated. This returns zero if the radius is zero
     * or if the altitude is less than or equal to zero.
     *
     * @param {Number} radius The globe's radius, in meters.
     * @param {Number} altitude The viewer's altitude above the globe, in meters.
     * @returns {Number} The distance to the horizon, in model coordinates.
     */
    horizonDistanceForGlobeRadius: function (radius, altitude) {
        return radius > 0 && altitude > 0 ? Math.sqrt(altitude * (2 * radius + altitude)) : 0;
    },

    /**
     * Computes the near clip distance that corresponds to a specified far clip distance and resolution at the far clip
     * plane.
     *
     * This computes a near clip distance appropriate for use in [perspectiveFrustumRect]{@link WWMath#perspectiveFrustumRectangle}
     * and [setToPerspectiveProjection]{@link Matrix#setToPerspectiveProjection}. This returns zero if either the distance or the
     * resolution are zero.
     *
     * @param {Number} farDistance The far clip distance, in meters.
     * @param {Number} farResolution The depth resolution at the far clip plane, in meters.
     * @param {Number} depthBits The number of bit-planes in the depth buffer.
     * @returns {Number} The near clip distance, in meters.
     */
    perspectiveNearDistanceForFarDistance: function (farDistance, farResolution, depthBits) {
        var maxDepthValue = (1 << depthBits) - 1;

        return farDistance / (maxDepthValue / (1 - farResolution / farDistance) - maxDepthValue + 1);
    },

    /**
     * Computes the maximum near clip distance for a perspective projection that avoids clipping an object at a
     * given distance from the eye point.
     * <p/>
     * This computes a near clip distance appropriate for use in perspectiveFrustumRect and
     * Matrix.setToPerspectiveProjection. The given distance should specify the smallest distance between the
     * eye and the object being viewed, but may be an approximation if an exact distance is not required.
     *
     * @param {Number} viewportWidth The viewport width, in screen coordinates.
     * @param {Number} viewportHeight The viewport height, in screen coordinates.
     * @param {Number} distanceToSurface The distance from the perspective eye point to the nearest object, in
     * meters.
     * @returns {Number} The maximum near clip distance, in meters.
     */
    perspectiveNearDistance: function (viewportWidth, viewportHeight, distanceToSurface) {
        // Compute the maximum near clip distance that avoids clipping an object at the specified distance from
        // the eye. Since the furthest points on the near clip rectangle are the four corners, we compute a near
        // distance that puts any one of these corners exactly at the given distance. The distance to one of the
        // four corners can be expressed in terms of the near clip distance, given distance to a corner 'd',
        // near distance 'n', and aspect ratio 'a':
        //
        // d*d = x*x + y*y + z*z
        // d*d = (n*n/4 * a*a) + (n*n/4) + (n*n)
        //
        // Extracting 'n*n/4' from the right hand side gives:
        //
        // d*d = (n*n/4) * (a*a + 1 + 4)
        // d*d = (n*n/4) * (a*a + 5)
        //
        // Finally, solving for 'n' gives:
        //
        // n*n = 4 * d*d / (a*a + 5)
        // n = 2 * d / sqrt(a*a + 5)

        // Assumes a 45 degree horizontal field of view.
        var aspectRatio = viewportHeight / viewportWidth;

        return 2 * distanceToSurface / Math.sqrt(aspectRatio * aspectRatio + 5);
    },

    /**
     * Computes the coordinates of a rectangle carved out of a perspective projection's frustum at a given
     * distance in model coordinates. This returns an empty rectangle if the specified distance is zero.
     *
     * @param {Number} viewportWidth The viewport width, in screen coordinates.
     * @param {Number} viewportHeight The viewport height, in screen coordinates.
     * @param {Number} distance The distance along the negative Z axis, in model coordinates.
     * @returns {Rectangle} The frustum rectangle, in model coordinates.
     */
    perspectiveFrustumRectangle: function (viewportWidth, viewportHeight, distance) {
        // Assumes a 45 degree horizontal field of view.
        var width = distance,
            height = distance * viewportHeight / viewportWidth;

        return new Rectangle(-width / 2, -height / 2, width, height);
    },

    /**
     * Computes the vertical size of a pixel in model coordinates at a given distance from the eye point in a
     * perspective projection. This returns zero if the specified distance is zero. The returned size is
     * undefined if the distance is less than zero.
     * <p/>
     * This method assumes the model of a screen composed of rectangular pixels, where pixel coordinates denote
     * infinitely thin space between pixels. The units of the returned size are in model coordinates per pixel
     * (usually meters per pixel).
     *
     * @param {Number} viewportWidth The viewport width, in screen coordinates.
     * @param {Number} viewportHeight The viewport height, in screen coordinates.
     * @param {Number} distance The distance from the perspective eye point at which to determine pixel size, in
     * model coordinates.
     * @returns {Number} The pixel size at the specified distance from the eye point, in model coordinates per
     * pixel.
     */
    perspectivePixelSize: function (viewportWidth, viewportHeight, distance) {
        var frustumHeight = WWMath.perspectiveFrustumRectangle(viewportWidth, viewportHeight, distance).height;
        return frustumHeight / viewportHeight;
    },

    /**
     * Computes the bounding rectangle for a unit quadrilateral after applying a transformation matrix to that
     * quadrilateral.
     * @param {THREE.Matrix4} transformMatrix The matrix to apply to the unit quadrilateral.
     * @returns {Rectangle} The computed bounding rectangle.
     */
    boundingRectForUnitQuad: function (transformMatrix) {
        var m = transformMatrix,
            // transform of (0, 0)
            x1 = m[3],
            y1 = m[7],
            // transform of (1, 0)
            x2 = m[0] + m[3],
            y2 = m[4] + m[7],
            // transform of (0, 1)
            x3 = m[1] + m[3],
            y3 = m[5] + m[7],
            // transform of (1, 1)
            x4 = m[0] + m[1] + m[3],
            y4 = m[4] + m[5] + m[7],
            minX = Math.min(Math.min(x1, x2), Math.min(x3, x4)),
            maxX = Math.max(Math.max(x1, x2), Math.max(x3, x4)),
            minY = Math.min(Math.min(y1, y2), Math.min(y3, y4)),
            maxY = Math.max(Math.max(y1, y2), Math.max(y3, y4));

        return new Rectangle(minX, minY, maxX - minX, maxY - minY);
    },

    /**
     * Indicates whether a specified value is a power of two.
     * @param {Number} value The value to test.
     * @returns {boolean} <code>true</code> if the specified value is a power of two,
     * otherwise <code>false</code>.
     */
    isPowerOfTwo: function (value) {
        return value != 0 && (value & value - 1) === 0;
    },

    /**
     * Determine the sign of a number.
     * @param {Number} value The value to determine the sign of.
     * @returns {Number} 1, -1, or 0, depending on the sign of the value.
     */
    signum: function (value) {
        return value > 0 ? 1 : value < 0 ? -1 : 0;
    },

    /**
     * Calculates the Gudermannian inverse used to unproject Mercator projections.
     * @param {Number} latitude The latitude in degrees.
     * @returns {Number} The Gudermannian inverse for the specified latitude.
     */
    gudermannianInverse: function (latitude) {
        return Math.log(Math.tan(Math.PI / 4 + latitude * Angle.DEGREES_TO_RADIANS / 2)) / Math.PI;
    },

    epsg3857ToEpsg4326: function (easting, northing) {
        var r = 6.3781e6,
            latRadians = Math.PI / 2 - 2 * Math.atan(Math.exp(-northing / r)),
            lonRadians = easting / r;

        return [
            WWMath.clamp(latRadians * Angle.RADIANS_TO_DEGREES, -90, 90),
            WWMath.clamp(lonRadians * Angle.RADIANS_TO_DEGREES, -180, 180)
        ];
    },

    /**
     * Returns the value that is the nearest power of 2 less than or equal to the given value.
     * @param {Number} value the reference value. The power of 2 returned is less than or equal to this value.
     * @returns {Number} the value that is the nearest power of 2 less than or equal to the reference value
     */
    powerOfTwoFloor: function (value) {
        var power = Math.floor(Math.log(value) / Math.log(2));
        return Math.pow(2, power);
    },

    /**
     * Restricts an angle to the range [0, 360] degrees, wrapping angles outside the range.
     * Wrapping takes place as though traversing the edge of a unit circle;
     * angles less than 0 wrap back to 360, while angles greater than 360 wrap back to 0.
     *
     * @param {Number} degrees the angle to wrap in degrees
     *
     * @return {Number} the specified angle wrapped to [0, 360] degrees
     */
    normalizeAngle360: function (degrees) {
        var angle = degrees % 360;
        return angle >= 0 ? angle : angle < 0 ? 360 + angle : 360 - angle;
    },

    /**
     * 墨卡托投影（弧度）
     * @param {Number} lat 纬度（弧度）
     * @returns {Number} 投影纬度（弧度）
     * @see https://github.com/d3/d3-geo/blob/master/src/projection/mercator.js
     */
    _mercatorLat: function (lat) {
        return Math.log(Math.tan((Math.PI / 2 + lat) / 2));
    },

    /**
     * 墨卡托投影（角度）
     * @param {Number} lat 纬度（角度）
     * @returns {Number} 投影纬度（角度）
     * @see https://github.com/d3/d3-geo/blob/master/src/projection/mercator.js
     */
    mercatorLat: function (lat) {
        return this._mercatorLat(lat * Angle.DEGREES_TO_RADIANS) * Angle.RADIANS_TO_DEGREES;
    },

    /**
     * 墨卡托投影反算（弧度）
     * @param {Number} y 墨卡托投影Y坐标
     * @returns {Number} 纬度（弧度）
     * @see https://github.com/d3/d3-geo/blob/master/src/projection/mercator.js
     */
    _mercatorLatInvert: function (y) {
        return 2 * Math.atan(Math.exp(y)) - Math.PI / 2;
    },

    /**
     * 墨卡托投影反算（角度）
     * @param {Number} y 墨卡托投影Y坐标（角度）
     * @returns {Number} 纬度（角度）
     * @see https://github.com/d3/d3-geo/blob/master/src/projection/mercator.js
     */
    mercatorLatInvert: function (y) {
        return this._mercatorLatInvert(y * Angle.DEGREES_TO_RADIANS) * Angle.RADIANS_TO_DEGREES;
    },

    /**
     * 计算两个经纬度之间距离(弧度)
     * @param {Number} lon1 经度1(弧度)
     * @param {Number} lat1 纬度1(弧度)
     * @param {Number} lon2 经度2(弧度)
     * @param {Number} lat2 纬度2(弧度)
     * @returns {Number} 距离（米）
     * @see https://www.xuebuyuan.com/2173606.html
     */
    _getDistance: function (lon1, lat1, lon2, lat2) {
        return 2 * 6378137 * Math.asin(Math.sqrt(Math.pow(Math.sin((lat1 - lat2) / 2), 2) +
            Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin((lon1 - lon2) / 2), 2)));
    },

    /**
     * 计算两个经纬度之间距离(角度)
     * @param {*} lon1 经度1(角度)
     * @param {*} lat1 纬度1(角度)
     * @param {*} lon2 经度2(角度)
     * @param {*} lat2 纬度2(角度)
     * @returns {Number} 距离（米）
     * @see https://www.xuebuyuan.com/2173606.html
     */
    getDistance: function (lon1, lat1, lon2, lat2) {
        lon1 *= Angle.DEGREES_TO_RADIANS;
        lat1 *= Angle.DEGREES_TO_RADIANS;
        lon2 *= Angle.DEGREES_TO_RADIANS;
        lat2 *= Angle.DEGREES_TO_RADIANS;

        return this._getDistance(lon1, lat1, lon2, lat2);
    },
    MAX_LAT: 180 // this.mercatorLatInvert(180) = 85.0511287798066
};

export default WWMath;
