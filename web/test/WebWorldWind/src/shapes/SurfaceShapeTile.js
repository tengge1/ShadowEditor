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
 * @exports SurfaceShapeTile
 */
import Angle from '../geom/Angle';
import ArgumentError from '../error/ArgumentError';
import Level from '../util/Level';
import Logger from '../util/Logger';
import Sector from '../geom/Sector';
import Texture from '../render/Texture';
import TextureTile from '../render/TextureTile';


/**
 * Constructs a surface shape tile.
 * @alias SurfaceShapeTile
 * @constructor
 * @classdesc Represents a texture map containing renditions of surface shapes applied to a portion of a globe's terrain.
 * @param {Sector} sector The sector this tile covers.
 * @param {Level} level The level this tile is associated with.
 * @param {number} row This tile's row in the associated level.
 * @param {number} column This tile's column in the associated level.
 * @throws {ArgumentError} If the specified sector or level is null or undefined, the row or column arguments
 * are less than zero, or the specified image path is null, undefined or empty.
 *
 */
function SurfaceShapeTile(sector, level, row, column) {
    TextureTile.call(this, sector, level, row, column); // args are checked in the superclass' constructor

    /**
     * The surface shapes that affect this tile.
     * @type {SurfaceShape[]}
     */
    this.surfaceShapes = [];

    // Internal use only. Intentionally not documented.
    this.surfaceShapeStateKeys = [];

    // Internal use only. Intentionally not documented.
    this.asRenderedSurfaceShapeStateKeys = [];

    /**
     * The sector that bounds this tile.
     * @type {Sector}
     */
    this.sector = sector;

    /**
     * A string to use as a cache key.
     * @type {string}
     */
    this.cacheKey = null;

    // Internal use only. Intentionally not documented.
    this.pickSequence = 0;

    this.createCtx2D();
}

SurfaceShapeTile.prototype = Object.create(TextureTile.prototype);

/**
 * Clear all collected surface shapes.
 */
SurfaceShapeTile.prototype.clearShapes = function () {
    // Clear out next surface shape.
    this.surfaceShapes = [];
    this.surfaceShapeStateKeys = [];
};

/**
 * Query whether any surface shapes have been collected.
 * @returns {boolean} Returns true if there are collected surface shapes.
 */
SurfaceShapeTile.prototype.hasShapes = function () {
    return this.surfaceShapes.length > 0;
};

/**
 * Get all shapes that this tile references.
 * @returns {SurfaceShape[]} The collection of surface shapes referenced by this tile.
 */
SurfaceShapeTile.prototype.getShapes = function () {
    return this.surfaceShapes;
};

/**
 * Set the shapes this tile should reference.
 * @param {SurfaceShape[]} surfaceShapes The collection of surface shapes to be referenced by this tile.
 */
SurfaceShapeTile.prototype.setShapes = function (surfaceShapes) {
    this.surfaceShapes = surfaceShapes;
};

/**
 * The sector that bounds this tile.
 * @returns {Sector}
 */
SurfaceShapeTile.prototype.getSector = function () {
    return this.sector;
};

/**
 * Add a surface shape to this tile's collection of surface shapes.
 * @param {SurfaceShape} surfaceShape The surface shape to add.
 */
SurfaceShapeTile.prototype.addSurfaceShape = function (surfaceShape) {
    this.surfaceShapes.push(surfaceShape);
    this.surfaceShapeStateKeys.push(surfaceShape.stateKey + " lo " + surfaceShape.layer.opacity); // combine the shape state key with layer opacity
};

// Internal use only. Intentionally not documented.
SurfaceShapeTile.prototype.needsUpdate = function (dc) {
    var idx, len, surfaceShape, surfaceShapeStateKey;

    // If the number of surface shapes does not match the number of surface shapes already in the texture
    if (this.surfaceShapes.length != this.asRenderedSurfaceShapeStateKeys.length) {
        return true;
    }

    // If the state key of the shape is different from the saved state key (in order or configuration)
    for (idx = 0, len = this.surfaceShapes.length; idx < len; idx += 1) {
        if (this.surfaceShapeStateKeys[idx] !== this.asRenderedSurfaceShapeStateKeys[idx]) {
            return true;
        }
    }

    // If a texture does not already exist, ...
    if (!this.hasTexture(dc)) {
        return true;
    }

    // If you get here, the texture can be reused.
    return false;
};

/**
 * Determine whether the surface shape tile has a valid texture.
 * @param {DrawContext} dc The draw context.
 * @returns {boolean} True if the surface shape tile has a valid texture, else false.
 */
SurfaceShapeTile.prototype.hasTexture = function (dc) {
    if (dc.pickingMode) {
        return false;
    }

    if (!this.gpuCacheKey) {
        this.gpuCacheKey = this.getCacheKey();
    }

    return dc.gpuResourceCache.containsResource(this.gpuCacheKey);
};

/**
 * Redraw all of the surface shapes onto the texture for this tile.
 * @param {DrawContext} dc
 * @returns {Texture}
 */
SurfaceShapeTile.prototype.updateTexture = function (dc) {
    var gl = dc.currentGlContext,
        canvas = SurfaceShapeTile.canvas,
        ctx2D = SurfaceShapeTile.ctx2D;

    canvas.width = this.tileWidth;
    canvas.height = this.tileHeight;

    // Mapping from lat/lon to x/y:
    //  lon = minlon => x = 0
    //  lon = maxLon => x = 256
    //  lat = minLat => y = 256
    //  lat = maxLat => y = 0
    //  (assuming texture size is 256)
    // So:
    //  x = 256 / sector.dlon * (lon - minLon)
    //  y = -256 / sector.dlat * (lat - maxLat)
    var xScale = this.tileWidth / this.sector.deltaLongitude(),
        yScale = -this.tileHeight / this.sector.deltaLatitude(),
        xOffset = -this.sector.minLongitude * xScale,
        yOffset = -this.sector.maxLatitude * yScale;

    // Reset the surface shape state keys
    this.asRenderedSurfaceShapeStateKeys = [];

    for (var idx = 0, len = this.surfaceShapes.length; idx < len; idx += 1) {
        var shape = this.surfaceShapes[idx];
        this.asRenderedSurfaceShapeStateKeys.push(this.surfaceShapeStateKeys[idx]);

        shape.renderToTexture(dc, ctx2D, xScale, yScale, xOffset, yOffset);
    }

    this.gpuCacheKey = this.getCacheKey();

    var gpuResourceCache = dc.gpuResourceCache;
    var texture = new Texture(gl, canvas);
    gpuResourceCache.putResource(this.gpuCacheKey, texture, texture.size);
    gpuResourceCache.setResourceAgingFactor(this.gpuCacheKey, 10);   // age this texture 10x faster than normal resources (e.g., tiles)

    return texture;
};

/**
 * Get a key suitable for cache look-ups.
 * @returns {string}
 */
SurfaceShapeTile.prototype.getCacheKey = function () {
    if (!this.cacheKey) {
        this.cacheKey = "SurfaceShapeTile:" +
            this.tileKey + "," +
            this.pickSequence.toString();
    }

    return this.cacheKey;
};

/**
 * Create a new canvas and its 2D context on demand.
 */
SurfaceShapeTile.prototype.createCtx2D = function () {
    // If the context was previously created, ...
    if (!SurfaceShapeTile.ctx2D) {
        SurfaceShapeTile.canvas = document.createElement("canvas");
        SurfaceShapeTile.ctx2D = SurfaceShapeTile.canvas.getContext("2d");
    }
};

/*
 * For internal use only.
 * 2D canvas and context, which is created lazily on demand.
 */
SurfaceShapeTile.canvas = null;
SurfaceShapeTile.ctx2D = null;

export default SurfaceShapeTile;
