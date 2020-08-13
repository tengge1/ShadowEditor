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
 * @exports Location
 */
import Angle from '../geom/Angle';
import ArgumentError from '../error/ArgumentError';
import Logger from '../util/Logger';
import Plane from '../geom/Plane';
import Vec3 from '../geom/Vec3';
import WWMath from '../util/WWMath';


/**
 * Constructs a location from a specified latitude and longitude in degrees.
 * @alias Location
 * @constructor
 * @classdesc Represents a latitude, longitude pair in degrees.
 * @param {Number} latitude The latitude in degrees.
 * @param {Number} longitude The longitude in degrees.
 */
function Location(latitude, longitude) {
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
}

/**
 * A location with latitude and longitude both 0.
 * @constant
 * @type {Location}
 */
Location.ZERO = new Location(0, 0);

/**
 * Creates a location from angles specified in radians.
 * @param {Number} latitudeRadians The latitude in radians.
 * @param {Number} longitudeRadians The longitude in radians.
 * @returns {Location} The new location with latitude and longitude in degrees.
 */
Location.fromRadians = function (latitudeRadians, longitudeRadians) {
    return new Location(latitudeRadians * Angle.RADIANS_TO_DEGREES, longitudeRadians * Angle.RADIANS_TO_DEGREES);
};

/**
 * Copies this location to the latitude and longitude of a specified location.
 * @param {Location} location The location to copy.
 * @returns {Location} This location, set to the values of the specified location.
 * @throws {ArgumentError} If the specified location is null or undefined.
 */
Location.prototype.copy = function (location) {
    if (!location) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Location", "copy", "missingLocation"));
    }

    this.latitude = location.latitude;
    this.longitude = location.longitude;

    return this;
};

/**
 * Sets this location to the latitude and longitude.
 * @param {Number} latitude The latitude to set.
 * @param {Number} longitude The longitude to set.
 * @returns {Location} This location, set to the values of the specified latitude and longitude.
 */
Location.prototype.set = function (latitude, longitude) {
    this.latitude = latitude;
    this.longitude = longitude;

    return this;
};

/**
 * Indicates whether this location is equal to a specified location.
 * @param {Location} location The location to compare this one to.
 * @returns {Boolean} <code>true</code> if this location is equal to the specified location, otherwise
 * <code>false</code>.
 */
Location.prototype.equals = function (location) {
    return location
        && location.latitude === this.latitude && location.longitude === this.longitude;
};

/**
 * Compute a location along a path at a specified distance between two specified locations.
 * @param {String} pathType The type of path to assume. Recognized values are
 * [WorldWind.GREAT_CIRCLE]{@link WorldWind#GREAT_CIRCLE},
 * [WorldWind.RHUMB_LINE]{@link WorldWind#RHUMB_LINE} and
 * [WorldWind.LINEAR]{@link WorldWind#LINEAR}.
 * If the path type is not recognized then WorldWind.LINEAR is used.
 * @param {Number} amount The fraction of the path between the two locations at which to compute the new
 * location. This number should be between 0 and 1. If not, it is clamped to the nearest of those values.
 * @param {Location} location1 The starting location.
 * @param {Location} location2 The ending location.
 * @param {Location} result A Location in which to return the result.
 * @returns {Location} The specified result location.
 * @throws {ArgumentError} If either specified location or the result argument is null or undefined.
 */
Location.interpolateAlongPath = function (pathType, amount, location1, location2, result) {
    if (!location1 || !location2) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Location", "interpolateAlongPath", "missingLocation"));
    }

    if (!result) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Location", "interpolateAlongPath", "missingResult"));
    }

    if (pathType === WorldWind.GREAT_CIRCLE) {
        return this.interpolateGreatCircle(amount, location1, location2, result);
    } else if (pathType && pathType === WorldWind.RHUMB_LINE) {
        return this.interpolateRhumb(amount, location1, location2, result);
    } else {
        return this.interpolateLinear(amount, location1, location2, result);
    }
};

/**
 * Compute a location along a great circle path at a specified distance between two specified locations.
 * @param {Number} amount The fraction of the path between the two locations at which to compute the new
 * location. This number should be between 0 and 1. If not, it is clamped to the nearest of those values.
 * This function uses a spherical model, not elliptical.
 * @param {Location} location1 The starting location.
 * @param {Location} location2 The ending location.
 * @param {Location} result A Location in which to return the result.
 * @returns {Location} The specified result location.
 * @throws {ArgumentError} If either specified location or the result argument is null or undefined.
 */
Location.interpolateGreatCircle = function (amount, location1, location2, result) {
    if (!location1 || !location2) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Location", "interpolateGreatCircle", "missingLocation"));
    }
    if (!result) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Location", "interpolateGreatCircle", "missingResult"));
    }

    if (location1.equals(location2)) {
        result.latitude = location1.latitude;
        result.longitude = location1.longitude;
        return result;
    }

    var t = WWMath.clamp(amount, 0, 1),
        azimuthDegrees = this.greatCircleAzimuth(location1, location2),
        distanceRadians = this.greatCircleDistance(location1, location2);

    return this.greatCircleLocation(location1, azimuthDegrees, t * distanceRadians, result);
};

/**
 * Computes the azimuth angle (clockwise from North) that points from the first location to the second location.
 * This angle can be used as the starting azimuth for a great circle arc that begins at the first location, and
 * passes through the second location.
 * This function uses a spherical model, not elliptical.
 * @param {Location} location1 The starting location.
 * @param {Location} location2 The ending location.
 * @returns {Number} The computed azimuth, in degrees.
 * @throws {ArgumentError} If either specified location is null or undefined.
 */
Location.greatCircleAzimuth = function (location1, location2) {
    if (!location1 || !location2) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Location", "greatCircleAzimuth", "missingLocation"));
    }

    var lat1 = location1.latitude * Angle.DEGREES_TO_RADIANS,
        lat2 = location2.latitude * Angle.DEGREES_TO_RADIANS,
        lon1 = location1.longitude * Angle.DEGREES_TO_RADIANS,
        lon2 = location2.longitude * Angle.DEGREES_TO_RADIANS,
        x,
        y,
        azimuthRadians;

    if (lat1 == lat2 && lon1 == lon2) {
        return 0;
    }

    if (lon1 == lon2) {
        return lat1 > lat2 ? 180 : 0;
    }

    // Taken from "Map Projections - A Working Manual", page 30, equation 5-4b.
    // The atan2() function is used in place of the traditional atan(y/x) to simplify the case when x == 0.
    y = Math.cos(lat2) * Math.sin(lon2 - lon1);
    x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
    azimuthRadians = Math.atan2(y, x);

    return isNaN(azimuthRadians) ? 0 : azimuthRadians * Angle.RADIANS_TO_DEGREES;
};

/**
 * Computes the great circle angular distance between two locations. The return value gives the distance as the
 * angle between the two positions. In radians, this angle is the arc length of the segment between the two
 * positions. To compute a distance in meters from this value, multiply the return value by the radius of the
 * globe.
 * This function uses a spherical model, not elliptical.
 *
 * @param {Location} location1 The starting location.
 * @param {Location} location2 The ending location.
 * @returns {Number} The computed distance, in radians.
 * @throws {ArgumentError} If either specified location is null or undefined.
 */
Location.greatCircleDistance = function (location1, location2) {
    if (!location1 || !location2) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Location", "greatCircleDistance", "missingLocation"));
    }

    var lat1Radians = location1.latitude * Angle.DEGREES_TO_RADIANS,
        lat2Radians = location2.latitude * Angle.DEGREES_TO_RADIANS,
        lon1Radians = location1.longitude * Angle.DEGREES_TO_RADIANS,
        lon2Radians = location2.longitude * Angle.DEGREES_TO_RADIANS,
        a,
        b,
        c,
        distanceRadians;

    if (lat1Radians == lat2Radians && lon1Radians == lon2Radians) {
        return 0;
    }

    // "Haversine formula," taken from https://en.wikipedia.org/wiki/Great-circle_distance#Formul.C3.A6
    a = Math.sin((lat2Radians - lat1Radians) / 2.0);
    b = Math.sin((lon2Radians - lon1Radians) / 2.0);
    c = a * a + Math.cos(lat1Radians) * Math.cos(lat2Radians) * b * b;
    distanceRadians = 2.0 * Math.asin(Math.sqrt(c));

    return isNaN(distanceRadians) ? 0 : distanceRadians;
};

/**
 * Computes the location on a great circle path corresponding to a given starting location, azimuth, and
 * arc distance.
 * This function uses a spherical model, not elliptical.
 *
 * @param {Location} location The starting location.
 * @param {Number} greatCircleAzimuthDegrees The azimuth in degrees.
 * @param {Number} pathLengthRadians The radian distance along the path at which to compute the end location.
 * @param {Location} result A Location in which to return the result.
 * @returns {Location} The specified result location.
 * @throws {ArgumentError} If the specified location or the result argument is null or undefined.
 */
Location.greatCircleLocation = function (location, greatCircleAzimuthDegrees, pathLengthRadians, result) {
    if (!location) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Location", "greatCircleLocation", "missingLocation"));
    }
    if (!result) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Location", "greatCircleLocation", "missingResult"));
    }

    if (pathLengthRadians == 0) {
        result.latitude = location.latitude;
        result.longitude = location.longitude;
        return result;
    }

    var latRadians = location.latitude * Angle.DEGREES_TO_RADIANS,
        lonRadians = location.longitude * Angle.DEGREES_TO_RADIANS,
        azimuthRadians = greatCircleAzimuthDegrees * Angle.DEGREES_TO_RADIANS,
        endLatRadians,
        endLonRadians;

    // Taken from "Map Projections - A Working Manual", page 31, equation 5-5 and 5-6.
    endLatRadians = Math.asin(Math.sin(latRadians) * Math.cos(pathLengthRadians) +
        Math.cos(latRadians) * Math.sin(pathLengthRadians) * Math.cos(azimuthRadians));
    endLonRadians = lonRadians + Math.atan2(
        Math.sin(pathLengthRadians) * Math.sin(azimuthRadians),
        Math.cos(latRadians) * Math.cos(pathLengthRadians) -
        Math.sin(latRadians) * Math.sin(pathLengthRadians) * Math.cos(azimuthRadians));

    if (isNaN(endLatRadians) || isNaN(endLonRadians)) {
        result.latitude = location.latitude;
        result.longitude = location.longitude;
    } else {
        result.latitude = Angle.normalizedDegreesLatitude(endLatRadians * Angle.RADIANS_TO_DEGREES);
        result.longitude = Angle.normalizedDegreesLongitude(endLonRadians * Angle.RADIANS_TO_DEGREES);
    }

    return result;
};

/**
 * Compute a location along a rhumb path at a specified distance between two specified locations.
 * This function uses a spherical model, not elliptical.
 * @param {Number} amount The fraction of the path between the two locations at which to compute the new
 * location. This number should be between 0 and 1. If not, it is clamped to the nearest of those values.
 * @param {Location} location1 The starting location.
 * @param {Location} location2 The ending location.
 * @param {Location} result A Location in which to return the result.
 * @returns {Location} The specified result location.
 * @throws {ArgumentError} If either specified location or the result argument is null or undefined.
 */
Location.interpolateRhumb = function (amount, location1, location2, result) {
    if (!location1 || !location2) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Location", "interpolateRhumb", "missingLocation"));
    }
    if (!result) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Location", "interpolateRhumb", "missingResult"));
    }

    if (location1.equals(location2)) {
        result.latitude = location1.latitude;
        result.longitude = location1.longitude;
        return result;
    }

    var t = WWMath.clamp(amount, 0, 1),
        azimuthDegrees = this.rhumbAzimuth(location1, location2),
        distanceRadians = this.rhumbDistance(location1, location2);

    return this.rhumbLocation(location1, azimuthDegrees, t * distanceRadians, result);
};

/**
 * Computes the azimuth angle (clockwise from North) that points from the first location to the second location.
 * This angle can be used as the azimuth for a rhumb arc that begins at the first location, and
 * passes through the second location.
 * This function uses a spherical model, not elliptical.
 * @param {Location} location1 The starting location.
 * @param {Location} location2 The ending location.
 * @returns {Number} The computed azimuth, in degrees.
 * @throws {ArgumentError} If either specified location is null or undefined.
 */
Location.rhumbAzimuth = function (location1, location2) {
    if (!location1 || !location2) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Location", "rhumbAzimuth", "missingLocation"));
    }

    var lat1 = location1.latitude * Angle.DEGREES_TO_RADIANS,
        lat2 = location2.latitude * Angle.DEGREES_TO_RADIANS,
        lon1 = location1.longitude * Angle.DEGREES_TO_RADIANS,
        lon2 = location2.longitude * Angle.DEGREES_TO_RADIANS,
        dLon,
        dPhi,
        azimuthRadians;

    if (lat1 == lat2 && lon1 == lon2) {
        return 0;
    }

    dLon = lon2 - lon1;
    dPhi = Math.log(Math.tan(lat2 / 2.0 + Math.PI / 4) / Math.tan(lat1 / 2.0 + Math.PI / 4));

    // If lonChange over 180 take shorter rhumb across 180 meridian.
    if (WWMath.fabs(dLon) > Math.PI) {
        dLon = dLon > 0 ? -(2 * Math.PI - dLon) : 2 * Math.PI + dLon;
    }

    azimuthRadians = Math.atan2(dLon, dPhi);

    return isNaN(azimuthRadians) ? 0 : azimuthRadians * Angle.RADIANS_TO_DEGREES;
};

/**
 * Computes the rhumb angular distance between two locations. The return value gives the distance as the
 * angle between the two positions in radians. This angle is the arc length of the segment between the two
 * positions. To compute a distance in meters from this value, multiply the return value by the radius of the
 * globe.
 * This function uses a spherical model, not elliptical.
 *
 * @param {Location} location1 The starting location.
 * @param {Location} location2 The ending location.
 * @returns {Number} The computed distance, in radians.
 * @throws {ArgumentError} If either specified location is null or undefined.
 */
Location.rhumbDistance = function (location1, location2) {
    if (!location1 || !location2) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Location", "rhumbDistance", "missingLocation"));
    }

    var lat1 = location1.latitude * Angle.DEGREES_TO_RADIANS,
        lat2 = location2.latitude * Angle.DEGREES_TO_RADIANS,
        lon1 = location1.longitude * Angle.DEGREES_TO_RADIANS,
        lon2 = location2.longitude * Angle.DEGREES_TO_RADIANS,
        dLat,
        dLon,
        dPhi,
        q,
        distanceRadians;

    if (lat1 == lat2 && lon1 == lon2) {
        return 0;
    }

    dLat = lat2 - lat1;
    dLon = lon2 - lon1;
    dPhi = Math.log(Math.tan(lat2 / 2.0 + Math.PI / 4) / Math.tan(lat1 / 2.0 + Math.PI / 4));
    q = dLat / dPhi;

    if (isNaN(dPhi) || isNaN(q)) {
        q = Math.cos(lat1);
    }

    // If lonChange over 180 take shorter rhumb across 180 meridian.
    if (WWMath.fabs(dLon) > Math.PI) {
        dLon = dLon > 0 ? -(2 * Math.PI - dLon) : 2 * Math.PI + dLon;
    }

    distanceRadians = Math.sqrt(dLat * dLat + q * q * dLon * dLon);

    return isNaN(distanceRadians) ? 0 : distanceRadians;
};

/**
 * Computes the location on a rhumb arc with the given starting location, azimuth, and arc distance.
 * This function uses a spherical model, not elliptical.
 *
 * @param {Location} location The starting location.
 * @param {Number} azimuthDegrees The azimuth in degrees.
 * @param {Number} pathLengthRadians The radian distance along the path at which to compute the location.
 * @param {Location} result A Location in which to return the result.
 * @returns {Location} The specified result location.
 * @throws {ArgumentError} If the specified location or the result argument is null or undefined.
 */
Location.rhumbLocation = function (location, azimuthDegrees, pathLengthRadians, result) {
    if (!location) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Location", "rhumbLocation", "missingLocation"));
    }
    if (!result) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Location", "rhumbLocation", "missingResult"));
    }

    if (pathLengthRadians == 0) {
        result.latitude = location.latitude;
        result.longitude = location.longitude;
        return result;
    }

    var latRadians = location.latitude * Angle.DEGREES_TO_RADIANS,
        lonRadians = location.longitude * Angle.DEGREES_TO_RADIANS,
        azimuthRadians = azimuthDegrees * Angle.DEGREES_TO_RADIANS,
        endLatRadians = latRadians + pathLengthRadians * Math.cos(azimuthRadians),
        dPhi = Math.log(Math.tan(endLatRadians / 2 + Math.PI / 4) / Math.tan(latRadians / 2 + Math.PI / 4)),
        q = (endLatRadians - latRadians) / dPhi,
        dLon,
        endLonRadians;

    if (isNaN(dPhi) || isNaN(q) || !isFinite(q)) {
        q = Math.cos(latRadians);
    }

    dLon = pathLengthRadians * Math.sin(azimuthRadians) / q;

    // Handle latitude passing over either pole.
    if (WWMath.fabs(endLatRadians) > Math.PI / 2) {
        endLatRadians = endLatRadians > 0 ? Math.PI - endLatRadians : -Math.PI - endLatRadians;
    }

    endLonRadians = WWMath.fmod(lonRadians + dLon + Math.PI, 2 * Math.PI) - Math.PI;

    if (isNaN(endLatRadians) || isNaN(endLonRadians)) {
        result.latitude = location.latitude;
        result.longitude = location.longitude;
    } else {
        result.latitude = Angle.normalizedDegreesLatitude(endLatRadians * Angle.RADIANS_TO_DEGREES);
        result.longitude = Angle.normalizedDegreesLongitude(endLonRadians * Angle.RADIANS_TO_DEGREES);
    }

    return result;
};

/**
 * Compute a location along a linear path at a specified distance between two specified locations.
 * @param {Number} amount The fraction of the path between the two locations at which to compute the new
 * location. This number should be between 0 and 1. If not, it is clamped to the nearest of those values.
 * @param {Location} location1 The starting location.
 * @param {Location} location2 The ending location.
 * @param {Location} result A Location in which to return the result.
 * @returns {Location} The specified result location.
 * @throws {ArgumentError} If either specified location or the result argument is null or undefined.
 */
Location.interpolateLinear = function (amount, location1, location2, result) {
    if (!location1 || !location2) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Location", "interpolateLinear", "missingLocation"));
    }
    if (!result) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Location", "interpolateLinear", "missingResult"));
    }

    if (location1.equals(location2)) {
        result.latitude = location1.latitude;
        result.longitude = location1.longitude;
        return result;
    }

    var t = WWMath.clamp(amount, 0, 1),
        azimuthDegrees = this.linearAzimuth(location1, location2),
        distanceRadians = this.linearDistance(location1, location2);

    return this.linearLocation(location1, azimuthDegrees, t * distanceRadians, result);
};

/**
 * Computes the azimuth angle (clockwise from North) that points from the first location to the second location.
 * This angle can be used as the azimuth for a linear arc that begins at the first location, and
 * passes through the second location.
 * @param {Location} location1 The starting location.
 * @param {Location} location2 The ending location.
 * @returns {Number} The computed azimuth, in degrees.
 * @throws {ArgumentError} If either specified location is null or undefined.
 */
Location.linearAzimuth = function (location1, location2) {
    if (!location1 || !location2) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Location", "linearAzimuth", "missingLocation"));
    }

    var lat1 = location1.latitude * Angle.DEGREES_TO_RADIANS,
        lat2 = location2.latitude * Angle.DEGREES_TO_RADIANS,
        lon1 = location1.longitude * Angle.DEGREES_TO_RADIANS,
        lon2 = location2.longitude * Angle.DEGREES_TO_RADIANS,
        dLon,
        dPhi,
        azimuthRadians;

    if (lat1 == lat2 && lon1 == lon2) {
        return 0;
    }

    dLon = lon2 - lon1;
    dPhi = lat2 - lat1;

    // If longitude change is over 180 take shorter path across 180 meridian.
    if (WWMath.fabs(dLon) > Math.PI) {
        dLon = dLon > 0 ? -(2 * Math.PI - dLon) : 2 * Math.PI + dLon;
    }

    azimuthRadians = Math.atan2(dLon, dPhi);

    return isNaN(azimuthRadians) ? 0 : azimuthRadians * Angle.RADIANS_TO_DEGREES;
};

/**
 * Computes the linear angular distance between two locations. The return value gives the distance as the
 * angle between the two positions in radians. This angle is the arc length of the segment between the two
 * positions. To compute a distance in meters from this value, multiply the return value by the radius of the
 * globe.
 *
 * @param {Location} location1 The starting location.
 * @param {Location} location2 The ending location.
 * @returns {Number} The computed distance, in radians.
 * @throws {ArgumentError} If either specified location is null or undefined.
 */
Location.linearDistance = function (location1, location2) {
    if (!location1 || !location2) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Location", "linearDistance", "missingLocation"));
    }

    var lat1 = location1.latitude * Angle.DEGREES_TO_RADIANS,
        lat2 = location2.latitude * Angle.DEGREES_TO_RADIANS,
        lon1 = location1.longitude * Angle.DEGREES_TO_RADIANS,
        lon2 = location2.longitude * Angle.DEGREES_TO_RADIANS,
        dLat,
        dLon,
        distanceRadians;

    if (lat1 == lat2 && lon1 == lon2) {
        return 0;
    }

    dLat = lat2 - lat1;
    dLon = lon2 - lon1;

    // If lonChange over 180 take shorter path across 180 meridian.
    if (WWMath.fabs(dLon) > Math.PI) {
        dLon = dLon > 0 ? -(2 * Math.PI - dLon) : 2 * Math.PI + dLon;
    }

    distanceRadians = Math.sqrt(dLat * dLat + dLon * dLon);

    return isNaN(distanceRadians) ? 0 : distanceRadians;
};

/**
 * Computes the location on a linear path with the given starting location, azimuth, and arc distance.
 *
 * @param {Location} location The starting location.
 * @param {Number} azimuthDegrees The azimuth in degrees.
 * @param {Number} pathLengthRadians The radian distance along the path at which to compute the location.
 * @param {Location} result A Location in which to return the result.
 * @returns {Location} The specified result location.
 * @throws {ArgumentError} If the specified location or the result argument is null or undefined.
 */
Location.linearLocation = function (location, azimuthDegrees, pathLengthRadians, result) {
    if (!location) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Location", "linearLocation", "missingLocation"));
    }
    if (!result) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Location", "linearLocation", "missingResult"));
    }

    if (pathLengthRadians == 0) {
        result.latitude = location.latitude;
        result.longitude = location.longitude;
        return result;
    }

    var latRadians = location.latitude * Angle.DEGREES_TO_RADIANS,
        lonRadians = location.longitude * Angle.DEGREES_TO_RADIANS,
        azimuthRadians = azimuthDegrees * Angle.DEGREES_TO_RADIANS,
        endLatRadians = latRadians + pathLengthRadians * Math.cos(azimuthRadians),
        endLonRadians;

    // Handle latitude passing over either pole.
    if (WWMath.fabs(endLatRadians) > Math.PI / 2) {
        endLatRadians = endLatRadians > 0 ? Math.PI - endLatRadians : -Math.PI - endLatRadians;
    }

    endLonRadians =
        WWMath.fmod(lonRadians + pathLengthRadians * Math.sin(azimuthRadians) + Math.PI, 2 * Math.PI) - Math.PI;

    if (isNaN(endLatRadians) || isNaN(endLonRadians)) {
        result.latitude = location.latitude;
        result.longitude = location.longitude;
    } else {
        result.latitude = Angle.normalizedDegreesLatitude(endLatRadians * Angle.RADIANS_TO_DEGREES);
        result.longitude = Angle.normalizedDegreesLongitude(endLonRadians * Angle.RADIANS_TO_DEGREES);
    }

    return result;
};

/**
 * Determine whether a list of locations crosses the dateline.
 * @param {Location[]} locations The locations to test.
 * @returns {boolean} True if the dateline is crossed, else false.
 * @throws {ArgumentError} If the locations list is null.
 */
Location.locationsCrossDateLine = function (locations) {
    if (!locations) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Location", "locationsCrossDateline", "missingLocation"));
    }

    var pos = null;
    for (var idx = 0, len = locations.length; idx < len; idx += 1) {
        var posNext = locations[idx];

        if (pos != null) {
            // A segment cross the line if end pos have different longitude signs
            // and are more than 180 degrees longitude apart
            if (WWMath.signum(pos.longitude) != WWMath.signum(posNext.longitude)) {
                var delta = Math.abs(pos.longitude - posNext.longitude);
                if (delta > 180 && delta < 360)
                    return true;
            }
        }
        pos = posNext;
    }

    return false;
};

/**
 * Returns two locations with the most extreme latitudes on the sequence of great circle arcs defined by each pair
 * of locations in the specified iterable.
 *
 * @param {Location[]} locations The pairs of locations defining a sequence of great circle arcs.
 *
 * @return {Location[]} Two locations with the most extreme latitudes on the great circle arcs.
 *
 * @throws IllegalArgumentException if locations is null.
 */
Location.greatCircleArcExtremeLocations = function (locations) {
    if (!locations) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Location", "greatCircleArcExtremeLocations", "missingLocation"));
    }

    var minLatLocation = null;
    var maxLatLocation = null;

    var lastLocation = null;

    for (var idx = 0, len = locations.length; idx < len; idx += 1) {
        var location = locations[idx];

        if (lastLocation != null) {
            var extremes = Location.greatCircleArcExtremeForTwoLocations(lastLocation, location);
            if (extremes == null) {
                continue;
            }

            if (minLatLocation == null || minLatLocation.latitude > extremes[0].latitude) {
                minLatLocation = extremes[0];
            }
            if (maxLatLocation == null || maxLatLocation.latitude < extremes[1].latitude) {
                maxLatLocation = extremes[1];
            }
        }

        lastLocation = location;
    }

    return [minLatLocation, maxLatLocation];
};

/**
 * Returns two locations with the most extreme latitudes on the great circle arc defined by, and limited to, the two
 * locations.
 *
 * @param {Location} begin Beginning location on the great circle arc.
 * @param {Location} end   Ending location on the great circle arc.
 *
 * @return {Location[]} Two locations with the most extreme latitudes on the great circle arc.
 *
 * @throws {ArgumentError} If either begin or end are null.
 */
Location.greatCircleArcExtremeForTwoLocations = function (begin, end) {
    if (!begin || !end) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Location", "greatCircleArcExtremeForTwoLocations", "missingLocation"));
    }

    var idx, len, location; // Iteration variables.
    var minLatLocation = null;
    var maxLatLocation = null;
    var minLat = 90;
    var maxLat = -90;

    // Compute the min and max latitude and associated locations from the arc endpoints.
    var locations = [begin, end];
    for (idx = 0, len = locations.length; idx < len; idx += 1) {
        location = locations[idx];

        if (minLat >= location.latitude) {
            minLat = location.latitude;
            minLatLocation = location;
        }
        if (maxLat <= location.latitude) {
            maxLat = location.latitude;
            maxLatLocation = location;
        }
    }
    // The above could be written for greater clarity, simplicity, and speed:
    // minLat = Math.min(begin.latitude, end.latitude);
    // maxLat = Math.max(begin.latitude, end.latitude);
    // minLatLocation = minLat == begin.latitude ? begin : end;
    // maxLatLocation = maxLat == begin.latitude ? begin : end;

    // Compute parameters for the great circle arc defined by begin and end. Then compute the locations of extreme
    // latitude on entire the great circle which that arc is part of.
    var greatArcAzimuth = Location.greatCircleAzimuth(begin, end);
    var greatArcDistance = Location.greatCircleDistance(begin, end);
    var greatCircleExtremes = Location.greatCircleExtremeLocationsUsingAzimuth(begin, greatArcAzimuth);

    // Determine whether either of the extreme locations are inside the arc defined by begin and end. If so,
    // adjust the min and max latitude accordingly.
    for (idx = 0, len = greatCircleExtremes.length; idx < len; idx += 1) {
        location = greatCircleExtremes[idx];

        var az = Location.greatCircleAzimuth(begin, location);
        var d = Location.greatCircleDistance(begin, location);

        // The extreme location must be between the begin and end locations. Therefore its azimuth relative to
        // the begin location should have the same signum, and its distance relative to the begin location should
        // be between 0 and greatArcDistance, inclusive.
        if (WWMath.signum(az) == WWMath.signum(greatArcAzimuth)) {
            if (d >= 0 && d <= greatArcDistance) {
                if (minLat >= location.latitude) {
                    minLat = location.latitude;
                    minLatLocation = location;
                }
                if (maxLat <= location.latitude) {
                    maxLat = location.latitude;
                    maxLatLocation = location;
                }
            }
        }
    }

    return [minLatLocation, maxLatLocation];
};

/**
 * Returns two locations with the most extreme latitudes on the great circle with the given starting location and
 * azimuth.
 *
 * @param {Location} location Location on the great circle.
 * @param {number} azimuth  Great circle azimuth angle (clockwise from North).
 *
 * @return {Location[]} Two locations where the great circle has its extreme latitudes.
 *
 * @throws {ArgumentError} If location is null.
 */
Location.greatCircleExtremeLocationsUsingAzimuth = function (location, azimuth) {
    if (!location) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Location", "greatCircleArcExtremeLocationsUsingAzimuth", "missingLocation"));
    }

    var lat0 = location.latitude;
    var az = azimuth * Angle.DEGREES_TO_RADIANS;

    // Derived by solving the function for longitude on a great circle against the desired longitude. We start
    // with the equation in "Map Projections - A Working Manual", page 31, equation 5-5:
    //
    //     lat = asin( sin(lat0) * cos(C) + cos(lat0) * sin(C) * cos(Az) )
    //
    // Where (lat0, lon) are the starting coordinates, c is the angular distance along the great circle from the
    // starting coordinate, and Az is the azimuth. All values are in radians. Solving for angular distance gives
    // distance to the equator:
    //
    //     tan(C) = -tan(lat0) / cos(Az)
    //
    // The great circle is by definition centered about the Globe's origin. Therefore intersections with the
    // equator will be antipodal (exactly 180 degrees opposite each other), as will be the extreme latitudes.
    // By observing the symmetry of a great circle, it is also apparent that the extreme latitudes will be 90
    // degrees from either intersection with the equator.
    //
    // d1 = c + 90
    // d2 = c - 90

    var tanDistance = -Math.tan(lat0) / Math.cos(az);
    var distance = Math.atan(tanDistance);

    var extremeDistance1 = distance + Math.PI / 2.0;
    var extremeDistance2 = distance - Math.PI / 2.0;

    return [
        Location.greatCircleLocation(location, azimuth, extremeDistance1, new Location(0, 0)),
        Location.greatCircleLocation(location, azimuth, extremeDistance2, new Location(0, 0))
    ];
};

/**
 * Determine where a line between two positions crosses a given meridian. The intersection test is performed by
 * intersecting a line in Cartesian space between the two positions with a plane through the meridian. Thus, it is
 * most suitable for working with positions that are fairly close together as the calculation does not take into
 * account great circle or rhumb paths.
 *
 * @param {Location} p1         First position.
 * @param {Location} p2         Second position.
 * @param {number} meridian     Longitude line to intersect with.
 * @param {Globe} globe         Globe used to compute intersection.
 *
 * @return {number} latitude The intersection latitude along the meridian
 *
 * TODO: this code allocates 4 new Vec3 and 1 new Position; use scratch variables???
 * TODO: Why not? Every location created would then allocated those variables as well, even if they aren't needed :(.
 */
Location.intersectionWithMeridian = function (p1, p2, meridian, globe) {
    // TODO: add support for 2D
    //if (globe instanceof Globe2D)
    //{
    //    // y = mx + b case after normalizing negative angles.
    //    double lon1 = p1.getLongitude().degrees < 0 ? p1.getLongitude().degrees + 360 : p1.getLongitude().degrees;
    //    double lon2 = p2.getLongitude().degrees < 0 ? p2.getLongitude().degrees + 360 : p2.getLongitude().degrees;
    //    if (lon1 == lon2)
    //        return null;
    //
    //    double med = meridian.degrees < 0 ? meridian.degrees + 360 : meridian.degrees;
    //    double slope = (p2.latitude.degrees - p1.latitude.degrees) / (lon2 - lon1);
    //    double lat = p1.latitude.degrees + slope * (med - lon1);
    //
    //    return LatLon.fromDegrees(lat, meridian.degrees);
    //}

    var pt1 = globe.computePointFromLocation(p1.latitude, p1.longitude, new Vec3(0, 0, 0));
    var pt2 = globe.computePointFromLocation(p2.latitude, p2.longitude, new Vec3(0, 0, 0));

    // Compute a plane through the origin, North Pole, and the desired meridian.
    var northPole = globe.computePointFromLocation(90, meridian, new Vec3(0, 0, 0));
    var pointOnEquator = globe.computePointFromLocation(0, meridian, new Vec3(0, 0, 0));

    var plane = Plane.fromPoints(northPole, pointOnEquator, Vec3.ZERO);

    var intersectionPoint = new Vec3(0, 0, 0);
    if (!plane.intersectsSegmentAt(pt1, pt2, intersectionPoint)) {
        return null;
    }

    // TODO: unable to simply create a new Position(0, 0, 0)
    var pos = new WorldWind.Position(0, 0, 0);
    globe.computePositionFromPoint(intersectionPoint[0], intersectionPoint[1], intersectionPoint[2], pos);

    return pos.latitude;
};

/**
 * Determine where a line between two positions crosses a given meridian. The intersection test is performed by
 * intersecting a line in Cartesian space. Thus, it is most suitable for working with positions that are fairly
 * close together as the calculation does not take into account great circle or rhumb paths.
 *
 * @param {Location | Position} p1 First position.
 * @param {Location | Position} p2 Second position.
 * @param {number} meridian Longitude line to intersect with.
 *
 * @return {number | null} latitude The intersection latitude along the meridian
 * or null if the line is collinear with the meridian
 */
Location.meridianIntersection = function (p1, p2, meridian) {
    // y = mx + b case after normalizing negative angles.
    var lon1 = p1.longitude < 0 ? p1.longitude + 360 : p1.longitude;
    var lon2 = p2.longitude < 0 ? p2.longitude + 360 : p2.longitude;
    if (lon1 === lon2) {
        //infinite solutions, the line is collinear with the anti-meridian
        return null;
    }

    var med = meridian < 0 ? meridian + 360 : meridian;
    var slope = (p2.latitude - p1.latitude) / (lon2 - lon1);
    var lat = p1.latitude + slope * (med - lon1);

    return lat;
};

/**
 * A bit mask indicating which if any pole is being referenced.
 * This corresponds to Java WW's AVKey.NORTH and AVKey.SOUTH,
 * although this encoding can capture both poles simultaneously, which was
 * a 'to do' item in the Java implementation.
 * @type {{NONE: number, NORTH: number, SOUTH: number}}
 */
Location.poles = {
    'NONE': 0,
    'NORTH': 1,
    'SOUTH': 2
};

export default Location;
