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
 * @exports GeographicProjection
 */
import ArgumentError from '../error/ArgumentError';
import Logger from '../util/Logger';
import Sector from '../geom/Sector';
import UnsupportedOperationError from '../error/UnsupportedOperationError';


/**
 * Constructs a base geographic projection.
 * @alias GeographicProjection
 * @constructor
 * @classdesc Represents a geographic projection.
 * This is an abstract class and is meant to be instantiated only by subclasses.
 * See the following projections:
 * <ul>
 *     <li>{@link ProjectionEquirectangular}</li>
 *     <li>{@link ProjectionMercator}</li>
 *     <li>{@link ProjectionPolarEquidistant}</li>
 *     <li>{@link ProjectionUPS}</li>
 </ul>
 * @param {String} displayName The projection's display name.
 * @param {boolean} continuous Indicates whether this projection is continuous.
 * @param {Sector} projectionLimits This projection's projection limits. May be null to indicate the full
 * range of latitude and longitude, +/- 90 degrees latitude, +/- 180 degrees longitude.
 */
function GeographicProjection(displayName, continuous, projectionLimits) {

    /**
     * This projection's display name.
     * @type {string}
     */
    this.displayName = displayName || "Geographic Projection";

    /**
     * Indicates whether this projection should be treated as continuous with itself. If true, the 2D map
     * will appear to scroll continuously horizontally.
     * @type {boolean}
     * @readonly
     */
    this.continuous = continuous;

    /**
     * Indicates the geographic limits of this projection.
     * @type {Sector}
     * @readonly
     */
    this.projectionLimits = projectionLimits;

    /**
     * Indicates whether this projection is a 2D projection.
     * @type {boolean}
     * @readonly
     */
    this.is2D = true;
}

/**
 * Converts a geographic position to Cartesian coordinates.
 *
 * @param {Globe} globe The globe this projection is applied to.
 * @param {number} latitude The latitude of the position, in degrees.
 * @param {number} longitude The longitude of the position, in degrees.
 * @param {number} elevation The elevation of the position, in meters.
 * @param {Vec3} offset An offset to apply to the Cartesian output. Typically only projections that are
 * continuous (see [continuous]{@link GeographicProjection#continuous}) apply to this offset. Others ignore
 * it. May be null to indicate no offset is applied.
 * @param {Vec3} result A variable in which to store the computed Cartesian point.
 *
 * @returns {Vec3} The specified result argument containing the computed point.
 * @throws {ArgumentError} If the specified globe or result is null or undefined.
 */
GeographicProjection.prototype.geographicToCartesian = function (globe, latitude, longitude, elevation,
    offset, result) {
    throw new UnsupportedOperationError(
        Logger.logMessage(Logger.LEVEL_SEVERE, "GeographicProjection", "geographicToCartesian", "abstractInvocation"));
};

/**
 * Computes a grid of Cartesian points within a specified sector and relative to a specified Cartesian
 * reference point.
 * <p>
 * This method is used to compute a collection of points within a sector. It is used by tessellators to
 * efficiently generate a tile's interior points. The number of points to generate is indicated by the tileWidth
 * and tileHeight parameters but is one more in each direction. Width refers to the longitudinal direction,
 * height to the latitudinal.
 * <p>
 * For each implied position within the sector, an elevation value is specified via an array of elevations. The
 * calculation at each position incorporates the associated elevation.
 * There must be (tileWidth + 1) x (tileHeight + 1) elevations in the array.
 *
 * @param {Globe} globe The globe this projection applies to.
 * @param {Sector} sector The sector in which to compute the points.
 * @param {Number} numLat The number of latitudinal sections a tile is divided into.
 * @param {Number} numLon The number of longitudinal sections a tile is divided into.
 * @param {Number[]} elevations An array of elevations to incorporate in the point calculations. There must be
 * one elevation value in the array for each generated point. Elevations are in meters.
 * There must be (tileWidth + 1) x (tileHeight + 1) elevations in the array.
 * @param {Vec3} referencePoint The X, Y and Z Cartesian coordinates to subtract from the computed coordinates.
 * This makes the computed coordinates relative to the specified point. May be null.
 * @param {Vec3} offset An offset to apply to the Cartesian output points. Typically only projections that
 * are continuous (see [continuous]{@link GeographicProjection#continuous}) apply this offset. Others ignore it.
 * May be null to indicate that no offset is applied.
 * @param {Float32Array} result A typed array to hold the computed coordinates. It must be at least of
 * size (tileWidth + 1) x (tileHeight + 1) * 3.
 * The points are returned in row major order, beginning with the row of minimum latitude.
 * @returns {Float32Array} The specified result argument, populated with the computed Cartesian coordinates.
 * @throws {ArgumentError} if any of the specified globe, sector, elevations array or results arrays is null or
 * undefined.
 */
GeographicProjection.prototype.geographicToCartesianGrid = function (globe, sector, numLat, numLon, elevations,
    referencePoint, offset, result) {
    throw new UnsupportedOperationError(
        Logger.logMessage(Logger.LEVEL_SEVERE, "GeographicProjection", "geographicToCartesianGrid", "abstractInvocation"));
};

/**
 * Converts a Cartesian point to a geographic position.
 * @param {Globe} globe The globe this projection is applied to.
 * @param {number} x The X component of the Cartesian point.
 * @param {number} y The Y component of the Cartesian point.
 * @param {number} z The Z component of the Cartesian point.
 * @param {Vec3} offset An offset to apply to the Cartesian output points. Typically only projections that
 * are continuous (see [continuous]{@link GeographicProjection#continuous}) apply this offset. Others ignore it.
 * May be null to indicate that no offset is applied.
 * @param {Position} result A variable in which to return the computed position.
 *
 * @returns {Position} The specified result argument containing the computed position.
 * @throws {ArgumentError} If either the specified globe or result argument is null or undefined.
 */
GeographicProjection.prototype.cartesianToGeographic = function (globe, x, y, z, offset, result) {
    throw new UnsupportedOperationError(
        Logger.logMessage(Logger.LEVEL_SEVERE, "GeographicProjection", "cartesianToGeographic", "abstractInvocation"));
};

/**
 * Computes a Cartesian vector that points north and is tangent to the meridian at a specified geographic
 * location.
 *
 * @param {Globe} globe The globe this projection is applied to.
 * @param {number} latitude The latitude of the location, in degrees.
 * @param {number} longitude The longitude of the location, in degrees.
 * @param {Vec3} result A variable in which to return the computed vector.
 *
 * @returns{Vec3} The specified result argument containing the computed vector.
 * @throws {ArgumentError} If either the specified globe or result argument is null or undefined.
 */
GeographicProjection.prototype.northTangentAtLocation = function (globe, latitude, longitude, result) {
    if (!result) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ProjectionEquirectangular",
            "northTangentAtLocation", "missingResult"));
    }

    result[0] = 0;
    result[1] = 1;
    result[2] = 0;

    return result;
};

/**
 * Computes a Cartesian vector that points north and is tangent to the meridian at a specified Cartesian
 * point.
 *
 * @param {Globe} globe The globe this projection is applied to.
 * @param {number} x The X component of the Cartesian point.
 * @param {number} y The Y component of the Cartesian point.
 * @param {number} z The Z component of the Cartesian point.
 * @param {Vec3} offset An offset to apply to the Cartesian point. Typically only projections that
 * are continuous (see [continuous]{@link GeographicProjection#continuous}) apply this offset. Others ignore it.
 * May be null to indicate that no offset is applied.
 * @param {Vec3} result A variable in which to return the computed vector.
 *
 * @returns{Vec3} The specified result argument containing the computed vector.
 * @throws {ArgumentError} If either the specified globe or result argument is null or undefined.
 */
GeographicProjection.prototype.northTangentAtPoint = function (globe, x, y, z, offset, result) {
    if (!result) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ProjectionEquirectangular",
            "northTangentAtPoint", "missingResult"));
    }

    result[0] = 0;
    result[1] = 1;
    result[2] = 0;

    return result;
};

/**
 * Computes the Cartesian surface normal vector at a specified geographic location.
 *
 * @param {Globe} globe The globe this projection is applied to.
 * @param {number} latitude The latitude of the location, in degrees.
 * @param {number} longitude The longitude of the location, in degrees.
 * @param {Vec3} result A variable in which to return the computed vector.
 *
 * @returns{Vec3} The specified result argument containing the computed vector.
 * @throws {ArgumentError} If either the specified globe or result argument is null or undefined.
 */
GeographicProjection.prototype.surfaceNormalAtLocation = function (globe, latitude, longitude, result) {
    if (!result) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "GeographicProjection", "surfaceNormalAtLocation",
            "missingResult"));
    }

    result[0] = 0;
    result[1] = 0;
    result[2] = 1;

    return result;
};

/**
 * Computes the Cartesian surface normal vector at a specified Cartesian point.
 *
 * @param {Globe} globe The globe this projection is applied to.
 * @param {number} x The X component of the Cartesian point.
 * @param {number} y The Y component of the Cartesian point.
 * @param {number} z The Z component of the Cartesian point.
 * @param {Vec3} result A variable in which to return the computed vector.
 *
 * @returns{Vec3} The specified result argument containing the computed vector.
 * @throws {ArgumentError} If either the specified globe or result argument is null or undefined.
 */
GeographicProjection.prototype.surfaceNormalAtPoint = function (globe, x, y, z, result) {
    if (!result) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "GeographicProjection", "surfaceNormalAtPoint",
            "missingResult"));
    }

    result[0] = 0;
    result[1] = 0;
    result[2] = 1;

    return result;
};

export default GeographicProjection;
