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
 * @exports Frustum
 */
import ArgumentError from '../error/ArgumentError';
import Matrix from '../geom/Matrix';
import Plane from '../geom/Plane';
import Logger from '../util/Logger';


/**
 * Constructs a frustum.
 * @alias Frustum
 * @constructor
 * @classdesc Represents a six-sided view frustum in Cartesian coordinates.
 * @param {Plane} left The frustum's left plane.
 * @param {Plane} right The frustum's right plane.
 * @param {Plane} bottom The frustum's bottom plane.
 * @param {Plane} top The frustum's top plane.
 * @param {Plane} near The frustum's near plane.
 * @param {Plane} far The frustum's far plane.
 * @throws {ArgumentError} If any specified plane is null or undefined.
 */
function Frustum(left, right, bottom, top, near, far) {
    if (!left || !right || !bottom || !top || !near || !far) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Frustum", "constructor", "missingPlane"));
    }

    // Internal. Intentionally not documented. See property accessors below for public interface.
    this._left = left;
    this._right = right;
    this._bottom = bottom;
    this._top = top;
    this._near = near;
    this._far = far;

    // Internal. Intentionally not documented.
    this._planes = [this._left, this._right, this._top, this._bottom, this._near, this._far];
}

// These accessors are defined in order to prevent changes that would make the properties inconsistent with the
// planes array.
Object.defineProperties(Frustum.prototype, {
    /**
     * This frustum's left plane.
     * @memberof Frustum.prototype
     * @type {Plane}
     * @readonly
     */
    left: {
        get: function () {
            return this._left;
        }
    },
    /**
     * This frustum's right plane.
     * @memberof Frustum.prototype
     * @type {Plane}
     * @readonly
     */
    right: {
        get: function () {
            return this._right;
        }
    },
    /**
     * This frustum's bottom plane.
     * @memberof Frustum.prototype
     * @type {Plane}
     * @readonly
     */
    bottom: {
        get: function () {
            return this._bottom;
        }
    },
    /**
     * This frustum's top plane.
     * @memberof Frustum.prototype
     * @type {Plane}
     * @readonly
     */
    top: {
        get: function () {
            return this._top;
        }
    },
    /**
     * This frustum's near plane.
     * @memberof Frustum.prototype
     * @type {Plane}
     * @readonly
     */
    near: {
        get: function () {
            return this._near;
        }
    },
    /**
     * This frustum's far plane.
     * @memberof Frustum.prototype
     * @type {Plane}
     * @readonly
     */
    far: {
        get: function () {
            return this._far;
        }
    }
});

/**
 * Transforms this frustum by a specified matrix.
 * @param {Matrix} matrix The matrix to apply to this frustum.
 * @returns {Frustum} This frustum set to its original value multiplied by the specified matrix.
 * @throws {ArgumentError} If the specified matrix is null or undefined.
 */
Frustum.prototype.transformByMatrix = function (matrix) {
    if (!matrix) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Frustum", "transformByMatrix", "missingMatrix"));
    }

    this._left.transformByMatrix(matrix);
    this._right.transformByMatrix(matrix);
    this._bottom.transformByMatrix(matrix);
    this._top.transformByMatrix(matrix);
    this._near.transformByMatrix(matrix);
    this._far.transformByMatrix(matrix);

    return this;
};

/**
 * Normalizes the plane vectors of the planes composing this frustum.
 * @returns {Frustum} This frustum with its planes normalized.
 */
Frustum.prototype.normalize = function () {
    this._left.normalize();
    this._right.normalize();
    this._bottom.normalize();
    this._top.normalize();
    this._near.normalize();
    this._far.normalize();

    return this;
};

/**
 * Returns a new frustum with each of its planes 1 meter from the center.
 * @returns {Frustum} The new frustum.
 */
Frustum.unitFrustum = function () {
    return new Frustum(
        new Plane(1, 0, 0, 1), // left
        new Plane(-1, 0, 0, 1), // right
        new Plane(0, 1, 1, 1), // bottom
        new Plane(0, -1, 0, 1), // top
        new Plane(0, 0, -1, 1), // near
        new Plane(0, 0, 1, 1) // far
    );
};

/**
 * Extracts a frustum from a projection matrix.
 * <p>
 * This method assumes that the specified matrix represents a projection matrix. If it does not represent a projection matrix
 * the results are undefined.
 * <p>
 * A projection matrix's view frustum is a Cartesian volume that contains everything visible in a scene displayed
 * using that projection matrix.
 *
 * @param {Matrix} matrix The projection matrix to extract the frustum from.
 * @return {Frustum} A new frustum containing the projection matrix's view frustum, in eye coordinates.
 * @throws {ArgumentError} If the specified matrix is null or undefined.
 */
Frustum.fromProjectionMatrix = function (matrix) {
    if (!matrix) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Frustum", "fromProjectionMatrix", "missingMatrix"));
    }

    var x, y, z, w, d, left, right, top, bottom, near, far;

    // Left Plane = row 4 + row 1:
    x = matrix[12] + matrix[0];
    y = matrix[13] + matrix[1];
    z = matrix[14] + matrix[2];
    w = matrix[15] + matrix[3];
    d = Math.sqrt(x * x + y * y + z * z); // for normalizing the coordinates
    left = new Plane(x / d, y / d, z / d, w / d);

    // Right Plane = row 4 - row 1:
    x = matrix[12] - matrix[0];
    y = matrix[13] - matrix[1];
    z = matrix[14] - matrix[2];
    w = matrix[15] - matrix[3];
    d = Math.sqrt(x * x + y * y + z * z); // for normalizing the coordinates
    right = new Plane(x / d, y / d, z / d, w / d);

    // Bottom Plane = row 4 + row 2:
    x = matrix[12] + matrix[4];
    y = matrix[13] + matrix[5];
    z = matrix[14] + matrix[6];
    w = matrix[15] + matrix[7];
    d = Math.sqrt(x * x + y * y + z * z); // for normalizing the coordinates
    bottom = new Plane(x / d, y / d, z / d, w / d);

    // Top Plane = row 4 - row 2:
    x = matrix[12] - matrix[4];
    y = matrix[13] - matrix[5];
    z = matrix[14] - matrix[6];
    w = matrix[15] - matrix[7];
    d = Math.sqrt(x * x + y * y + z * z); // for normalizing the coordinates
    top = new Plane(x / d, y / d, z / d, w / d);

    // Near Plane = row 4 + row 3:
    x = matrix[12] + matrix[8];
    y = matrix[13] + matrix[9];
    z = matrix[14] + matrix[10];
    w = matrix[15] + matrix[11];
    d = Math.sqrt(x * x + y * y + z * z); // for normalizing the coordinates
    near = new Plane(x / d, y / d, z / d, w / d);

    // Far Plane = row 4 - row 3:
    x = matrix[12] - matrix[8];
    y = matrix[13] - matrix[9];
    z = matrix[14] - matrix[10];
    w = matrix[15] - matrix[11];
    d = Math.sqrt(x * x + y * y + z * z); // for normalizing the coordinates
    far = new Plane(x / d, y / d, z / d, w / d);

    return new Frustum(left, right, bottom, top, near, far);
};

Frustum.prototype.containsPoint = function (point) {
    if (!point) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Frustum", "containsPoint", "missingPoint"));
    }

    // See if the point is entirely within the frustum. The dot product of the point with each plane's vector
    // provides a distance to each plane. If this distance is less than 0, the point is clipped by that plane and
    // neither intersects nor is contained by the space enclosed by this Frustum.

    if (this._far.dot(point) <= 0)
        return false;
    if (this._left.dot(point) <= 0)
        return false;
    if (this._right.dot(point) <= 0)
        return false;
    if (this._top.dot(point) <= 0)
        return false;
    if (this._bottom.dot(point) <= 0)
        return false;
    if (this._near.dot(point) <= 0)
        return false;

    return true;
};

/**
 * Determines whether a line segment intersects this frustum.
 *
 * @param {Vec3} pointA One end of the segment.
 * @param {Vec3} pointB The other end of the segment.
 *
 * @return {boolean} <code>true</code> if the segment intersects or is contained in this frustum,
 * otherwise <code>false</code>.
 *
 * @throws {ArgumentError} If either point is null or undefined.
 */
Frustum.prototype.intersectsSegment = function (pointA, pointB) {
    if (!pointA || !pointB) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Frustum", "containsPoint", "missingPoint"));
    }

    // First do a trivial accept test.
    if (this.containsPoint(pointA) || this.containsPoint(pointB))
        return true;

    if (pointA.equals(pointB))
        return false;

    for (var i = 0, len = this._planes.length; i < len; i++) {

        // See if both points are behind the plane and therefore not in the frustum.
        if (this._planes[i].onSameSide(pointA, pointB) < 0)
            return false;

        // See if the segment intersects the plane.
        if (this._planes[i].clip(pointA, pointB) != null)
            return true;
    }

    return false; // segment does not intersect frustum
};

export default Frustum;
