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
 * @exports FramebufferTileController
 */
import ArgumentError from '../error/ArgumentError';
import FramebufferTile from '../render/FramebufferTile';
import LevelSet from '../util/LevelSet';
import Location from '../geom/Location';
import Logger from '../util/Logger';
import MemoryCache from '../cache/MemoryCache';
import Sector from '../geom/Sector';
import Tile from '../util/Tile';


/**
 * Constructs a framebuffer tile controller.
 * @alias FramebufferTileController
 * @constructor
 * @classdesc Provides access to a multi-resolution WebGL framebuffer arranged as adjacent tiles in a pyramid.
 * WorldWind shapes use this class internally to draw on the terrain surface. Applications typically do not
 * interact with this class.
 */
function FramebufferTileController() {

    /**
     * The width in pixels of framebuffers associated with this controller's tiles.
     * @type {Number}
     * @readonly
     */
    this.tileWidth = 256;

    /**
     * The height in pixels of framebuffers associated with this controller's tiles.
     * @type {Number}
     * @readonly
     */
    this.tileHeight = 256;

    /**
     * Controls the level of detail switching for this controller. The next highest resolution level is
     * used when an image's texel size is greater than this number of pixels.
     * @type {Number}
     * @default 1.75
     */
    this.detailControl = 1.75;

    // Internal. Intentionally not documented.
    this.levels = new LevelSet(Sector.FULL_SPHERE, new Location(45, 45), 16, this.tileWidth, this.tileHeight);

    // Internal. Intentionally not documented.
    this.topLevelTiles = [];

    // Internal. Intentionally not documented.
    this.currentTiles = [];

    // Internal. Intentionally not documented.
    this.currentTimestamp = null;

    // Internal. Intentionally not documented.
    this.currentGlobeStateKey = null;

    // Internal. Intentionally not documented.
    this.tileCache = new MemoryCache(500000, 400000);

    // Internal. Intentionally not documented.
    this.key = "FramebufferTileController " + ++FramebufferTileController.keyPool;
}

// Internal. Intentionally not documented.
FramebufferTileController.keyPool = 0; // source of unique ids

/**
 * Returns a set of multi-resolution [FramebufferTile]{@link FramebufferTile} instances appropriate for the
 * current draw context that overlap a specified sector.
 * @param {DrawContext} dc The current draw context.
 * @param {Sector} sector The geographic region of interest.
 * @returns {Array} The set of multi-resolution framebuffer tiles that overlap the sector.
 * @throws {ArgumentError} If the specified sector is null.
 */
FramebufferTileController.prototype.selectTiles = function (dc, sector) {
    if (!sector) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "FramebufferTileController",
            "selectTiles", "missingSector"));
    }

    // Assemble a set of global tiles appropriate for the draw context.
    this.assembleTiles(dc);

    // Collect the tiles that overlap the specified sector and mark them as selected.
    var tiles = [];
    for (var i = 0, len = this.currentTiles.length; i < len; i++) {
        var tile = this.currentTiles[i];
        if (tile.sector.overlaps(sector)) {
            tile.selected = true;
            tiles.push(tile);
        }
    }

    return tiles;
};

/**
 * Draws this multi-resolution framebuffer on the terrain surface then clears the framebuffer. This has no
 * effect if the framebuffer is unchanged since the last call to render.
 * @param {DrawContext} dc The current draw context.
 */
FramebufferTileController.prototype.render = function (dc) {
    // Exit immediately if there are no framebuffer tiles. This can happen when there ar eno surface shapes in
    // the scene, for example.
    if (this.currentTiles.length == 0) {
        return;
    }

    // Collect the tiles that have changed since the last call to render.
    var tiles = [];
    for (var i = 0, len = this.currentTiles.length; i < len; i++) {
        var tile = this.currentTiles[i];
        if (tile.selected) {
            tiles.push(tile);
        }
    }

    // Draw the changed tiles on the terrain surface.
    dc.surfaceTileRenderer.renderTiles(dc, tiles, 1);

    // Clear the changed tile's WebGL framebuffers.
    var gl = dc.currentGlContext,
        framebuffer = dc.currentFramebuffer;
    try {
        gl.clearColor(0, 0, 0, 0);
        for (i = 0, len = tiles.length; i < len; i++) {
            tile = tiles[i];
            tile.selected = false;
            tile.bindFramebuffer(dc);
            gl.clear(gl.COLOR_BUFFER_BIT);
        }
    } finally {
        dc.bindFramebuffer(framebuffer);
    }
};

// Internal. Intentionally not documented.
FramebufferTileController.prototype.assembleTiles = function (dc) {
    var timestamp = dc.timestamp,
        globeStateKey = dc.globeStateKey;

    if (this.currentTimestamp != timestamp ||
        this.currentGlobeStateKey != globeStateKey) {

        this.doAssembleTiles(dc);

        this.currentTimestamp = timestamp;
        this.currentGlobeStateKey = globeStateKey;
    }
};

// Internal. Intentionally not documented.
FramebufferTileController.prototype.doAssembleTiles = function (dc) {
    this.currentTiles = [];

    if (!dc.terrain) {
        return;
    }

    if (this.topLevelTiles.length == 0) {
        this.createTopLevelTiles();
    }

    for (var i = 0, len = this.topLevelTiles.length; i < len; i++) {
        var tile = this.topLevelTiles[i];
        tile.update(dc);

        if (this.isTileVisible(dc, tile)) {
            this.addTileOrDescendants(dc, tile);
        }
    }
};

// Internal. Intentionally not documented.
FramebufferTileController.prototype.createTile = function (sector, level, row, column) {
    var tileKey = this.key + " " + level.levelNumber + "." + row + "." + column;
    return new FramebufferTile(sector, level, row, column, tileKey);
};

// Internal. Intentionally not documented.
FramebufferTileController.prototype.createTopLevelTiles = function () {
    Tile.createTilesForLevel(this.levels.firstLevel(), this, this.topLevelTiles);
};

// Internal. Intentionally not documented.
FramebufferTileController.prototype.addTileOrDescendants = function (dc, tile) {
    if (this.tileMeetsRenderingCriteria(dc, tile)) {
        this.addTile(tile);
        return;
    }

    var subTiles = tile.subdivideToCache(tile.level.nextLevel(), this, this.tileCache);
    for (var i = 0, len = subTiles.length; i < len; i++) {
        var child = subTiles[i];
        child.update(dc);

        if (this.isTileVisible(dc, child)) {
            this.addTileOrDescendants(dc, child);
        }
    }
};

// Internal. Intentionally not documented.
FramebufferTileController.prototype.addTile = function (tile) {
    this.currentTiles.push(tile);
};

// Internal. Intentionally not documented.
FramebufferTileController.prototype.isTileVisible = function (dc, tile) {
    if (dc.globe.projectionLimits && !tile.sector.overlaps(dc.globe.projectionLimits)) {
        return false;
    }

    if (dc.pickingMode) {
        return tile.extent.intersectsFrustum(dc.pickFrustum);
    }

    return tile.extent.intersectsFrustum(dc.frustumInModelCoordinates);
};

// Internal. Intentionally not documented.
FramebufferTileController.prototype.tileMeetsRenderingCriteria = function (dc, tile) {
    var s = this.detailControl;
    if (tile.sector.minLatitude >= 75 || tile.sector.maxLatitude <= -75) {
        s *= 1.2;
    }

    return tile.level.isLastLevel() || !tile.mustSubdivide(dc, s);
};

export default FramebufferTileController;
