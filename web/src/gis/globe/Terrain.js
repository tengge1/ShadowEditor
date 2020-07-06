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
 * @exports Terrain
 */
import ArgumentError from '../error/ArgumentError';
import Logger from '../util/Logger';
import Vec3 from '../geom/Vec3';


/**
 * Constructs a Terrain object.
 * @alias Terrain
 * @constructor
 * @classdesc Represents terrain and provides functions for computing points on or relative to the terrain.
 * Applications do not typically interact directly with this class.
 */
function Terrain(globe, tessellator, terrainTiles, verticalExaggeration) {

    /**
     * The globe associated with this terrain.
     * @type {Globe}
     */
    this.globe = globe;

    /**
     * The vertical exaggeration of this terrain.
     * @type {Number}
     */
    this.verticalExaggeration = verticalExaggeration;

    /**
     * The sector spanned by this terrain.
     * @type {Sector}
     */
    this.sector = terrainTiles.sector;

    /**
     * The tessellator used to generate this terrain.
     * @type {Tessellator}
     */
    this.tessellator = tessellator;

    /**
     * The surface geometry for this terrain
     * @type {TerrainTile[]}
     */
    this.surfaceGeometry = terrainTiles.tileArray;

    /**
     * A string identifying this terrain's current state. Used to compare states during rendering to
     * determine whether state dependent cached values must be updated. Applications typically do not
     * interact with this property.
     * @readonly
     * @type {String}
     */
    this.stateKey = globe.stateKey + " ve " + verticalExaggeration.toString();
}

Terrain.scratchPoint = new Vec3(0, 0, 0);

/**
 * Computes a Cartesian point at a location on the surface of this terrain.
 * @param {Number} latitude The location's latitude.
 * @param {Number} longitude The location's longitude.
 * @param {Number} offset Distance above the terrain, in meters, at which to compute the point.
 * @param {Vec3} result A pre-allocated Vec3 in which to return the computed point.
 * @returns {Vec3} The specified result parameter, set to the coordinates of the computed point. If the
 * specfied location is not within this terrain, the associated globe is used to compute the point.
 * @throws {ArgumentError} If the specified result argument is null or undefined.
 */
Terrain.prototype.surfacePoint = function (latitude, longitude, offset, result) {
    if (!result) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Terrain", "surfacePoint", "missingResult"));
    }

    for (var i = 0, len = this.surfaceGeometry.length; i < len; i++) {
        if (this.surfaceGeometry[i].sector.containsLocation(latitude, longitude)) {
            this.surfaceGeometry[i].surfacePoint(latitude, longitude, result);

            if (offset) {
                var normal = this.globe.surfaceNormalAtPoint(result[0], result[1], result[2], Terrain.scratchPoint);
                result[0] += normal[0] * offset;
                result[1] += normal[1] * offset;
                result[2] += normal[2] * offset;
            }

            return result;
        }
    }

    // No tile was found that contains the location, so approximate one using the globe.
    var h = offset + this.globe.elevationAtLocation(latitude, longitude) * this.verticalExaggeration;
    this.globe.computePointFromPosition(latitude, longitude, h, result);

    return result;
};

/**
 * Computes a Cartesian point at a location on the surface of this terrain according to a specified
 * altitude mode.
 * @param {Number} latitude The location's latitude.
 * @param {Number} longitude The location's longitude.
 * @param {Number} offset Distance above the terrain, in meters relative to the specified altitude mode, at
 * which to compute the point.
 * @param {String} altitudeMode The altitude mode to use to compute the point. Recognized values are
 * WorldWind.ABSOLUTE, WorldWind.CLAMP_TO_GROUND and
 * WorldWind.RELATIVE_TO_GROUND. The mode WorldWind.ABSOLUTE is used if the
 * specified mode is null, undefined or unrecognized, or if the specified location is outside this terrain.
 * @param {Vec3} result A pre-allocated Vec3 in which to return the computed point.
 * @returns {Vec3} The specified result parameter, set to the coordinates of the computed point.
 * @throws {ArgumentError} If the specified result argument is null or undefined.
 */
Terrain.prototype.surfacePointForMode = function (latitude, longitude, offset, altitudeMode, result) {
    if (!result) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Terrain", "surfacePointForMode", "missingResult"));
    }

    if (!altitudeMode)
        altitudeMode = WorldWind.ABSOLUTE;

    if (altitudeMode === WorldWind.CLAMP_TO_GROUND) {
        return this.surfacePoint(latitude, longitude, 0, result);
    } else if (altitudeMode === WorldWind.RELATIVE_TO_GROUND) {
        return this.surfacePoint(latitude, longitude, offset, result);
    } else {
        var height = offset * this.verticalExaggeration;
        this.globe.computePointFromPosition(latitude, longitude, height, result);
        return result;
    }
};

/**
 * Initializes rendering state to draw a succession of terrain tiles.
 * @param {DrawContext} dc The current draw context.
 */
Terrain.prototype.beginRendering = function (dc) {
    if (this.globe && this.globe.tessellator) {
        this.globe.tessellator.beginRendering(dc);
    }
};

/**
 * Restores rendering state after drawing a succession of terrain tiles.
 * @param {DrawContext} dc The current draw context.
 */
Terrain.prototype.endRendering = function (dc) {
    if (this.globe && this.globe.tessellator) {
        this.globe.tessellator.endRendering(dc);
    }
};

/**
 * Initializes rendering state for drawing a specified terrain tile.
 * @param {DrawContext} dc The current draw context.
 * @param {TerrainTile} terrainTile The terrain tile subsequently drawn via this tessellator's render function.
 * @throws {ArgumentError} If the specified tile is null or undefined.
 */
Terrain.prototype.beginRenderingTile = function (dc, terrainTile) {
    if (!terrainTile) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Terrain", "beginRenderingTile", "missingTile"));
    }

    if (this.globe && this.globe.tessellator) {
        this.globe.tessellator.beginRenderingTile(dc, terrainTile);
    }
};

/**
 * Restores rendering state after drawing the most recent tile specified to
 * [beginRenderingTile]{@link Terrain#beginRenderingTile}.
 * @param {DrawContext} dc The current draw context.
 * @param {TerrainTile} terrainTile The terrain tile most recently rendered.
 * @throws {ArgumentError} If the specified tile is null or undefined.
 */
Terrain.prototype.endRenderingTile = function (dc, terrainTile) {
    // Intentionally empty.
};

/**
 * Renders a specified terrain tile.
 * @param {DrawContext} dc The current draw context.
 * @param {TerrainTile} terrainTile The terrain tile to render.
 * @throws {ArgumentError} If the specified tile is null or undefined.
 */
Terrain.prototype.renderTile = function (dc, terrainTile) {
    if (!terrainTile) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Terrain", "renderTile", "missingTile"));
    }

    if (this.globe && this.globe.tessellator) {
        this.globe.tessellator.renderTile(dc, terrainTile);
    }
};

/**
 * Causes this terrain to perform the picking operations appropriate for the draw context's pick settings.
 * Normally, this draws the terrain in a unique pick color and computes the picked terrain position. When the
 * draw context is set to region picking mode this omits the computation of a picked terrain position.
 * @param {DrawContext} dc The current draw context.
 */
Terrain.prototype.pick = function (dc) {
    if (this.globe && this.globe.tessellator) {
        this.globe.tessellator.pick(dc, this.surfaceGeometry, this); // use this terrain as the userObject
    }
};

export default Terrain;
