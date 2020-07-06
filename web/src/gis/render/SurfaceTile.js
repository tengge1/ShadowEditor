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
 * @exports SurfaceTile
 */
import ArgumentError from '../error/ArgumentError';
import Logger from '../util/Logger';
import Matrix from '../geom/Matrix';
import Sector from '../geom/Sector';
import UnsupportedOperationError from '../error/UnsupportedOperationError';


/**
 * Constructs a surface tile for a specified sector.
 * @alias SurfaceTile
 * @constructor
 * @classdesc Defines an abstract base class for imagery to be rendered on terrain. Applications typically
 * do not interact with this class.
 * @param {Sector} sector The sector of this surface tile.
 * @throws {ArgumentError} If the specified sector is null or undefined.
 */
function SurfaceTile(sector) {
    if (!sector) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "SurfaceTile", "constructor",
            "missingSector"));
    }

    /**
     * The sector spanned by this surface tile.
     * @type {Sector}
     */
    this.sector = sector;
}

/**
 * Causes this surface tile to be active, typically by binding the tile's texture in WebGL.
 * Subclasses must override this function.
 * @param {DrawContext} dc The current draw context.
 * @returns {Boolean} true if the resource was successfully bound, otherwise false.
 */
SurfaceTile.prototype.bind = function (dc) {
    throw new UnsupportedOperationError(
        Logger.logMessage(Logger.LEVEL_SEVERE, "SurfaceTile", "bind", "abstractInvocation"));
};

/**
 * Applies this surface tile's internal transform, typically a texture transform to align the associated
 * resource with the terrain.
 * Subclasses must override this function.
 * @param {DrawContext} dc The current draw context.
 * @param {Matrix} matrix The transform to apply.
 */
SurfaceTile.prototype.applyInternalTransform = function (dc, matrix) {
    throw new UnsupportedOperationError(
        Logger.logMessage(Logger.LEVEL_SEVERE, "SurfaceTile", "applyInternalTransform", "abstractInvocation"));
};

export default SurfaceTile;
