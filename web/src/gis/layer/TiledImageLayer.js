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
 * @exports TiledImageLayer
 */
import AbsentResourceList from '../util/AbsentResourceList';
import ArgumentError from '../error/ArgumentError';
import ImageTile from '../render/ImageTile';
import Layer from '../layer/Layer';
import LevelSet from '../util/LevelSet';
import Logger from '../util/Logger';
import Matrix from '../geom/Matrix';
import MemoryCache from '../cache/MemoryCache';
import Texture from '../render/Texture';
import Tile from '../util/Tile';
import WWUtil from '../util/WWUtil';


/**
 * Constructs a tiled image layer.
 * @alias TiledImageLayer
 * @constructor
 * @classdesc
 * Provides a layer that displays multi-resolution imagery arranged as adjacent tiles in a pyramid.
 * This is the primary WorldWind base class for displaying imagery of this type. While it may be used as a
 * stand-alone class, it is typically subclassed by classes that identify the remote image server.
 * <p>
 * While the image tiles for this class are typically drawn from a remote server such as a WMS server. The actual
 * retrieval protocol is independent of this class and encapsulated by a class implementing the {@link UrlBuilder}
 * interface and associated with instances of this class as a property.
 * <p>
 * There is no requirement that image tiles of this class be remote, they may be local or procedurally generated. For
 * such cases the subclass overrides this class' [retrieveTileImage]{@link TiledImageLayer#retrieveTileImage} method.
 * <p>
 * Layers of this type are by default not pickable. Their pick-enabled flag is initialized to false.
 *
 * @augments Layer
 * @param {Sector} sector The sector this layer covers.
 * @param {Location} levelZeroDelta The size in latitude and longitude of level zero (lowest resolution) tiles.
 * @param {Number} numLevels The number of levels to define for the layer. Each level is successively one power
 * of two higher resolution than the next lower-numbered level. (0 is the lowest resolution level, 1 is twice
 * that resolution, etc.)
 * Each level contains four times as many tiles as the next lower-numbered level, each 1/4 the geographic size.
 * @param {String} imageFormat The mime type of the image format for the layer's tiles, e.g., <em>image/png</em>.
 * @param {String} cachePath A string uniquely identifying this layer relative to other layers.
 * @param {Number} tileWidth The horizontal size of image tiles in pixels.
 * @param {Number} tileHeight The vertical size of image tiles in pixels.
 * @throws {ArgumentError} If any of the specified sector, level-zero delta, cache path or image format arguments are
 * null or undefined, or if the specified number of levels, tile width or tile height is less than 1.
 *
 */
function TiledImageLayer(sector, levelZeroDelta, numLevels, imageFormat, cachePath, tileWidth, tileHeight) {
    if (!sector) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "TiledImageLayer", "constructor", "missingSector"));
    }

    if (!levelZeroDelta) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "TiledImageLayer", "constructor",
                "The specified level-zero delta is null or undefined."));
    }

    if (!imageFormat) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "TiledImageLayer", "constructor",
                "The specified image format is null or undefined."));
    }

    if (!cachePath) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "TiledImageLayer", "constructor",
                "The specified cache path is null or undefined."));
    }

    if (!numLevels || numLevels < 1) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "TiledImageLayer", "constructor",
                "The specified number of levels is less than one."));
    }

    if (!tileWidth || !tileHeight || tileWidth < 1 || tileHeight < 1) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "TiledImageLayer", "constructor",
                "The specified tile width or height is less than one."));
    }

    Layer.call(this, "Tiled Image Layer");

    this.retrievalImageFormat = imageFormat;
    this.cachePath = cachePath;

    /**
     * Controls how many concurrent tile requests are allowed for this layer.
     * @type {Number}
     * @default WorldWind.configuration.layerRetrievalQueueSize
     */
    this.retrievalQueueSize = WorldWind.configuration.layerRetrievalQueueSize;

    this.levels = new LevelSet(sector, levelZeroDelta, numLevels, tileWidth, tileHeight);

    /**
     * Controls the level of detail switching for this layer. The next highest resolution level is
     * used when an image's texel size is greater than this number of pixels, up to the maximum resolution
     * of this layer.
     * @type {Number}
     * @default 1.75
     */
    this.detailControl = 1.75;

    /**
     * Indicates whether credentials are sent when requesting images from a different origin.
     *
     * Allowed values are anonymous and use-credentials.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-crossorigin
     * @type {string}
     * @default anonymous
     */
    this.crossOrigin = 'anonymous';

    /* Intentionally not documented.
     * Indicates the time at which this layer's imagery expire. Expired images are re-retrieved
     * when the current time exceeds the specified expiry time. If null, images do not expire.
     * @type {Date}
     */
    this.expiration = null;

    this.currentTiles = [];
    this.currentTilesInvalid = true;
    this.tileCache = new MemoryCache(500000, 400000);
    this.currentRetrievals = [];
    this.absentResourceList = new AbsentResourceList(3, 50e3);

    this.pickEnabled = false;

    // Internal. Intentionally not documented.
    this.lasTtMVP = Matrix.fromIdentity();
}

TiledImageLayer.prototype = Object.create(Layer.prototype);

// Inherited from Layer.
TiledImageLayer.prototype.refresh = function () {
    this.expiration = new Date();
    this.currentTilesInvalid = true;
};

/**
 * Initiates retrieval of this layer's level 0 images. Use
 * [isPrePopulated]{@link TiledImageLayer#isPrePopulated} to determine when the images have been retrieved
 * and associated with the level 0 tiles.
 * Pre-populating is not required. It is used to eliminate the visual effect of loading tiles incrementally,
 * but only for level 0 tiles. An application might pre-populate a layer in order to delay displaying it
 * within a time series until all the level 0 images have been retrieved and added to memory.
 * @param {WorldWindow} wwd The WorldWindow for which to pre-populate this layer.
 * @throws {ArgumentError} If the specified WorldWindow is null or undefined.
 */
TiledImageLayer.prototype.prePopulate = function (wwd) {
    if (!wwd) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "TiledImageLayer", "prePopulate", "missingWorldWindow"));
    }

    var dc = wwd.drawContext;

    if (!this.topLevelTiles || this.topLevelTiles.length === 0) {
        this.createTopLevelTiles(dc);
    }

    for (var i = 0; i < this.topLevelTiles.length; i++) {
        var tile = this.topLevelTiles[i];

        if (!this.isTileTextureInMemory(dc, tile)) {
            this.retrieveTileImage(dc, tile, true); // suppress redraw upon successful retrieval
        }
    }
};

/**
 * Initiates retrieval of this layer's tiles that are visible in the specified WorldWindow. Pre-populating is
 * not required. It is used to eliminate the visual effect of loading tiles incrementally.
 * @param {WorldWindow} wwd The WorldWindow for which to pre-populate this layer.
 * @throws {ArgumentError} If the specified WorldWindow is null or undefined.
 */
TiledImageLayer.prototype.prePopulateCurrentTiles = function (wwd) {
    if (!wwd) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "TiledImageLayer", "prePopulate", "missingWorldWindow"));
    }

    var dc = wwd.drawContext;
    this.assembleTiles(dc);

    for (var i = 0, len = this.currentTiles.length; i < len; i++) {
        var tile = this.currentTiles[i];

        if (!this.isTileTextureInMemory(dc, tile)) {
            this.retrieveTileImage(dc, tile, true); // suppress redraw upon successful retrieval
        }
    }
};

/**
 * Indicates whether this layer's level 0 tile images have been retrieved and associated with the tiles.
 * Use [prePopulate]{@link TiledImageLayer#prePopulate} to initiate retrieval of level 0 images.
 * @param {WorldWindow} wwd The WorldWindow associated with this layer.
 * @returns {Boolean} true if all level 0 images have been retrieved, otherwise false.
 * @throws {ArgumentError} If the specified WorldWindow is null or undefined.
 */
TiledImageLayer.prototype.isPrePopulated = function (wwd) {
    if (!wwd) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "TiledImageLayer", "isPrePopulated", "missingWorldWindow"));
    }

    for (var i = 0; i < this.topLevelTiles.length; i++) {
        if (!this.isTileTextureInMemory(wwd.drawContext, this.topLevelTiles[i])) {
            return false;
        }
    }

    return true;
};

// Intentionally not documented.
TiledImageLayer.prototype.createTile = function (sector, level, row, column) {
    var path = this.cachePath + "-layer/" + level.levelNumber + "/" + row + "/" + row + "_" + column + "."
        + WWUtil.suffixForMimeType(this.retrievalImageFormat);

    return new ImageTile(sector, level, row, column, path);
};

// Documented in superclass.
TiledImageLayer.prototype.doRender = function (dc) {
    if (!dc.terrain)
        return;

    if (this.currentTilesInvalid
        || !dc.modelviewProjection.equals(this.lasTtMVP)
        || dc.globeStateKey !== this.lastGlobeStateKey) {
        this.currentTilesInvalid = false;

        // Tile fading works visually only when the surface tiles are opaque, otherwise the surface flashes
        // when two tiles are drawn over the same area, even though one of them is semi-transparent.
        // So do not provide fading when the surface opacity is less than 1;
        if (dc.surfaceOpacity >= 1 && this.opacity >= 1) {
            // Fading of outgoing tiles requires determination of the those tiles. Prepare an object with all of
            // the preceding frame's tiles so that we can subsequently compare the list of newly selected tiles
            // with the previously selected tiles.
            this.previousTiles = {};
            for (var j = 0; j < this.currentTiles.length; j++) {
                this.previousTiles[this.currentTiles[j].imagePath] = this.currentTiles[j];
            }

            this.assembleTiles(dc);
            this.fadeOutgoingTiles(dc);
        } else {
            this.assembleTiles(dc);
        }

    }

    this.lasTtMVP.copy(dc.modelviewProjection);
    this.lastGlobeStateKey = dc.globeStateKey;

    if (this.currentTiles.length > 0) {
        dc.surfaceTileRenderer.renderTiles(dc, this.currentTiles, this.opacity, dc.surfaceOpacity >= 1);
        dc.frameStatistics.incrementImageTileCount(this.currentTiles.length);
        this.inCurrentFrame = true;
    }
};

TiledImageLayer.prototype.fadeOutgoingTiles = function (dc) {
    // Determine which files are outgoing and fade their disappearance. Must be called after this frame's
    // current tiles for this layer have been determined.

    var visibilityDelta = (dc.timestamp - dc.previousRedrawTimestamp) / dc.fadeTime;

    // Create a hash table of the current tiles so that we can check for tile inclusion below.
    var current = {};
    for (var i = 0; i < this.currentTiles.length; i++) {
        var tile = this.currentTiles[i];
        current[tile.imagePath] = tile;
    }

    // Determine whether the tile was in the previous frame but is not in this one.  If that's the case,
    // then the tile is outgoing and its opacity needs to be reduced.
    for (var tileImagePath in this.previousTiles) {
        if (this.previousTiles.hasOwnProperty(tileImagePath)) {
            tile = this.previousTiles[tileImagePath];

            if (tile.opacity > 0 && !current[tile.imagePath]) {
                // Compute the reduced.
                tile.opacity = Math.max(0, tile.opacity - visibilityDelta);

                // If not fully faded, add the tile to the list of current tiles and request a redraw so that
                // we'll be called continuously until all tiles have faded completely. Note that order in the
                // current tiles list is important: the non-opaque tiles must be drawn after the opaque tiles.
                if (tile.opacity > 0) {
                    this.currentTiles.push(tile);
                    this.currentTilesInvalid = true;
                    dc.redrawRequested = true;
                }
            }
        }
    }
};

// Documented in superclass.
TiledImageLayer.prototype.isLayerInView = function (dc) {
    return dc.terrain && dc.terrain.sector && dc.terrain.sector.intersects(this.levels.sector);
};

// Documented in superclass.
TiledImageLayer.prototype.createTopLevelTiles = function (dc) {
    this.topLevelTiles = [];
    Tile.createTilesForLevel(this.levels.firstLevel(), this, this.topLevelTiles);
};

// Intentionally not documented.
TiledImageLayer.prototype.assembleTiles = function (dc) {
    this.currentTiles = [];

    if (!this.topLevelTiles || this.topLevelTiles.length === 0) {
        this.createTopLevelTiles(dc);
    }

    for (var i = 0, len = this.topLevelTiles.length; i < len; i++) {
        var tile = this.topLevelTiles[i];

        tile.update(dc);

        this.currentAncestorTile = null;

        if (this.isTileVisible(dc, tile)) {
            this.addTileOrDescendants(dc, tile);
        }
    }
};

// Intentionally not documented.
TiledImageLayer.prototype.addTileOrDescendants = function (dc, tile) {
    if (this.tileMeetsRenderingCriteria(dc, tile)) {
        this.addTile(dc, tile);
        return;
    }

    var ancestorTile = null;

    try {
        if (this.isTileTextureInMemory(dc, tile) || tile.level.levelNumber === 0) {
            ancestorTile = this.currentAncestorTile;
            this.currentAncestorTile = tile;
        }

        var nextLevel = this.levels.level(tile.level.levelNumber + 1),
            subTiles = tile.subdivideToCache(nextLevel, this, this.tileCache);

        for (var i = 0, len = subTiles.length; i < len; i++) {
            var child = subTiles[i];

            child.update(dc);

            if (this.levels.sector.intersects(child.sector) && this.isTileVisible(dc, child)) {
                this.addTileOrDescendants(dc, child);
            }
        }
    } finally {
        if (ancestorTile) {
            this.currentAncestorTile = ancestorTile;
        }
    }
};

// Intentionally not documented.
TiledImageLayer.prototype.addTile = function (dc, tile) {
    tile.fallbackTile = null;

    var texture = dc.gpuResourceCache.resourceForKey(tile.imagePath);
    if (texture) {
        tile.opacity = 1;
        
        this.currentTiles.push(tile);

        // If the tile's texture has expired, cause it to be re-retrieved. Note that the current,
        // expired texture is still used until the updated one arrives.
        if (this.expiration && this.isTextureExpired(texture)) {
            this.retrieveTileImage(dc, tile);
        }

        return;
    }

    this.retrieveTileImage(dc, tile);

    if (this.currentAncestorTile) {
        if (this.isTileTextureInMemory(dc, this.currentAncestorTile)) {
            // Set up to map the ancestor tile into the current one.
            tile.fallbackTile = this.currentAncestorTile;
            tile.fallbackTile.opacity = 1;
            this.currentTiles.push(tile);
        }
    }
};

// Intentionally not documented.
TiledImageLayer.prototype.isTileVisible = function (dc, tile) {
    if (dc.globe.projectionLimits && !tile.sector.overlaps(dc.globe.projectionLimits)) {
        return false;
    }

    return tile.extent.intersectsFrustum(dc.frustumInModelCoordinates);
};

// Intentionally not documented.
TiledImageLayer.prototype.tileMeetsRenderingCriteria = function (dc, tile) {
    var s = this.detailControl;
    if (tile.sector.minLatitude >= 75 || tile.sector.maxLatitude <= -75) {
        s *= 1.2;
    }
    return tile.level.isLastLevel() || !tile.mustSubdivide(dc, s);
};

// Intentionally not documented.
TiledImageLayer.prototype.isTileTextureInMemory = function (dc, tile) {
    return dc.gpuResourceCache.containsResource(tile.imagePath);
};

// Intentionally not documented.
TiledImageLayer.prototype.isTextureExpired = function (texture) {
    return this.expiration && texture.creationTime.getTime() <= this.expiration.getTime();
};

/**
 * Retrieves the image for the specified tile. Subclasses should override this method in order to retrieve,
 * compute or otherwise create the image.
 * @param {DrawContext} dc The current draw context.
 * @param {ImageTile} tile The tile for which to retrieve the resource.
 * @param {Boolean} suppressRedraw true to suppress generation of redraw events when an image is successfully
 * retrieved, otherwise false.
 * @protected
 */
TiledImageLayer.prototype.retrieveTileImage = function (dc, tile, suppressRedraw) {
    if (this.currentRetrievals.indexOf(tile.imagePath) < 0) {
        if (this.currentRetrievals.length > this.retrievalQueueSize) {
            return;
        }

        if (this.absentResourceList.isResourceAbsent(tile.imagePath)) {
            return;
        }

        var url = this.resourceUrlForTile(tile, this.retrievalImageFormat),
            image = new Image(),
            imagePath = tile.imagePath,
            cache = dc.gpuResourceCache,
            canvas = dc.currentGlContext.canvas,
            layer = this;

        if (!url) {
            this.currentTilesInvalid = true;
            return;
        }

        image.onload = function () {
            Logger.log(Logger.LEVEL_INFO, "Image retrieval succeeded: " + url);
            var texture = layer.createTexture(dc, tile, image);
            layer.removeFromCurrentRetrievals(imagePath);

            if (texture) {
                cache.putResource(imagePath, texture, texture.size);

                layer.currentTilesInvalid = true;
                layer.absentResourceList.unmarkResourceAbsent(imagePath);

                if (!suppressRedraw) {
                    // Send an event to request a redraw.
                    var e = document.createEvent('Event');
                    e.initEvent(WorldWind.REDRAW_EVENT_TYPE, true, true);
                    canvas.dispatchEvent(e);
                }
            }
        };

        image.onerror = function () {
            layer.removeFromCurrentRetrievals(imagePath);
            layer.absentResourceList.markResourceAbsent(imagePath);
            Logger.log(Logger.LEVEL_WARNING, "Image retrieval failed: " + url);
        };

        this.currentRetrievals.push(imagePath);
        image.crossOrigin = this.crossOrigin;
        image.src = url;
    }
};

// Intentionally not documented.
TiledImageLayer.prototype.createTexture = function (dc, tile, image) {
    return new Texture(dc.currentGlContext, image);
};

// Intentionally not documented.
TiledImageLayer.prototype.removeFromCurrentRetrievals = function (imagePath) {
    var index = this.currentRetrievals.indexOf(imagePath);
    if (index > -1) {
        this.currentRetrievals.splice(index, 1);
    }
};

/**
 * Returns the URL string for the resource.
 * @param {ImageTile} tile The tile whose image is returned
 * @param {String} imageFormat The mime type of the image format desired.
 * @returns {String} The URL string, or null if the string can not be formed.
 * @protected
 */
TiledImageLayer.prototype.resourceUrlForTile = function (tile, imageFormat) {
    if (this.urlBuilder) {
        return this.urlBuilder.urlForTile(tile, imageFormat);
    } else {
        return null;
    }
};

export default TiledImageLayer;
