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
 * @exports Level
 */
import Angle from '../geom/Angle';
import ArgumentError from '../error/ArgumentError';
import Location from '../geom/Location';
import Logger from '../util/Logger';


/**
 * Constructs a Level within a [LevelSet]{@link LevelSet}. Applications typically do not interact with this
 * class.
 * @alias Level
 * @constructor
 * @classdesc Represents a level in a tile pyramid.
 * @throws {ArgumentError} If either the specified tile delta or parent level set is null or undefined.
 */
function Level(levelNumber, tileDelta, parent) {
    if (!tileDelta) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Level", "constructor",
                "The specified tile delta is null or undefined"));
    }

    if (!parent) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Level", "constructor",
                "The specified parent level set is null or undefined"));
    }

    /**
     * The level's ordinal in its parent level set.
     * @type {Number}
     */
    this.levelNumber = levelNumber;

    /**
     * The geographic size of tiles within this level.
     * @type {Location}
     */
    this.tileDelta = tileDelta;

    /**
     * The level set that this level is a member of.
     * @type {LevelSet}
     */
    this.parent = parent;

    /**
     * The size of pixels or elevation cells within this level, in radians per pixel or per cell.
     * @type {Number}
     */
    this.texelSize = tileDelta.latitude * Angle.DEGREES_TO_RADIANS / parent.tileHeight;

    /**
     * The width in pixels or cells of the resource associated with tiles within this level.
     * @type {Number}
     */
    this.tileWidth = parent.tileWidth;

    /**
     * The height in pixels or cells of the resource associated with tiles within this level.
     * @type {Number}
     */
    this.tileHeight = parent.tileHeight;

    /**
     * The sector spanned by this level.
     * @type {Sector}
     */
    this.sector = parent.sector;
}

/**
 * Indicates whether this level is the lowest resolution level (level 0) within its parent's level set.
 * @returns {Boolean} true If this tile is the lowest resolution in the parent level set,
 * otherwise false.
 */
Level.prototype.isFirstLevel = function () {
    return this.parent.firstLevel() == this;
};

/**
 * Indicates whether this level is the highest resolution level within its parent's level set.
 * @returns {Boolean} true If this tile is the highest resolution in the parent level set,
 * otherwise false.
 */
Level.prototype.isLastLevel = function () {
    return this.parent.lastLevel() == this;
};

/**
 * Returns the level whose ordinal occurs immediately before this level's ordinal in the parent level set, or
 * null if this is the fist level.
 * @returns {Level} The previous level, or null if this is the first level.
 */
Level.prototype.previousLevel = function () {
    return this.parent.level(this.levelNumber - 1);
};

/**
 * Returns the level whose ordinal occurs immediately after this level's ordinal in the parent level set, or
 * null if this is the last level.
 * @returns {Level} The next level, or null if this is the last level.
 */
Level.prototype.nextLevel = function () {
    return this.parent.level(this.levelNumber + 1);
};

/**
 * Compare this level's ordinal to that of a specified level.
 * @param {Level} that The level to compare this one to.
 * @returns {Number} 0 if the two ordinals are equivalent. -1 if this level's ordinal is less than the specified
 * level's ordinal. 1 if this level's ordinal is greater than the specified level's ordinal.
 * @throws {ArgumentError} If the specified level is null or undefined.
 */
Level.prototype.compare = function (that) {
    if (!that) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Level", "compare",
                "The specified level is null or undefined"));
    }

    if (this.levelNumber < that.levelNumber)
        return -1;

    if (this.levelNumber > that.levelNumber)
        return 1;

    return 0;
};

export default Level;
