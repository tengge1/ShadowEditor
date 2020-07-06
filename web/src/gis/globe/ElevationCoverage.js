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
 * @exports ElevationCoverage
 */
import ArgumentError from '../error/ArgumentError';
import Logger from '../util/Logger';
import Sector from '../geom/Sector';


/**
 * Constructs an ElevationCoverage
 * @alias ElevationCoverage
 * @constructor
 * @classdesc When used directly and not through a subclass, this class represents an elevation coverage
 * whose elevations are zero at all locations.
 * @param {Number} resolution The resolution of the coverage, in degrees. (To compute degrees from
 * meters, divide the number of meters by the globe's radius to obtain radians and convert the result to degrees.)
 * @throws {ArgumentError} If the resolution argument is null, undefined, or zero.
 */
function ElevationCoverage(resolution) {
    if (!resolution) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "ElevationCoverage", "constructor",
                "missingResolution"));
    }

    /**
     * Indicates the last time this coverage changed, in milliseconds since midnight Jan 1, 1970.
     * @type {Number}
     * @readonly
     * @default Date.now() at construction
     */
    this.timestamp = Date.now();

    /**
     * Indicates this coverage's display name.
     * @type {String}
     * @default "Coverage"
     */
    this.displayName = "Coverage";

    /**
     * Indicates whether or not to use this coverage.
     * @type {Boolean}
     * @default true
     */
    this._enabled = true;

    /**
     * The resolution of this coverage in degrees.
     * @type {Number}
     */
    this.resolution = resolution;

    /**
     * The sector this coverage spans.
     * @type {Sector}
     * @readonly
     */
    this.coverageSector = Sector.FULL_SPHERE;
}

Object.defineProperties(ElevationCoverage.prototype, {
    /**
     * Indicates whether or not to use this coverage.
     * @type {Boolean}
     * @default true
     */
    enabled: {
        get: function () {
            return this._enabled;
        },
        set: function (value) {
            this._enabled = value;
            this.timestamp = Date.now();
        }
    }
});

/**
 * Returns the minimum and maximum elevations within a specified sector.
 * @param {Sector} sector The sector for which to determine extreme elevations.
 * @param {Number[]} result An array in which to return the requested minimum and maximum elevations.
 * @returns {Boolean} true if the coverage completely fills the sector with data, false otherwise.
 * @throws {ArgumentError} If any argument is null or undefined
 */
ElevationCoverage.prototype.minAndMaxElevationsForSector = function (sector, result) {
    if (!sector) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "ElevationCoverage", "minAndMaxElevationsForSector", "missingSector"));
    }

    if (!result) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "ElevationCoverage", "minAndMaxElevationsForSector", "missingResult"));
    }

    if (result[0] > 0) { // min elevation
        result[0] = 0;
    }

    if (result[1] < 0) { // max elevation
        result[1] = 0;
    }

    return true;
};

/**
 * Returns the elevation at a specified location.
 * @param {Number} latitude The location's latitude in degrees.
 * @param {Number} longitude The location's longitude in degrees.
 * @returns {Number} The elevation at the specified location, in meters. Returns null if the location is
 * outside the coverage area of this coverage.
 */
ElevationCoverage.prototype.elevationAtLocation = function (latitude, longitude) {
    return 0;
};

/**
 * Returns the elevations at locations within a specified sector.
 * @param {Sector} sector The sector for which to determine the elevations.
 * @param {Number} numLat The number of latitudinal sample locations within the sector.
 * @param {Number} numLon The number of longitudinal sample locations within the sector.
 * @param {Number[]} result An array in which to return the requested elevations.
 * @returns {Boolean} true if the result array was completely filled with elevation data, false otherwise.
 * @throws {ArgumentError} If the specified sector or result array is null or undefined, or if either of the
 * specified numLat or numLon values is less than one.
 */
ElevationCoverage.prototype.elevationsForGrid = function (sector, numLat, numLon, result) {
    if (!sector) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "ElevationCoverage", "elevationsForGrid", "missingSector"));
    }

    if (numLat <= 0 || numLon <= 0) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ElevationCoverage",
            "elevationsForGrid", "numLat or numLon is less than 1"));
    }

    if (!result || result.length < numLat * numLon) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ElevationCoverage",
            "elevationsForGrid", "missingArray"));
    }

    for (var i = 0, len = result.length; i < len; i++) {
        result[i] = 0;
    }

    return true;
};

export default ElevationCoverage;
