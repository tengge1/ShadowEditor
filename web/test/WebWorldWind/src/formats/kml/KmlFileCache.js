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

    

    // Contains all files that were already retrieved as a promises.
    /**
     * Provides Cache for Promises representing KmlFiles in current KmlDocument.
     * @exports KmlFileCache
     */
    var KmlFileCache = function () {
        this._rootFile = null;
        this._map = {};
    };

    /**
     * Retrieve relevant KmlFile from the cache representing this Document.
     * @param url {String} Url of the file to retrieve from this cache.
     * @returns {Promise|null}
     */
    KmlFileCache.prototype.retrieve = function (url) {
        if (url.indexOf('kmz;') != 0 && url.indexOf('href;') != 0 && (url.indexOf('#') == 0 || url == null || url.indexOf('http') != 0)) {
            return this._rootFile;
        } else {
            var urlNormalized = url;
            if (url.indexOf('#') != -1) {
                urlNormalized = url.substr(0, url.indexOf('#') - 1);
            }
            // Start of the URL use to store it in the map.
            if (this._map[urlNormalized]) {
                return this._map[urlNormalized];
            }
        }

        return null;
    };

    /**
     * Adds new KmlFile to the KmlDocument represented by this Cache.
     * @param url {String} Url of the file for internal mapping
     * @param filePromise {Promise} Promise of the file to be stored.
     * @param isRoot {Boolean} Whether it is the root object for the cache.
     */
    KmlFileCache.prototype.add = function (url, filePromise, isRoot) {
        if (isRoot) {
            this._rootFile = filePromise;
        } else {
            this._map[url] = filePromise;
        }
    };

    export default KmlFileCache; // Return actually object. This is singleton used throughout the whole application.
