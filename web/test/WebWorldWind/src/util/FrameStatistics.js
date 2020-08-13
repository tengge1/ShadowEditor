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
 * @exports FrameStatistics
 */



/**
 * Constructs a performance statistics instance. This is performed internally by the {@link WorldWindow}.
 * Applications do not construct instances of this class.
 * @alias FrameStatistics
 * @constructor
 * @classdesc Captures performance statistics.
 */
function FrameStatistics() {

    // Internal: intentionally not documented
    this.frameCount = 0;

    // Internal: intentionally not documented
    this.frameTimeCumulative = 0;

    // Internal: intentionally not documented
    this.frameTimeBase = 0;

    // Internal: intentionally not documented
    this.frameTimeExtremes = [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY];

    /**
     * The number of milliseconds required to render the most recent frame.
     * @type {Number}
     */
    this.frameTime = 0;

    /**
     * The number of milliseconds spent tessellating the terrain during the most recent frame.
     * @type {Number}
     */
    this.tessellationTime = 0;

    /**
     * The number of milliseconds spent rendering the active layers during the most recent frame.
     * @type {Number}
     */
    this.layerRenderingTime = 0;

    /**
     * The number of milliseconds spent rendering ordered renderables during the most recent frame.
     * @type {Number}
     */
    this.orderedRenderingTime = 0;

    /**
     * The number of terrain tiles in the most recent frame.
     * @type {Number}
     */
    this.terrainTileCount = 0;

    /**
     * The number of image tiles in the most recent frame.
     * @type {Number}
     */
    this.imageTileCount = 0;

    /**
     * The number of terrain tile renderings. Since terrain tiles are generally rendered more than once per
     * frame, this count will be greater than the number of terrain tiles created for the frame.
     * @type {Number}
     */
    this.renderedTileCount = 0;

    /**
     * The number of calls to [Tile.update()]{@link Tile#update} during the most recent frame.
     * @type {Number}
     */
    this.tileUpdateCount = 0;

    /**
     * The number of texture bind calls during the most recent frame.
     * @type {Number}
     */
    this.textureLoadCount = 0;

    /**
     * The number of WebGL VBO loads during the most recent frame.
     * @type {Number}
     */
    this.vboLoadCount = 0;

    /**
     * The average frame time over the most recent two seconds.
     * @type {Number}
     */
    this.frameTimeAverage = 0;

    /**
     * The average frame rate over the most recent two seconds.
     * @type {Number}
     */
    this.frameRateAverage = 0;

    /**
     * The minimum frame time over the most recent two seconds.
     * @type {Number}
     */
    this.frameTimeMin = 0;

    /**
     * The maximum frame time over the most recent two seconds.
     * @type {Number}
     */
    this.frameTimeMax = 0;
}

/**
 * Initializes this frame statistics with initial values.
 */
FrameStatistics.prototype.beginFrame = function () {
    this.frameTime = Date.now();
    this.tessellationTime = 0;
    this.layerRenderingTime = 0;
    this.orderedRenderingTime = 0;
    this.terrainTileCount = 0;
    this.imageTileCount = 0;
    this.renderedTileCount = 0;
    this.tileUpdateCount = 0;
    this.textureLoadCount = 0;
    this.vboLoadCount = 0;

    ++this.frameCount;
};

/**
 * Computes the statistics for the most recent frame.
 */
FrameStatistics.prototype.endFrame = function () {
    var now = Date.now();
    this.frameTime = now - this.frameTime;
    this.frameTimeCumulative += this.frameTime;
    this.frameTimeExtremes[0] = Math.min(this.frameTimeExtremes[0], this.frameTime);
    this.frameTimeExtremes[1] = Math.max(this.frameTimeExtremes[1], this.frameTime);

    // Compute averages every 2 seconds.
    if (now - this.frameTimeBase > 2000) {
        this.frameTimeAverage = this.frameTimeCumulative / this.frameCount;
        this.frameRateAverage = 1000 * this.frameCount / (now - this.frameTimeBase);
        this.frameTimeMin = this.frameTimeExtremes[0];
        this.frameTimeMax = this.frameTimeExtremes[1];
        this.frameCount = 0;
        this.frameTimeCumulative = 0;
        this.frameTimeBase = now;
        this.frameTimeExtremes = [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY];
        //console.log(this.frameTimeAverage.toString() + ", " + this.frameRateAverage.toString());
    }
};

/**
 * Increments the rendered tile count.
 * @param {Number} tileCount The amount to increment the counter.
 */
FrameStatistics.prototype.incrementRenderedTileCount = function (tileCount) {
    this.renderedTileCount += tileCount;
};

/**
 * Sets the terrain tile count.
 * @param {Number} tileCount The amount to set the counter to.
 */
FrameStatistics.prototype.setTerrainTileCount = function (tileCount) {
    this.terrainTileCount = tileCount;
};

/**
 * Increments the image tile count.
 * @param {Number} tileCount The amount to increment the counter.
 */
FrameStatistics.prototype.incrementImageTileCount = function (tileCount) {
    this.imageTileCount = tileCount;
};

/**
 * Increments the tile update count.
 * @param {Number} count The amount to increment the counter.
 */
FrameStatistics.prototype.incrementTileUpdateCount = function (count) {
    this.tileUpdateCount += count;
};

/**
 * Increments the texture load count.
 * @param {Number} count The amount to increment the counter.
 */
FrameStatistics.prototype.incrementTextureLoadCount = function (count) {
    this.textureLoadCount += count;
};

/**
 * Increments the VBO load count.
 * @param {Number} count The amount to increment the counter.
 */
FrameStatistics.prototype.incrementVboLoadCount = function (count) {
    this.vboLoadCount += count;
};

export default FrameStatistics;
