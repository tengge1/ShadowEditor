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
 * @exports Tile
 */
import ArgumentError from '../error/ArgumentError';
import BoundingBox from '../geom/BoundingBox';
import Logger from '../util/Logger';
import Sector from '../geom/Sector';
import Vec3 from '../geom/Vec3';
import WWUtil from '../util/WWUtil';


/**
 * Constructs a tile for a specified sector, level, row and column.
 * @alias Tile
 * @constructor
 * @classdesc Represents a tile of terrain or imagery.
 * Provides a base class for texture tiles used by tiled image layers and elevation tiles used by elevation models.
 * Applications typically do not interact with this class.
 * @param {Sector} sector The sector represented by this tile.
 * @param {Level} level This tile's level in a tile pyramid.
 * @param {Number} row This tile's row in the specified level in a tile pyramid.
 * @param {Number} column This tile's column in the specified level in a tile pyramid.
 * @throws {ArgumentError} If the specified sector or level is null or undefined or the row or column arguments
 * are less than zero.
 */
function Tile(sector, level, row, column) {
    if (!sector) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Tile", "constructor", "missingSector"));
    }

    if (!level) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Tile", "constructor",
                "The specified level is null or undefined."));
    }

    if (row < 0 || column < 0) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Tile", "constructor",
                "The specified row or column is less than zero."));
    }

    /**
     * The sector represented by this tile.
     * @type {Sector}
     * @readonly
     */
    this.sector = sector;

    /**
     * The level at which this tile lies in a tile pyramid.
     * @type {Number}
     * @readonly
     */
    this.level = level;

    /**
     * The row in this tile's level in which this tile lies in a tile pyramid.
     * @type {Number}
     * @readonly
     */
    this.row = row;

    /**
     * The column in this tile's level in which this tile lies in a tile pyramid.
     * @type {Number}
     * @readonly
     */
    this.column = column;

    /**
     * The width in pixels or cells of this tile's associated resource.
     * @type {Number}
     */
    this.tileWidth = level.tileWidth;

    /**
     * The height in pixels or cells of this tile's associated resource.
     * @type {Number}
     */
    this.tileHeight = level.tileHeight;

    /**
     * The size in radians of pixels or cells of this tile's associated resource.
     * @type {Number}
     */
    this.texelSize = level.texelSize;

    /**
     * A key that uniquely identifies this tile within a level set.
     * @type {String}
     * @readonly
     */
    this.tileKey = Tile.computeTileKey(level.levelNumber, row, column);

    /**
     * The Cartesian bounding box of this tile.
     * @type {BoundingBox}
     */
    this.extent = null;

    /**
     * The tile's local origin in model coordinates. Any model coordinate points associates with the tile
     * should be relative to this point.
     * @type {Vec3}
     */
    this.referencePoint = null;

    /**
     * This tile's opacity.
     * @type {Number}
     * @default 1
     */
    this.opacity = 1;

    // Internal use only. Intentionally not documented.
    this.samplePoints = null;

    // Internal use only. Intentionally not documented.
    this.sampleElevations = null;

    // Internal use only. Intentionally not documented.
    this.updateTimestamp = null;

    // Internal use only. Intentionally not documented.
    this.updateVerticalExaggeration = null;

    // Internal use only. Intentionally not documented.
    this.updateGlobeStateKey = null;
}

/**
 * Indicates whether this tile is equivalent to a specified tile.
 * @param {Tile} that The tile to check equivalence with.
 * @returns {boolean} true if this tile is equivalent to the specified one, false if
 * they are not equivalent or the specified tile is null or undefined.
 */
Tile.prototype.isEqual = function (that) {
    if (!that)
        return false;

    if (!that.tileKey)
        return false;

    return this.tileKey == that.tileKey;
};

/**
 * Returns the size of this tile in bytes.
 * @returns {Number} The size of this tile in bytes.
 */
Tile.prototype.size = function () {
    return 4 // child pointer
        + (4 + 32) // sector
        + 4 //level pointer (the level is common to the layer or tessellator so is not included here)
        + 8 // row and column
        + 8 // texel size
        + (4 + 32) // reference point
        + (4 + 676) // bounding box
        + 8 // min and max height
        + (4 + 32) // nearest point
        + 8; // extent timestamp and vertical exaggeration
};

/**
 * Computes an approximate distance from this tile to a specified vector.
 * @param {Vec3} vector The vector to compute the distance to.
 * @returns {number} The distance between this tile and the vector.
 * @throws {ArgumentError} If the specified vector is null or undefined.
 */
Tile.prototype.distanceTo = function (vector) {
    if (!vector) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Tile", "distanceTo", "missingVector"));
    }

    var px = vector[0], py = vector[1], pz = vector[2],
        dx, dy, dz,
        points = this.samplePoints,
        distance = Number.POSITIVE_INFINITY;

    for (var i = 0, len = points.length; i < len; i += 3) {
        dx = px - points[i];
        dy = py - points[i + 1];
        dz = pz - points[i + 2];
        distance = Math.min(distance, dx * dx + dy * dy + dz * dz); // minimum squared distance
    }

    return Math.sqrt(distance);
};

/**
 * Returns the four children formed by subdividing this tile.
 * @param {Level} level The level of the children.
 * @param {TileFactory} tileFactory The tile factory to use to create the children.
 * @returns {Tile[]} An array containing the four child tiles.
 * @throws {ArgumentError} If the specified tile factory or level is null or undefined.
 */
Tile.prototype.subdivide = function (level, tileFactory) {
    if (!level) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Tile", "subdivide",
                "The specified level is null or undefined."));
    }

    if (!tileFactory) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Tile", "subdivide",
                "The specified tile factory is null or undefined."));
    }

    var latMin = this.sector.minLatitude,
        latMax = this.sector.maxLatitude,
        latMid = this.sector.centroidLatitude(),

        lonMin = this.sector.minLongitude,
        lonMax = this.sector.maxLongitude,
        lonMid = this.sector.centroidLongitude(),

        subRow,
        subCol,
        childSector,
        children = [];

    subRow = 2 * this.row;
    subCol = 2 * this.column;
    childSector = new Sector(latMin, latMid, lonMin, lonMid);
    children.push(tileFactory.createTile(childSector, level, subRow, subCol));

    subRow = 2 * this.row;
    subCol = 2 * this.column + 1;
    childSector = new Sector(latMin, latMid, lonMid, lonMax);
    children.push(tileFactory.createTile(childSector, level, subRow, subCol));

    subRow = 2 * this.row + 1;
    subCol = 2 * this.column;
    childSector = new Sector(latMid, latMax, lonMin, lonMid);
    children.push(tileFactory.createTile(childSector, level, subRow, subCol));

    subRow = 2 * this.row + 1;
    subCol = 2 * this.column + 1;
    childSector = new Sector(latMid, latMax, lonMid, lonMax);
    children.push(tileFactory.createTile(childSector, level, subRow, subCol));

    return children;
};

/**
 * Returns the four children formed by subdividing this tile, drawing those children from a specified cache
 * if they exist there.
 * @param {Level} level The level of the children.
 * @param {TileFactory} tileFactory The tile factory to use to create the children.
 * @param {MemoryCache} cache A memory cache that may contain pre-existing child tiles. If non-null, the
 * cache is checked for a child collection prior to creating that tile. If one exists
 * in the cache it is returned rather than creating a new collection of children. If a new collection is
 * created, it is added to the cache.
 * @returns {Tile[]} An array containing the four tiles.
 * @throws {ArgumentError} If the specified tile factory or level is null or undefined.
 */
Tile.prototype.subdivideToCache = function (level, tileFactory, cache) {
    if (!level) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Tile", "subdivideToCache",
                "The specified level is null or undefined."));
    }

    if (!tileFactory) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Tile", "subdivideToCache",
                "The specified tile factory is null or undefined."));
    }

    var childList = cache ? cache.entryForKey(this.tileKey) : null;
    if (!childList) {
        childList = this.subdivide(level, tileFactory);
        if (childList && cache) {
            cache.putEntry(this.tileKey, childList, 4 * childList[0].size());
        }
    }

    return childList;
};

/**
 * Indicates whether this tile should be subdivided based on the current navigation state and a specified
 * detail factor.
 * @param {DrawContext} dc The current draw context.
 * @param {Number} detailFactor The detail factor to consider.
 * @returns {boolean} true If the tile should be subdivided, otherwise false.
 */
Tile.prototype.mustSubdivide = function (dc, detailFactor) {
    // Split when the cell height (length of a texel) becomes greater than the specified fraction of the eye
    // distance. The fraction is specified as a power of 10. For example, a detail factor of 3 means split when
    // the cell height becomes more than one thousandth of the eye distance. Another way to say it is, use the
    // current tile if the cell height is less than the specified fraction of the eye distance.
    //
    // Note: It's tempting to instead compare a screen pixel size to the texel size, but that calculation is
    // window-size dependent and results in selecting an excessive number of tiles when the window is large.

    var cellSize = dc.globe.equatorialRadius * this.texelSize,
        distance = this.distanceTo(dc.eyePoint),
        pixelSize = dc.pixelSizeAtDistance(distance);

    return cellSize > Math.max(detailFactor * pixelSize, 0.5);
};

/**
 * Updates this tile's frame-dependent properties as necessary, according to the specified draw context.
 * <p>
 * The tile's frame-dependent properties, include the extent (bounding volume). These properties are dependent
 * on the tile's sector and the elevation values currently in memory, and change when those dependencies change.
 * Therefore <code>update</code> must be called once per frame before the extent and any other frame-dependent
 * properties are used. <code>update</code> intelligently determines when it is necessary to recompute these
 * properties, and does nothing if the state of all dependencies has not changed since the last call.
 * @param {DrawContext} dc The current draw context.
 */
Tile.prototype.update = function (dc) {
    var elevationTimestamp = dc.globe.elevationTimestamp(),
        verticalExaggeration = dc.verticalExaggeration,
        globeStateKey = dc.globeStateKey;

    if (this.updateTimestamp != elevationTimestamp
        || this.updateVerticalExaggeration != verticalExaggeration
        || this.updateGlobeStateKey != globeStateKey) {

        this.doUpdate(dc);
        dc.frameStatistics.incrementTileUpdateCount(1);

        // Set the geometry extent to the globe's elevation timestamp on which the geometry is based. This
        // ensures that the geometry timestamp can be reliably compared to the elevation timestamp in subsequent
        // frames.
        this.updateTimestamp = elevationTimestamp;
        this.updateVerticalExaggeration = verticalExaggeration;
        this.updateGlobeStateKey = globeStateKey;
    }
};

/**
 * Updates this tile's frame-dependent properties according to the specified draw context.
 * @param {DrawContext} dc The current draw context.
 * @protected
 */
Tile.prototype.doUpdate = function (dc) {
    // Compute the minimum and maximum world coordinate height for this tile's sector by multiplying the minimum
    // and maximum elevations by the scene's vertical exaggeration. This ensures that the elevations to used
    // build the terrain are contained by this tile's extent. Use zero if the globe as no elevations in this
    // tile's sector.
    var globe = dc.globe,
        verticalExaggeration = dc.verticalExaggeration,
        extremes = globe.minAndMaxElevationsForSector(this.sector),
        minHeight = extremes[0] * verticalExaggeration,
        maxHeight = extremes[1] * verticalExaggeration;

    if (minHeight === maxHeight) {
        minHeight = maxHeight + 10; // TODO: Determine if this is necessary.
    }

    // Compute a bounding box for this tile that contains the terrain surface in the tile's coverage area.
    if (!this.extent) {
        this.extent = new BoundingBox();
    }
    this.extent.setToSector(this.sector, globe, minHeight, maxHeight);

    // Compute the cartesian points for a 3x3 geographic grid. This grid captures sufficiently close sample
    // points in order to estimate the distance from the viewer to this tile.
    if (!this.samplePoints) {
        this.sampleElevations = new Float64Array(9);
        this.samplePoints = new Float64Array(3 * this.sampleElevations.length);
    }
    WWUtil.fillArray(this.sampleElevations, 0.5 * (minHeight + maxHeight));
    globe.computePointsForGrid(this.sector, 3, 3, this.sampleElevations, Vec3.ZERO, this.samplePoints);

    // Compute the reference point used as a local coordinate origin for the tile.
    if (!this.referencePoint) {
        this.referencePoint = new Vec3(0, 0, 0);
    }

    globe.computePointFromPosition(this.sector.centroidLatitude(), this.sector.centroidLongitude(), 0,
        this.referencePoint);
};

/**
 * Computes a key that uniquely identifies a tile within its level set.
 *
 * @param {Number} levelNumber The tile's level number in a tile pyramid.
 * @param {Number} row The tile's row in the specified level in a tile pyramid.
 * @param {Number} column The tile's column in the specified level in a tile pyramid.
 * @returns {String} A string key uniquely identifying a tile with the specified level, row, and column.
 */
Tile.computeTileKey = function (levelNumber, row, column) {
    return levelNumber + "." + row + "." + column;
};

/**
 * Computes a row number for a tile within a level given the tile's latitude.
 * @param {Number} delta The level's latitudinal tile delta in degrees.
 * @param {Number} latitude The tile's minimum latitude.
 * @returns {Number} The computed row number.
 */
Tile.computeRow = function (delta, latitude) {
    var row = Math.floor((latitude + 90) / delta);

    // If latitude is at the end of the grid, subtract 1 from the computed row to return the last row.
    if (latitude == 90) {
        row -= 1;
    }

    return row;
};

/**
 * Computes a column number for a tile within a level given the tile's longitude.
 * @param {Number} delta The level's longitudinal tile delta in degrees.
 * @param {Number} longitude The tile's minimum longitude.
 * @returns {Number} The computed column number.
 */
Tile.computeColumn = function (delta, longitude) {
    var col = Math.floor((longitude + 180) / delta);

    // If longitude is at the end of the grid, subtract 1 from the computed column to return the last column.
    if (longitude == 180) {
        col -= 1;
    }

    return col;
};

/**
 * Computes the last row number for a tile within a level given the tile's maximum latitude.
 * @param {Number} delta The level's latitudinal tile delta in degrees.
 * @param {Number} maxLatitude The tile's maximum latitude in degrees.
 * @returns {Number} The computed row number.
 */
Tile.computeLastRow = function (delta, maxLatitude) {
    var row = Math.ceil((maxLatitude + 90) / delta - 1);

    // If max latitude is in the first row, set the max row to 0.
    if (maxLatitude + 90 < delta) {
        row = 0;
    }

    return row;
};

/**
 * Computes the last column number for a tile within a level given the tile's maximum longitude.
 * @param {Number} delta The level's longitudinal tile delta in degrees.
 * @param {Number} maxLongitude The tile's maximum longitude in degrees.
 * @returns {Number} The computed column number.
 */
Tile.computeLastColumn = function (delta, maxLongitude) {
    var col = Math.ceil((maxLongitude + 180) / delta - 1);

    // If max longitude is in the first column, set the max column to 0.
    if (maxLongitude + 180 < delta) {
        col = 0;
    }

    return col;
};

/**
 * Computes a sector spanned by a tile with the specified level number, row and column.
 * @param {Level} level The tile's level number.
 * @param {Number} row The tile's row number.
 * @param {Number} column The tile's column number.
 * @returns {Sector} The sector spanned by the tile.
 * @throws {ArgumentError} If the specified level is null or undefined or the row or column are less than zero.
 */
Tile.computeSector = function (level, row, column) {
    if (!level) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Tile", "computeSector", "missingLevel"));
    }

    if (row < 0 || column < 0) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Tile", "computeSector",
                "The specified row or column is less than zero."));
    }

    var deltaLat = level.tileDelta.latitude,
        deltaLon = level.tileDelta.longitude,

        minLat = -90 + row * deltaLat,
        minLon = -180 + column * deltaLon,
        maxLat = minLat + deltaLat,
        maxLon = minLon + deltaLon;

    return new Sector(minLat, maxLat, minLon, maxLon);
};

/**
 * Creates all tiles for a specified level number.
 * @param {Level} level The level to create the tiles for.
 * @param {TileFactory} tileFactory The tile factory to use for creating tiles.
 * @param {Tile[]} result An array in which to return the results.
 * @throws {ArgumentError} If any argument is null or undefined.
 */
Tile.createTilesForLevel = function (level, tileFactory, result) {
    if (!level) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Tile", "createTilesForLevel", "missingLevel"));
    }

    if (!tileFactory) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Tile", "createTilesForLevel",
                "The specified tile factory is null or undefined"));
    }

    if (!result) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Tile", "createTilesForLevel", "missingResult"));
    }

    var deltaLat = level.tileDelta.latitude,
        deltaLon = level.tileDelta.longitude,

        sector = level.sector,
        firstRow = Tile.computeRow(deltaLat, sector.minLatitude),
        lastRow = Tile.computeRow(deltaLat, sector.maxLatitude),

        firstCol = Tile.computeColumn(deltaLon, sector.minLongitude),
        lastCol = Tile.computeColumn(deltaLon, sector.maxLongitude),

        firstRowLat = -90 + firstRow * deltaLat,
        firstRowLon = -180 + firstCol * deltaLon,

        minLat = firstRowLat,
        minLon,
        maxLat,
        maxLon;

    for (var row = firstRow; row <= lastRow; row += 1) {
        maxLat = minLat + deltaLat;
        minLon = firstRowLon;

        for (var col = firstCol; col <= lastCol; col += 1) {
            maxLon = minLon + deltaLon;
            var tileSector = new Sector(minLat, maxLat, minLon, maxLon),
                tile = tileFactory.createTile(tileSector, level, row, col);
            result.push(tile);

            minLon = maxLon;
        }

        minLat = maxLat;
    }
};

export default Tile;
