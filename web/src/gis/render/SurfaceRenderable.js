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
 * @exports SurfaceRenderable
 */
import Logger from '../util/Logger';
import UnsupportedOperationError from '../error/UnsupportedOperationError';


/**
 * Applications must not call this constructor. It is an interface class and is not meant to be instantiated
 * directly.
 * @alias SurfaceRenderable
 * @constructor
 * @classdesc Represents a surface renderable.
 * This is an interface class and is not meant to be instantiated directly.
 */
function SurfaceRenderable() {

    /**
     * This surface renderable's display name.
     * @type {String}
     * @default Renderable
     */
    this.displayName = "Renderable";

    /**
     * Indicates whether this surface renderable is enabled.
     * @type {Boolean}
     * @default true
     */
    this.enabled = true;

    throw new UnsupportedOperationError(
        Logger.logMessage(Logger.LEVEL_SEVERE, "SurfaceRenderable", "constructor", "abstractInvocation"));
}

/**
 * Renders this surface renderable.
 * @param {DrawContext} dc The current draw context.
 */
SurfaceRenderable.prototype.renderSurface = function (dc) {
    throw new UnsupportedOperationError(
        Logger.logMessage(Logger.LEVEL_SEVERE, "SurfaceRenderable", "renderSurface", "abstractInvocation"));
};

export default SurfaceRenderable;
