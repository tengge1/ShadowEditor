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
 * @exports ProjectionMercator
 */
import Angle from '../geom/Angle';
import ArgumentError from '../error/ArgumentError';
import GeographicProjection from '../projections/GeographicProjection';
import Logger from '../util/Logger';
import Sector from '../geom/Sector';
import Vec3 from '../geom/Vec3';
import WWMath from '../util/WWMath';


/**
 * Constructs a Mercator geographic projection.
 * @alias ProjectionMercator
 * @constructor
 * @augments GeographicProjection
 * @classdesc Represents a Mercator geographic projection.
 */
function ProjectionMercator() {

    GeographicProjection.call(this, "Mercator", true, new Sector(-78, 78, -180, 180));
}

ProjectionMercator.prototype = Object.create(GeographicProjection.prototype);

// Documented in base class.
ProjectionMercator.prototype.geographicToCartesian = function (globe, latitude, longitude, elevation, offset,
    result) {
    if (!globe) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ProjectionMercator",
            "geographicToCartesian", "missingGlobe"));
    }

    if (!result) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ProjectionMercator",
            "geographicToCartesian", "missingResult"));
    }

    if (latitude > this.projectionLimits.maxLatitude) {
        latitude = this.projectionLimits.maxLatitude;
    }
    if (latitude < this.projectionLimits.minLatitude) {
        latitude = this.projectionLimits.minLatitude;
    }

    // See "Map Projections: A Working Manual", page 44 for the source of the below formulas.

    var ecc = Math.sqrt(globe.eccentricitySquared),
        sinLat = Math.sin(latitude * Angle.DEGREES_TO_RADIANS),
        s = (1 + sinLat) / (1 - sinLat) * Math.pow((1 - ecc * sinLat) / (1 + ecc * sinLat), ecc);

    result[0] = globe.equatorialRadius * longitude * Angle.DEGREES_TO_RADIANS + (offset ? offset[0] : 0);
    result[1] = 0.5 * globe.equatorialRadius * Math.log(s);
    result[2] = elevation;

    return result;
};

Object.defineProperties(ProjectionMercator.prototype, {
    /**
     * A string identifying this projection's current state. Used to compare states during rendering to
     * determine whether globe-state dependent cached values must be updated. Applications typically do not
     * interact with this property.
     * @memberof ProjectionMercator.prototype
     * @readonly
     * @type {String}
     */
    stateKey: {
        get: function () {
            return "projection mercator ";
        }
    }
});

// Documented in base class.
ProjectionMercator.prototype.geographicToCartesianGrid = function (globe, sector, numLat, numLon, elevations,
    referencePoint, offset, result) {
    if (!globe) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ProjectionMercator",
            "geographicToCartesianGrid", "missingGlobe"));
    }

    if (!sector) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ProjectionMercator",
            "geographicToCartesianGrid", "missingSector"));
    }

    if (!elevations || elevations.length < numLat * numLon) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ProjectionMercator",
            "geographicToCartesianGrid",
            "The specified elevations array is null, undefined or insufficient length"));
    }

    if (!result) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ProjectionMercator",
            "geographicToCartesianGrid", "missingResult"));
    }

    var eqr = globe.equatorialRadius,
        ecc = Math.sqrt(globe.eccentricitySquared),
        minLat = sector.minLatitude * Angle.DEGREES_TO_RADIANS,
        maxLat = sector.maxLatitude * Angle.DEGREES_TO_RADIANS,
        minLon = sector.minLongitude * Angle.DEGREES_TO_RADIANS,
        maxLon = sector.maxLongitude * Angle.DEGREES_TO_RADIANS,
        deltaLat = (maxLat - minLat) / (numLat > 1 ? numLat - 1 : 1),
        deltaLon = (maxLon - minLon) / (numLon > 1 ? numLon - 1 : 1),
        minLatLimit = this.projectionLimits.minLatitude * Angle.DEGREES_TO_RADIANS,
        maxLatLimit = this.projectionLimits.maxLatitude * Angle.DEGREES_TO_RADIANS,
        refCenter = referencePoint ? referencePoint : new Vec3(0, 0, 0),
        offsetX = offset ? offset[0] : 0,
        latIndex, lonIndex,
        elevIndex = 0, resultIndex = 0,
        lat, lon, clampedLat, sinLat, s, y;

    // Iterate over the latitude and longitude coordinates in the specified sector, computing the Cartesian point
    // corresponding to each latitude and longitude.
    for (latIndex = 0, lat = minLat; latIndex < numLat; latIndex++, lat += deltaLat) {
        if (latIndex === numLat - 1) {
            lat = maxLat; // explicitly set the last lat to the max latitude to ensure alignment
        }

        // Latitude is constant for each row. Values that are a function of latitude can be computed once per row.
        clampedLat = WWMath.clamp(lat, minLatLimit, maxLatLimit);
        sinLat = Math.sin(clampedLat);
        s = (1 + sinLat) / (1 - sinLat) * Math.pow((1 - ecc * sinLat) / (1 + ecc * sinLat), ecc);
        y = eqr * Math.log(s) * 0.5 - refCenter[1];

        for (lonIndex = 0, lon = minLon; lonIndex < numLon; lonIndex++, lon += deltaLon) {
            if (lonIndex === numLon - 1) {
                lon = maxLon; // explicitly set the last lon to the max longitude to ensure alignment
            }

            result[resultIndex++] = eqr * lon - refCenter[0] + offsetX;
            result[resultIndex++] = y;
            result[resultIndex++] = elevations[elevIndex++] - refCenter[2];
        }
    }

    return result;
};

// Documented in base class.
ProjectionMercator.prototype.cartesianToGeographic = function (globe, x, y, z, offset, result) {
    if (!globe) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ProjectionMercator",
            "cartesianToGeographic", "missingGlobe"));
    }

    if (!result) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ProjectionMercator",
            "cartesianToGeographic", "missingResult"));
    }

    // See "Map Projections: A Working Manual", pages 45 and 19 for the source of the below formulas.

    var ecc2 = globe.eccentricitySquared,
        ecc4 = ecc2 * ecc2,
        ecc6 = ecc4 * ecc2,
        ecc8 = ecc6 * ecc2,
        t = Math.pow(Math.E, - y / globe.equatorialRadius),
        A = Math.PI / 2 - 2 * Math.atan(t),
        B = ecc2 / 2 + 5 * ecc4 / 24 + ecc6 / 12 + 13 * ecc8 / 360,
        C = 7 * ecc4 / 48 + 29 * ecc6 / 240 + 811 * ecc8 / 11520,
        D = 7 * ecc6 / 120 + 81 * ecc8 / 1120,
        E = 4279 * ecc8 / 161280,
        Ap = A - C + E,
        Bp = B - 3 * D,
        Cp = 2 * C - 8 * E,
        Dp = 4 * D,
        Ep = 8 * E,
        s2p = Math.sin(2 * A),
        lat = Ap + s2p * (Bp + s2p * (Cp + s2p * (Dp + Ep * s2p)));

    result.latitude = lat * Angle.RADIANS_TO_DEGREES;
    result.longitude = (x - (offset ? offset[0] : 0)) / globe.equatorialRadius * Angle.RADIANS_TO_DEGREES;
    result.altitude = z;

    return result;
};

export default ProjectionMercator;
