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
 * @exports Rectangle
 */

/**
 * Constructs a rectangle with a specified origin and size.
 * @alias Rectangle
 * @constructor
 * @classdesc Represents a rectangle in 2D Cartesian coordinates.
 * @param {Number} x The X coordinate of the rectangle's origin.
 * @param {Number} y The Y coordinate of the rectangle's origin.
 * @param {Number} width The rectangle's width.
 * @param {Number} height The rectangle's height.
 */
function Rectangle(x, y, width, height) {

    /**
     * The X coordinate of this rectangle's origin.
     * @type {Number}
     */
    this.x = x;

    /**
     * The Y coordinate of this rectangle's origin.
     * @type {Number}
     */
    this.y = y;

    /**
     * This rectangle's width.
     * @type {Number}
     */
    this.width = width;

    /**
     * This rectangle's height.
     * @type {Number}
     */
    this.height = height;
}

/**
 * Sets all this rectangle's properties.
 * @param {Number} x The X coordinate of the rectangle's origin.
 * @param {Number} y The Y coordinate of the rectangle's origin.
 * @param {Number} width The rectangle's width.
 * @param {Number} height The rectangle's height.
 */
Rectangle.prototype.set = function (x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
};

/**
 * Returns the minimum X value of this rectangle.
 * @returns {Number} The rectangle's minimum X value.
 */
Rectangle.prototype.getMinX = function () {
    return this.x;
};

/**
 * Returns the minimum Y value of this rectangle.
 * @returns {Number} The rectangle's minimum Y value.
 */
Rectangle.prototype.getMinY = function () {
    return this.y;
};

/**
 * Returns the maximum X value of this rectangle.
 * @returns {Number} The rectangle's maximum X value.
 */
Rectangle.prototype.getMaxX = function () {
    return this.x + this.width;
};

/**
 * Returns the maximum Y value of this rectangle.
 * @returns {Number} The rectangle's maximum Y value.
 */
Rectangle.prototype.getMaxY = function () {
    return this.y + this.height;
};

/**
 * Indicates whether this rectangle contains a specified point.
 * @param {Vec2} point The point to test.
 * @returns {Boolean} true if this rectangle contains the specified point, otherwise false.
 */
Rectangle.prototype.containsPoint = function (point) {
    return point[0] >= this.x && point[0] <= this.x + this.width
        && point[1] >= this.y && point[1] <= this.y + this.height;
};
/**
 *
 * Indicates whether this rectangle intersects a specified one.
 * @param {Rectangle} that The rectangle to test.
 * @returns {Boolean} true if this triangle and the specified one intersect, otherwise false.
 */
Rectangle.prototype.intersects = function (that) {
    if (that.x + that.width < this.x)
        return false;

    if (that.x > this.x + this.width)
        return false;

    if (that.y + that.height < this.y)
        return false;

    //noinspection RedundantIfStatementJS
    if (that.y > this.y + this.height)
        return false;

    return true;
};

/**
 * Indicates whether this rectangle intersects any rectangle in a specified array of rectangles.
 * @param {Rectangle[]} rectangles The rectangles to test intersection with.
 * @returns {Boolean} true if this rectangle intersects any rectangle in the array, otherwise false.
 */
Rectangle.prototype.intersectsRectangles = function (rectangles) {
    if (rectangles) {
        for (var i = 0; i < rectangles.length; i++) {
            if (this.intersects(rectangles[i])) {
                return true;
            }
        }
    }

    return false;
};

/**
 * Returns a string representation of this object.
 * @returns {String} A string representation of this object.
 */
Rectangle.prototype.toString = function () {
    return this.x + ", " + this.y + ", " + this.width + ", " + this.height;
};

export default Rectangle;
