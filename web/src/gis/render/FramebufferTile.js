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
 * @exports FramebufferTile
 */
import ArgumentError from '../error/ArgumentError';
import FramebufferTexture from '../render/FramebufferTexture';
import Logger from '../util/Logger';
import Matrix from '../geom/Matrix';
import Rectangle from '../geom/Rectangle';
import TextureTile from '../render/TextureTile';


/**
 * Constructs a framebuffer tile.
 * @alias FramebufferTile
 * @constructor
 * @augments TextureTile
 * @classdesc Represents a WebGL framebuffer applied to a portion of a globe's terrain. The framebuffer's width
 * and height in pixels are equal to this tile's [tileWidth]{@link FramebufferTile#tileWidth} and
 * [tileHeight]{@link FramebufferTile#tileHeight}, respectively. The framebuffer can be made active by calling
 * [bindFramebuffer]{@link FramebufferTile#bindFramebuffer}. Color fragments written to this
 * tile's framebuffer can then be drawn on the terrain surface using a
 * [SurfaceTileRenderer]{@link SurfaceTileRenderer}.
 * <p>
 * This class is meant to be used internally. Applications typically do not interact with this class.
 * @param {Sector} sector The sector this tile covers.
 * @param {Level} level The level this tile is associated with.
 * @param {Number} row This tile's row in the associated level.
 * @param {Number} column This tile's column in the associated level.
 * @param {String} cacheKey A string uniquely identifying this tile relative to other tiles.
 * @throws {ArgumentError} If the specified sector or level is null or undefined, the row or column arguments
 * are less than zero, or the cache name is null, undefined or empty.
 */
function FramebufferTile(sector, level, row, column, cacheKey) {
    if (!cacheKey || cacheKey.length < 1) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "FramebufferTile", "constructor",
                "The specified cache name is null, undefined or zero length."));
    }

    TextureTile.call(this, sector, level, row, column); // args are checked in the superclass' constructor

    // Assign the cacheKey as the gpuCacheKey (inherited from TextureTile).
    this.gpuCacheKey = cacheKey;

    // Internal. Intentionally not documented.
    this.textureTransform = Matrix.fromIdentity().setToUnitYFlip();

    // Internal. Intentionally not documented.
    this.mustClear = true;
}

FramebufferTile.prototype = Object.create(TextureTile.prototype);

/**
 * Causes this tile to clear any color fragments written to its off-screen framebuffer.
 * @param dc The current draw context.
 */
FramebufferTile.prototype.clearFramebuffer = function (dc) {
    this.mustClear = true;
};

/**
 * Causes this tile's off-screen framebuffer as the current WebGL framebuffer. WebGL operations that affect the
 * framebuffer now affect this tile's framebuffer, rather than the default WebGL framebuffer.
 * Color fragments are written to this tile's WebGL texture, which can be made active by calling
 * [SurfaceTile.bind]{@link SurfaceTile#bind}.
 *
 * @param {DrawContext} dc The current draw context.
 * @returns {Boolean} true if the framebuffer was bound successfully, otherwise false.
 */
FramebufferTile.prototype.bindFramebuffer = function (dc) {
    var framebuffer = dc.gpuResourceCache.resourceForKey(this.gpuCacheKey);

    if (!framebuffer) {
        framebuffer = this.createFramebuffer(dc);
    }

    dc.bindFramebuffer(framebuffer);

    if (this.mustClear) {
        this.doClearFramebuffer(dc);
        this.mustClear = false;
    }

    return true;
};

// Internal. Intentionally not documented.
FramebufferTile.prototype.createFramebuffer = function (dc) {
    var framebuffer = new FramebufferTexture(dc.currentGlContext, this.tileWidth, this.tileHeight, false);
    dc.gpuResourceCache.putResource(this.gpuCacheKey, framebuffer, framebuffer.size);

    return framebuffer;
};

// Internal. Intentionally not documented.
FramebufferTile.prototype.doClearFramebuffer = function (dc) {
    var gl = dc.currentGlContext;
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
};

/**
 * Applies the appropriate texture transform to display this tile's WebGL texture.
 * @param {DrawContext} dc The current draw context.
 * @param {Matrix} matrix The matrix to apply the transform to.
 */
FramebufferTile.prototype.applyInternalTransform = function (dc, matrix) {
    matrix.multiplyMatrix(this.textureTransform);
};

export default FramebufferTile;
