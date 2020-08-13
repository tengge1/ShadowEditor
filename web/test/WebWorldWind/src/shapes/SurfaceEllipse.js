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
 * @exports SurfaceEllipse
 */
import Angle from '../geom/Angle';
import ArgumentError from '../error/ArgumentError';
import Location from '../geom/Location';
import Logger from '../util/Logger';
import ShapeAttributes from '../shapes/ShapeAttributes';
import SurfaceShape from '../shapes/SurfaceShape';
import WWMath from '../util/WWMath';


/**
 * Constructs a surface ellipse with a specified center and radii and an optional attributes bundle.
 * @alias SurfaceEllipse
 * @constructor
 * @augments SurfaceShape
 * @classdesc Represents an ellipse draped over the terrain surface.
 * <p>
 * SurfaceEllipse uses the following attributes from its associated shape attributes bundle:
 * <ul>
 *         <li>Draw interior</li>
 *         <li>Draw outline</li>
 *         <li>Interior color</li>
 *         <li>Outline color</li>
 *         <li>Outline width</li>
 *         <li>Outline stipple factor</li>
 *         <li>Outline stipple pattern</li>
 * </ul>
 * @param {Location} center The ellipse's center location.
 * @param {Number} majorRadius The ellipse's major radius in meters.
 * @param {Number} minorRadius The ellipse's minor radius in meters.
 * @param {Number} heading The heading of the major axis in degrees.
 * @param {ShapeAttributes} attributes The attributes to apply to this shape. May be null, in which case
 * attributes must be set directly before the shape is drawn.
 * @throws {ArgumentError} If the specified center location is null or undefined or if either specified radii
 * is negative.
 */
function SurfaceEllipse(center, majorRadius, minorRadius, heading, attributes) {
    if (!center) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "SurfaceEllipse", "constructor", "missingLocation"));
    }

    if (majorRadius < 0 || minorRadius < 0) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "SurfaceEllipse", "constructor", "Radius is negative."));
    }

    SurfaceShape.call(this, attributes);

    // All these are documented with their property accessors below.
    this._center = center;
    this._majorRadius = majorRadius;
    this._minorRadius = minorRadius;
    this._heading = heading;
    this._intervals = SurfaceEllipse.DEFAULT_NUM_INTERVALS;
}

SurfaceEllipse.prototype = Object.create(SurfaceShape.prototype);

Object.defineProperties(SurfaceEllipse.prototype, {
    /**
     * This shape's center location.
     * @memberof SurfaceEllipse.prototype
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
     * This shape's major radius, in meters.
     * @memberof SurfaceEllipse.prototype
     * @type {Number}
     */
    majorRadius: {
        get: function () {
            return this._majorRadius;
        },
        set: function (value) {
            this.stateKeyInvalid = true;
            this.resetBoundaries();
            this._majorRadius = value;
        }
    },

    /**
     * This shape's minor radius in meters.
     * @memberof SurfaceEllipse.prototype
     * @type {Number}
     */
    minorRadius: {
        get: function () {
            return this._minorRadius;
        },
        set: function (value) {
            this.stateKeyInvalid = true;
            this.resetBoundaries();
            this._minorRadius = value;
        }
    },

    /**
     * The heading of the major axis, specified as degrees clockwise from North.
     * @type {Number}
     * @memberof SurfaceEllipse.prototype
     * @default 0
     */
    heading: {
        get: function () {
            return this._heading;
        },
        set: function (value) {
            this.stateKeyInvalid = true;
            this.resetBoundaries();
            this._heading = value;
        }
    },

    /**
     * The number of intervals to generate locations for.
     * @type {Number}
     * @memberof SurfaceEllipse.prototype
     * @default SurfaceEllipse.DEFAULT_NUM_INTERVALS
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
SurfaceEllipse.staticStateKey = function (shape) {
    var shapeStateKey = SurfaceShape.staticStateKey(shape);

    return shapeStateKey +
        " ce " + shape.center.toString() +
        " ma " + shape.majorRadius.toString() +
        " mi " + shape.minorRadius.toString() +
        " he " + shape.heading.toString() +
        " in " + shape.intervals.toString();
};

// Internal use only. Intentionally not documented.
SurfaceEllipse.prototype.computeStateKey = function () {
    return SurfaceEllipse.staticStateKey(this);
};

// Internal. Intentionally not documented.
SurfaceEllipse.prototype.computeBoundaries = function (dc) {
    if (this.majorRadius == 0 && this.minorRadius == 0) {
        return null;
    }

    var globe = dc.globe,
        numLocations = 1 + Math.max(SurfaceEllipse.MIN_NUM_INTERVALS, this.intervals),
        da = 2 * Math.PI / (numLocations - 1),
        globeRadius = globe.radiusAt(this.center.latitude, this.center.longitude);

    this._boundaries = new Array(numLocations);

    for (var i = 0; i < numLocations; i++) {
        var angle = i != numLocations - 1 ? i * da : 0,
            xLength = this.majorRadius * Math.cos(angle),
            yLength = this.minorRadius * Math.sin(angle),
            distance = Math.sqrt(xLength * xLength + yLength * yLength);

        // azimuth runs positive clockwise from north and through 360 degrees.
        var azimuth = Math.PI / 2.0 -
            (Math.acos(xLength / distance) * WWMath.signum(yLength) - this.heading * Angle.DEGREES_TO_RADIANS);

        this._boundaries[i] = Location.greatCircleLocation(this.center, azimuth * Angle.RADIANS_TO_DEGREES,
            distance / globeRadius, new Location(0, 0));
    }
};

// Internal use only. Intentionally not documented.
SurfaceEllipse.prototype.getReferencePosition = function () {
    return this.center;
};

// Internal use only. Intentionally not documented.
SurfaceEllipse.prototype.moveTo = function (globe, position) {
    this.center = position;
};

/**
 * The minimum number of intervals the ellipse generates.
 * @type {Number}
 */
SurfaceEllipse.MIN_NUM_INTERVALS = 8;

/**
 * The default number of intervals the ellipse generates.
 * @type {Number}
 */
SurfaceEllipse.DEFAULT_NUM_INTERVALS = 64;

export default SurfaceEllipse;

