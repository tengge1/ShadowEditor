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
 * @exports ProjectionWgs84
 */
import Angle from '../geom/Angle';
import ArgumentError from '../error/ArgumentError';
import GeographicProjection from '../projections/GeographicProjection';
import Logger from '../util/Logger';
import Position from '../geom/Position';
import Vec3 from '../geom/Vec3';
import WWMath from '../util/WWMath';


/**
 * Constructs a WGS84 ellipsoid
 * @alias ProjectionWgs84
 * @constructor
 * @augments GeographicProjection
 * @classdesc Represents a WGS84 ellipsoid.
 */
function ProjectionWgs84() {

    GeographicProjection.call(this, "WGS84", false, null);

    this.is2D = false;

    this.scratchPosition = new Position(0, 0, 0);
}

ProjectionWgs84.prototype = Object.create(GeographicProjection.prototype);

Object.defineProperties(ProjectionWgs84.prototype, {
    /**
     * A string identifying this projection's current state. Used to compare states during rendering to
     * determine whether globe-state dependent cached values must be updated. Applications typically do not
     * interact with this property.
     * @memberof ProjectionEquirectangular.prototype
     * @readonly
     * @type {String}
     */
    stateKey: {
        get: function () {
            return "projection wgs84 ";
        }
    }
});

// Documented in base class.
ProjectionWgs84.prototype.geographicToCartesian = function (globe, latitude, longitude, altitude, offset,
    result) {
    if (!globe) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ProjectionWgs84",
            "geographicToCartesian", "missingGlobe"));
    }

    var cosLat = Math.cos(latitude * Angle.DEGREES_TO_RADIANS),
        sinLat = Math.sin(latitude * Angle.DEGREES_TO_RADIANS),
        cosLon = Math.cos(longitude * Angle.DEGREES_TO_RADIANS),
        sinLon = Math.sin(longitude * Angle.DEGREES_TO_RADIANS),
        rpm = globe.equatorialRadius / Math.sqrt(1.0 - globe.eccentricitySquared * sinLat * sinLat);

    result[0] = (rpm + altitude) * cosLat * sinLon;
    result[1] = (rpm * (1.0 - globe.eccentricitySquared) + altitude) * sinLat;
    result[2] = (rpm + altitude) * cosLat * cosLon;

    return result;
};

// Documented in base class.
ProjectionWgs84.prototype.geographicToCartesianGrid = function (globe, sector, numLat, numLon, elevations,
    referencePoint, offset, result) {
    if (!globe) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ProjectionWgs84",
            "geographicToCartesianGrid", "missingGlobe"));
    }

    var minLat = sector.minLatitude * Angle.DEGREES_TO_RADIANS,
        maxLat = sector.maxLatitude * Angle.DEGREES_TO_RADIANS,
        minLon = sector.minLongitude * Angle.DEGREES_TO_RADIANS,
        maxLon = sector.maxLongitude * Angle.DEGREES_TO_RADIANS,
        deltaLat = (maxLat - minLat) / (numLat > 1 ? numLat - 1 : 1),
        deltaLon = (maxLon - minLon) / (numLon > 1 ? numLon - 1 : 1),
        refCenter = referencePoint ? referencePoint : new Vec3(0, 0, 0),
        latIndex, lonIndex,
        elevIndex = 0, resultIndex = 0,
        lat, lon, rpm, elev,
        cosLat, sinLat,
        cosLon = new Float64Array(numLon), sinLon = new Float64Array(numLon);

    // Compute and save values that are a function of each unique longitude value in the specified sector. This
    // eliminates the need to re-compute these values for each column of constant longitude.
    for (lonIndex = 0, lon = minLon; lonIndex < numLon; lonIndex++, lon += deltaLon) {
        if (lonIndex === numLon - 1) {
            lon = maxLon; // explicitly set the last lon to the max longitude to ensure alignment
        }

        cosLon[lonIndex] = Math.cos(lon);
        sinLon[lonIndex] = Math.sin(lon);
    }

    // Iterate over the latitude and longitude coordinates in the specified sector, computing the Cartesian
    // point corresponding to each latitude and longitude.
    for (latIndex = 0, lat = minLat; latIndex < numLat; latIndex++, lat += deltaLat) {
        if (latIndex === numLat - 1) {
            lat = maxLat; // explicitly set the last lat to the max longitude to ensure alignment
        }

        // Latitude is constant for each row. Values that are a function of latitude can be computed once per row.
        cosLat = Math.cos(lat);
        sinLat = Math.sin(lat);
        rpm = globe.equatorialRadius / Math.sqrt(1.0 - globe.eccentricitySquared * sinLat * sinLat);

        for (lonIndex = 0; lonIndex < numLon; lonIndex++) {
            elev = elevations[elevIndex++];
            result[resultIndex++] = (rpm + elev) * cosLat * sinLon[lonIndex] - refCenter[0];
            result[resultIndex++] = (rpm * (1.0 - globe.eccentricitySquared) + elev) * sinLat - refCenter[1];
            result[resultIndex++] = (rpm + elev) * cosLat * cosLon[lonIndex] - refCenter[2];
        }
    }

    return result;
};

// Documented in base class.
ProjectionWgs84.prototype.cartesianToGeographic = function (globe, x, y, z, offset, result) {
    if (!globe) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ProjectionWgs84",
            "cartesianToGeographic", "missingGlobe"));
    }

    // According to H. Vermeille, "An analytical method to transform geocentric into geodetic coordinates"
    // http://www.springerlink.com/content/3t6837t27t351227/fulltext.pdf
    // Journal of Geodesy, accepted 10/2010, not yet published
    var X = z,
        Y = x,
        Z = y,
        XXpYY = X * X + Y * Y,
        sqrtXXpYY = Math.sqrt(XXpYY),
        a = globe.equatorialRadius,
        ra2 = 1 / (a * a),
        e2 = globe.eccentricitySquared,
        e4 = e2 * e2,
        p = XXpYY * ra2,
        q = Z * Z * (1 - e2) * ra2,
        r = (p + q - e4) / 6,
        h,
        phi,
        u,
        evoluteBorderTest = 8 * r * r * r + e4 * p * q,
        rad1,
        rad2,
        rad3,
        atan,
        v,
        w,
        k,
        D,
        sqrtDDpZZ,
        e,
        lambda,
        s2;

    if (evoluteBorderTest > 0 || q != 0) {
        if (evoluteBorderTest > 0) {
            // Step 2: general case
            rad1 = Math.sqrt(evoluteBorderTest);
            rad2 = Math.sqrt(e4 * p * q);

            // 10*e2 is my arbitrary decision of what Vermeille means by "near... the cusps of the evolute".
            if (evoluteBorderTest > 10 * e2) {
                rad3 = WWMath.cbrt((rad1 + rad2) * (rad1 + rad2));
                u = r + 0.5 * rad3 + 2 * r * r / rad3;
            }
            else {
                u = r + 0.5 * WWMath.cbrt((rad1 + rad2) * (rad1 + rad2))
                    + 0.5 * WWMath.cbrt((rad1 - rad2) * (rad1 - rad2));
            }
        }
        else {
            // Step 3: near evolute
            rad1 = Math.sqrt(-evoluteBorderTest);
            rad2 = Math.sqrt(-8 * r * r * r);
            rad3 = Math.sqrt(e4 * p * q);
            atan = 2 * Math.atan2(rad3, rad1 + rad2) / 3;

            u = -4 * r * Math.sin(atan) * Math.cos(Math.PI / 6 + atan);
        }

        v = Math.sqrt(u * u + e4 * q);
        w = e2 * (u + v - q) / (2 * v);
        k = (u + v) / (Math.sqrt(w * w + u + v) + w);
        D = k * sqrtXXpYY / (k + e2);
        sqrtDDpZZ = Math.sqrt(D * D + Z * Z);

        h = (k + e2 - 1) * sqrtDDpZZ / k;
        phi = 2 * Math.atan2(Z, sqrtDDpZZ + D);
    }
    else {
        // Step 4: singular disk
        rad1 = Math.sqrt(1 - e2);
        rad2 = Math.sqrt(e2 - p);
        e = Math.sqrt(e2);

        h = -a * rad1 * rad2 / e;
        phi = rad2 / (e * rad2 + rad1 * Math.sqrt(p));
    }

    // Compute lambda
    s2 = Math.sqrt(2);
    if ((s2 - 1) * Y < sqrtXXpYY + X) {
        // case 1 - -135deg < lambda < 135deg
        lambda = 2 * Math.atan2(Y, sqrtXXpYY + X);
    }
    else if (sqrtXXpYY + Y < (s2 + 1) * X) {
        // case 2 - -225deg < lambda < 45deg
        lambda = -Math.PI * 0.5 + 2 * Math.atan2(X, sqrtXXpYY - Y);
    }
    else {
        // if (sqrtXXpYY-Y<(s2=1)*X) {  // is the test, if needed, but it's not
        // case 3: - -45deg < lambda < 225deg
        lambda = Math.PI * 0.5 - 2 * Math.atan2(X, sqrtXXpYY + Y);
    }

    result.latitude = Angle.RADIANS_TO_DEGREES * phi;
    result.longitude = Angle.RADIANS_TO_DEGREES * lambda;
    result.altitude = h;

    return result;
};

ProjectionWgs84.prototype.northTangentAtLocation = function (globe, latitude, longitude, result) {
    // The north-pointing tangent is derived by rotating the vector (0, 1, 0) about the Y-axis by longitude degrees,
    // then rotating it about the X-axis by -latitude degrees. The latitude angle must be inverted because latitude
    // is a clockwise rotation about the X-axis, and standard rotation matrices assume counter-clockwise rotation.
    // The combined rotation can be represented by a combining two rotation matrices Rlat, and Rlon, then
    // transforming the vector (0, 1, 0) by the combined transform:
    //
    // NorthTangent = (Rlon * Rlat) * (0, 1, 0)
    //
    // This computation can be simplified and encoded inline by making two observations:
    // - The vector's X and Z coordinates are always 0, and its Y coordinate is always 1.
    // - Inverting the latitude rotation angle is equivalent to inverting sinLat. We know this by the
    //  trigonometric identities cos(-x) = cos(x), and sin(-x) = -sin(x).

    var cosLat = Math.cos(latitude * Angle.DEGREES_TO_RADIANS),
        cosLon = Math.cos(longitude * Angle.DEGREES_TO_RADIANS),
        sinLat = Math.sin(latitude * Angle.DEGREES_TO_RADIANS),
        sinLon = Math.sin(longitude * Angle.DEGREES_TO_RADIANS);

    result[0] = -sinLat * sinLon;
    result[1] = cosLat;
    result[2] = -sinLat * cosLon;

    return result.normalize();
};

ProjectionWgs84.prototype.northTangentAtPoint = function (globe, x, y, z, offset, result) {
    this.cartesianToGeographic(globe, x, y, z, Vec3.ZERO, this.scratchPosition);

    return this.northTangentAtLocation(globe, this.scratchPosition.latitude, this.scratchPosition.longitude, result);
};

ProjectionWgs84.prototype.surfaceNormalAtLocation = function (globe, latitude, longitude, result) {
    var cosLat = Math.cos(latitude * Angle.DEGREES_TO_RADIANS),
        cosLon = Math.cos(longitude * Angle.DEGREES_TO_RADIANS),
        sinLat = Math.sin(latitude * Angle.DEGREES_TO_RADIANS),
        sinLon = Math.sin(longitude * Angle.DEGREES_TO_RADIANS);

    result[0] = cosLat * sinLon;
    result[1] = sinLat;
    result[2] = cosLat * cosLon;

    return result.normalize();
};

ProjectionWgs84.prototype.surfaceNormalAtPoint = function (globe, x, y, z, result) {
    if (!globe) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ProjectionWgs84",
            "surfaceNormalAtPoint", "missingGlobe"));
    }

    var a2 = globe.equatorialRadius * globe.equatorialRadius,
        b2 = globe.polarRadius * globe.polarRadius;

    result[0] = x / a2;
    result[1] = y / b2;
    result[2] = z / a2;

    return result.normalize();
};

export default ProjectionWgs84;
