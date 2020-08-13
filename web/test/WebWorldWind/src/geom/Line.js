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
 * @exports Line
 */
import ArgumentError from '../error/ArgumentError';
import Logger from '../util/Logger';
import Vec3 from '../geom/Vec3';


/**
 * Constructs a line from a specified origin and direction.
 * @alias Line
 * @constructor
 * @classdesc Represents a line in Cartesian coordinates.
 * @param {Vec3} origin The line's origin.
 * @param {Vec3} direction The line's direction.
 * @throws {ArgumentError} If either the origin or the direction are null or undefined.
 */
function Line(origin, direction) {
    if (!origin) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Line", "constructor",
            "Origin is null or undefined."));
    }

    if (!direction) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Line", "constructor",
            "Direction is null or undefined."));
    }

    /**
     * This line's origin.
     * @type {Vec3}
     */
    this.origin = origin;

    /**
     * This line's direction.
     * @type {Vec3}
     */
    this.direction = direction;
}

/**
 * Creates a line given two specified endpoints.
 * @param {Vec3} pointA The first endpoint.
 * @param {Vec3} pointB The second endpoint.
 * @return {Line} The new line.
 * @throws {ArgumentError} If either endpoint is null or undefined.
 */
Line.fromSegment = function (pointA, pointB) {
    if (!pointA || !pointB) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Line", "fromSegment", "missingPoint"));
    }

    var origin = new Vec3(pointA[0], pointA[1], pointA[2]),
        direction = new Vec3(pointB[0] - pointA[0], pointB[1] - pointA[1], pointB[2] - pointA[2]);

    return new Line(origin, direction);
};

/**
 * Computes a Cartesian point a specified distance along this line.
 * @param {Number} distance The distance from this line's origin at which to compute the point.
 * @param {Vec3} result A pre-allocated {@Link Vec3} instance in which to return the computed point.
 * @return {Vec3} The specified result argument containing the computed point.
 * @throws {ArgumentError} If the specified result argument is null or undefined.
 */
Line.prototype.pointAt = function (distance, result) {
    if (!result) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Line", "pointAt", "missingResult."));
    }

    result[0] = this.origin[0] + this.direction[0] * distance;
    result[1] = this.origin[1] + this.direction[1] * distance;
    result[2] = this.origin[2] + this.direction[2] * distance;

    return result;
};

/**
 * Indicates whether the components of this line are equal to those of a specified line.
 * @param {Line} otherLine The line to test equality with. May be null or undefined, in which case this
 * function returns false.
 * @returns {boolean} true if all components of this line are equal to the corresponding
 * components of the specified line, otherwise false.
 */
Line.prototype.equals = function (otherLine) {
    if (otherLine) {
        return this.origin.equals(otherLine.origin) && this.direction.equals(otherLine.direction);
    }

    return false;
};

/**
 * Creates a new line that is a copy of this line.
 * @returns {Line} The new line.
 */
Line.prototype.clone = function () {
    var clone = new Line(new Vec3(0, 0, 0), new Vec3(0, 0, 0));
    clone.copy(this);

    return clone;
};

/**
 * Copies the components of a specified line to this line.
 * @param {Line} copyLine The line to copy.
 * @returns {Line} A copy of this line equal to otherLine.
 * @throws {ArgumentError} If the specified line is null or undefined.
 */
Line.prototype.copy = function (copyLine) {
    if (!copyLine) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Line", "copy", "missingLine"));
    }

    this.origin.copy(copyLine.origin);
    this.direction.copy(copyLine.direction);

    return this;
};

export default Line;
