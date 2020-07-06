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
 * @exports Globe
 */
import Angle from '../geom/Angle';
import ArgumentError from '../error/ArgumentError';
import BoundingBox from '../geom/BoundingBox';
import ElevationModel from '../globe/ElevationModel';
import Line from '../geom/Line';
import Logger from '../util/Logger';
import Position from '../geom/Position';
import ProjectionWgs84 from '../projections/ProjectionWgs84';
import Sector from '../geom/Sector';
import Tessellator from '../globe/Tessellator';
import Vec3 from '../geom/Vec3';


/**
 * Constructs an ellipsoidal Globe with default radii for Earth (WGS84).
 * @alias Globe
 * @constructor
 * @classdesc Represents an ellipsoidal globe. The default configuration represents Earth but may be changed.
 * To configure for another planet, set the globe's equatorial and polar radii properties and its
 * eccentricity-squared property.
 * <p>
 * A globe uses a Cartesian coordinate system whose origin is at the globe's center. It's Y axis points to the
 * north pole, the Z axis points to the intersection of the prime meridian and the equator,
 * and the X axis completes a right-handed coordinate system, is in the equatorial plane and 90 degrees east
 * of the Z axis.
 * <p>
 *     All Cartesian coordinates and elevations are in meters.

 * @param {ElevationModel} elevationModel The elevation model to use for this globe.
 * @param {GeographicProjection} projection The projection to apply to the globe. May be null or undefined,
 * in which case no projection is applied and the globe is a WGS84 ellipsoid.
 * @throws {ArgumentError} If the specified elevation model is null or undefined.
 */
function Globe(elevationModel, projection) {
    if (!elevationModel) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Globe",
            "constructor", "Elevation model is null or undefined."));
    }
    /**
     * This globe's elevation model.
     * @type {ElevationModel}
     */
    this.elevationModel = elevationModel;

    /**
     * This globe's equatorial radius in meters.
     *
     * @type {Number}
     * @default WGS 84 semi-major axis (6378137.0 meters)
     */
    this.equatorialRadius = WorldWind.WGS84_SEMI_MAJOR_AXIS;
    var f = 1 / WorldWind.WGS84_INVERSE_FLATTENING;

    /**
     * This globe's polar radius in meters.
     * @type {Number}
     * @default WGS 84 semi-minor axis (6356752.3142 meters). Taken from NGA.STND.0036_1.0.0_WGS84, section 3.2.
     */
    this.polarRadius = this.equatorialRadius * (1 - f);

    /**
     * This globe's eccentricity squared.
     * @type {Number}
     * @default WGS 84 first eccentricity squared (6.694379990141e-3). Taken from NGA.STND.0036_1.0.0_WGS84, section 3.3.
     */
    this.eccentricitySquared = 2 * f - f * f;

    /**
     * The tessellator used to create this globe's terrain.
     * @type {Tessellator}
     */
    this.tessellator = new Tessellator();

    // Internal. Intentionally not documented.
    this._projection = projection || new ProjectionWgs84();

    // Internal. Intentionally not documented.
    this._offset = 0;

    // Internal. Intentionally not documented.
    this.offsetVector = new Vec3(0, 0, 0);

    // A unique ID for this globe. Intentionally not documented.
    this.id = ++Globe.idPool;

    this._stateKey = "globe " + this.id.toString() + " ";
}

Globe.idPool = 0; // Used to assign unique IDs to globes for use in their state keys.

Object.defineProperties(Globe.prototype, {
    /**
     * A string identifying this globe's current state. Used to compare states during rendering to
     * determine whether globe-state dependent cached values must be updated. Applications typically do not
     * interact with this property.
     * @memberof Globe.prototype
     * @readonly
     * @type {String}
     */
    stateKey: {
        get: function () {
            return this._stateKey + this.elevationModel.stateKey + "offset " + this.offset.toString() + " "
                + this.projection.stateKey;
        }
    },

    /**
     * Indicates whether this globe is 2D and continuous with itself -- that it should scroll continuously
     * horizontally.
     * @memberof Globe.prototype
     * @readonly
     * @type {Boolean}
     */
    continuous: {
        get: function () {
            return this.projection.continuous;
        }
    },

    /**
     * The projection used by this globe.
     * @memberof Globe.prototype
     * @default {@link ProjectionWgs84}
     * @type {GeographicProjection}
     */
    projection: {
        get: function () {
            return this._projection;
        },
        set: function (projection) {
            if (!projection) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Globe",
                    "projection", "missingProjection"));
            }

            if (this.projection != projection) {
                this.tessellator = new Tessellator();
            }
            this._projection = projection;
        }
    },

    /**
     * The projection limits of the associated projection.
     * @memberof Globe.prototype
     * @type {Sector}
     */
    projectionLimits: {
        get: function () {
            return this._projection.projectionLimits;
        }
    },

    /**
     * An offset to apply to this globe when translating between Geographic positions and Cartesian points.
     * Used during scrolling to position points appropriately.
     * Applications typically do not access this property. It is used by the associated globe.
     * @memberof Globe.prototype
     * @type {Number}
     */
    offset: {
        get: function () {
            return this._offset;
        },
        set: function (offset) {
            this._offset = offset;
            this.offsetVector[0] = offset * 2 * Math.PI * this.equatorialRadius;
        }
    }
});

/**
 * Indicates whether this is a 2D globe.
 * @returns {Boolean} true if this is a 2D globe, otherwise false.
 */
Globe.prototype.is2D = function () {
    return this.projection.is2D;
};

/**
 * Computes a Cartesian point from a specified position.
 * See this class' Overview section for a description of the Cartesian coordinate system used.
 * @param {Number} latitude The position's latitude.
 * @param {Number} longitude The position's longitude.
 * @param {Number} altitude The position's altitude.
 * @param {Vec3} result A reference to a pre-allocated {@link Vec3} in which to return the computed X,
 * Y and Z Cartesian coordinates.
 * @returns {Vec3} The result argument.
 * @throws {ArgumentError} If the specified result argument is null or undefined.
 */
Globe.prototype.computePointFromPosition = function (latitude, longitude, altitude, result) {
    if (!result) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Globe", "computePointFromPosition",
            "missingResult"));
    }

    return this.projection.geographicToCartesian(this, latitude, longitude, altitude, this.offsetVector, result);
};

/**
 * Computes a Cartesian point from a specified location.
 * See this class' Overview section for a description of the Cartesian coordinate system used.
 * @param {Number} latitude The position's latitude.
 * @param {Number} longitude The position's longitude.
 * @param {Vec3} result A reference to a pre-allocated {@link Vec3} in which to return the computed X,
 * Y and Z Cartesian coordinates.
 * @returns {Vec3} The result argument.
 * @throws {ArgumentError} If the specified result argument is null or undefined.
 */
Globe.prototype.computePointFromLocation = function (latitude, longitude, result) {
    if (!result) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Globe", "computePointFromLocation",
            "missingResult"));
    }

    return this.computePointFromPosition(latitude, longitude, 0, result);
};

/**
 * Computes a grid of Cartesian points within a specified sector and relative to a specified Cartesian
 * reference point.
 * <p>
 * This method is used to compute a collection of points within a sector. It is used by tessellators to
 * efficiently generate a tile's interior points. The number of points to generate is indicated by the numLon
 * and numLat parameters.
 * <p>
 * For each implied position within the sector, an elevation value is specified via an array of elevations. The
 * calculation at each position incorporates the associated elevation. There must be numLat x numLon elevations
 * in the array.
 *
 * @param {Sector} sector The sector for which to compute the points.
 * @param {Number} numLat The number of latitudinal points in the grid.
 * @param {Number} numLon The number of longitudinal points in the grid.
 * @param {Number[]} elevations An array of elevations to incorporate in the point calculations. There must be
 * one elevation value in the array for each generated point. Elevations are in meters. There must be
 * numLat x numLon elevations in the array.
 * @param {Vec3} referencePoint The X, Y and Z Cartesian coordinates to subtract from the computed coordinates.
 * This makes the computed coordinates relative to the specified point.
 * @param {Float32Array} result A typed array to hold the computed coordinates. It must be at least of
 * size numLat x numLon. The points are returned in row major order, beginning with the row of minimum latitude.
 * @returns {Float32Array} The specified result argument.
 * @throws {ArgumentError} if the specified sector, elevations array or results arrays are null or undefined, or
 * if the lengths of any of the arrays are insufficient.
 */
Globe.prototype.computePointsForGrid = function (sector, numLat, numLon, elevations, referencePoint, result) {
    if (!sector) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Globe",
            "computePointsFromPositions", "missingSector"));
    }

    if (numLat < 1 || numLon < 1) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Globe", "computePointsFromPositions",
            "Number of latitude or longitude locations is less than one."));
    }

    var numPoints = numLat * numLon;
    if (!elevations || elevations.length < numPoints) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Globe", "computePointsFromPositions",
            "Elevations array is null, undefined or insufficient length."));
    }

    if (!result || result.length < numPoints) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Globe", "computePointsFromPositions",
            "Result array is null, undefined or insufficient length."));
    }

    return this.projection.geographicToCartesianGrid(this, sector, numLat, numLon, elevations, referencePoint,
        this.offsetVector, result);
};

/**
 * Computes a geographic position from a specified Cartesian point.
 *
 * See this class' Overview section for a description of the Cartesian coordinate system used.
 *
 * @param {Number} x The X coordinate.
 * @param {Number} y The Y coordinate.
 * @param {Number} z The Z coordinate.
 * @param {Position} result A pre-allocated {@link Position} instance in which to return the computed position.
 * @returns {Position} The specified result position.
 * @throws {ArgumentError} If the specified result argument is null or undefined.
 */
Globe.prototype.computePositionFromPoint = function (x, y, z, result) {
    if (!result) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Globe", "computePositionFromPoint",
            "missingResult"));
    }

    this.projection.cartesianToGeographic(this, x, y, z, this.offsetVector, result);

    // Wrap if the globe is continuous.
    if (this.continuous) {
        if (result.longitude < -180) {
            result.longitude += 360;
        } else if (result.longitude > 180) {
            result.longitude -= 360;
        }
    }

    return result;
};

/**
 * Computes the radius of this globe at a specified location.
 * @param {Number} latitude The locations' latitude.
 * @param {Number} longitude The locations' longitude.
 * @returns {Number} The radius at the specified location.
 */
Globe.prototype.radiusAt = function (latitude, longitude) {
    var sinLat = Math.sin(latitude * Angle.DEGREES_TO_RADIANS),
        rpm = this.equatorialRadius / Math.sqrt(1.0 - this.eccentricitySquared * sinLat * sinLat);

    return rpm * Math.sqrt(1.0 + (this.eccentricitySquared * this.eccentricitySquared - 2.0 * this.eccentricitySquared) * sinLat * sinLat);
};

/**
 * Computes the normal vector to this globe's surface at a specified location.
 * @param {Number} latitude The location's latitude.
 * @param {Number} longitude The location's longitude.
 * @param {Vec3} result A pre-allocated {@Link Vec3} instance in which to return the computed vector. The returned
 * normal vector is unit length.
 * @returns {Vec3} The specified result vector.  The returned normal vector is unit length.
 * @throws {ArgumentError} If the specified result argument is null or undefined.
 */
Globe.prototype.surfaceNormalAtLocation = function (latitude, longitude, result) {
    if (!result) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Globe", "surfaceNormalAtLocation",
            "missingResult"));
    }

    // For backwards compatibility, check whether the projection defines a surfaceNormalAtLocation function
    // before calling it. If it's not available, use the old code to compute the normal.
    if (this.projection.surfaceNormalAtLocation) {
        return this.projection.surfaceNormalAtLocation(this, latitude, longitude, result);
    }

    if (this.is2D()) {
        result[0] = 0;
        result[1] = 0;
        result[2] = 1;

        return result;
    }

    var cosLat = Math.cos(latitude * Angle.DEGREES_TO_RADIANS),
        cosLon = Math.cos(longitude * Angle.DEGREES_TO_RADIANS),
        sinLat = Math.sin(latitude * Angle.DEGREES_TO_RADIANS),
        sinLon = Math.sin(longitude * Angle.DEGREES_TO_RADIANS);

    result[0] = cosLat * sinLon;
    result[1] = sinLat;
    result[2] = cosLat * cosLon;

    return result.normalize();
};

/**
 * Computes the normal vector to this globe's surface at a specified Cartesian point.
 * @param {Number} x The point's X coordinate.
 * @param {Number} y The point's Y coordinate.
 * @param {Number} z The point's Z coordinate.
 * @param {Vec3} result A pre-allocated {@Link Vec3} instance in which to return the computed vector. The returned
 * normal vector is unit length.
 * @returns {Vec3} The specified result vector.
 * @throws {ArgumentError} If the specified result argument is null or undefined.
 */
Globe.prototype.surfaceNormalAtPoint = function (x, y, z, result) {
    if (!result) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Globe", "surfaceNormalAtPoint",
            "missingResult"));
    }

    // For backwards compatibility, check whether the projection defines a surfaceNormalAtPoint function
    // before calling it. If it's not available, use the old code to compute the normal.
    if (this.projection.surfaceNormalAtPoint) {
        return this.projection.surfaceNormalAtPoint(this, x, y, z, result);
    }

    if (this.is2D()) {
        result[0] = 0;
        result[1] = 0;
        result[2] = 1;

        return result;
    }

    var eSquared = this.equatorialRadius * this.equatorialRadius,
        polSquared = this.polarRadius * this.polarRadius;

    result[0] = x / eSquared;
    result[1] = y / polSquared;
    result[2] = z / eSquared;

    return result.normalize();
};

/**
 * Computes the north-pointing tangent vector to this globe's surface at a specified location.
 * @param {Number} latitude The location's latitude.
 * @param {Number} longitude The location's longitude.
 * @param {Vec3} result A pre-allocated {@Link Vec3} instance in which to return the computed vector. The returned
 * tangent vector is unit length.
 * @returns {Vec3} The specified result vector.
 * @throws {ArgumentError} If the specified result argument is null or undefined.
 */
Globe.prototype.northTangentAtLocation = function (latitude, longitude, result) {
    if (!result) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Globe", "northTangentAtLocation",
            "missingResult"));
    }

    return this.projection.northTangentAtLocation(this, latitude, longitude, result);
};

/**
 * Computes the north-pointing tangent vector to this globe's surface at a specified Cartesian point.
 * @param {Number} x The point's X coordinate.
 * @param {Number} y The point's Y coordinate.
 * @param {Number} z The point's Z coordinate.
 * @param {Vec3} result A pre-allocated {@Link Vec3} instance in which to return the computed vector. The returned
 * tangent vector is unit length.
 * @returns {Vec3} The specified result vector.
 * @throws {ArgumentError} If the specified result argument is null or undefined.
 */
Globe.prototype.northTangentAtPoint = function (x, y, z, result) {
    if (!result) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Globe", "northTangentAtPoint",
            "missingResult"));
    }

    return this.projection.northTangentAtPoint(this, x, y, z, this.offsetVector, result);
};

/**
 * Indicates whether this globe intersects a specified frustum.
 * @param {Frustum} frustum The frustum to test.
 * @returns {Boolean} true if this globe intersects the frustum, otherwise false.
 * @throws {ArgumentError} If the specified frustum is null or undefined.
 */
Globe.prototype.intersectsFrustum = function (frustum) {
    if (!frustum) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Globe", "intersectsFrustum", "missingFrustum"));
    }

    if (this.is2D()) {
        var bbox = new BoundingBox();
        bbox.setToSector(Sector.FULL_SPHERE, this, this.elevationModel.minElevation,
            this.elevationModel.maxElevation);

        return bbox.intersectsFrustum(frustum);
    }

    if (frustum.far.distance <= this.equatorialRadius)
        return false;
    if (frustum.left.distance <= this.equatorialRadius)
        return false;
    if (frustum.right.distance <= this.equatorialRadius)
        return false;
    if (frustum.top.distance <= this.equatorialRadius)
        return false;
    if (frustum.bottom.distance <= this.equatorialRadius)
        return false;
    if (frustum.near.distance <= this.equatorialRadius)
        return false;

    return true;
};

/**
 * Computes the first intersection of this globe with a specified line. The line is interpreted as a ray;
 * intersection points behind the line's origin are ignored.
 * @param {Line} line The line to intersect with this globe.
 * @param {Vec3} result A pre-allocated Vec3 in which to return the computed point.
 * @returns {boolean} true If the ray intersects the globe, otherwise false.
 * @throws {ArgumentError} If the specified line or result argument is null or undefined.
 */
Globe.prototype.intersectsLine = function (line, result) {
    if (!line) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Globe", "intersectWithRay", "missingLine"));
    }

    if (!result) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Globe", "intersectsLine", "missingResult"));
    }

    // Taken from "Mathematics for 3D Game Programming and Computer Graphics, Third Edition", Section 6.2.3.
    //
    // Note that the parameter n from equations 6.70 and 6.71 is omitted here. For an ellipsoidal globe this
    // parameter is always 1, so its square and its product with any other value simplifies to the identity.

    var vx = line.direction[0],
        vy = line.direction[1],
        vz = line.direction[2],
        sx = line.origin[0],
        sy = line.origin[1],
        sz = line.origin[2],
        t;

    if (this.is2D()) {
        if (vz == 0 && sz != 0) { // ray is parallel to and not coincident with the XY plane
            return false;
        }

        t = -sz / vz; // intersection distance, simplified for the XY plane
        if (t < 0) { // intersection is behind the ray's origin
            return false;
        }

        result[0] = sx + vx * t;
        result[1] = sy + vy * t;
        result[2] = sz + vz * t;

        return true;
    } else {
        var eqr = this.equatorialRadius, eqr2 = eqr * eqr, m = eqr / this.polarRadius, m2 = m * m, a, b, c, d;

        a = vx * vx + m2 * vy * vy + vz * vz;
        b = 2 * (sx * vx + m2 * sy * vy + sz * vz);
        c = sx * sx + m2 * sy * sy + sz * sz - eqr2;
        d = b * b - 4 * a * c; // discriminant

        if (d < 0) {
            return false;
        }

        t = (-b - Math.sqrt(d)) / (2 * a);
        // check if the nearest intersection point is in front of the origin of the ray
        if (t > 0) {
            result[0] = sx + vx * t;
            result[1] = sy + vy * t;
            result[2] = sz + vz * t;
            return true;
        }

        t = (-b + Math.sqrt(d)) / (2 * a);
        // check if the second intersection point is in the front of the origin of the ray
        if (t > 0) {
            result[0] = sx + vx * t;
            result[1] = sy + vy * t;
            result[2] = sz + vz * t;
            return true;
        }

        // the intersection points were behind the origin of the provided line
        return false;
    }
};

/**
 * Returns the time at which any elevations associated with this globe last changed.
 * @returns {Number} The time in milliseconds relative to the Epoch of the most recent elevation change.
 */
Globe.prototype.elevationTimestamp = function () {
    return this.elevationModel.timestamp;
};

/**
 * Returns this globe's minimum elevation.
 * @returns {Number} This globe's minimum elevation.
 */
Globe.prototype.minElevation = function () {
    return this.elevationModel.minElevation;
};

/**
 * Returns this globe's maximum elevation.
 * @returns {Number} This globe's maximum elevation.
 */
Globe.prototype.maxElevation = function () {
    return this.elevationModel.maxElevation;
};

/**
 * Returns the minimum and maximum elevations within a specified sector of this globe.
 * @param {Sector} sector The sector for which to determine extreme elevations.
 * @returns {Number[]} The An array containing the minimum and maximum elevations.
 * @throws {ArgumentError} If the specified sector is null or undefined.
 */
Globe.prototype.minAndMaxElevationsForSector = function (sector) {
    if (!sector) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Globe", "minAndMaxElevationsForSector",
                "missingSector"));
    }

    return this.elevationModel.minAndMaxElevationsForSector(sector);
};

/**
 * Returns the elevation at a specified location.
 * @param {Number} latitude The location's latitude in degrees.
 * @param {Number} longitude The location's longitude in degrees.
 * @returns {Number} The elevation at the specified location, in meters. Returns zero if the location is
 * outside the coverage area of this elevation model.
 */
Globe.prototype.elevationAtLocation = function (latitude, longitude) {
    return this.elevationModel.elevationAtLocation(latitude, longitude);
};

/**
 * Returns the elevations at locations within a specified sector.
 * @param {Sector} sector The sector for which to determine the elevations.
 * @param {Number} numLat The number of latitudinal sample locations within the sector.
 * @param {Number} numLon The number of longitudinal sample locations within the sector.
 * @param {Number} targetResolution The desired elevation resolution, in degrees. (To compute degrees from
 * meters, divide the number of meters by the globe's radius to obtain radians and convert the result to degrees.)
 * @param {Number[]} result An array in which to return the requested elevations.
 * @returns {Number} The resolution actually achieved, which may be greater than that requested if the
 * elevation data for the requested resolution is not currently available.
 * @throws {ArgumentError} If the specified sector or result array is null or undefined, or if either of the
 * specified numLat or numLon values is less than one.
 */
Globe.prototype.elevationsForGrid = function (sector, numLat, numLon, targetResolution, result) {
    if (!sector) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Globe", "elevationsForSector", "missingSector"));
    }

    if (numLat <= 0 || numLon <= 0) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Globe",
            "elevationsForSector", "numLat or numLon is less than 1"));
    }

    if (!result || result.length < numLat * numLon) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Globe",
            "elevationsForSector", "missingArray"));
    }

    return this.elevationModel.elevationsForGrid(sector, numLat, numLon, targetResolution, result);
};

export default Globe;

