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
import ImageTile from '../render/ImageTile';
import Layer from '../layer/Layer';
import LevelSet from '../util/LevelSet';
import MemoryCache from '../cache/MemoryCache';
import Texture from '../render/Texture';
import Tile from '../util/Tile';
import WWMath from '../util/WWMath';
import global from '../global';
import TileCache from '../cache/TileCache';

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
 *
 */
function TiledImageLayer(sector, levelZeroDelta, numLevels, imageFormat, cachePath, tileWidth, tileHeight) {
    Layer.call(this, "Tiled Image Layer");

    this.retrievalImageFormat = imageFormat;

    /**
     * Controls how many concurrent tile requests are allowed for this layer.
     * @type {Number}
     * @default WorldWind.configuration.layerRetrievalQueueSize
     */
    this.retrievalQueueSize = WorldWind.configuration.layerRetrievalQueueSize;

    this.levels = new LevelSet(sector, levelZeroDelta, numLevels, tileWidth, tileHeight);

    this.cache = new TileCache();

    /**
     * Controls the level of detail switching for this layer. The next highest resolution level is
     * used when an image's texel size is greater than this number of pixels, up to the maximum resolution
     * of this layer.
     * @type {Number}
     * @default 1.75
     */
    this.detailControl = 3.5;

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

    this.currentTiles = [];
    this.currentTilesInvalid = true;
    this.tileCache = new MemoryCache(500000, 400000);
    this.currentRetrievals = [];
    this.absentResourceList = new AbsentResourceList(3, 50e3);

    this.pickEnabled = false;

    // Internal. Intentionally not documented.
    this.lasTtMVP = new THREE.Matrix4();
}

TiledImageLayer.prototype = Object.create(Layer.prototype);

// Intentionally not documented.
TiledImageLayer.prototype.createTile = function (sector, level, row, column) {
    return new ImageTile(sector, level, row, column, "");
};

// Documented in superclass.
TiledImageLayer.prototype.doRender = function (dc) {
    if (!dc.terrain)
        return;

    if (this.currentTilesInvalid
        || !dc.modelviewProjection.equals(this.lasTtMVP)
        || dc.globeStateKey !== this.lastGlobeStateKey) {
        this.currentTilesInvalid = false;

        this.assembleTiles(dc);
    }

    this.lasTtMVP.copy(dc.modelviewProjection);
    this.lastGlobeStateKey = dc.globeStateKey;

    if (this.currentTiles.length > 0) {
        dc.surfaceTileRenderer.renderTiles(dc, this.currentTiles, this.opacity, dc.surfaceOpacity >= 1);
        this.inCurrentFrame = true;
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

    var texture = this.cache.get(tile.level.levelNumber, tile.row, tile.column);
    if (texture) {
        tile.opacity = 1;
        this.currentTiles.push(tile);
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
    var highLatitude = WWMath.mercatorLat(75);
    if (tile.sector.minLatitude >= highLatitude || tile.sector.maxLatitude <= -highLatitude) {
        s *= 1.2;
    }
    return tile.level.isLastLevel() || !tile.mustSubdivide(dc, s);
};

// Intentionally not documented.
TiledImageLayer.prototype.isTileTextureInMemory = function (dc, tile) {
    return !!this.cache.get(tile.level.levelNumber, tile.level.row, tile.level.column);
};

/**
 * Retrieves the image for the specified tile. Subclasses should override this method in order to retrieve,
 * compute or otherwise create the image.
 * @param {DrawContext} dc The current draw context.
 * @param {ImageTile} tile The tile for which to retrieve the resource.
 * @protected
 */
TiledImageLayer.prototype.retrieveTileImage = function (dc, tile) {
    if (this.currentRetrievals.indexOf(tile.imagePath) < 0) {
        if (this.currentRetrievals.length > this.retrievalQueueSize) {
            return;
        }

        if (this.absentResourceList.isResourceAbsent(tile.imagePath)) {
            return;
        }

        var url = this.resourceUrlForTile(tile, this.retrievalImageFormat),
            image = new Image(),
            imagePath = tile.imagePath;

        if (!url) {
            this.currentTilesInvalid = true;
            return;
        }

        image.onload = () => {
            var texture = new Texture(dc.currentGlContext, image);
            this.removeFromCurrentRetrievals(imagePath);

            if (texture) {
                tile.texture = texture;
                this.cache.set(tile.level.levelNumber, tile.row, tile.column, texture);

                this.currentTilesInvalid = true;
                this.absentResourceList.unmarkResourceAbsent(imagePath);

                global.worldWindow.redraw();
            }
        };

        image.onerror = () => {
            this.removeFromCurrentRetrievals(imagePath);
            this.absentResourceList.markResourceAbsent(imagePath);
            console.warn("Image retrieval failed: " + url);
        };

        this.currentRetrievals.push(imagePath);
        image.crossOrigin = this.crossOrigin;
        image.src = url;
    }
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
    return null;
};

export default TiledImageLayer;
