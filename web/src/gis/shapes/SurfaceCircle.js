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
 * @exports SurfaceCircle
 */
import ArgumentError from '../error/ArgumentError';
import Location from '../geom/Location';
import Logger from '../util/Logger';
import ShapeAttributes from '../shapes/ShapeAttributes';
import SurfaceShape from '../shapes/SurfaceShape';


/**
 * Constructs a surface circle with a specified center and radius and an optional attributes bundle.
 * @alias SurfaceCircle
 * @constructor
 * @augments SurfaceShape
 * @classdesc Represents a circle draped over the terrain surface.
 * <p>
 *     SurfaceCircle uses the following attributes from its associated shape attributes bundle:
 *     <ul>
 *         <li>Draw interior</li>
 *         <li>Draw outline</li>
 *         <li>Interior color</li>
 *         <li>Outline color</li>
 *         <li>Outline width</li>
 *         <li>Outline stipple factor</li>
 *         <li>Outline stipple pattern</li>
 *     </ul>
 * @param {Location} center The circle's center location.
 * @param {Number} radius The circle's radius in meters.
 * @param {ShapeAttributes} attributes The attributes to apply to this shape. May be null, in which case
 * attributes must be set directly before the shape is drawn.
 * @throws {ArgumentError} If the specified center location is null or undefined or the specified radius
 * is negative.
 */
function SurfaceCircle(center, radius, attributes) {
    if (!center) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "SurfaceCircle", "constructor", "missingLocation"));
    }

    if (radius < 0) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "SurfaceCircle", "constructor", "Radius is negative"));
    }

    SurfaceShape.call(this, attributes);

    // All these are documented with their property accessors below.
    this._center = center;
    this._radius = radius;
    this._intervals = SurfaceCircle.DEFAULT_NUM_INTERVALS;
}

SurfaceCircle.prototype = Object.create(SurfaceShape.prototype);

Object.defineProperties(SurfaceCircle.prototype, {
    /**
     * This shape's center location.
     * @memberof SurfaceCircle.prototype
     * @type {Location}
     */
    center: {
        get: function () {
            return this._center;
        },
        set: function (value) {
            this.stateKeyInvalid = true;
            this.resetBoundaries();
            this._center = value;
        }
    },

    /**
     * This shape's radius, in meters.
     * @memberof SurfaceCircle.prototype
     * @type {Number}
     */
    radius: {
        get: function () {
            return this._radius;
        },
        set: function (value) {
            this.stateKeyInvalid = true;
            this.resetBoundaries();
            this._radius = value;
        }
    },

    /**
     * The number of intervals to generate locations for.
     * @type {Number}
     * @memberof SurfaceCircle.prototype
     * @default SurfaceCircle.DEFAULT_NUM_INTERVALS
     */
    intervals: {
        get: function () {
            return this._intervals;
        },
        set: function (value) {
            this.stateKeyInvalid = true;
            this.resetBoundaries();
            this._intervals = value;
        }
    }
});

// Internal use only. Intentionally not documented.
SurfaceCircle.staticStateKey = function (shape) {
    var shapeStateKey = SurfaceShape.staticStateKey(shape);

    return shapeStateKey +
        " ce " + shape.center.toString() +
        " ra " + shape.radius.toString();
};

// Internal use only. Intentionally not documented.
SurfaceCircle.prototype.computeStateKey = function () {
    return SurfaceCircle.staticStateKey(this);
};

// Internal. Intentionally not documented.
SurfaceCircle.prototype.computeBoundaries = function (dc) {
    if (this.radius === 0) {
        return null;
    }

    var numLocations = 1 + Math.max(SurfaceCircle.MIN_NUM_INTERVALS, this.intervals),
        da = 360 / (numLocations - 1),
        arcLength = this.radius / dc.globe.radiusAt(this.center.latitude, this.center.longitude);

    this._boundaries = new Array(numLocations);

    for (var i = 0; i < numLocations; i++) {
        var azimuth = i !== numLocations - 1 ? i * da : 0;
        this._boundaries[i] = Location.greatCircleLocation(
            this.center,
            azimuth,   // In degrees
            arcLength, // In radians
            new Location(0, 0)
        );
    }
};

// Internal use only. Intentionally not documented.
SurfaceCircle.prototype.getReferencePosition = function () {
    return this.center;
};

// Internal use only. Intentionally not documented.
SurfaceCircle.prototype.moveTo = function (globe, position) {
    this.center = position;
};

/**
 * The minimum number of intervals the circle generates.
 * @type {Number}
 */
SurfaceCircle.MIN_NUM_INTERVALS = 8;

/**
 * The default number of intervals the circle generates.
 * @type {Number}
 */
SurfaceCircle.DEFAULT_NUM_INTERVALS = 64;

export default SurfaceCircle;

