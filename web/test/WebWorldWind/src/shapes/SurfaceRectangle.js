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
 * @exports SurfaceRectangle
 */
import Angle from '../geom/Angle';
import ArgumentError from '../error/ArgumentError';
import Location from '../geom/Location';
import Logger from '../util/Logger';
import ShapeAttributes from '../shapes/ShapeAttributes';
import SurfaceShape from '../shapes/SurfaceShape';
import WWMath from '../util/WWMath';


/**
 * Constructs a surface rectangle with a specified center and size and an optional attributes bundle.
 * @alias SurfaceRectangle
 * @constructor
 * @augments SurfaceShape
 * @classdesc Represents a rectangle draped over the terrain surface.
 * <p>
 * SurfaceRectangle uses the following attributes from its associated shape attributes bundle:
 * <ul>
 *         <li>Draw interior</li>
 *         <li>Draw outline</li>
 *         <li>Interior color</li>
 *         <li>Outline color</li>
 *         <li>Outline width</li>
 *         <li>Outline stipple factor</li>
 *         <li>Outline stipple pattern</li>
 * </ul>
 * @param {Location} center The rectangle's center location.
 * @param {Number} width The rectangle's width in meters.
 * @param {Number} height The rectangle's height in meters.
 * @param {Number} heading The rectangle's heading.
 * @param {ShapeAttributes} attributes The attributes to apply to this shape. May be null, in which case
 * attributes must be set directly before the shape is drawn.
 * @throws {ArgumentError} If the specified center location is null or undefined or if either specified width
 * or height is negative.
 */
function SurfaceRectangle(center, width, height, heading, attributes) {
    if (!center) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "SurfaceRectangle", "constructor", "missingLocation"));
    }

    if (width < 0 || height < 0) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "SurfaceRectangle", "constructor", "Size is negative."));
    }

    SurfaceShape.call(this, attributes);

    // All these are documented with their property accessors below.
    this._center = center;
    this._width = width;
    this._height = height;
    this._heading = heading;
}

SurfaceRectangle.prototype = Object.create(SurfaceShape.prototype);

Object.defineProperties(SurfaceRectangle.prototype, {
    /**
     * This shape's center location.
     * @memberof SurfaceRectangle.prototype
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
     * This shape's width, in meters.
     * @memberof SurfaceRectangle.prototype
     * @type {Number}
     */
    width: {
        get: function () {
            return this._width;
        },
        set: function (value) {
            this.stateKeyInvalid = true;
            this.resetBoundaries();
            this._width = value;
        }
    },

    /**
     * This shape's height in meters.
     * @memberof SurfaceRectangle.prototype
     * @type {Number}
     */
    height: {
        get: function () {
            return this._height;
        },
        set: function (value) {
            this.stateKeyInvalid = true;
            this.resetBoundaries();
            this._height = value;
        }
    },

    /**
     * The shape's heading, specified as degrees clockwise from North. This shape's height and width are
     * relative to its heading.
     * @memberof SurfaceRectangle.prototype
     * @type {number}
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
    }
});

// Internal use only. Intentionally not documented.
SurfaceRectangle.staticStateKey = function (shape) {
    var shapeStateKey = SurfaceShape.staticStateKey(shape);

    return shapeStateKey +
        " ce " + shape.center.toString() +
        " wi " + shape.width.toString() +
        " he " + shape.height.toString() +
        " hd " + shape.heading.toString();
};

// Internal use only. Intentionally not documented.
SurfaceRectangle.prototype.computeStateKey = function () {
    return SurfaceRectangle.staticStateKey(this);
};

// Internal. Intentionally not documented.
SurfaceRectangle.prototype.computeBoundaries = function (dc) {
    var halfWidth = 0.5 * this.width,
        halfHeight = 0.5 * this.height,
        globeRadius = dc.globe.radiusAt(this.center.latitude, this.center.longitude);


    this._boundaries = new Array(4);

    this.addLocation(0, -halfWidth, -halfHeight, globeRadius);
    this.addLocation(1, halfWidth, -halfHeight, globeRadius);
    this.addLocation(2, halfWidth, halfHeight, globeRadius);
    this.addLocation(3, -halfWidth, halfHeight, globeRadius);
};

SurfaceRectangle.prototype.addLocation = function (idx, xLength, yLength, globeRadius) {
    var distance = Math.sqrt(xLength * xLength + yLength * yLength);

    // azimuth runs positive clockwise from north and through 360 degrees.
    var azimuth = Math.PI / 2.0 - (Math.acos(xLength / distance) * WWMath.signum(yLength) - this.heading * Angle.DEGREES_TO_RADIANS);

    this._boundaries[idx] = Location.greatCircleLocation(this.center, azimuth * Angle.RADIANS_TO_DEGREES,
        distance / globeRadius, new Location(0, 0));

};

// Internal use only. Intentionally not documented.
SurfaceRectangle.prototype.getReferencePosition = function () {
    return this.center;
};

// Internal use only. Intentionally not documented.
SurfaceRectangle.prototype.moveTo = function (globe, position) {
    this.center = this.computeShiftedLocations(globe, this.getReferencePosition(), position, [this.center])[0];
};

export default SurfaceRectangle;

