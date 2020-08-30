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

/**
 * Constructs a line from a specified origin and direction.
 * @alias Line
 * @constructor
 * @classdesc Represents a line in Cartesian coordinates.
 * @param {THREE.Vector3} origin The line's origin.
 * @param {THREE.Vector3} direction The line's direction.
 */
function Line(origin, direction) {
    /**
     * This line's origin.
     * @type {THREE.Vector3}
     */
    this.origin = origin;

    /**
     * This line's direction.
     * @type {THREE.Vector3}
     */
    this.direction = direction;
}

/**
 * Creates a line given two specified endpoints.
 * @param {THREE.Vector3} pointA The first endpoint.
 * @param {THREE.Vector3} pointB The second endpoint.
 * @return {Line} The new line.
 */
Line.fromSegment = function (pointA, pointB) {
    var origin = new THREE.Vector3(pointA.x, pointA.y, pointA.z),
        direction = new THREE.Vector3(pointB.x - pointA.x, pointB.y - pointA.y, pointB.z - pointA.z);

    return new Line(origin, direction);
};

/**
 * Computes a Cartesian point a specified distance along this line.
 * @param {Number} distance The distance from this line's origin at which to compute the point.
 * @param {THREE.Vector3} result A pre-allocated {@Link THREE.Vector3} instance in which to return the computed point.
 * @return {THREE.Vector3} The specified result argument containing the computed point.
 */
Line.prototype.pointAt = function (distance, result) {
    result.x = this.origin.x + this.direction.x * distance;
    result.y = this.origin.y + this.direction.y * distance;
    result.z = this.origin.z + this.direction.z * distance;

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
    var clone = new Line(new THREE.Vector3(), new THREE.Vector3());
    clone.copy(this);

    return clone;
};

/**
 * Copies the components of a specified line to this line.
 * @param {Line} copyLine The line to copy.
 * @returns {Line} A copy of this line equal to otherLine.
 */
Line.prototype.copy = function (copyLine) {
    this.origin.copy(copyLine.origin);
    this.direction.copy(copyLine.direction);

    return this;
};

export default Line;
