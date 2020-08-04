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
 * @exports MercatorTiledImageLayer
 */
import Sector from '../geom/Sector';
import TiledImageLayer from '../layer/TiledImageLayer';
import Vec2 from '../geom/Vec2';
import WWMath from '../util/WWMath';


/**
 * Constructs a layer supporting Mercator imagery.
 * @alias MercatorTiledImageLayer
 * @constructor
 * @augments TiledImageLayer
 * @classdesc Provides an abstract layer to support Mercator layers.
 *
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
 */
function MercatorTiledImageLayer(sector, levelZeroDelta, numLevels, imageFormat, cachePath,
    tileWidth, tileHeight) {
    TiledImageLayer.call(this,
        sector, levelZeroDelta, numLevels, imageFormat, cachePath, tileWidth, tileHeight);
}

MercatorTiledImageLayer.prototype = Object.create(TiledImageLayer.prototype);

// Overridden from TiledImageLayer. Computes a tile's sector and creates the tile.
// Unlike typical tiles, Tiles at the same level do not have the same sector size.
MercatorTiledImageLayer.prototype.createTile = function (sector, level, row, column) {
    var degreePerTile = 360 / (1 << level.levelNumber);
    var minLon = degreePerTile * column - 180;
    var maxLon = minLon + degreePerTile;
    var maxLat = 180 - degreePerTile * row;
    var minLat = maxLat - degreePerTile;

    sector = new Sector(minLat, maxLat, minLon, maxLon);
    return TiledImageLayer.prototype.createTile.call(this, sector, level, row, column);
};

export default MercatorTiledImageLayer;
