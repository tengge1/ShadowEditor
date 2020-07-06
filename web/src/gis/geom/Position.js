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
 * @exports Position
 */
import Angle from '../geom/Angle';
import ArgumentError from '../error/ArgumentError';
import Location from '../geom/Location';
import Logger from '../util/Logger';
import WWMath from '../util/WWMath';


/**
 * Constructs a position from a specified latitude and longitude in degrees and altitude in meters.
 * @alias Position
 * @constructor
 * @classdesc Represents a latitude, longitude, altitude triple, with latitude and longitude in degrees and
 * altitude in meters.
 * @param {Number} latitude The latitude in degrees.
 * @param {Number} longitude The longitude in degrees.
 * @param {Number} altitude The altitude in meters.
 */
function Position(latitude, longitude, altitude) {
    /**
     * The latitude in degrees.
     * @type {Number}
     */
    this.latitude = latitude;
    /**
     * The longitude in degrees.
     * @type {Number}
     */
    this.longitude = longitude;
    /**
     * The altitude in meters.
     * @type {Number}
     */
    this.altitude = altitude;
}

/**
 * A Position with latitude, longitude and altitude all 0.
 * @constant
 * @type {Position}
 */
Position.ZERO = new Position(0, 0, 0);

/**
 * Creates a position from angles specified in radians.
 * @param {Number} latitudeRadians The latitude in radians.
 * @param {Number} longitudeRadians The longitude in radians.
 * @param {Number} altitude The altitude in meters.
 * @returns {Position} The new position with latitude and longitude in degrees.
 */
Position.fromRadians = function (latitudeRadians, longitudeRadians, altitude) {
    return new Position(
        latitudeRadians * Angle.RADIANS_TO_DEGREES,
        longitudeRadians * Angle.RADIANS_TO_DEGREES,
        altitude);
};

/**
 * Sets this position to the latitude, longitude and altitude of a specified position.
 * @param {Position} position The position to copy.
 * @returns {Position} This position, set to the values of the specified position.
 * @throws {ArgumentError} If the specified position is null or undefined.
 */
Position.prototype.copy = function (position) {
    if (!position) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Position", "copy", "missingPosition"));
    }

    this.latitude = position.latitude;
    this.longitude = position.longitude;
    this.altitude = position.altitude;

    return this;
};

/**
 * Indicates whether this position has the same latitude, longitude and altitude as a specified position.
 * @param {Position} position The position to compare with this one.
 * @returns {Boolean} true if this position is equal to the specified one, otherwise false.
 */
Position.prototype.equals = function (position) {
    return position
        && position.latitude === this.latitude
        && position.longitude === this.longitude
        && position.altitude === this.altitude;
};

/**
 * Computes a position along a great circle path at a specified distance between two specified positions.
 * @param {Number} amount The fraction of the path between the two positions at which to compute the new
 * position. This number should be between 0 and 1. If not, it is clamped to the nearest of those values.
 * @param {Position} position1 The starting position.
 * @param {Position} position2 The ending position.
 * @param {Position} result A Position in which to return the result.
 * @returns {Position} The specified result position.
 * @throws {ArgumentError} If either specified position or the result argument is null or undefined.
 */
Position.interpolateGreatCircle = function (amount, position1, position2, result) {
    if (!position1 || !position2) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Position", "interpolateGreatCircle", "missingPosition"));
    }

    if (!result) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Position", "interpolateGreatCircle", "missingResult"));
    }

    var t = WWMath.clamp(amount, 0, 1);
    result.altitude = WWMath.interpolate(t, position1.altitude, position2.altitude);

    //noinspection JSCheckFunctionSignatures
    Location.interpolateGreatCircle(t, position1, position2, result);

    return result;
};

/**
 * Computes a position along a rhumb path at a specified distance between two specified positions.
 * @param {Number} amount The fraction of the path between the two positions at which to compute the new
 * position. This number should be between 0 and 1. If not, it is clamped to the nearest of those values.
 * @param {Position} position1 The starting position.
 * @param {Position} position2 The ending position.
 * @param {Position} result A Position in which to return the result.
 * @returns {Position} The specified result position.
 * @throws {ArgumentError} If either specified position or the result argument is null or undefined.
 */
Position.interpolateRhumb = function (amount, position1, position2, result) {
    if (!position1 || !position2) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Position", "interpolateRhumb", "missingPosition"));
    }

    if (!result) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Position", "interpolateRhumb", "missingResult"));
    }

    var t = WWMath.clamp(amount, 0, 1);
    result.altitude = WWMath.interpolate(t, position1.altitude, position2.altitude);

    //noinspection JSCheckFunctionSignatures
    Location.interpolateRhumb(t, position1, position2, result);

    return result;
};

/**
 * Computes a position along a linear path at a specified distance between two specified positions.
 * @param {Number} amount The fraction of the path between the two positions at which to compute the new
 * position. This number should be between 0 and 1. If not, it is clamped to the nearest of those values.
 * @param {Position} position1 The starting position.
 * @param {Position} position2 The ending position.
 * @param {Position} result A Position in which to return the result.
 * @returns {Position} The specified result position.
 * @throws {ArgumentError} If either specified position or the result argument is null or undefined.
 */
Position.interpolateLinear = function (amount, position1, position2, result) {
    if (!position1 || !position2) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Position", "interpolateLinear", "missingPosition"));
    }

    if (!result) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Position", "interpolateLinear", "missingResult"));
    }

    var t = WWMath.clamp(amount, 0, 1);
    result.altitude = WWMath.interpolate(t, position1.altitude, position2.altitude);

    //noinspection JSCheckFunctionSignatures
    Location.interpolateLinear(t, position1, position2, result);

    return result;
};

/**
 * Returns a string representation of this position.
 * @returns {String}
 */
Position.prototype.toString = function () {
    return "(" + this.latitude.toString() + "\u00b0, " + this.longitude.toString() + "\u00b0, "
        + this.altitude.toString() + ")";
};

export default Position;

