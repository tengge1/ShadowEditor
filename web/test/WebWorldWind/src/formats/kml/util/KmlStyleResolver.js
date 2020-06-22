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
import KmlFile from '../KmlFile';
import KmlStyle from '../styles/KmlStyle';
import Logger from '../../../util/Logger';
import Promise from '../../../util/Promise';
    

    /**
     * Provide functions for handling styles.
     * @exports KmlStyleResolver
     */
    var KmlStyleResolver = function (fileCache) {
        this._fileCache = fileCache;
    };

    /**
     * This function externalizes handling of the remote style based on the type of the style
     * @param styleUrl {String} Url of the style. Optional.
     * @param styleSelector {KmlStyleSelector} Style to be applied. Optional.
     * @return {Promise} Promise of the style.
     */
    KmlStyleResolver.prototype.handleRemoteStyle = function (styleUrl, styleSelector) {
        if (styleUrl) {
            return this.handleStyleUrl(styleUrl);
        } else if (styleSelector) {
            return this.handleStyleSelector(styleSelector);
        } else {
            Logger.logMessage(Logger.LEVEL_INFO, "KmlStyleResolver", "handleRemoteStyle", "Style was null.");
            return Promise.resolve(KmlStyle.default());
        }
    };

    /**
     * It receives the url of the style and load it.
     * @param styleUrl {String} Url of the style. Url contain a file and a id of the style contained there.
     * @return {Promise} Promise of the style.
     * @private
     */
    KmlStyleResolver.prototype.handleStyleUrl = function (styleUrl) {
        var self = this;
        return this.handlePromiseOfFile(styleUrl).then(function (kmlFile) {
            return kmlFile.resolveStyle(styleUrl);
        }).then(function (style) {
            if (style.isMap) {
                return style.resolve(self);
            } else {
                return Promise.resolve({normal: style, highlight: null});
            }
        });
    };

    /**
     * It either retrieves the file from the cache or build a new file from the URL.
     * @param styleUrl {String} Url used to store the information in the cache.
     * @returns {Promise} Promise of the resolved KmlFile
     * @private
     */
    KmlStyleResolver.prototype.handlePromiseOfFile = function (styleUrl) {
        var file = this._fileCache.retrieve(styleUrl);
        if (!file) {
            // This is an issue of circular dependency again.
            return new WorldWind.KmlFile({url: styleUrl}).then(function(kmlFile){
                this._fileCache.add(styleUrl, kmlFile);

                return kmlFile;
            }.bind(this));
        } else {
            return Promise.resolve(file);
        }
    };

    /**
     * It handles style selector. Either by resolving a map or by simply returning the resolved promise with style data.
     * @param styleSelector
     * @returns {Promise|*}
     * @private
     */
    KmlStyleResolver.prototype.handleStyleSelector = function (styleSelector) {
        if (styleSelector.isMap) {
            return styleSelector.resolve(this);
        } else {
            // Move this resolve to the end of the stack to prevent recursion.
            return new Promise(function(resolve){
                window.setTimeout(function () {
                    resolve({normal: styleSelector, highlight: null});
                }, 0);
            });
        }
    };

    export default KmlStyleResolver;
