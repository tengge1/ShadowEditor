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
 * @exports ProjectionPolarEquidistant
 */
import Angle from '../geom/Angle';
import ArgumentError from '../error/ArgumentError';
import GeographicProjection from '../projections/GeographicProjection';
import Logger from '../util/Logger';


/**
 * Constructs a polar equidistant geographic projection.
 * @alias ProjectionPolarEquidistant
 * @constructor
 * @augments GeographicProjection
 * @classdesc Represents a polar equidistant geographic projection.
 * @param {String} pole Indicates the north or south aspect. Specify "North" for the north aspect or "South"
 * for the south aspect.
 */
function ProjectionPolarEquidistant(pole) {

    GeographicProjection.call(this, "Polar Equidistant", false, null);

    // Internal. Intentionally not documented. See "pole" property accessor below for public interface.
    this._pole = pole;

    // Internal. Intentionally not documented.
    this.north = !(pole === "South");

    // Documented in superclass.
    this.displayName = this.north ? "North Polar" : "South Polar";

    // Internal. Intentionally not documented. See "stateKey" property accessor below for public interface.
    this._stateKey = "projection polar equidistant " + this._pole + " ";
}

ProjectionPolarEquidistant.prototype = Object.create(GeographicProjection.prototype);

Object.defineProperties(ProjectionPolarEquidistant.prototype, {

    /**
     * Indicates the north or south aspect. Specify "North" or "South".
     * @memberof ProjectionPolarEquidistant.prototype
     * @type {String}
     */
    pole: {
        get: function () {
            return this._pole;
        },
        set: function (pole) {
            this._pole = pole;
            this.north = !(this._pole === "South");
            this._stateKey = "projection polar equidistant " + this._pole + " ";
        }
    },

    /**
     * A string identifying this projection's current state. Used to compare states during rendering to
     * determine whether globe-state dependent cached values must be updated. Applications typically do not
     * interact with this property.
     * @memberof ProjectionPolarEquidistant.prototype
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
ProjectionPolarEquidistant.prototype.geographicToCartesian = function (globe, latitude, longitude, elevation,
    offset, result) {
    if (!globe) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ProjectionPolarEquidistant",
            "geographicToCartesian", "missingGlobe"));
    }

    if (!result) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ProjectionPolarEquidistant",
            "geographicToCartesian", "missingResult"));
    }

    // Formulae taken from "Map Projections -- A Working Manual", Snyder, USGS paper 1395, pg. 195.

    if (this.north && latitude === 90 || !this.north && latitude === -90) {
        result[0] = 0;
        result[1] = 0;
        result[2] = elevation;
    } else {
        var northSouthFactor = this.north ? -1 : 1,
            a = globe.equatorialRadius * (Math.PI / 2 + latitude * Angle.DEGREES_TO_RADIANS * northSouthFactor);

        result[0] = a * Math.sin(longitude * Angle.DEGREES_TO_RADIANS);
        result[1] = a * Math.cos(longitude * Angle.DEGREES_TO_RADIANS) * northSouthFactor;
        result[2] = elevation;
    }

    return result;
};

// Documented in base class.
ProjectionPolarEquidistant.prototype.geographicToCartesianGrid = function (globe, sector, numLat, numLon,
    elevations, referencePoint,
    offset, result) {
    if (!globe) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ProjectionPolarEquidistant",
            "geographicToCartesianGrid", "missingGlobe"));
    }

    if (!sector) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ProjectionPolarEquidistant",
            "geographicToCartesianGrid", "missingSector"));
    }

    if (!elevations || elevations.length < numLat * numLon) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ProjectionPolarEquidistant",
            "geographicToCartesianGrid",
            "The specified elevations array is null, undefined or insufficient length"));
    }

    if (!result) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ProjectionPolarEquidistant",
            "geographicToCartesianGrid", "missingResult"));
    }

    var eqr = globe.equatorialRadius,
        minLat = sector.minLatitude * Angle.DEGREES_TO_RADIANS,
        maxLat = sector.maxLatitude * Angle.DEGREES_TO_RADIANS,
        minLon = sector.minLongitude * Angle.DEGREES_TO_RADIANS,
        maxLon = sector.maxLongitude * Angle.DEGREES_TO_RADIANS,
        deltaLat = (maxLat - minLat) / (numLat > 1 ? numLat - 1 : 1),
        deltaLon = (maxLon - minLon) / (numLon > 1 ? numLon - 1 : 1),
        northSouthFactor = this.north ? -1 : 1,
        refPoint = referencePoint ? referencePoint : new Vec3(0, 0, 0),
        pi_2 = Math.PI / 2,
        latIndex, lonIndex,
        elevIndex = 0, resultIndex = 0,
        cosLon = new Float64Array(numLon), sinLon = new Float64Array(numLon),
        lat, lon, a;

    // Compute and save values that are a function of each unique longitude value in the specified sector. This
    // eliminates the need to re-compute these values for each column of constant longitude.
    for (lonIndex = 0, lon = minLon; lonIndex < numLon; lonIndex++, lon += deltaLon) {
        if (lonIndex === numLon - 1) {
            lon = maxLon; // explicitly set the last lon to the max longitude to ensure alignment
        }

        cosLon[lonIndex] = Math.cos(lon);
        sinLon[lonIndex] = Math.sin(lon);
    }

    // Iterate over the latitude and longitude coordinates in the specified sector, computing the Cartesian point
    // corresponding to each latitude and longitude.
    for (latIndex = 0, lat = minLat; latIndex < numLat; latIndex++, lat += deltaLat) {
        if (latIndex === numLat - 1) {
            lat = maxLat; // explicitly set the last lat to the max latitude to ensure alignment
        }

        // Latitude is constant for each row. Values that are a function of latitude can be computed once per row.
        a = eqr * (pi_2 + lat * northSouthFactor);
        if (this.north && lat === pi_2 || !this.north && lat === -pi_2) {
            a = 0;
        }

        for (lonIndex = 0; lonIndex < numLon; lonIndex++) {
            result[resultIndex++] = a * sinLon[lonIndex] - refPoint[0];
            result[resultIndex++] = a * cosLon[lonIndex] * northSouthFactor - refPoint[1];
            result[resultIndex++] = elevations[elevIndex++] - refPoint[2];
        }
    }

    return result;
};

// Documented in base class.
ProjectionPolarEquidistant.prototype.cartesianToGeographic = function (globe, x, y, z, offset, result) {
    if (!globe) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ProjectionPolarEquidistant",
            "cartesianToGeographic", "missingGlobe"));
    }

    if (!result) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ProjectionPolarEquidistant",
            "cartesianToGeographic", "missingResult"));
    }

    // Formulae taken from "Map Projections -- A Working Manual", Snyder, USGS paper 1395, pg. 196.

    var rho = Math.sqrt(x * x + y * y),
        c;

    if (rho < 1.0e-4) {
        result.latitude = this.north ? 90 : -90;
        result.longitude = 0;
        result.altitude = z;
    } else {
        c = rho / globe.equatorialRadius;
        if (c > Math.PI) {
            c = Math.PI; // map cartesian points beyond the projection's radius to the edge of the projection
        }

        result.latitude = Math.asin(Math.cos(c) * (this.north ? 1 : -1)) * Angle.RADIANS_TO_DEGREES;
        result.longitude = Math.atan2(x, y * (this.north ? -1 : 1)) * Angle.RADIANS_TO_DEGREES; // use atan2(x,y) instead of atan(x/y)
        result.altitude = z;
    }

    //console.log(x + ", " + y + ", " + z + " --> " + result.toString());
    return result;
};

// Documented in base class.
ProjectionPolarEquidistant.prototype.northTangentAtLocation = function (globe, latitude, longitude, result) {
    if (!result) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ProjectionPolarEquidistant",
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
ProjectionPolarEquidistant.prototype.northTangentAtPoint = function (globe, x, y, z, offset, result) {
    if (!result) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ProjectionPolarEquidistant",
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

export default ProjectionPolarEquidistant;
