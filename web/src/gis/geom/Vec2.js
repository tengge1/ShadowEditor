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
import Vec3 from '../geom/Vec3';


/**
 * Constructs a two-component vector.
 * @alias Vec2
 * @classdesc Represents a two-component vector. Access the X component of the vector as v[0] and the Y
 * component as v[1].
 * @augments Float64Array
 * @param {Number} x X component of vector.
 * @param {Number} y Y component of vector.
 * @constructor
 */
function Vec2(x, y) {
    this[0] = x;
    this[1] = y;
}

// Vec2 inherits from Float64Array.
Vec2.prototype = new Float64Array(2);

/**
 * Assigns the components of this vector.
 * @param {Number} x The X component of the vector.
 * @param {Number} y The Y component of the vector.
 * @returns {Vec2} This vector with the specified components assigned.
 */
Vec2.prototype.set = function (x, y) {
    this[0] = x;
    this[1] = y;

    return this;
};

/**
 * Copies the components of a specified vector to this vector.
 * @param {Vec2} vector The vector to copy.
 * @returns {Vec2} This vector set to the values of the specified vector.
 * @throws {ArgumentError} If the specified vector is null or undefined.
 */
Vec2.prototype.copy = function (vector) {
    if (!vector) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Vec2", "copy", "missingVector"));
    }

    this[0] = vector[0];
    this[1] = vector[1];

    return this;
};

/**
 * Indicates whether the X and Y components of this vector are identical to those of a specified vector.
 * @param {Vec2} vector The vector to test.
 * @returns {Boolean} true if this vector's components are equal to those of the specified vector,
 * otherwise false.
 */
Vec2.prototype.equals = function (vector) {
    return this[0] === vector[0] && this[1] === vector[1];
};

/**
 * Computes the average of a specified array of vectors.
 * @param {Vec2[]} vectors The vectors whose average to compute.
 * @param {Vec2} result A pre-allocated Vec2 in which to return the computed average.
 * @returns {Vec2} The result argument set to the average of the specified lists of vectors.
 * @throws {ArgumentError} If the specified array of vectors is null, undefined or empty, or the specified
 * result argument is null or undefined.
 */
Vec2.average = function (vectors, result) {
    if (!vectors || vectors.length < 1) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Vec2", "average", "missingArray"));
    }

    if (!result) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Vec2", "average", "missingResult"));
    }

    var count = vectors.length,
        vec;

    result[0] = 0;
    result[1] = 0;

    for (var i = 0, len = vectors.length; i < len; i++) {
        vec = vectors[i];

        result[0] += vec[0] / count;
        result[1] += vec[1] / count;
    }

    return result;
};

/**
 * Adds a vector to this vector.
 * @param {Vec2} addend The vector to add to this one.
 * @returns {Vec2} This vector after adding the specified vector to it.
 * @throws {ArgumentError} If the specified addend is null or undefined.
 */
Vec2.prototype.add = function (addend) {
    if (!addend) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Vec2", "add", "missingVector"));
    }

    this[0] += addend[0];
    this[1] += addend[1];

    return this;
};

/**
 * Subtracts a vector from this vector.
 * @param {Vec2} subtrahend The vector to subtract from this one.
 * @returns {Vec2} This vector after subtracting the specified vector from it.
 * @throws {ArgumentError} If the subtrahend is null or undefined.
 */
Vec2.prototype.subtract = function (subtrahend) {
    if (!subtrahend) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Vec2", "subtract", "missingVector"));
    }

    this[0] -= subtrahend[0];
    this[1] -= subtrahend[1];

    return this;
};

/**
 * Multiplies this vector by a scalar.
 * @param {Number} scalar The scalar to multiply this vector by.
 * @returns {Vec2} This vector multiplied by the specified scalar.
 */
Vec2.prototype.multiply = function (scalar) {
    this[0] *= scalar;
    this[1] *= scalar;

    return this;
};

/**
 * Divide this vector by a scalar.
 * @param {Number} divisor The scalar to divide this vector by.
 * @returns {Vec2} This vector divided by the specified scalar.
 */
Vec2.prototype.divide = function (divisor) {
    this[0] /= divisor;
    this[1] /= divisor;

    return this;
};

/**
 * Mixes (interpolates) a specified vector with this vector, modifying this vector.
 * @param {Vec2} vector The vector to mix.
 * @param {Number} weight The relative weight of this vector.
 * @returns {Vec2} This vector modified to the mix of itself and the specified vector.
 * @throws {ArgumentError} If the specified vector is null or undefined.
 */
Vec2.prototype.mix = function (vector, weight) {
    if (!vector) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Vec2", "mix", "missingVector"));
    }

    var w0 = 1 - weight,
        w1 = weight;

    this[0] = this[0] * w0 + vector[0] * w1;
    this[1] = this[1] * w0 + vector[1] * w1;

    return this;
};

/**
 * Negates this vector.
 * @returns {Vec2} This vector, negated.
 */
Vec2.prototype.negate = function () {
    this[0] = -this[0];
    this[1] = -this[1];

    return this;
};

/**
 * Computes the scalar dot product of this vector and a specified vector.
 * @param {Vec2} vector The vector to multiply.
 * @returns {Number} The scalar dot product of the vectors.
 * @throws {ArgumentError} If the specified vector is null or undefined.
 */
Vec2.prototype.dot = function (vector) {
    if (!vector) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Vec2", "dot", "missingVector"));
    }

    return this[0] * vector[0] + this[1] * vector[1];
};

/**
 * Computes the squared magnitude of this vector.
 * @returns {Number} The squared magnitude of this vector.
 */
Vec2.prototype.magnitudeSquared = function () {
    return this.dot(this);
};

/**
 * Computes the magnitude of this vector.
 * @returns {Number} The magnitude of this vector.
 */
Vec2.prototype.magnitude = function () {
    return Math.sqrt(this.magnitudeSquared());
};

/**
 * Normalizes this vector to a unit vector.
 * @returns {Vec2} This vector, normalized.
 */
Vec2.prototype.normalize = function () {
    var magnitude = this.magnitude(),
        magnitudeInverse = 1 / magnitude;

    this[0] *= magnitudeInverse;
    this[1] *= magnitudeInverse;

    return this;
};

/**
 * Computes the squared distance from this vector to a specified vector.
 * @param {Vec2} vector The vector to compute the distance to.
 * @returns {Number} The squared distance between the vectors.
 * @throws {ArgumentError} If the specified vector is null or undefined.
 */
Vec2.prototype.distanceToSquared = function (vector) {
    if (!vector) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Vec2", "distanceToSquared", "missingVector"));
    }

    var dx = this[0] - vector[0],
        dy = this[1] - vector[1];

    return dx * dx + dy * dy;
};

/**
 * Computes the distance from this vector to a specified vector.
 * @param {Vec2} vector The vector to compute the distance to.
 * @returns {Number} The distance between the vectors.
 * @throws {ArgumentError} If the specified vector is null or undefined.
 */
Vec2.prototype.distanceTo = function (vector) {
    if (!vector) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Vec2", "distanceTo", "missingVector"));
    }

    return Math.sqrt(this.distanceToSquared(vector));
};

/**
 * Creates a {@link Vec3} using this vector's X and Y components and a Z component of 0.
 * @returns {Vec3} A new vector whose X and Y components are those of this vector and whose Z component is 0.
 */
Vec2.prototype.toVec3 = function () {
    return new Vec3(this[0], this[1], 0);
};

/**
 * Swaps the components of this vector with those of another vector. This vector is set to the values of the
 * specified vector, and the specified vector's components are set to the values of this vector.
 * @param {Vec2} that The vector to swap.
 * @returns {Vec2} This vector set to the values of the specified vector.
 */
Vec2.prototype.swap = function (that) {
    var tmp = this[0];
    this[0] = that[0];
    that[0] = tmp;

    tmp = this[1];
    this[1] = that[1];
    that[1] = tmp;

    return this;
};

/**
 * Returns a string representation of this vector.
 * @returns {String} A string representation of this vector, in the form "(x, y)".
 */
Vec2.prototype.toString = function () {
    return "(" + this[0] + ", " + this[1] + ")";
};

export default Vec2;
