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
 * @exports OrderedRenderable
 */
import Logger from '../util/Logger';
import UnsupportedOperationError from '../error/UnsupportedOperationError';


/**
 * Applications must not call this constructor. It is an interface class and is not meant to be instantiated
 * directly.
 * @alias OrderedRenderable
 * @constructor
 * @classdesc Represents an ordered renderable.
 * This is an interface class and is not meant to be instantiated directly.
 */
function OrderedRenderable() {

    /**
     * This ordered renderable's display name.
     * @type {String}
     * @default Renderable
     */
    this.displayName = "Renderable";

    /**
     * Indicates whether this ordered renderable is enabled.
     * @type {Boolean}
     * @default true
     */
    this.enabled = true;

    /**
     * This ordered renderable's distance from the eye point in meters.
     * @type {Number}
     * @default Number.MAX_VALUE
     */
    this.eyeDistance = Number.MAX_VALUE;

    /**
     * The time at which this ordered renderable was inserted into the ordered rendering list.
     * @type {Number}
     * @default 0
     */
    this.insertionTime = 0;

    throw new UnsupportedOperationError(
        Logger.logMessage(Logger.LEVEL_SEVERE, "OrderedRenderable", "constructor", "abstractInvocation"));
}

/**
 * Renders this ordered renderable.
 * @param {DrawContext} dc The current draw context.
 */
OrderedRenderable.prototype.renderOrdered = function (dc) {
    throw new UnsupportedOperationError(
        Logger.logMessage(Logger.LEVEL_SEVERE, "OrderedRenderable", "renderOrdered", "abstractInvocation"));
};

export default OrderedRenderable;
