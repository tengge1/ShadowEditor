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
/**
 * @exports Plane
 */
import ArgumentError from '../error/ArgumentError';
import Line from '../geom/Line';
import Logger from '../util/Logger';
import Vec3 from '../geom/Vec3';


/**
 * Constructs a plane.
 * This constructor does not normalize the components. It assumes that a unit normal vector is provided.
 * @alias Plane
 * @constructor
 * @classdesc Represents a plane in Cartesian coordinates.
 * The plane's X, Y and Z components indicate the plane's normal vector. The distance component
 * indicates the plane's distance from the origin relative to its unit normal.
 * The components are expected to be normalized.
 * @param {Number} x The X coordinate of the plane's unit normal vector.
 * @param {Number} y The Y coordinate of the plane's unit normal vector.
 * @param {Number} z The Z coordinate of the plane's unit normal vector.
 * @param {Number} distance The plane's distance from the origin.
 */
function Plane(x, y, z, distance) {
    /**
     * The normal vector to the plane.
     * @type {Vec3}
     */
    this.normal = new Vec3(x, y, z);

    /**
     * The plane's distance from the origin.
     * @type {Number}
     */
    this.distance = distance;
}

/**
 * Computes a plane that passes through the specified three points.
 * The plane's normal is the cross product of the
 * two vectors from pb to pa and pc to pa, respectively. The
 * returned plane is undefined if any of the specified points are colinear.
 *
 * @param {Vec3} pa The first point.
 * @param {Vec3} pb The second point.
 * @param {Vec3} pc The third point.
 *
 * @return {Plane} A plane passing through the specified points.
 *
 * @throws {ArgumentError} if pa, pb, or pc is null or undefined.
 */
Plane.fromPoints = function (pa, pb, pc) {
    if (!pa || !pb || !pc) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Plane", "fromPoints", "missingVector"));
    }

    var vab = new Vec3(pb[0], pb[1], pb[2]);
    vab.subtract(pa);
    var vac = new Vec3(pc[0], pc[1], pc[2]);
    vac.subtract(pa);
    vab.cross(vac);
    vab.normalize();
    var d = -vab.dot(pa);

    return new Plane(vab[0], vab[1], vab[2], d);
};

/**
 * Computes the dot product of this plane's normal vector with a specified vector.
 * Since the plane was defined with a unit normal vector, this function returns the distance of the vector from
 * the plane.
 * @param {Vec3} vector The vector to dot with this plane's normal vector.
 * @returns {Number} The computed dot product.
 * @throws {ArgumentError} If the specified vector is null or undefined.
 */
Plane.prototype.dot = function (vector) {
    if (!vector) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Plane", "dot", "missingVector"));
    }

    return this.normal.dot(vector) + this.distance;
};

/**
 * Computes the distance between this plane and a point.
 * @param {Vec3} point The point whose distance to compute.
 * @returns {Number} The computed distance.
 * @throws {ArgumentError} If the specified point is null or undefined.
 */
Plane.prototype.distanceToPoint = function (point) {
    return this.dot(point);
};

/**
 * Transforms this plane by a specified matrix.
 * @param {Matrix} matrix The matrix to apply to this plane.
 * @returns {Plane} This plane transformed by the specified matrix.
 * @throws {ArgumentError} If the specified matrix is null or undefined.
 */
Plane.prototype.transformByMatrix = function (matrix) {
    if (!matrix) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Plane", "transformByMatrix", "missingMatrix"));
    }

    var x = matrix[0] * this.normal[0] + matrix[1] * this.normal[1] + matrix[2] * this.normal[2] + matrix[3] * this.distance,
        y = matrix[4] * this.normal[0] + matrix[5] * this.normal[1] + matrix[6] * this.normal[2] + matrix[7] * this.distance,
        z = matrix[8] * this.normal[0] + matrix[9] * this.normal[1] + matrix[10] * this.normal[2] + matrix[11] * this.distance,
        distance = matrix[12] * this.normal[0] + matrix[13] * this.normal[1] + matrix[14] * this.normal[2] + matrix[15] * this.distance;

    this.normal[0] = x;
    this.normal[1] = y;
    this.normal[2] = z;
    this.distance = distance;

    return this;
};

/**
 * Normalizes the components of this plane.
 * @returns {Plane} This plane with its components normalized.
 */
Plane.prototype.normalize = function () {
    var magnitude = this.normal.magnitude();

    if (magnitude === 0)
        return this;

    this.normal.divide(magnitude);
    this.distance /= magnitude;

    return this;
};

/**
 * Determines whether a specified line segment intersects this plane.
 *
 * @param {Vec3} endPoint1 The first end point of the line segment.
 * @param {Vec3} endPoint2 The second end point of the line segment.
 * @returns {Boolean} true if the line segment intersects this plane, otherwise false.
 */
Plane.prototype.intersectsSegment = function (endPoint1, endPoint2) {
    var distance1 = this.dot(endPoint1),
        distance2 = this.dot(endPoint2);

    return distance1 * distance2 <= 0;
};

/**
 * Computes the intersection point of this plane with a specified line segment.
 *
 * @param {Vec3} endPoint1 The first end point of the line segment.
 * @param {Vec3} endPoint2 The second end point of the line segment.
 * @param {Vec3} result A variable in which to return the intersection point of the line segment with this plane.
 * @returns {Boolean} true If the line segment intersects this plane, otherwise false.
 */
Plane.prototype.intersectsSegmentAt = function (endPoint1, endPoint2, result) {
    // Compute the distance from the end-points.
    var distance1 = this.dot(endPoint1),
        distance2 = this.dot(endPoint2);

    // If both points points lie on the plane, ...
    if (distance1 === 0 && distance2 === 0) {
        // Choose an arbitrary endpoint as the intersection.
        result[0] = endPoint1[0];
        result[1] = endPoint1[1];
        result[2] = endPoint1[2];

        return true;
    }
    else if (distance1 === distance2) {
        // The intersection is undefined.
        return false;
    }

    var weight1 = -distance1 / (distance2 - distance1),
        weight2 = 1 - weight1;

    result[0] = weight1 * endPoint1[0] + weight2 * endPoint2[0];
    result[1] = weight1 * endPoint1[1] + weight2 * endPoint2[1];
    result[2] = weight1 * endPoint1[2] + weight2 * endPoint2[2];

    return distance1 * distance2 <= 0;
};

/**
 * Determines whether two points are on the same side of this plane.
 *
 * @param {Vec3} pointA the first point.
 * @param {Vec3} pointB the second point.
 *
 * @return {Number} -1 If both points are on the negative side of this plane, +1 if both points are on the
 * positive side of this plane, 0 if the points are on opposite sides of this plane.
 *
 * @throws {ArgumentError} If either point is null or undefined.
 */
Plane.prototype.onSameSide = function (pointA, pointB) {
    if (!pointA || !pointB) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Plane", "onSameSide", "missingPoint"));
    }

    var da = this.distanceToPoint(pointA),
        db = this.distanceToPoint(pointB);

    if (da < 0 && db < 0)
        return -1;

    if (da > 0 && db > 0)
        return 1;

    return 0;
};

/**
 * Clips a line segment to this plane.
 * @param {Vec3} pointA The first line segment endpoint.
 * @param {Vec3} pointB The second line segment endpoint.
 *
 * @returns {Vec3[]}  An array of two points both on the positive side of the plane. If the direction of the line formed by the
 *         two points is positive with respect to this plane's normal vector, the first point in the array will be
 *         the intersection point on the plane, and the second point will be the original segment end point. If the
 *         direction of the line is negative with respect to this plane's normal vector, the first point in the
 *         array will be the original segment's begin point, and the second point will be the intersection point on
 *         the plane. If the segment does not intersect the plane, null is returned. If the segment is coincident
 *         with the plane, the input points are returned, in their input order.
 *
 * @throws {ArgumentError} If either point is null or undefined.
 */
Plane.prototype.clip = function (pointA, pointB) {
    if (!pointA || !pointB) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Plane", "clip", "missingPoint"));
    }

    if (pointA.equals(pointB)) {
        return null;
    }

    // Get the projection of the segment onto the plane.
    var line = Line.fromSegment(pointA, pointB),
        lDotV = this.normal.dot(line.direction),
        lDotS, t, p;

    // Are the line and plane parallel?
    if (lDotV === 0) { // line and plane are parallel and may be coincident.
        lDotS = this.dot(line.origin);
        if (lDotS === 0) {
            return [pointA, pointB]; // line is coincident with the plane
        } else {
            return null; // line is not coincident with the plane.
        }
    }

    // Not parallel so the line intersects. But does the segment intersect?
    t = -this.dot(line.origin) / lDotV; // lDotS / lDotV
    if (t < 0 || t > 1) { // segment does not intersect
        return null;
    }

    p = line.pointAt(t, new Vec3(0, 0, 0));
    if (lDotV > 0) {
        return [p, pointB];
    } else {
        return [pointA, p];
    }
};

export default Plane;
