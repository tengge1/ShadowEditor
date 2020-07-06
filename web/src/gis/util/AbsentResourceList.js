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
 * @exports AbsentResourceList
 */



/**
 * Constructs an absent resource list.
 * @alias AbsentResourceList
 * @constructor
 * @classdesc Provides a collection to keep track of resources whose retrieval failed and when retrieval
 * may be tried again. Applications typically do not use this class directly.
 * @param {Number} maxTrys The number of attempts to make before the resource is marked as absent.
 * @param {Number} minCheckInterval The amount of time to wait between attempts, in milliseconds.
 * @constructor
 */
function AbsentResourceList(maxTrys, minCheckInterval) {

    /**
     * The number  of attempts to make before the resource is marked as absent.
     * @type {Number}
     */
    this.maxTrys = maxTrys;

    /**
     * The amount of time to wait before each attempt.
     * @type {Number}
     */
    this.minCheckInterval = minCheckInterval;

    /**
     * The amount of time, in milliseconds, beyond which retrieval attempts should again be allowed.
     * When this time has elapsed from the most recent failed attempt the number of trys attempted is
     * reset to 0. This prevents the resource from being permanently blocked.
     * @type {number}
     * @default 60,000 milliseconds (one minute)
     */
    this.tryAgainInterval = 60e3; // 60 seconds

    this.possiblyAbsent = {};
}

/**
 * Indicates whether a specified resource is marked as absent.
 * @param {String} resourceId The resource identifier.
 * @returns {Boolean} true if the resource is marked as absent, otherwise false.
 */
AbsentResourceList.prototype.isResourceAbsent = function (resourceId) {
    var entry = this.possiblyAbsent[resourceId];

    if (!entry) {
        return false;
    }

    if (entry.permanent) {
        return true;
    }

    var timeSinceLastMark = Date.now() - entry.timeOfLastMark;

    if (timeSinceLastMark > this.tryAgainInterval) {
        delete this.possiblyAbsent[resourceId];
        return false;
    }

    return timeSinceLastMark < this.minCheckInterval || entry.numTrys > this.maxTrys;
};

/**
 * Marks a resource attempt as having failed. This increments the number-of-tries counter and sets the time
 * of the last attempt. When this method has been called [this.maxTrys]{@link AbsentResourceList#maxTrys}
 * times the resource is marked as absent until this absent resource list's
 * [try-again-interval]{@link AbsentResourceList#tryAgainInterval} is reached.
 * @param {String} resourceId The resource identifier.
 */
AbsentResourceList.prototype.markResourceAbsent = function (resourceId) {
    var entry = this.possiblyAbsent[resourceId];

    if (!entry) {
        entry = {
            timeOfLastMark: Date.now(),
            numTrys: 0
        };
        this.possiblyAbsent[resourceId] = entry;
    }

    entry.numTrys = entry.numTrys + 1;
    entry.timeOfLastMark = Date.now();
};

/**
 * Marks a resource attempt as having failed permanently. No attempt will ever again be made to retrieve
 * the resource.
 * @param {String} resourceId The resource identifier.
 */
AbsentResourceList.prototype.markResourceAbsentPermanently = function (resourceId) {
    var entry = this.possiblyAbsent[resourceId];

    if (!entry) {
        entry = {
            timeOfLastMark: Date.now(),
            numTrys: 0
        };
        this.possiblyAbsent[resourceId] = entry;
    }

    entry.numTrys = entry.numTrys + 1;
    entry.timeOfLastMark = Date.now();
    entry.permanent = true;
};

/**
 * Removes the specified resource from this absent resource list. Call this method when retrieval attempts
 * succeed.
 * @param {String} resourceId The resource identifier.
 */
AbsentResourceList.prototype.unmarkResourceAbsent = function (resourceId) {
    var entry = this.possiblyAbsent[resourceId];

    if (entry) {
        delete this.possiblyAbsent[resourceId];
    }
};

export default AbsentResourceList;
