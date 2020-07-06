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
 * @exports ProjectionGnomonic
 */
import Angle from '../geom/Angle';
import ArgumentError from '../error/ArgumentError';
import GeographicProjection from '../projections/GeographicProjection';
import Logger from '../util/Logger';
import Sector from '../geom/Sector';
import WWMath from '../util/WWMath';


/**
 * Constructs a gnomonic geographic projection.
 * @alias ProjectionGnomonic
 * @constructor
 * @augments GeographicProjection
 * @classdesc Represents a polar gnomonic geographic projection.
 * @param {String} pole Indicates the north or south aspect. Specify "North" for the north aspect or "South"
 * for the south aspect.
 */
function ProjectionGnomonic(pole) {

    // Internal. Intentionally not documented. See "pole" property accessor below for public interface.

    // Internal. Intentionally not documented.
    this.north = !(pole === "South");

    var limits = this.north ? new Sector(30, 90, -180, 180) : new Sector(-90, -30, -180, 180);

    GeographicProjection.call(this, "Polar Gnomonic", false, limits);

    // Internal. Intentionally not documented. See "pole" property accessor below for public interface.
    this._pole = pole;

    // Documented in superclass.
    this.displayName = this.north ? "North Gnomonic" : "South Gnomonic";

    // Internal. Intentionally not documented. See "stateKey" property accessor below for public interface.
    this._stateKey = "projection polar gnomonic " + this._pole + " ";
}

ProjectionGnomonic.prototype = Object.create(GeographicProjection.prototype);

Object.defineProperties(ProjectionGnomonic.prototype, {

    /**
     * Indicates the north or south aspect. Specify "North" or "South".
     * @memberof ProjectionGnomonic.prototype
     * @type {String}
     */
    pole: {
        get: function () {
            return this._pole;
        },
        set: function (pole) {
            this._pole = pole;
            this.north = !(this._pole === "South");
            this.projectionLimits = this.north ? new Sector(30, 90, -180, 180) : new Sector(-90, -30, -180, 180);
            this._stateKey = "projection polar gnomonic " + this._pole + " ";
        }
    },

    /**
     * A string identifying this projection's current state. Used to compare states during rendering to
     * determine whether globe-state dependent cached values must be updated. Applications typically do not
     * interact with this property.
     * @memberof ProjectionGnomonic.prototype
     * @readonly
     * @type {String}
     */
    stateKey: {
        get: function () {
            return this._stateKey;
        }
    }
});

// Documented in base class.
ProjectionGnomonic.prototype.geographicToCartesian = function (globe, latitude, longitude, elevation,
    offset, result) {
    if (!globe) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ProjectionGnomonic",
            "geographicToCartesian", "missingGlobe"));
    }

    if (!result) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ProjectionGnomonic",
            "geographicToCartesian", "missingResult"));
    }

    // Formulae taken from "Map Projections -- A Working Manual", Snyder, USGS paper 1395, pg. 167.

    if (this.north && latitude === 90 || !this.north && latitude === -90) {
        result[0] = 0;
        result[1] = 0;
        result[2] = elevation;
    } else {
        var poleFactor = this.north ? 1 : -1,
            a = globe.equatorialRadius / Math.tan(latitude * Angle.DEGREES_TO_RADIANS); // R cot(phi)

        result[0] = a * Math.sin(longitude * Angle.DEGREES_TO_RADIANS) * poleFactor; // eqs. 22-6, 22-10
        result[1] = a * -Math.cos(longitude * Angle.DEGREES_TO_RADIANS); // eqs. 22-7, 22-11
        result[2] = elevation;
    }

    return result;
};

// Documented in base class.
ProjectionGnomonic.prototype.geographicToCartesianGrid = function (globe, sector, numLat, numLon,
    elevations, referencePoint,
    offset, result) {
    if (!globe) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ProjectionGnomonic",
            "geographicToCartesianGrid", "missingGlobe"));
    }

    if (!sector) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ProjectionGnomonic",
            "geographicToCartesianGrid", "missingSector"));
    }

    if (!elevations || elevations.length < numLat * numLon) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ProjectionGnomonic",
            "geographicToCartesianGrid",
            "The specified elevations array is null, undefined or insufficient length"));
    }

    if (!result) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ProjectionGnomonic",
            "geographicToCartesianGrid", "missingResult"));
    }

    var minLat = sector.minLatitude * Angle.DEGREES_TO_RADIANS,
        maxLat = sector.maxLatitude * Angle.DEGREES_TO_RADIANS,
        minLon = sector.minLongitude * Angle.DEGREES_TO_RADIANS,
        maxLon = sector.maxLongitude * Angle.DEGREES_TO_RADIANS,
        deltaLat = (maxLat - minLat) / (numLat > 1 ? numLat - 1 : 1),
        deltaLon = (maxLon - minLon) / (numLon > 1 ? numLon - 1 : 1),
        minLatLimit = this.projectionLimits.minLatitude * Angle.DEGREES_TO_RADIANS,
        maxLatLimit = this.projectionLimits.maxLatitude * Angle.DEGREES_TO_RADIANS,
        poleFactor = this.north ? 1 : -1,
        refPoint = referencePoint ? referencePoint : new Vec3(0, 0, 0),
        latIndex, lonIndex,
        elevIndex = 0, resultIndex = 0,
        lat, lon, clampedLat, a;

    for (latIndex = 0, lat = minLat; latIndex < numLat; latIndex++, lat += deltaLat) {
        if (latIndex === numLat - 1) {
            lat = maxLat; // explicitly set the last lat to the max latitude to ensure alignment
        }

        // Latitude is constant for each row. Values that are a function of latitude can be computed once per row.
        clampedLat = WWMath.clamp(lat, minLatLimit, maxLatLimit);

        a = globe.equatorialRadius / Math.tan(clampedLat);
        if (this.north && clampedLat === Math.PI / 2 || !this.north && clampedLat === -Math.PI / 2) {
            a = 0;
        }

        for (lonIndex = 0, lon = minLon; lonIndex < numLon; lonIndex++, lon += deltaLon) {
            if (lonIndex === numLon - 1) {
                lon = maxLon; // explicitly set the last lon to the max longitude to ensure alignment
            }

            // Formulae taken from "Map Projections -- A Working Manual", Snyder, USGS paper 1395, pg. 167.

            result[resultIndex++] = a * Math.sin(lon) * poleFactor - refPoint[0]; // eqs. 22-6, 22-10
            result[resultIndex++] = a * -Math.cos(lon) - refPoint[1]; // eqs. 22-7, 22-11
            result[resultIndex++] = elevations[elevIndex++] - refPoint[2];
        }
    }

    return result;
};

// Documented in base class.
ProjectionGnomonic.prototype.cartesianToGeographic = function (globe, x, y, z, offset, result) {
    if (!globe) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ProjectionGnomonic",
            "cartesianToGeographic", "missingGlobe"));
    }

    if (!result) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ProjectionGnomonic",
            "cartesianToGeographic", "missingResult"));
    }

    // Formulae taken from "Map Projections -- A Working Manual", Snyder, USGS paper 1395, pg. 167.

    var rho = Math.sqrt(x * x + y * y),// eq. 20-18
        c;

    if (rho < 1.0e-4) {
        result.latitude = this.north ? 90 : -90;
        result.longitude = 0;
        result.altitude = z;
    } else {
        c = Math.atan2(rho, globe.equatorialRadius); // eq. 22-16
        if (c > Math.PI) {
            c = Math.PI; // map cartesian points beyond the projection's radius to the edge of the projection
        }

        result.latitude = Math.asin(Math.cos(c) * (this.north ? 1 : -1)) * Angle.RADIANS_TO_DEGREES; // eq. 20-14
        result.longitude = Math.atan2(x, y * (this.north ? -1 : 1)) * Angle.RADIANS_TO_DEGREES; // use atan2(x,y) instead of atan(x/y). 20-16, 20-17
        result.altitude = z;
    }

    return result;
};

// Documented in base class.
ProjectionGnomonic.prototype.northTangentAtLocation = function (globe, latitude, longitude, result) {
    if (!result) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ProjectionGnomonic",
            "northTangentAtLocation", "missingResult"));
    }

    // The north pointing tangent depends on the pole. With the south pole, the north pointing tangent points in
    // the same direction as the vector returned by cartesianToGeographic. With the north pole, the north
    // pointing tangent has the opposite direction.

    result[0] = Math.sin(longitude * Angle.DEGREES_TO_RADIANS) * (this.north ? -1 : 1);
    result[1] = Math.cos(longitude * Angle.DEGREES_TO_RADIANS);
    result[2] = 0;

    return result;
};

// Documented in base class.
ProjectionGnomonic.prototype.northTangentAtPoint = function (globe, x, y, z, offset, result) {
    if (!result) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ProjectionGnomonic",
            "northTangentAtLocation", "missingResult"));
    }

    // The north pointing tangent depends on the pole. With the south pole, the north pointing tangent points in
    // the same direction as the vector returned by cartesianToGeographic. With the north pole, the north
    // pointing tangent has the opposite direction.

    var rho = Math.sqrt(x * x + y * y);

    if (rho < 1.0e-4) {
        result[0] = 0;
        result[1] = 1;
        result[2] = 0;
    } else {
        result[0] = x / rho * (this.north ? -1 : 1);
        result[1] = y / rho * (this.north ? -1 : 1);
        result[2] = 0;
    }

    return result;
};

export default ProjectionGnomonic;

