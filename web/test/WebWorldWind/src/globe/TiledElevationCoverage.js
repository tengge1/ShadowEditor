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
 * @exports TiledElevationCoverage
 */
import AbsentResourceList from '../util/AbsentResourceList';
import Angle from '../geom/Angle';
import ElevationCoverage from '../globe/ElevationCoverage';
import ElevationImage from '../globe/ElevationImage';
import LevelSet from '../util/LevelSet';
import Location from '../geom/Location';
import Sector from '../geom/Sector';
import Tile from '../util/Tile';
import WWMath from '../util/WWMath';
import TileCache from '../cache/TileCache';
import global from '../global';

/**
 * Constructs a TiledElevationCoverage
 * @alias TiledElevationCoverage
 * @constructor
 * @classdesc Represents the elevations for an area, often but not necessarily the whole globe.
 * @param {{}} config Configuration properties for the coverage:
 * <ul>
 *     <li>coverageSector: {Sector} The sector this coverage spans.</li>
 *     <li>resolution: {Number} The resolution of the coverage, in degrees. (To compute degrees from meters, divide the number of meters by the globe's radius to obtain radians and convert the result to degrees.)</li>
 *     <li>retrievalImageFormat: {String} The mime type of the elevation data retrieved by this coverage.</li>
 *     <li>minElevation (optional): {Number} The coverage's minimum elevation in meters.</li>
 *     <li>maxElevation (optional): {Number} Te coverage's maximum elevation in meters.</li>
 * <ul>
 */
function TiledElevationCoverage(config) {
    ElevationCoverage.call(this, config.resolution);

    var firstLevelDelta = 360,
        tileWidth = 256,
        lastLevel = LevelSet.numLevelsForResolution(firstLevelDelta / tileWidth, config.resolution),
        numLevels = Math.ceil(lastLevel); // match or exceed the specified resolution

    /**
     * The sector this coverage spans.
     * @type {Sector}
     * @readonly
     */
    this.coverageSector = config.coverageSector;

    /**
     * The mime type to use when retrieving elevations.
     * @type {String}
     * @readonly
     */
    this.retrievalImageFormat = config.retrievalImageFormat;

    /**
     * This coverage's minimum elevation in meters.
     * @type {Number}
     * @default 0
     */
    this.minElevation = config.minElevation || 0;

    /**
     * This coverage's maximum elevation in meters.
     * @type {Number}
     */
    this.maxElevation = config.maxElevation || 0;

    /**
     * The {@link LevelSet} dividing this coverage's geographic domain into a multi-resolution, hierarchical
     * collection of tiles.
     * @type {LevelSet}
     * @readonly
     */
    this.levels = new LevelSet(this.coverageSector, new Location(firstLevelDelta, firstLevelDelta),
        numLevels, tileWidth, tileWidth);

    /**
     * Internal use only
     * The list of assembled tiles.
     * @type {Array}
     * @ignore
     */
    this.currentTiles = [];

    /**
     * Internal use only
     * A scratch sector for use in computations.
     * @type {Sector}
     * @ignore
     */
    this.currentSector = new Sector(0, 0, 0, 0);

    /**
     * Internal use only
     * A cache of elevation tiles.
     * @type {TileCache}
     * @ignore
     */
    this.tileCache = new TileCache();

    /**
     * Internal use only
     * A cache of elevations.
     * @type {TileCache}
     * @ignore
     */
    this.imageCache = new TileCache();

    /**
     * Controls how many concurrent tile requests are allowed for this coverage.
     * @type {Number}
     * @default WorldWind.configuration.coverageRetrievalQueueSize
     */
    this.retrievalQueueSize = WorldWind.configuration.coverageRetrievalQueueSize;

    /**
     * Internal use only
     * The list of elevation retrievals in progress.
     * @type {Array}
     * @ignore
     */
    this.currentRetrievals = [];

    /**
     * Internal use only
     * The list of resources pending acquisition.
     * @type {Array}
     * @ignore
     */
    this.absentResourceList = new AbsentResourceList(3, 5e3);
}

TiledElevationCoverage.prototype = Object.create(ElevationCoverage.prototype);

// Documented in super class
TiledElevationCoverage.prototype.minAndMaxElevationsForSector = function (sector, result) {
    var levelNumber = Math.log2(360 / (sector.maxLongitude - sector.minLongitude));
    var tileSize = 360 / 2 ** levelNumber;
    var column = (180 + sector.minLongitude) / tileSize;
    var row = (180 - sector.maxLatitude) / tileSize;

    var image = this.imageCache.get(levelNumber, row, column);
    if (!image || !image.hasData) {
        return false;
    }

    result[0] = image.minElevation;
    result[1] = image.maxElevation;

    return true;
};

// Documented in super class
TiledElevationCoverage.prototype.elevationAtLocation = function (latitude, longitude) {
    latitude = WWMath.mercatorLat(latitude);
    if (!this.coverageSector.containsLocation(latitude, longitude)) {
        return null; // location is outside the coverage's coverage
    }

    return this.pointElevationForLocation(latitude, longitude);
};

// Documented in super class
TiledElevationCoverage.prototype.elevationsForGrid = function (sector, numLat, numLon, result) {
    var gridResolution = sector.deltaLatitude() / (numLat - 1) * Angle.DEGREES_TO_RADIANS;
    var level = this.levels.levelForTexelSize(gridResolution);
    return this.pointElevationsForGrid(sector, numLat, numLon, level, result);
};

// Intentionally not documented.
TiledElevationCoverage.prototype.pointElevationForLocation = function (latitude, longitude) {
    var level = this.levels.lastLevel(),
        deltaLat = level.tileDelta.latitude,
        deltaLon = level.tileDelta.longitude,
        r = Tile.computeRow(deltaLat, latitude),
        c = Tile.computeColumn(deltaLon, longitude),
        image = null;

    for (var i = level.levelNumber; i >= 0; i--) {
        image = this.imageCache.get(i, r, c);
        if (image) {
            var elevation = image.elevationAtLocation(latitude, longitude);
            return isNaN(elevation) ? null : elevation;
        }

        r = Math.floor(r / 2);
        c = Math.floor(c / 2);
    }

    return null; // did not find a tile with an image
};

// Intentionally not documented.
TiledElevationCoverage.prototype.pointElevationsForGrid = function (sector, numLat, numLon, level, result) {
    this.assembleTiles(level, sector, true);
    if (this.currentTiles.length === 0) {
        return false; // Sector is outside the coverage's coverage area. Do not modify the results array.
    }

    // Sort from lowest resolution to highest so that higher resolutions override lower resolutions in the
    // loop below.
    this.currentTiles.sort(function (tileA, tileB) {
        return tileA.level.levelNumber - tileB.level.levelNumber;
    });

    for (var i = 0, len = this.currentTiles.length; i < len; i++) {
        var levelNumber = this.currentTiles[i].level.levelNumber;
        var row = this.currentTiles[i].row;
        var column = this.currentTiles[i].column;
        var image = this.imageCache.get(levelNumber, row, column);
        if (image) {
            image.elevationsForGrid(sector, numLat, numLon, result);
        }
    }

    return !result.includes(NaN); // true if the result array is fully populated.
};

// Internal. Bilinearly interpolates tile-image elevations.
TiledElevationCoverage.prototype.lookupPixels = function (x0, x1, y0, y1, level, retrieveTiles, result) {
    var levelNumber = level.levelNumber,
        tileWidth = level.tileWidth,
        tileHeight = level.tileHeight,
        row0 = Math.floor(y0 / tileHeight),
        row1 = Math.floor(y1 / tileHeight),
        col0 = Math.floor(x0 / tileWidth),
        col1 = Math.floor(x1 / tileWidth),
        r0c0, r0c1, r1c0, r1c1;

    if (row0 == row1 && row0 == this.cachedRow && col0 == col1 && col0 == this.cachedCol) {
        r0c0 = r0c1 = r1c0 = r1c1 = this.cachedImage; // use results from previous lookup
    } else if (row0 == row1 && col0 == col1) {
        r0c0 = this.lookupImage(levelNumber, row0, col0, retrieveTiles); // only need to lookup one image
        r0c1 = r1c0 = r1c1 = r0c0; // re-use the single image
        this.cachedRow = row0;
        this.cachedCol = col0;
        this.cachedImage = r0c0; // note the results for subsequent lookups
    } else {
        r0c0 = this.lookupImage(levelNumber, row0, col0, retrieveTiles);
        r0c1 = this.lookupImage(levelNumber, row0, col1, retrieveTiles);
        r1c0 = this.lookupImage(levelNumber, row1, col0, retrieveTiles);
        r1c1 = this.lookupImage(levelNumber, row1, col1, retrieveTiles);
    }

    if (r0c0 && r0c1 && r1c0 && r1c1) {
        result[0] = r0c0.pixel(x0 % tileWidth, y0 % tileHeight);
        result[1] = r0c1.pixel(x1 % tileWidth, y0 % tileHeight);
        result[2] = r1c0.pixel(x0 % tileWidth, y1 % tileHeight);
        result[3] = r1c1.pixel(x1 % tileWidth, y1 % tileHeight);
        return true;
    }

    return false;
};

// Internal. Intentionally not documented.
TiledElevationCoverage.prototype.lookupImage = function (levelNumber, row, column, retrieveTiles) {
    var image = this.imageCache.get(levelNumber, row, column);

    if (!image && retrieveTiles) {
        var tile = this.tileForLevel(levelNumber, row, column);
        this.retrieveTileImage(tile);
    }

    return image;
};

// Intentionally not documented.
TiledElevationCoverage.prototype.assembleTiles = function (level, sector, retrieveTiles) {
    this.currentTiles = [];

    // Intersect the requested sector with the coverage's coverage area. This avoids attempting to assemble tiles
    // that are outside the coverage area.
    this.currentSector.copy(sector);
    this.currentSector.intersection(this.coverageSector);

    if (this.currentSector.isEmpty())
        return; // sector is outside the coverage's coverage area

    var deltaLat = level.tileDelta.latitude,
        deltaLon = level.tileDelta.longitude,
        firstRow = Tile.computeRow(deltaLat, this.currentSector.minLatitude),
        lastRow = Tile.computeLastRow(deltaLat, this.currentSector.maxLatitude),
        firstCol = Tile.computeColumn(deltaLon, this.currentSector.minLongitude),
        lastCol = Tile.computeLastColumn(deltaLon, this.currentSector.maxLongitude);

    for (var row = firstRow; row <= lastRow; row++) {
        for (var col = firstCol; col <= lastCol; col++) {
            this.addTileOrAncestor(level, row, col, retrieveTiles);
        }
    }
};

// Intentionally not documented.
TiledElevationCoverage.prototype.addTileOrAncestor = function (level, row, column, retrieveTiles) {
    var tile = this.tileForLevel(level.levelNumber, row, column);

    if (this.isTileImageInMemory(tile)) {
        this.addToCurrentTiles(tile);
    } else {
        if (retrieveTiles) {
            this.retrieveTileImage(tile);
        }

        if (level.isFirstLevel()) {
            this.currentTiles.push(tile); // no ancestor tile to add
        } else {
            this.addAncestor(level, row, column, retrieveTiles);
        }
    }
};

// Intentionally not documented.
TiledElevationCoverage.prototype.addAncestor = function (level, row, column, retrieveTiles) {
    var tile = null,
        r = Math.floor(row / 2),
        c = Math.floor(column / 2);

    for (var i = level.levelNumber - 1; i >= 0; i--) {
        tile = this.tileForLevel(i, r, c);
        if (this.isTileImageInMemory(tile)) {
            this.addToCurrentTiles(tile);
            return;
        }

        r = Math.floor(r / 2);
        c = Math.floor(c / 2);
    }

    // No ancestor tiles have an in-memory image. Retrieve the ancestor tile corresponding for the first level, and
    // add it. We add the necessary tiles to provide coverage over the requested sector in order to accurately return
    // whether or not this coverage has data for the entire sector.
    this.addToCurrentTiles(tile);

    if (retrieveTiles) {
        this.retrieveTileImage(tile);
    }
};

// Intentionally not documented.
TiledElevationCoverage.prototype.addToCurrentTiles = function (tile) {
    this.currentTiles.push(tile);
};

// Intentionally not documented.
TiledElevationCoverage.prototype.tileForLevel = function (levelNumber, row, column) {
    var tile = this.tileCache.get(levelNumber, row, column);
    if (tile) {
        return tile;
    }

    var level = this.levels.level(levelNumber),
        sector = Tile.computeSector(level, row, column);

    tile = new Tile(sector, level, row, column);
    this.tileCache.set(levelNumber, row, column, tile);

    return tile;
};

// Intentionally not documented.
TiledElevationCoverage.prototype.isTileImageInMemory = function (tile) {
    return !!this.imageCache.get(tile.level.levelNumber, tile.row, tile.column);
};

// Intentionally not documented.
TiledElevationCoverage.prototype.resourceUrlForTile = function (tile) {
    return null;
};

// Intentionally not documented.
TiledElevationCoverage.prototype.retrieveTileImage = function (tile) {
    if (this.currentRetrievals.indexOf(tile.tileKey) < 0) {

        if (this.currentRetrievals.length > this.retrievalQueueSize) {
            return;
        }

        var url = this.resourceUrlForTile(tile, this.retrievalImageFormat),
            xhr = new XMLHttpRequest(),
            elevationCoverage = this;

        if (!url)
            return;

        xhr.open("GET", url + `&x=${tile.column}&y=${tile.row}&z=${tile.level.levelNumber + 1}`, true);
        xhr.responseType = 'arraybuffer';
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                elevationCoverage.removeFromCurrentRetrievals(tile.tileKey);

                var contentType = xhr.getResponseHeader("content-type");

                if (xhr.status === 200) {
                    if (contentType === elevationCoverage.retrievalImageFormat
                        || contentType === "text/plain"
                        || contentType === "application/octet-stream") {
                        elevationCoverage.loadElevationImage(tile, xhr);
                        elevationCoverage.absentResourceList.unmarkResourceAbsent(tile.tileKey);

                        global.worldWindow.redraw();
                    } else if (contentType === "text/xml") {
                        elevationCoverage.absentResourceList.markResourceAbsent(tile.tileKey);
                        console.warn("Elevations retrieval failed (" + xhr.statusText + "): " + url + ".\n "
                            + String.fromCharCode.apply(null, new Uint8Array(xhr.response)));
                    } else {
                        elevationCoverage.absentResourceList.markResourceAbsent(tile.tileKey);
                        console.warn("Elevations retrieval failed: " + url + ". " + "Unexpected content type "
                            + contentType);
                    }
                } else {
                    elevationCoverage.absentResourceList.markResourceAbsent(tile.tileKey);
                    console.warn("Elevations retrieval failed (" + xhr.statusText + "): " + url);
                }
            }
        };

        xhr.onerror = function () {
            elevationCoverage.removeFromCurrentRetrievals(tile.tileKey);
            elevationCoverage.absentResourceList.markResourceAbsent(tile.tileKey);
            console.warn("Elevations retrieval failed: " + url);
        };

        xhr.ontimeout = function () {
            elevationCoverage.removeFromCurrentRetrievals(tile.tileKey);
            elevationCoverage.absentResourceList.markResourceAbsent(tile.tileKey);
            console.warn("Elevations retrieval timed out: " + url);
        };

        xhr.send(null);

        this.currentRetrievals.push(tile.tileKey);
    }
};

// Intentionally not documented
TiledElevationCoverage.prototype.removeFromCurrentRetrievals = function (tileKey) {
    var index = this.currentRetrievals.indexOf(tileKey);
    if (index > -1) {
        this.currentRetrievals.splice(index, 1);
    }
};

// Intentionally not documented.
TiledElevationCoverage.prototype.loadElevationImage = function (tile, xhr) {
    var elevationImage = new ElevationImage(tile.sector, tile.tileWidth, tile.tileHeight),
        geoTiff;

    if (this.retrievalImageFormat === "application/bil16") {
        elevationImage.imageData = new Int16Array(xhr.response);
        elevationImage.size = elevationImage.imageData.length * 2;
    } else if (this.retrievalImageFormat === "application/bil32") {
        elevationImage.imageData = new Float32Array(xhr.response);
        elevationImage.size = elevationImage.imageData.length * 4;
    }

    if (elevationImage.imageData) {
        elevationImage.findMinAndMaxElevation();
        this.imageCache.set(tile.level.levelNumber, tile.row, tile.column, elevationImage);
        this.timestamp = Date.now();
    }
};

export default TiledElevationCoverage;
