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
 * @exports BoundingBox
 */
import ArgumentError from '../error/ArgumentError';
import BasicProgram from '../shaders/BasicProgram';
import Frustum from '../geom/Frustum';
import Logger from '../util/Logger';
import Matrix from '../geom/Matrix';
import Plane from '../geom/Plane';
import Sector from '../geom/Sector';
import Vec3 from '../geom/Vec3';
import WWMath from '../util/WWMath';
import WWUtil from '../util/WWUtil';


/**
 * Constructs a unit bounding box.
 * The unit box has its R, S and T axes aligned with the X, Y and Z axes, respectively, and has its length,
 * width and height set to 1.
 * @alias BoundingBox
 * @constructor
 * @classdesc Represents a bounding box in Cartesian coordinates. Typically used as a bounding volume.
 */
function BoundingBox() {

    /**
     * The box's center point.
     * @type {Vec3}
     * @default (0, 0, 0)
     */
    this.center = new Vec3(0, 0, 0);

    /**
     * The center point of the box's bottom. (The origin of the R axis.)
     * @type {Vec3}
     * @default (-0.5, 0, 0)
     */
    this.bottomCenter = new Vec3(-0.5, 0, 0);

    /**
     * The center point of the box's top. (The end of the R axis.)
     * @type {Vec3}
     * @default (0.5, 0, 0)
     */
    this.topCenter = new Vec3(0.5, 0, 0);

    /**
     * The box's R axis, its longest axis.
     * @type {Vec3}
     * @default (1, 0, 0)
     */
    this.r = new Vec3(1, 0, 0);

    /**
     * The box's S axis, its mid-length axis.
     * @type {Vec3}
     * @default (0, 1, 0)
     */
    this.s = new Vec3(0, 1, 0);

    /**
     * The box's T axis, its shortest axis.
     * @type {Vec3}
     * @default (0, 0, 1)
     */
    this.t = new Vec3(0, 0, 1);

    /**
     * The box's radius. (The half-length of its diagonal.)
     * @type {number}
     * @default sqrt(3)
     */
    this.radius = Math.sqrt(3);

    // Internal use only. Intentionally not documented.
    this.tmp1 = new Vec3(0, 0, 0);
    this.tmp2 = new Vec3(0, 0, 0);
    this.tmp3 = new Vec3(0, 0, 0);

    // Internal use only. Intentionally not documented.
    this.scratchElevations = new Float64Array(9);
    this.scratchPoints = new Float64Array(3 * this.scratchElevations.length);
}

// Internal use only. Intentionally not documented.
BoundingBox.scratchMatrix = Matrix.fromIdentity();

/**
 * Returns the eight {@link Vec3} corners of the box.
 *
 * @returns {Array} the eight box corners in the order bottom-lower-left, bottom-lower-right, bottom-upper-right,
 *         bottom-upper-left, top-lower-left, top-lower-right, top-upper-right, top-upper-left.
 */
BoundingBox.prototype.getCorners = function () {
    var ll = new Vec3(this.s[0], this.s[1], this.s[2]);
    var lr = new Vec3(this.t[0], this.t[1], this.t[2]);
    var ur = new Vec3(this.s[0], this.s[1], this.s[2]);
    var ul = new Vec3(this.s[0], this.s[1], this.s[2]);

    ll.add(this.t).multiply(-0.5);     // Lower left.
    lr.subtract(this.s).multiply(0.5); // Lower right.
    ur.add(this.t).multiply(0.5);      // Upper right.
    ul.subtract(this.t).multiply(0.5); // Upper left.

    var corners = [];
    for (var i = 0; i < 4; i++) {
        corners.push(new Vec3(this.bottomCenter[0], this.bottomCenter[1], this.bottomCenter[2]));
    }

    for (i = 0; i < 4; i++) {
        corners.push(new Vec3(this.topCenter[0], this.topCenter[1], this.topCenter[2]));
    }

    corners[0].add(ll);
    corners[1].add(lr);
    corners[2].add(ur);
    corners[3].add(ul);
    corners[4].add(ll);
    corners[5].add(lr);
    corners[6].add(ur);
    corners[7].add(ul);

    return corners;
};

/**
 * Sets this bounding box such that it minimally encloses a specified collection of points.
 * @param {Float32Array} points The points to contain.
 * @returns {BoundingBox} This bounding box set to contain the specified points.
 * @throws {ArgumentError} If the specified list of points is null, undefined or empty.
 */
BoundingBox.prototype.setToPoints = function (points) {
    if (!points || points.length < 3) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "BoundingBox", "setToPoints", "missingArray"));
    }

    var rMin = +Number.MAX_VALUE,
        rMax = -Number.MAX_VALUE,
        sMin = +Number.MAX_VALUE,
        sMax = -Number.MAX_VALUE,
        tMin = +Number.MAX_VALUE,
        tMax = -Number.MAX_VALUE,
        r = this.r, s = this.s, t = this.t,
        p = new Vec3(0, 0, 0),
        pdr, pds, pdt, rLen, sLen, tLen, rSum, sSum, tSum,
        rx_2, ry_2, rz_2, cx, cy, cz;

    Matrix.principalAxesFromPoints(points, r, s, t);

    for (var i = 0, len = points.length / 3; i < len; i++) {
        p[0] = points[i * 3];
        p[1] = points[i * 3 + 1];
        p[2] = points[i * 3 + 2];

        pdr = p.dot(r);
        if (rMin > pdr)
            rMin = pdr;
        if (rMax < pdr)
            rMax = pdr;

        pds = p.dot(s);
        if (sMin > pds)
            sMin = pds;
        if (sMax < pds)
            sMax = pds;

        pdt = p.dot(t);
        if (tMin > pdt)
            tMin = pdt;
        if (tMax < pdt)
            tMax = pdt;
    }

    if (rMax === rMin)
        rMax = rMin + 1;
    if (sMax === sMin)
        sMax = sMin + 1;
    if (tMax === tMin)
        tMax = tMin + 1;

    rLen = rMax - rMin;
    sLen = sMax - sMin;
    tLen = tMax - tMin;
    rSum = rMax + rMin;
    sSum = sMax + sMin;
    tSum = tMax + tMin;

    rx_2 = 0.5 * r[0] * rLen;
    ry_2 = 0.5 * r[1] * rLen;
    rz_2 = 0.5 * r[2] * rLen;

    cx = 0.5 * (r[0] * rSum + s[0] * sSum + t[0] * tSum);
    cy = 0.5 * (r[1] * rSum + s[1] * sSum + t[1] * tSum);
    cz = 0.5 * (r[2] * rSum + s[2] * sSum + t[2] * tSum);

    this.center[0] = cx;
    this.center[1] = cy;
    this.center[2] = cz;

    this.topCenter[0] = cx + rx_2;
    this.topCenter[1] = cy + ry_2;
    this.topCenter[2] = cz + rz_2;

    this.bottomCenter[0] = cx - rx_2;
    this.bottomCenter[1] = cy - ry_2;
    this.bottomCenter[2] = cz - rz_2;

    r.multiply(rLen);
    s.multiply(sLen);
    t.multiply(tLen);

    this.radius = 0.5 * Math.sqrt(rLen * rLen + sLen * sLen + tLen * tLen);

    return this;
};

/**
 * Sets this bounding box such that it minimally encloses a specified collection of points.
 * @param {Vec3} points The points to contain.
 * @returns {BoundingBox} This bounding box set to contain the specified points.
 * @throws {ArgumentError} If the specified list of points is null, undefined or empty.
 */
BoundingBox.prototype.setToVec3Points = function (points) {
    if (!points || points.length === 0) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "BoundingBox", "setToVec3Points", "missingArray"));
    }

    var pointList = new Float32Array(points.length * 3);
    for (var i = 0; i < points.length; i++) {
        var point = points[i];
        for (var j = 0; j < 3; j++) {
            pointList[i * 3 + j] = point[j];
        }
    }

    return this.setToPoints(pointList);
};

/**
 * Sets this bounding box such that it contains a specified sector on a specified globe with min and max elevation.
 * <p>
 * To create a bounding box that contains the sector at mean sea level, specify zero for the minimum and maximum
 * elevations.
 * To create a bounding box that contains the terrain surface in this sector, specify the actual minimum and maximum
 * elevation values associated with the sector, multiplied by the model's vertical exaggeration.
 * @param {Sector} sector The sector for which to create the bounding box.
 * @param {Globe} globe The globe associated with the sector.
 * @param {Number} minElevation The minimum elevation within the sector.
 * @param {Number} maxElevation The maximum elevation within the sector.
 * @returns {BoundingBox} This bounding box set to contain the specified sector.
 * @throws {ArgumentError} If either the specified sector or globe is null or undefined.
 */
BoundingBox.prototype.setToSector = function (sector, globe, minElevation, maxElevation) {
    if (!sector) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "BoundingBox", "setToSector", "missingSector"));
    }

    if (!globe) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "BoundingBox", "setToSector", "missingGlobe"));
    }

    // Compute the cartesian points for a 3x3 geographic grid. This grid captures enough detail to bound the
    // sector. Use minimum elevation at the corners and max elevation everywhere else.
    var elevations = this.scratchElevations,
        points = this.scratchPoints;

    WWUtil.fillArray(elevations, maxElevation);
    elevations[0] = elevations[2] = elevations[6] = elevations[8] = minElevation;
    globe.computePointsForGrid(sector, 3, 3, elevations, Vec3.ZERO, points);

    // Compute the local coordinate axes. Since we know this box is bounding a geographic sector, we use the
    // local coordinate axes at its centroid as the box axes. Using these axes results in a box that has +-10%
    // the volume of a box with axes derived from a principal component analysis, but is faster to compute.
    var index = 12; // index to the center point's X coordinate
    this.tmp1.set(points[index], points[index + 1], points[index + 2]);
    WWMath.localCoordinateAxesAtPoint(this.tmp1, globe, this.r, this.s, this.t);

    // Find the extremes along each axis.
    var rExtremes = [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY],
        sExtremes = [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY],
        tExtremes = [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY];

    for (var i = 0, len = points.length; i < len; i += 3) {
        this.tmp1.set(points[i], points[i + 1], points[i + 2]);
        this.adjustExtremes(this.r, rExtremes, this.s, sExtremes, this.t, tExtremes, this.tmp1);
    }

    // If the sector encompasses more than one hemisphere, the 3x3 grid does not capture enough detail to bound
    // the sector. The antipodal points along the parallel through the sector's centroid represent its extremes
    // in longitude. Incorporate those antipodal points into the extremes along each axis.
    if (sector.deltaLongitude() > 180) {
        globe.computePointFromPosition(sector.centroidLatitude(), sector.centroidLongitude() + 90, maxElevation, this.tmp1);
        globe.computePointFromPosition(sector.centroidLatitude(), sector.centroidLongitude() - 90, maxElevation, this.tmp2);
        this.adjustExtremes(this.r, rExtremes, this.s, sExtremes, this.t, tExtremes, this.tmp1);
        this.adjustExtremes(this.r, rExtremes, this.s, sExtremes, this.t, tExtremes, this.tmp2);
    }

    // Sort the axes from most prominent to least prominent. The frustum intersection methods in WWBoundingBox assume
    // that the axes are defined in this way.
    if (rExtremes[1] - rExtremes[0] < sExtremes[1] - sExtremes[0]) {
        this.swapAxes(this.r, rExtremes, this.s, sExtremes);
    }
    if (sExtremes[1] - sExtremes[0] < tExtremes[1] - tExtremes[0]) {
        this.swapAxes(this.s, sExtremes, this.t, tExtremes);
    }
    if (rExtremes[1] - rExtremes[0] < sExtremes[1] - sExtremes[0]) {
        this.swapAxes(this.r, rExtremes, this.s, sExtremes);
    }

    // Compute the box properties from its unit axes and the extremes along each axis.
    var rLen = rExtremes[1] - rExtremes[0],
        sLen = sExtremes[1] - sExtremes[0],
        tLen = tExtremes[1] - tExtremes[0],
        rSum = rExtremes[1] + rExtremes[0],
        sSum = sExtremes[1] + sExtremes[0],
        tSum = tExtremes[1] + tExtremes[0],

        cx = 0.5 * (this.r[0] * rSum + this.s[0] * sSum + this.t[0] * tSum),
        cy = 0.5 * (this.r[1] * rSum + this.s[1] * sSum + this.t[1] * tSum),
        cz = 0.5 * (this.r[2] * rSum + this.s[2] * sSum + this.t[2] * tSum),
        rx_2 = 0.5 * this.r[0] * rLen,
        ry_2 = 0.5 * this.r[1] * rLen,
        rz_2 = 0.5 * this.r[2] * rLen;

    this.center.set(cx, cy, cz);
    this.topCenter.set(cx + rx_2, cy + ry_2, cz + rz_2);
    this.bottomCenter.set(cx - rx_2, cy - ry_2, cz - rz_2);

    this.r.multiply(rLen);
    this.s.multiply(sLen);
    this.t.multiply(tLen);

    this.radius = 0.5 * Math.sqrt(rLen * rLen + sLen * sLen + tLen * tLen);

    return this;
};

/**
 * Translates this bounding box by a specified translation vector.
 * @param {Vec3} translation The translation vector.
 * @returns {BoundingBox} This bounding box translated by the specified translation vector.
 * @throws {ArgumentError} If the specified translation vector is null or undefined.
 */
BoundingBox.prototype.translate = function (translation) {
    if (!translation) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "BoundingBox", "translate", "missingVector"));
    }

    this.bottomCenter.add(translation);
    this.topCenter.add(translation);
    this.center.add(translation);

    return this;
};

/**
 * Computes the approximate distance between this bounding box and a specified point.
 * <p>
 * This calculation treats the bounding box as a sphere with the same radius as the box.
 * @param {Vec3} point The point to compute the distance to.
 * @returns {Number} The distance from the edge of this bounding box to the specified point.
 * @throws {ArgumentError} If the specified point is null or undefined.
 */
BoundingBox.prototype.distanceTo = function (point) {
    if (!point) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "BoundingBox", "distanceTo", "missingPoint"));
    }

    var d = this.center.distanceTo(point) - this.radius;

    return d >= 0 ? d : -d;
};

/**
 * Computes the effective radius of this bounding box relative to a specified plane.
 * @param {Plane} plane The plane of interest.
 * @returns {Number} The effective radius of this bounding box to the specified plane.
 * @throws {ArgumentError} If the specified plane is null or undefined.
 */
BoundingBox.prototype.effectiveRadius = function (plane) {
    if (!plane) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "BoundingBox", "effectiveRadius", "missingPlane"));
    }

    var n = plane.normal;

    return 0.5 * (WWMath.fabs(this.r.dot(n)) + WWMath.fabs(this.s.dot(n)) + WWMath.fabs(this.t.dot(n)));
};

/**
 * Indicates whether this bounding box intersects a specified frustum.
 * @param {Frustum} frustum The frustum of interest.
 * @returns {boolean} true if the specified frustum intersects this bounding box, otherwise false.
 * @throws {ArgumentError} If the specified frustum is null or undefined.
 */
BoundingBox.prototype.intersectsFrustum = function (frustum) {
    if (!frustum) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "BoundingBox", "intersectsFrustum", "missingFrustum"));
    }

    this.tmp1.copy(this.bottomCenter);
    this.tmp2.copy(this.topCenter);

    if (this.intersectionPoint(frustum.near) < 0) {
        return false;
    }
    if (this.intersectionPoint(frustum.far) < 0) {
        return false;
    }
    if (this.intersectionPoint(frustum.left) < 0) {
        return false;
    }
    if (this.intersectionPoint(frustum.right) < 0) {
        return false;
    }
    if (this.intersectionPoint(frustum.top) < 0) {
        return false;
    }
    if (this.intersectionPoint(frustum.bottom) < 0) {
        return false;
    }

    return true;
};

// Internal. Intentionally not documented.
BoundingBox.prototype.intersectionPoint = function (plane) {
    var n = plane.normal,
        effectiveRadius = 0.5 * (Math.abs(this.s.dot(n)) + Math.abs(this.t.dot(n)));

    return this.intersectsAt(plane, effectiveRadius, this.tmp1, this.tmp2);
};

// Internal. Intentionally not documented.
BoundingBox.prototype.intersectsAt = function (plane, effRadius, endPoint1, endPoint2) {
    // Test the distance from the first end-point.
    var dq1 = plane.dot(endPoint1);
    var bq1 = dq1 <= -effRadius;

    // Test the distance from the second end-point.
    var dq2 = plane.dot(endPoint2);
    var bq2 = dq2 <= -effRadius;

    if (bq1 && bq2) { // endpoints more distant from plane than effective radius; box is on neg. side of plane
        return -1;
    }

    if (bq1 == bq2) { // endpoints less distant from plane than effective radius; can't draw any conclusions
        return 0;
    }

    // Compute and return the endpoints of the box on the positive side of the plane
    this.tmp3.copy(endPoint1);
    this.tmp3.subtract(endPoint2);
    var t = (effRadius + dq1) / plane.normal.dot(this.tmp3);

    this.tmp3.copy(endPoint2);
    this.tmp3.subtract(endPoint1);
    this.tmp3.multiply(t);
    this.tmp3.add(endPoint1);

    // Truncate the line to only that in the positive halfspace, e.g., inside the frustum.
    if (bq1) {
        endPoint1.copy(this.tmp3);
    }
    else {
        endPoint2.copy(this.tmp3);
    }

    return t;
};

// Internal. Intentionally not documented.
BoundingBox.prototype.adjustExtremes = function (r, rExtremes, s, sExtremes, t, tExtremes, p) {
    var pdr = p.dot(r);
    if (rExtremes[0] > pdr) {
        rExtremes[0] = pdr;
    }
    if (rExtremes[1] < pdr) {
        rExtremes[1] = pdr;
    }

    var pds = p.dot(s);
    if (sExtremes[0] > pds) {
        sExtremes[0] = pds;
    }
    if (sExtremes[1] < pds) {
        sExtremes[1] = pds;
    }

    var pdt = p.dot(t);
    if (tExtremes[0] > pdt) {
        tExtremes[0] = pdt;
    }
    if (tExtremes[1] < pdt) {
        tExtremes[1] = pdt;
    }
};

// Internal. Intentionally not documented.
BoundingBox.prototype.swapAxes = function (a, aExtremes, b, bExtremes) {
    a.swap(b);

    var tmp = aExtremes[0];
    aExtremes[0] = bExtremes[0];
    bExtremes[0] = tmp;

    tmp = aExtremes[1];
    aExtremes[1] = bExtremes[1];
    bExtremes[1] = tmp;
};

/**
 * Renders this bounding box in a semi-transparent color with a highlighted outline. This function is intended
 * for diagnostic use only.
 * @param dc {DrawContext} dc The current draw context.
 */
BoundingBox.prototype.render = function (dc) {
    var gl = dc.currentGlContext,
        matrix = BoundingBox.scratchMatrix,
        program = dc.findAndBindProgram(BasicProgram);

    try {
        // Setup to transform unit cube coordinates to this bounding box's local coordinates, as viewed by the
        // current navigator state.
        matrix.copy(dc.modelviewProjection);
        matrix.multiply(
            this.r[0], this.s[0], this.t[0], this.center[0],
            this.r[1], this.s[1], this.t[1], this.center[1],
            this.r[2], this.s[2], this.t[2], this.center[2],
            0, 0, 0, 1);
        matrix.multiplyByTranslation(-0.5, -0.5, -0.5);
        program.loadModelviewProjection(gl, matrix);

        // Setup to draw the geometry when the eye point is inside or outside the box.
        gl.disable(gl.CULL_FACE);

        // Bind the shared unit cube vertex buffer and element buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, dc.unitCubeBuffer());
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, dc.unitCubeElements());
        gl.enableVertexAttribArray(program.vertexPointLocation);
        gl.vertexAttribPointer(program.vertexPointLocation, 3, gl.FLOAT, false, 0, 0);

        // Draw bounding box fragments that are below the terrain.
        program.loadColorComponents(gl, 0, 1, 0, 0.6);
        gl.drawElements(gl.LINES, 24, gl.UNSIGNED_SHORT, 72);
        program.loadColorComponents(gl, 1, 1, 1, 0.3);
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);

    } finally {
        // Restore WorldWind's default WebGL state.
        gl.enable(gl.CULL_FACE);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
};

export default BoundingBox;
