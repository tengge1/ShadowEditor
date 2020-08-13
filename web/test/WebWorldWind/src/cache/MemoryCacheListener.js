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
 * Defines an interface for {@link MemoryCache} listeners.
 * @exports MemoryCacheListener
 * @interface MemoryCacheListener
 */
import Logger from '../util/Logger';
import UnsupportedOperationError from '../error/UnsupportedOperationError';


/**
 * @alias MemoryCacheListener
 * @constructor
 */
function MemoryCacheListener() { 
}

/**
 * Called when an entry is removed from the cache.
 * Implementers of this interface must implement this function.
 * @param {String} key The key of the entry removed.
 * @param {Object} entry The entry removed.
 */
MemoryCacheListener.prototype.entryRemoved = function (key, entry) {
    throw new UnsupportedOperationError(
        Logger.logMessage(Logger.LEVEL_SEVERE, "MemoryCacheListener", "entryRemoved", "abstractInvocation"));
};

/**
 * Called when an error occurs during entry removal.
 * Implementers of this interface must implement this function.
 * @param {Object} error The error object describing the error that occurred.
 * @param {String} key The key of the entry being removed.
 * @param {Object} entry The entry being removed.
 */
MemoryCacheListener.prototype.removalError = function (error, key, entry) {
    throw new UnsupportedOperationError(
        Logger.logMessage(Logger.LEVEL_SEVERE, "MemoryCacheListener", "removalError", "abstractInvocation"));
};

export default MemoryCacheListener;
