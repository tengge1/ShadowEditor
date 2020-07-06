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
 * @exports TileMatrixSet
 */
import ArgumentError from '../error/ArgumentError';
import Logger from '../util/Logger';
import TileMatrix from '../geom/TileMatrix';


/**
 * TileMatrixSet defines a generic tiled space as defined by a geographic bounding area and an array of
 * TileMatrix objects which define the tiled space at different resolutions.
 * @param sector the geographic bounding area of this TileMatrixSet
 * @param tileMatrixList the array of TileMatrix objects forming this TileMatrixSet
 * @constructor
 */
function TileMatrixSet(sector, tileMatrixList) {
    if (!sector) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "TileMatrixSet", "constructor", "missingSector"));
    }

    if (!tileMatrixList) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "TileMatrixSet", "constructor",
                "The specified TileMatrix list is null or undefined."));
    }

    /**
     * The geographic coverage of this TileMatrixSet.
     */
    this.sector = sector;

    /**
     * An array of TileMatrix objects defining this TileMatrixSet.
     */
    this.entries = tileMatrixList;
}

/**
 * Create a TileMatrixSet based on a quad division technique given the provided initial starting conditions.
 * @param sector the geographic bounding area of the TileMatrixSet
 * @param matrixWidth the number of tiles in the x direction at the initial level
 * @param matrixHeight the number of tiles in the y direction at the initial level
 * @param tileWidth the number of pixels or points in the x direction of a tile
 * @param tileHeight the number of pixels or points in the y direction of a tile
 * @param numLevels the number of resolution levels this TileMatrixSet should contain
 * @returns {TileMatrixSet} fully configured TileMatrixSet
 */
TileMatrixSet.fromTilePyramid = function (sector, matrixWidth, matrixHeight, tileWidth, tileHeight, numLevels) {
    if (!sector) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "TileMatrixSet", "fromTilePyramid", "missingSector"));
    }

    if (matrixWidth < 1) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "TileMatrixSet", "fromTilePyramid", "invalidWidth"));
    }

    if (matrixHeight < 1) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "TileMatrixSet", "fromTilePyramid", "invalidHeight"));
    }

    if (tileWidth < 1) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "TileMatrixSet", "fromTilePyramid", "invalidWidth"));
    }

    if (tileHeight < 1) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "TileMatrixSet", "fromTilePyramid", "invalidHeight"));
    }

    if (numLevels < 1) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "TileMatrixSet", "fromTilePyramid",
                "The specified number of levels is invalid"));
    }

    var tileMatrices = [], matrix, idx;

    for (idx = 0; idx < numLevels; idx++) {
        matrix = new TileMatrix(sector, matrixWidth, matrixHeight, tileWidth, tileHeight);
        tileMatrices.push(matrix);
        matrixWidth *= 2;
        matrixHeight *= 2;
    }

    return new TileMatrixSet(sector, tileMatrices);
};

/**
 * Determines the index of the TileMatrix with the closest resolution to the provided value.
 * @param degreesPerPixel the target resolution
 * @returns {number} the index of the TileMatrix within this TileMatrixSet's entries array
 */
TileMatrixSet.prototype.indexOfMatrixNearest = function (degreesPerPixel) {
    if (degreesPerPixel <= 0) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "TileMatrixSet", "indexOfMatrixNearest",
                "The specified resolution is invalid"));
    }

    var nearestIdx = -1, nearestDelta2 = Number.MAX_VALUE, delta, delta2;

    for (var idx = 0, len = this.entries.length; idx < len; idx++) {
        delta = this.entries[idx].degreesPerPixel - degreesPerPixel;
        delta2 = delta * delta;

        if (nearestDelta2 > delta2) {
            nearestDelta2 = delta2;
            nearestIdx = idx;
        }
    }

    return nearestIdx;
};

export default TileMatrixSet;

