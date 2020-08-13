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
import Logger from '../util/Logger';
import ArgumentError from '../error/ArgumentError';


/**
 * Constructs a three-component vector.
 * @alias Vec3
 * @classdesc Represents a three-component vector. Access the X component of the vector as v[0], the Y
 * component as v[1] and the Z component as v[2].
 * @augments Float64Array
 * @param {Number} x X component of vector.
 * @param {Number} y Y component of vector.
 * @param {Number} z Z component of vector.
 * @constructor
 */
function Vec3(x, y, z) {
    this[0] = x;
    this[1] = y;
    this[2] = z;
}

// Vec3 extends Float64Array.
Vec3.prototype = new Float64Array(3);

/**
 * A vector corresponding to the origin.
 * @type {Vec3}
 */
Vec3.ZERO = new Vec3(0, 0, 0);

/**
 * Computes the average of a specified array of vectors.
 * @param {Vec3[]} vectors The vectors whose average to compute.
 * @param {Vec3} result A pre-allocated Vec3 in which to return the computed average.
 * @returns {Vec3} The result argument set to the average of the specified array of vectors.
 * @throws {ArgumentError} If the specified array of vectors is null, undefined or empty or the specified
 * result argument is null or undefined.
 */
Vec3.average = function (vectors, result) {
    if (!vectors || vectors.length < 1) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Vec3", "average", "missingArray"));
    }

    if (!result) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Vec3", "average", "missingResult"));
    }

    var count = vectors.length,
        vec;

    result[0] = 0;
    result[1] = 0;
    result[2] = 0;

    for (var i = 0, len = vectors.length; i < len; i++) {
        vec = vectors[i];

        result[0] += vec[0] / count;
        result[1] += vec[1] / count;
        result[2] += vec[2] / count;
    }

    return result;
};

/**
 * Computes the average of a specified array of points packed into a single array.
 * @param {Float32Array | Float64Array | Number[]} points The points whose average to compute.
 * @param {Vec3} result A pre-allocated Vec3 in which to return the computed average.
 * @returns {Vec3} The result argument set to the average of the specified array of points.
 * @throws {ArgumentError} If the specified array of points is null, undefined or empty or the result argument
 * is null or undefined.
 */
Vec3.averageOfBuffer = function (points, result) {
    if (!points || points.length < 1) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Vec3", "averageBuffer", "missingArray"));
    }

    if (!result) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Vec3", "averageBuffer", "missingResult"));
    }

    var count = points.length / 3;

    result[0] = 0;
    result[1] = 0;
    result[2] = 0;

    for (var i = 0; i < count; i++) {
        result[0] += points[i * 3] / count;
        result[1] += points[i * 3 + 1] / count;
        result[2] += points[i * 3 + 2] / count;
    }

    return result;
};

/**
 * Indicates whether three vectors are colinear.
 * @param {Vec3} a The first vector.
 * @param {Vec3} b The second vector.
 * @param {Vec3} c The third vector.
 * @returns {Boolean} true if the vectors are colinear, otherwise false.
 * @throws {ArgumentError} If any of the specified vectors are null or undefined.
 */
Vec3.areColinear = function (a, b, c) {
    if (!a || !b || !c) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Vec3", "areColinear", "missingVector"));
    }

    var ab = new Vec3(a[0] - b[0], a[1] - b[1], a[2] - b[2]).normalize(),
        bc = new Vec3(c[0] - b[0], c[1] - b[1], c[2] - b[2]).normalize();

    // ab and bc are considered colinear if their dot product is near +/-1.
    return Math.abs(ab.dot(bc)) > 0.999;
};

/**
 * Computes the normal vector of a specified triangle.
 *
 * @param {Vec3} a The triangle's first vertex.
 * @param {Vec3} b The triangle's second vertex.
 * @param {Vec3} c The triangle's third vertex.
 * @returns {Vec3} The triangle's unit-normal vector.
 * @throws {ArgumentError} If any of the specified vectors are null or undefined.
 */
Vec3.computeTriangleNormal = function (a, b, c) {
    if (!a || !b || !c) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Vec3", "areColinear", "missingVector"));
    }

    var x = (b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]),
        y = (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]),
        z = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]),
        length = x * x + y * y + z * z;

    if (length === 0) {
        return new Vec3(x, y, z);
    }

    length = Math.sqrt(length);

    return new Vec3(x / length, y / length, z / length);
};

/**
 * Finds three non-colinear points in an array of coordinates.
 *
 * @param {Number[]} coords The coordinates, in the order x0, y0, z0, x1, y1, z1, ...
 * @param {Number} stride The number of numbers between successive points. 0 indicates that the points
 * are arranged one immediately after the other, as would the value 3.
 * @returns {Vec3[]} Three non-colinear points from the input array of coordinates, or null if three
 * non-colinear points could not be found or the specified coordinates array is null, undefined or
 * contains fewer than three points.
 */
Vec3.findThreeIndependentVertices = function (coords, stride) {
    var xstride = stride && stride > 0 ? stride : 3;

    if (!coords || coords.length < 3 * xstride) {
        return null;
    }

    var a = new Vec3(coords[0], coords[1], coords[2]),
        b = null,
        c = null,
        k = xstride;

    for (; k < coords.length; k += xstride) {
        b = new Vec3(coords[k], coords[k + 1], coords[k + 2]);
        if (!(b[0] === a[0] && b[1] === a[1] && b[2] === a[2])) {
            break;
        }
        b = null;
    }

    if (!b) {
        return null;
    }

    for (k += xstride; k < coords.length; k += xstride) {
        c = new Vec3(coords[k], coords[k + 1], coords[k + 2]);

        // if c is not coincident with a or b, and the vectors ab and bc are not colinear, break and
        // return a, b, c.
        if (!(c[0] === a[0] && c[1] === a[1] && c[2] === a[2]
            || c[0] === b[0] && c[1] === b[1] && c[2] === b[2])) {
            if (!Vec3.areColinear(a, b, c))
                break;
        }

        c = null;
    }

    return c ? [a, b, c] : null;
};

/**
 * Computes a unit-normal vector for a buffer of coordinate triples. The normal vector is computed from the
 * first three non-colinear points in the buffer.
 *
 * @param {Number[]} coords The coordinates, in the order x0, y0, z0, x1, y1, z1, ...
 * @param {Number} stride The number of numbers between successive points. 0 indicates that the points
 * are arranged one immediately after the other, as would the value 3.
 * @returns {Vec3} The computed unit-length normal vector.
 */
Vec3.computeBufferNormal = function (coords, stride) {
    var vertices = Vec3.findThreeIndependentVertices(coords, stride);

    return vertices ? Vec3.computeTriangleNormal(vertices[0], vertices[1], vertices[2]) : null;
};

/**
 * Assigns the components of this vector.
 * @param {Number} x The X component of the vector.
 * @param {Number} y The Y component of the vector.
 * @param {Number} z The Z component of the vector.
 * @returns {Vec3} This vector with the specified components assigned.
 */
Vec3.prototype.set = function (x, y, z) {
    this[0] = x;
    this[1] = y;
    this[2] = z;

    return this;
};

/**
 * Copies the components of a specified vector to this vector.
 * @param {Vec3} vector The vector to copy.
 * @returns {Vec3} This vector set to the X, Y and Z values of the specified vector.
 * @throws {ArgumentError} If the specified vector is null or undefined.
 */
Vec3.prototype.copy = function (vector) {
    if (!vector) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Vec3", "copy", "missingVector"));
    }

    this[0] = vector[0];
    this[1] = vector[1];
    this[2] = vector[2];

    return this;
};

/**
 * Indicates whether the components of this vector are identical to those of a specified vector.
 * @param {Vec3} vector The vector to test.
 * @returns {Boolean} true if the components of this vector are equal to those of the specified one,
 * otherwise false.
 */
Vec3.prototype.equals = function (vector) {
    return this[0] === vector[0] && this[1] === vector[1] && this[2] === vector[2];
};

/**
 * Adds a specified vector to this vector.
 * @param {Vec3} addend The vector to add.
 * @returns {Vec3} This vector after adding the specified vector to it.
 * @throws {ArgumentError} If the addend is null or undefined.
 */
Vec3.prototype.add = function (addend) {
    if (!addend) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Vec3", "add", "missingVector"));
    }

    this[0] += addend[0];
    this[1] += addend[1];
    this[2] += addend[2];

    return this;
};

/**
 * Subtracts a specified vector from this vector.
 * @param {Vec3} subtrahend The vector to subtract
 * @returns {Vec3} This vector after subtracting the specified vector from it.
 * @throws {ArgumentError} If the subtrahend is null or undefined.
 */
Vec3.prototype.subtract = function (subtrahend) {
    if (!subtrahend) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Vec3", "subtract", "missingVector"));
    }

    this[0] -= subtrahend[0];
    this[1] -= subtrahend[1];
    this[2] -= subtrahend[2];

    return this;
};

/**
 * Multiplies this vector by a scalar.
 * @param {Number} scalar The scalar to multiply this vector by.
 * @returns {Vec3} This vector multiplied by the specified scalar.
 */
Vec3.prototype.multiply = function (scalar) {
    this[0] *= scalar;
    this[1] *= scalar;
    this[2] *= scalar;

    return this;
};

/**
 * Divides this vector by a scalar.
 * @param {Number} divisor The scalar to divide this vector by.
 * @returns {Vec3} This vector divided by the specified scalar.
 */
Vec3.prototype.divide = function (divisor) {
    this[0] /= divisor;
    this[1] /= divisor;
    this[2] /= divisor;

    return this;
};

/**
 * Multiplies this vector by a 4x4 matrix. The multiplication is performed with an implicit W component of 1.
 * The resultant W component of the product is then divided through the X, Y, and Z components.
 *
 * @param {Matrix} matrix The matrix to multiply this vector by.
 * @returns {Vec3} This vector multiplied by the specified matrix.
 * @throws ArgumentError If the specified matrix is null or undefined.
 */
Vec3.prototype.multiplyByMatrix = function (matrix) {
    if (!matrix) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Vec3", "multiplyByMatrix", "missingMatrix"));
    }

    var x = matrix[0] * this[0] + matrix[1] * this[1] + matrix[2] * this[2] + matrix[3],
        y = matrix[4] * this[0] + matrix[5] * this[1] + matrix[6] * this[2] + matrix[7],
        z = matrix[8] * this[0] + matrix[9] * this[1] + matrix[10] * this[2] + matrix[11],
        w = matrix[12] * this[0] + matrix[13] * this[1] + matrix[14] * this[2] + matrix[15];

    this[0] = x / w;
    this[1] = y / w;
    this[2] = z / w;

    return this;
};

/**
 * Mixes (interpolates) a specified vector with this vector, modifying this vector.
 * @param {Vec3} vector The vector to mix with this one.
 * @param {Number} weight The relative weight of this vector.
 * @returns {Vec3} This vector modified to the mix of itself and the specified vector.
 * @throws {ArgumentError} If the specified vector is null or undefined.
 */
Vec3.prototype.mix = function (vector, weight) {
    if (!vector) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Vec3", "mix", "missingVector"));
    }

    var w0 = 1 - weight,
        w1 = weight;

    this[0] = this[0] * w0 + vector[0] * w1;
    this[1] = this[1] * w0 + vector[1] * w1;
    this[2] = this[2] * w0 + vector[2] * w1;

    return this;
};

/**
 * Negates the components of this vector.
 * @returns {Vec3} This vector, negated.
 */
Vec3.prototype.negate = function () {
    this[0] = -this[0];
    this[1] = -this[1];
    this[2] = -this[2];

    return this;
};

/**
 * Computes the scalar dot product of this vector and a specified vector.
 * @param {Vec3} vector The vector to multiply.
 * @returns {Number} The dot product of the two vectors.
 * @throws {ArgumentError} If the specified vector is null or undefined.
 */
Vec3.prototype.dot = function (vector) {
    if (!vector) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Vec3", "dot", "missingVector"));
    }

    return this[0] * vector[0] +
        this[1] * vector[1] +
        this[2] * vector[2];
};

/**
 * Computes the cross product of this vector and a specified vector, modifying this vector.
 * @param {Vec3} vector The vector to cross with this vector.
 * @returns {Vec3} This vector set to the cross product of itself and the specified vector.
 * @throws {ArgumentError} If the specified vector is null or undefined.
 */
Vec3.prototype.cross = function (vector) {
    if (!vector) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Vec3", "cross", "missingVector"));
    }

    var x = this[1] * vector[2] - this[2] * vector[1],
        y = this[2] * vector[0] - this[0] * vector[2],
        z = this[0] * vector[1] - this[1] * vector[0];

    this[0] = x;
    this[1] = y;
    this[2] = z;

    return this;
};

/**
 * Computes the squared magnitude of this vector.
 * @returns {Number} The squared magnitude of this vector.
 */
Vec3.prototype.magnitudeSquared = function () {
    return this.dot(this);
};

/**
 * Computes the magnitude of this vector.
 * @returns {Number} The magnitude of this vector.
 */
Vec3.prototype.magnitude = function () {
    return Math.sqrt(this.magnitudeSquared());
};

/**
 * Normalizes this vector to a unit vector.
 * @returns {Vec3} This vector, normalized.
 */
Vec3.prototype.normalize = function () {
    var magnitude = this.magnitude(),
        magnitudeInverse = 1 / magnitude;

    this[0] *= magnitudeInverse;
    this[1] *= magnitudeInverse;
    this[2] *= magnitudeInverse;

    return this;
};

/**
 * Computes the squared distance from this vector to a specified vector.
 * @param {Vec3} vector The vector to compute the distance to.
 * @returns {Number} The squared distance between the vectors.
 * @throws {ArgumentError} If the specified vector is null or undefined.
 */
Vec3.prototype.distanceToSquared = function (vector) {
    if (!vector) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Vec3", "distanceToSquared", "missingVector"));
    }

    var dx = this[0] - vector[0],
        dy = this[1] - vector[1],
        dz = this[2] - vector[2];

    return dx * dx + dy * dy + dz * dz;
};

/**
 * Computes the distance from this vector to another vector.
 * @param {Vec3} vector The vector to compute the distance to.
 * @returns {number} The distance between the vectors.
 * @throws {ArgumentError} If the specified vector is null or undefined.
 */
Vec3.prototype.distanceTo = function (vector) {
    if (!vector) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Vec3", "distanceTo", "missingVector"));
    }

    return Math.sqrt(this.distanceToSquared(vector));
};

/**
 * Swaps this vector with that vector. This vector's components are set to the values of the specified
 * vector's components, and the specified vector's components are set to the values of this vector's components.
 * @param {Vec3} that The vector to swap.
 * @returns {Vec3} This vector set to the values of the specified vector.
 */
Vec3.prototype.swap = function (that) {
    var tmp = this[0];
    this[0] = that[0];
    that[0] = tmp;

    tmp = this[1];
    this[1] = that[1];
    that[1] = tmp;

    tmp = this[2];
    this[2] = that[2];
    that[2] = tmp;

    return this;
};

/**
 * Returns a string representation of this vector.
 * @returns {String} A string representation of this vector, in the form "(x, y, z)".
 */
Vec3.prototype.toString = function () {
    return "(" + this[0] + ", " + this[1] + ", " + this[2] + ")";
};

export default Vec3;
