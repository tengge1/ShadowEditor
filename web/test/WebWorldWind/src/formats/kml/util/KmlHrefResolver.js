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
import Promise from '../../../util/Promise';
import WWUtil from '../../../util/WWUtil';
    /**
     * It can handle the format in which is the URL present in the file and transform it to the URL available
     * for the relevant other concepts.
     * @param url {String} Representation of the url of the resource.
     * @param fileCache {KmlFileCache} Cache representing potential links loaded by current KML file.
     * @constructor
     * @alias KmlHrefResolver
     */
    var KmlHrefResolver = function (url, fileCache) {
        /**
         * The url to be resolved. The result will be an URL again. It is possible to load any binary data into
         * readable URL.
         */
        this._url = url;

        /**
         * File cache used to retrieve the links URL.
         */
        this._fileCache = fileCache;
    };

    /**
     * It returns relevant string. Either the url directly or retrieved from cache. It means that the cache needs
     * to resolve the URLs upfront.
     * @private
     * @return {String} Either external URL or internal URL representing the information.
     */
    KmlHrefResolver.prototype.url = function () {
        if (WWUtil.startsWith(this._url, 'http://') || WWUtil.startsWith(this._url, 'https://')) {
            return this._url;
        } else {
            var retrieved = this._fileCache.retrieve('kmz;' + this._url);
            if(!retrieved) {
                retrieved = this._fileCache.retrieve('href;' + this._url);
                // Probably relative path.
                if(!retrieved) {
                    return this._url;
                } else {
                    return retrieved;
                }
            } else {
                return retrieved;
            }
        }
    };

    export default KmlHrefResolver;
