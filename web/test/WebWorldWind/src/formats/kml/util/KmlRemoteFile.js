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
import ArgumentError from '../../../error/ArgumentError';
import Logger from '../../../util/Logger';
import Promise from '../../../util/Promise';
    
    /**
     * Creates representation of KmlRemoteFile. In order to load an object it is necessary to run get function on created object.
     * @param options {Object}
     * @param options.ajax {Boolean} If we should use plain AJAX
     * @param options.zip {Boolean} If we are downloading kmz
     * @param options.responseType {String} Optional responseType applied in specific circumstances for the kmz
     * @constructor
     * @alias KmlRemoteFile
     */
    var KmlRemoteFile = function(options) {
        if(!options.ajax && !options.zip) {
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "RemoteDocument", "constructor",
                    "Invalid option for retrieval specified. Use either ajax or zip option.")
            );
        }

        this.options = options;
    };

	/**
     * It retrieves the current file. Usually it is used only once, but it can be used multiple times.
     * @returns {Promise}
     */
    KmlRemoteFile.prototype.get = function() {
        var options = this.options;
        if(options.ajax) {
            return this.ajax(options.url, options);
        } else if(options.zip) {
            options.responseType = options.responseType || "arraybuffer";
            return this.ajax(options.url, options);
        } else {
            // This branch should never happen.
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "RemoteDocument", "constructor",
                    "Invalid option for retrieval specified. Use either ajax or zip option.")
            );
        }
    };

    /**
     * Retrieves the data from remote server.
     * @param url {String} Url to query for data
     * @param options {Object}
     * @param options.responseType {String} If set, rewrites default responseType.
     * @returns {Promise} Promise of the data.
     */
    KmlRemoteFile.prototype.ajax = function(url, options) {
        // Return promise.
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();

            xhr.open("GET", url, true);
            if (options.responseType) {
                xhr.responseType = options.responseType;
            }
            xhr.onreadystatechange = (function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var text;
                        if(options.responseType == 'arraybuffer') {
                            text = this.response;
                        } else {
                            text = this.responseText;
                        }
                        resolve({text: text, headers: xhr.getAllResponseHeaders()});
                    }
                    else {
                        Logger.log(Logger.LEVEL_WARNING,
                            "KmlFile retrieval failed (" + xhr.statusText + "): " + url);
                    }
                }
            });

            xhr.onerror = (function () {
                Logger.log(Logger.LEVEL_WARNING, "Remote file retrieval failed: " + url);

                reject();
            }).bind(this);

            xhr.ontimeout = (function () {
                Logger.log(Logger.LEVEL_WARNING, "Remote file retrieval timed out: " + url);

                reject();
            }).bind(this);

            xhr.send(null);
        });
    };

    export default KmlRemoteFile;
