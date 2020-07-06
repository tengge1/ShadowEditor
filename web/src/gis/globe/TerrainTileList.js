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
 * @exports TerrainTileList
 */
import ArgumentError from '../error/ArgumentError';
import Logger from '../util/Logger';
import Sector from '../geom/Sector';


/**
 * Constructs a terrain tile list, a container for terrain tiles that also has a tessellator and a sector
 * associated with it.
 * @alias TerrainTileList
 * @constructor
 * @classdesc Represents a portion of a globe's terrain.
 * @param {Tessellator} tessellator The tessellator that created this terrain tile list.
 *
 */
function TerrainTileList(tessellator) {
    if (!tessellator) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "TerrainTileList", "TerrainTileList", "missingTessellator"));
    }
    this.tessellator = tessellator;
    this.sector = null;
    this.tileArray = [];
}

Object.defineProperties(TerrainTileList.prototype, {
    /**
     * The number of terrain tiles in this terrain tile list.
     * @memberof TerrainTileList.prototype
     * @readonly
     * @type {Number}
     */
    length: {
        get: function () {
            return this.tileArray.length;
        }
    }
});

TerrainTileList.prototype.addTile = function (tile) {
    if (!tile) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "TerrainTileList", "addTile", "missingTile"));
    }

    if (this.tileArray.indexOf(tile) == -1) {
        this.tileArray.push(tile);

        if (!this.sector) {
            this.sector = new Sector(0, 0, 0, 0);
            this.sector.copy(tile.sector);
        } else {
            this.sector.union(tile.sector);
        }
    }
};

TerrainTileList.prototype.removeAllTiles = function () {
    this.tileArray = [];
    this.sector = null;
};

export default TerrainTileList;
