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
import ArgumentError from '../error/ArgumentError';
import ElevationCoverage from '../globe/ElevationCoverage';
import ElevationImage from '../globe/ElevationImage';
import LevelSet from '../util/LevelSet';
import Location from '../geom/Location';
import Logger from '../util/Logger';
import MemoryCache from '../cache/MemoryCache';
import Sector from '../geom/Sector';
import Tile from '../util/Tile';
import WWMath from '../util/WWMath';

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
 *     <li>urlBuilder (optional): {UrlBuilder} The factory to create URLs for elevation data requests.</li>
 * <ul>
 * @throws {ArgumentError} If any required configuration parameter is null or undefined.
 */
function TiledElevationCoverage(config) {
    if (!config) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "TiledElevationCoverage", "constructor", "missingConfig"));
    }

    if (!config.coverageSector) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "TiledElevationCoverage", "constructor", "missingSector"));
    }

    if (!config.resolution) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "TiledElevationCoverage", "constructor", "missingResolution"));
    }

    if (!config.retrievalImageFormat) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "TiledElevationCoverage", "constructor", "missingImageFormat"));
    }

    ElevationCoverage.call(this, config.resolution);

    var firstLevelDelta = 45,
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
     * Indicates whether the data associated with this coverage is point data. A value of false
     * indicates that the data is area data (pixel is area).
     * @type {Boolean}
     * @default true
     */
    this.pixelIsPoint = false;

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
     * @type {MemoryCache}
     * @ignore
     */
    this.tileCache = new MemoryCache(1000000, 800000);

    /**
     * Internal use only
     * A cache of elevations.
     * @type {MemoryCache}
     * @ignore
     */
    this.imageCache = new MemoryCache(10000000, 8000000);

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

    /**
     * Internal use only
     * The factory to create URLs for data requests. This property is typically set in the constructor of child
     * classes. See {@link WcsUrlBuilder} for a concrete example.
     * @type {UrlBuilder}
     * @ignore
     */
    // this.urlBuilder = new UrlBuilder() || null;
    this.urlBuilder = config.urlBuilder || null;
    this.urlBuilder.serviceAddress = 'http://localhost:2020/api/Map/Elev';
}

TiledElevationCoverage.prototype = Object.create(ElevationCoverage.prototype);

// Documented in super class
TiledElevationCoverage.prototype.minAndMaxElevationsForSector = function (sector, result) {
    if (!sector) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "TiledElevationCoverage", "minAndMaxElevationsForSector", "missingSector"));
    }

    if (!result) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "TiledElevationCoverage", "minAndMaxElevationsForSector", "missingResult"));
    }

    var level = this.levels.levelForTexelSize(sector.deltaLatitude() * Angle.DEGREES_TO_RADIANS / 64);
    this.assembleTiles(level, sector, false);

    if (this.currentTiles.length === 0) {
        return false; // Sector is outside the coverage's coverage area. Don't modify the result.
    }

    var hasCompleteCoverage = true;

    for (var i = 0, len = this.currentTiles.length; i < len; i++) {
        var image = this.imageCache.entryForKey(this.currentTiles[i].tileKey);
        if (image && image.hasData) {
            var imageMin = image.minElevation;
            if (result[0] > imageMin) {
                result[0] = imageMin;
            }

            var imageMax = image.maxElevation;
            if (result[1] < imageMax) {
                result[1] = imageMax;
            }
        }

        if (!image || !image.hasData || image.hasMissingData) {
            hasCompleteCoverage = false;
        }
    }

    return hasCompleteCoverage;
};

// Documented in super class
TiledElevationCoverage.prototype.elevationAtLocation = function (latitude, longitude) {
    if (!this.coverageSector.containsLocation(latitude, longitude)) {
        return null; // location is outside the coverage's coverage
    }

    return this.pointElevationForLocation(latitude, longitude);
};

// Documented in super class
TiledElevationCoverage.prototype.elevationsForGrid = function (sector, numLat, numLon, result) {
    if (!sector) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "TiledElevationCoverage", "elevationsForGrid", "missingSector"));
    }

    if (!numLat || !numLon || numLat < 1 || numLon < 1) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "TiledElevationCoverage", "elevationsForGrid",
                "The specified number of latitudinal or longitudinal positions is less than one."));
    }

    var gridResolution = sector.deltaLatitude() / (numLat - 1) * Angle.DEGREES_TO_RADIANS;
    var level = this.levels.levelForTexelSize(gridResolution);
    if (this.pixelIsPoint) {
        return this.pointElevationsForGrid(sector, numLat, numLon, level, result);
    } else {
        return this.areaElevationsForGrid(sector, numLat, numLon, level, result);
    }
};

// Intentionally not documented.
TiledElevationCoverage.prototype.pointElevationForLocation = function (latitude, longitude) {
    var level = this.levels.lastLevel(),
        deltaLat = level.tileDelta.latitude,
        deltaLon = level.tileDelta.longitude,
        r = Tile.computeRow(deltaLat, latitude),
        c = Tile.computeColumn(deltaLon, longitude),
        tileKey,
        image = null;

    for (var i = level.levelNumber; i >= 0; i--) {
        tileKey = Tile.computeTileKey(i, r, c);
        image = this.imageCache.entryForKey(tileKey);
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
        var image = this.imageCache.entryForKey(this.currentTiles[i].tileKey);
        if (image) {
            image.elevationsForGrid(sector, numLat, numLon, result);
        }
    }

    return !result.includes(NaN); // true if the result array is fully populated.
};

// Internal. Returns elevations for a grid assuming pixel-is-area.
TiledElevationCoverage.prototype.areaElevationsForGrid = function (sector, numLat, numLon, level, result) {
    var minLat = sector.minLatitude,
        maxLat = sector.maxLatitude,
        minLon = sector.minLongitude,
        maxLon = sector.maxLongitude,
        deltaLat = sector.deltaLatitude() / (numLat > 1 ? numLat - 1 : 1),
        deltaLon = sector.deltaLongitude() / (numLon > 1 ? numLon - 1 : 1),
        lat, lon, s, t,
        latIndex, lonIndex, resultIndex = 0;

    for (latIndex = 0, lat = minLat; latIndex < numLat; latIndex += 1, lat += deltaLat) {
        if (latIndex === numLat - 1) {
            lat = maxLat; // explicitly set the last lat to the max latitude ensure alignment
        }

        for (lonIndex = 0, lon = minLon; lonIndex < numLon; lonIndex += 1, lon += deltaLon) {
            if (lonIndex === numLon - 1) {
                lon = maxLon; // explicitly set the last lon to the max longitude ensure alignment
            }

            if (isNaN(result[resultIndex])) {
                if (this.coverageSector.containsLocation(lat, lon)) { // ignore locations outside of the model
                    s = (lon + 180) / 360;
                    t = (lat + 90) / 180;
                    this.areaElevationForCoord(s, t, level.levelNumber, result, resultIndex);
                }
            }

            resultIndex++;
        }
    }

    return !result.includes(NaN); // true if the result array is fully populated.
};

// Internal. Returns an elevation for a location assuming pixel-is-area.
TiledElevationCoverage.prototype.areaElevationForCoord = function (s, t, levelNumber, result, resultIndex) {
    var level, levelWidth, levelHeight,
        tMin, tMax,
        vMin, vMax,
        u, v,
        x0, x1, y0, y1,
        xf, yf,
        retrieveTiles,
        pixels = new Float64Array(4);

    for (var i = levelNumber; i >= 0; i--) {
        level = this.levels.level(i);
        levelWidth = Math.round(level.tileWidth * 360 / level.tileDelta.longitude);
        levelHeight = Math.round(level.tileHeight * 180 / level.tileDelta.latitude);
        tMin = 1 / (2 * levelHeight);
        tMax = 1 - tMin;
        vMin = 0;
        vMax = levelHeight - 1;
        u = levelWidth * WWMath.fract(s); // wrap the horizontal coordinate
        v = levelHeight * WWMath.clamp(t, tMin, tMax); // clamp the vertical coordinate to the level edge
        x0 = WWMath.mod(Math.floor(u - 0.5), levelWidth);
        x1 = WWMath.mod(x0 + 1, levelWidth);
        y0 = WWMath.clamp(Math.floor(v - 0.5), vMin, vMax);
        y1 = WWMath.clamp(y0 + 1, vMin, vMax);
        xf = WWMath.fract(u - 0.5);
        yf = WWMath.fract(v - 0.5);
        retrieveTiles = i == levelNumber || i == 0;

        if (this.lookupPixels(x0, x1, y0, y1, level, retrieveTiles, pixels)) {
            if (ElevationImage.isNoData(pixels[0], pixels[1], pixels[2], pixels[3])) {
                return false;
            }
            else {
                result[resultIndex] = (1 - xf) * (1 - yf) * pixels[0] +
                    xf * (1 - yf) * pixels[1] +
                    (1 - xf) * yf * pixels[2] +
                    xf * yf * pixels[3];
                return true;
            }
        }
    }

    return false;
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
    var tileKey = Tile.computeTileKey(levelNumber, row, column),
        image = this.imageCache.entryForKey(tileKey);

    if (image == null && retrieveTiles) {
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
    var tileKey = Tile.computeTileKey(levelNumber, row, column),
        tile = this.tileCache.entryForKey(tileKey);

    if (tile) {
        return tile;
    }

    var level = this.levels.level(levelNumber),
        sector = Tile.computeSector(level, row, column);

    tile = new Tile(sector, level, row, column);
    this.tileCache.putEntry(tileKey, tile, tile.size());

    return tile;
};

// Intentionally not documented.
TiledElevationCoverage.prototype.isTileImageInMemory = function (tile) {
    return this.imageCache.containsKey(tile.tileKey);
};

// Intentionally not documented.
TiledElevationCoverage.prototype.resourceUrlForTile = function (tile) {
    return this.urlBuilder.urlForTile(tile, this.retrievalImageFormat);
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
                        Logger.log(Logger.LEVEL_INFO, "Elevations retrieval succeeded: " + url);
                        elevationCoverage.loadElevationImage(tile, xhr);
                        elevationCoverage.absentResourceList.unmarkResourceAbsent(tile.tileKey);

                        // Send an event to request a redraw.
                        var e = document.createEvent('Event');
                        e.initEvent(WorldWind.REDRAW_EVENT_TYPE, true, true);
                        window.dispatchEvent(e);
                    } else if (contentType === "text/xml") {
                        elevationCoverage.absentResourceList.markResourceAbsent(tile.tileKey);
                        Logger.log(Logger.LEVEL_WARNING,
                            "Elevations retrieval failed (" + xhr.statusText + "): " + url + ".\n "
                            + String.fromCharCode.apply(null, new Uint8Array(xhr.response)));
                    } else {
                        elevationCoverage.absentResourceList.markResourceAbsent(tile.tileKey);
                        Logger.log(Logger.LEVEL_WARNING,
                            "Elevations retrieval failed: " + url + ". " + "Unexpected content type "
                            + contentType);
                    }
                } else {
                    elevationCoverage.absentResourceList.markResourceAbsent(tile.tileKey);
                    Logger.log(Logger.LEVEL_WARNING,
                        "Elevations retrieval failed (" + xhr.statusText + "): " + url);
                }
            }
        };

        xhr.onerror = function () {
            elevationCoverage.removeFromCurrentRetrievals(tile.tileKey);
            elevationCoverage.absentResourceList.markResourceAbsent(tile.tileKey);
            Logger.log(Logger.LEVEL_WARNING, "Elevations retrieval failed: " + url);
        };

        xhr.ontimeout = function () {
            elevationCoverage.removeFromCurrentRetrievals(tile.tileKey);
            elevationCoverage.absentResourceList.markResourceAbsent(tile.tileKey);
            Logger.log(Logger.LEVEL_WARNING, "Elevations retrieval timed out: " + url);
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
        this.imageCache.putEntry(tile.tileKey, elevationImage, elevationImage.size);
        this.timestamp = Date.now();
    }
};

export default TiledElevationCoverage;
