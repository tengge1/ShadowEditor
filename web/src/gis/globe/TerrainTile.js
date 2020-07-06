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
 * @exports TerrainTile
 */
import ArgumentError from '../error/ArgumentError';
import Logger from '../util/Logger';
import Matrix from '../geom/Matrix';
import Tile from '../util/Tile';


/**
 * Constructs a terrain tile.
 * @alias TerrainTile
 * @constructor
 * @augments Tile
 * @classdesc Represents a portion of a globe's terrain. Applications typically do not interact directly with
 * this class.
 * @param {Sector} sector The sector this tile covers.
 * @param {Level} level The level this tile is associated with.
 * @param {Number} row This tile's row in the associated level.
 * @param {Number} column This tile's column in the associated level.
 * @throws {ArgumentError} If the specified sector or level is null or undefined or the row or column arguments
 * are less than zero.
 */
function TerrainTile(sector, level, row, column) {
    Tile.call(this, sector, level, row, column); // args are checked in the superclass' constructor

    /**
     * The transformation matrix that maps tile local coordinates to model coordinates.
     * @type {Matrix}
     */
    this.transformationMatrix = Matrix.fromIdentity();

    /**
     * The tile's model coordinate points.
     * @type {Float32Array}
     */
    this.points = null;

    /**
     * Indicates the state of this tile when the model coordinate points were last updated. This is used to
     * invalidate the points when this tile's state changes.
     * @type {String}
     */
    this.pointsStateKey = null;

    /**
     * Indicates the state of this tile when the model coordinate VBO was last uploaded to GL. This is used to
     * invalidate the VBO when the tile's state changes.
     * @type {String}
     */
    this.pointsVboStateKey = null;

    // Internal use. Intentionally not documented.
    this.neighborMap = {};
    this.neighborMap[WorldWind.NORTH] = null;
    this.neighborMap[WorldWind.SOUTH] = null;
    this.neighborMap[WorldWind.EAST] = null;
    this.neighborMap[WorldWind.WEST] = null;

    // Internal use. Intentionally not documented.
    this._stateKey = null;

    // Internal use. Intentionally not documented.
    this._elevationTimestamp = null;

    // Internal use. Intentionally not documented.
    this.scratchArray = [];
}

TerrainTile.prototype = Object.create(Tile.prototype);

Object.defineProperties(TerrainTile.prototype, {
    /**
     * A string identifying the state of this tile as a function of the elevation model's timestamp and this
     * tile's neighbors. Used to compare states during rendering to determine whether cached values must be
     * updated. Applications typically do not interact with this property.
     * @type {String}
     * @memberof TerrainTile.prototype
     * @readonly
     */
    stateKey: {
        get: function () {
            if (!this._stateKey) {
                this._stateKey = this.computeStateKey();
            }

            return this._stateKey;
        }
    }
});

/**
 * Indicates the level of the tile adjacent to this tile in a specified direction. This returns null when this
 * tile has no neighbor in that direction.
 * @param {String} direction The cardinal direction. Must be one of WorldWind.NORTH, WorldWind.SOUTH,
 * WorldWind.EAST or WorldWind.WEST.
 * @returns {Level} The neighbor tile's level in the specified direction, or null if there is no neighbor.
 */
TerrainTile.prototype.neighborLevel = function (direction) {
    return this.neighborMap[direction];
};

/**
 * Specifies the level of the tile adjacent to this tile in a specified direction.
 * @param {String} direction The cardinal direction. Must be one of WorldWind.NORTH, WorldWind.SOUTH,
 * WorldWind.EAST or WorldWind.WEST.
 * @param {Level} level The neighbor tile's level in the specified direction, or null to indicate that there is
 * no neighbor in that direction.
 */
TerrainTile.prototype.setNeighborLevel = function (direction, level) {
    this.neighborMap[direction] = level;
    this._stateKey = null; // cause updates to any neighbor-dependent cached state
};

/**
 * Computes a point on the terrain at a specified location.
 * @param {Number} latitude The location's latitude.
 * @param {Number} longitude The location's longitude.
 * @param {Vec3} result A pre-allocated Vec3 in which to return the computed point.
 * @returns {Vec3} The result argument set to the computed point.
 * @throws {ArgumentError} If the specified result argument is null or undefined.
 */
TerrainTile.prototype.surfacePoint = function (latitude, longitude, result) {
    if (!result) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "TerrainTile", "surfacePoint", "missingResult"));
    }

    var tileSector = this.sector,
        minLat = tileSector.minLatitude,
        maxLat = tileSector.maxLatitude,
        minLon = tileSector.minLongitude,
        maxLon = tileSector.maxLongitude,
        tileWidth = this.tileWidth,
        tileHeight = this.tileHeight,
        s, t, si, ti, rowStride, vertices, points, k, sf, tf, x, y, z;

    // Compute the location's horizontal (s) and vertical (t) parameterized coordinates within the tiles 2D grid of
    // points as a floating-point value in the range [0, tileWidth] and [0, tileHeight]. These coordinates indicate
    // which cell contains the location, as well as the location's placement within the cell. Note that this method
    // assumes that the caller has tested whether the location is contained within the tile's sector.
    s = (longitude - minLon) / (maxLon - minLon) * tileWidth;
    t = (latitude - minLat) / (maxLat - minLat) * tileHeight;

    // Get the coordinates for the four vertices defining the cell this point is in. Tile vertices start in the lower
    // left corner and proceed in row major order across the tile. The tile contains one more vertex per row or
    // column than the tile width or height. Vertices in the points array are organized in the
    // following order: lower-left, lower-right, upper-left, upper-right. The cell's diagonal starts at the
    // lower-left vertex and ends at the upper-right vertex.
    si = s < tileWidth ? Math.floor(s) : tileWidth - 1;
    ti = t < tileHeight ? Math.floor(t) : tileHeight - 1;
    rowStride = tileWidth + 1;

    vertices = this.points;
    points = this.scratchArray; // temporary working buffer
    k = 3 * (si + ti * rowStride); // lower-left and lower-right vertices
    for (var i = 0; i < 6; i++) {
        points[i] = vertices[k + i];
    }

    k = 3 * (si + (ti + 1) * rowStride); // upper-left and upper-right vertices
    for (var j = 6; j < 12; j++) {
        points[j] = vertices[k + (j - 6)];
    }

    // Compute the location's corresponding point on the cell in tile local coordinates,
    // given the fractional portion of the parameterized s and t coordinates. These values indicate the location's
    // relative placement within the cell. The cell's vertices are defined in the following order: lower-left,
    // lower-right, upper-left, upper-right. The cell's diagonal starts at the lower-right vertex and ends at the
    // upper-left vertex.
    sf = s < tileWidth ? s - Math.floor(s) : 1;
    tf = t < tileHeight ? t - Math.floor(t) : 1;

    if (sf > tf) {
        result[0] = points[0] + sf * (points[3] - points[0]) + tf * (points[6] - points[0]);
        result[1] = points[1] + sf * (points[4] - points[1]) + tf * (points[7] - points[1]);
        result[2] = points[2] + sf * (points[5] - points[2]) + tf * (points[8] - points[2]);
    }
    else {
        result[0] = points[9] + (1 - sf) * (points[6] - points[9]) + (1 - tf) * (points[3] - points[9]);
        result[1] = points[10] + (1 - sf) * (points[7] - points[10]) + (1 - tf) * (points[4] - points[10]);
        result[2] = points[11] + (1 - sf) * (points[8] - points[11]) + (1 - tf) * (points[5] - points[11]);
    }

    result[0] += this.referencePoint[0];
    result[1] += this.referencePoint[1];
    result[2] += this.referencePoint[2];

    return result;
};

TerrainTile.prototype.update = function (dc) {
    Tile.prototype.update.call(this, dc);

    var elevationTimestamp = dc.globe.elevationTimestamp();
    if (this._elevationTimestamp != elevationTimestamp) {
        this._elevationTimestamp = elevationTimestamp;
        this._stateKey = null; // cause updates to any elevation-dependent cached state
    }
};

// Intentionally not documented.
TerrainTile.prototype.computeStateKey = function () {
    var array = [];
    array.push(this._elevationTimestamp);
    array.push(this.neighborMap[WorldWind.NORTH] ? this.neighborMap[WorldWind.NORTH].compare(this.level) : 0);
    array.push(this.neighborMap[WorldWind.SOUTH] ? this.neighborMap[WorldWind.SOUTH].compare(this.level) : 0);
    array.push(this.neighborMap[WorldWind.EAST] ? this.neighborMap[WorldWind.EAST].compare(this.level) : 0);
    array.push(this.neighborMap[WorldWind.WEST] ? this.neighborMap[WorldWind.WEST].compare(this.level) : 0);

    return array.join(".");
};

export default TerrainTile;
