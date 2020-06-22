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
 * @exports AAIGridReader
 */
import AAIGridConstants from './AAIGridConstants';
import AAIGridMetadata from './AAIGridMetadata';
import ArgumentError from '../../error/ArgumentError';
import Logger from '../../util/Logger';
        

        /**
         * Constructs an AAIGrid reader object for the specified data source.
         * Call [getImageData]{@link AAIGridReader#getImageData} to retrieve the data as a typed array.
         * Use [metadata]{@link AAIGridReader#metadata} to access the metadata of this AAIGrid.
         * @alias AAIGridReader
         * @constructor
         * @classdesc Parses an AAIGrid and creates a typed array with its values.
         * @param {String|ArrayBuffer} dataSource The data source for the AAIGrid.
         * @throws {ArgumentError} If the specified data source is not a string or an array buffer.
         */
        var AAIGridReader = function (dataSource) {
            if (!dataSource) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "AAIGridReader", "constructor", "missingDataSource")
                );
            }

            if (typeof dataSource !== 'string' && !(dataSource instanceof ArrayBuffer)) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "AAIGridReader", "constructor", "invalidDataSource")
                );
            }

            //Internal. Contains the numerical values of the AAIGrid.
            this._values = null;

            //Documented in defineProperties below.
            this._metadata = new AAIGridMetadata();

            var dataString = this.decodeData(dataSource);
            this.parse(dataString);
        };

        Object.defineProperties(AAIGridReader.prototype, {
            /**
             * An object containing the metadata of the AAIGrid file.
             * @memberof AAIGridReader.prototype
             * @type {AAIGridMetadata}
             * @readonly
             */
            metadata: {
                get: function () {
                    return this._metadata;
                }
            }
        });

        /**
         * Returns the content of the AAIGrid as an Int16Array or Float32Array.
         *
         * @return {Int16Array|Float32Array} The content of the AAIGrid.
         */
        AAIGridReader.prototype.getImageData = function () {
            return this._values;
        };

        /**
         * Internal. Applications should not call this method.
         * Decodes an arrayBuffer as a string.
         * If the dataSource is a string, no decoding takes place, the string is immediately returned.
         *
         * @param {String|ArrayBuffer} dataSource The data source to decode.
         * @return {String} The decoded array buffer.
         * @throws {ArgumentError} If the specified data source is not a string or an array buffer.
         */
        AAIGridReader.prototype.decodeData = function (dataSource) {
            if (typeof dataSource !== 'string' && !(dataSource instanceof ArrayBuffer)) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "AAIGridReader", "decodeData", "invalidDataSource")
                );
            }

            if (typeof dataSource === 'string') {
                return dataSource;
            }

            if (typeof window.TextDecoder === 'function') {
                var decoder = new TextDecoder('utf-8');
                return decoder.decode(dataSource);
            }

            // The procedure below is for old browsers.
            var dataString = '';
            var bufferView = new Uint8Array(dataSource);

            var step = 65535; // The maximum number of arguments a function can take
            for (var i = 0, len = bufferView.length; i < len; i += step) {
                if (i + step > len) {
                    step = len - i;
                }
                dataString += String.fromCharCode.apply(null, bufferView.subarray(i, i + step));
            }

            return dataString;
        };

        /**
         * Internal. Applications should not call this method.
         * Parses the AAIGrid.
         *
         * @param {String} dataString The string to parse.
         * @throws {ArgumentError} If the specified data source is not a string.
         */
        AAIGridReader.prototype.parse = function (dataString) {
            if (typeof dataString !== 'string') {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "AAIGridReader", "parse", "invalidDataString")
                );
            }

            var lines = dataString.replace(/\r?\n|\r/g, '\n').split('\n');

            var values = [];
            var isInt = true;
            for (var i = 0, len = lines.length; i < len; i++) {
                var line = lines[i];

                if (!line) {
                    continue;
                }

                var words = line
                    .trim()
                    .split(' ')
                    .map(function (word) {
                        return word.trim();
                    })
                    .filter(function (word) {
                        return word !== '';
                    });

                if (words[0] === AAIGridConstants.N_COLS) {
                    this.metadata.ncols = +words[1];
                }
                else if (words[0] === AAIGridConstants.N_ROWS) {
                    this.metadata.nrows = +words[1];
                }
                else if (words[0] === AAIGridConstants.X_LL_CORNER) {
                    this.metadata.xllcorner = +words[1];
                }
                else if (words[0] === AAIGridConstants.Y_LL_CORNER) {
                    this.metadata.yllcorner = +words[1];
                }
                else if (words[0] === AAIGridConstants.CELL_SIZE) {
                    this.metadata.cellsize = +words[1];
                }
                else if (words[0] === AAIGridConstants.NO_DATA_VALUE) {
                    this.metadata.NODATA_value = +words[1];
                }
                else if (isFinite(+words[0])) {
                    var numbers = words.map(function (word) {
                        var number = +word;
                        if (Math.floor(number) !== number) {
                            isInt = false;
                        }
                        return number;
                    });
                    values = values.concat(numbers);
                }
            }

            this._values = isInt ? new Int16Array(values) : new Float32Array(values);
        };

        /**
         * Attempts to retrieve the AAIGrid data from the provided URL, parse the data and return an AAIGridReader
         * using the provided parserCompletionCallback.
         *
         * @param {String} url An URL pointing to an external resource.
         * @param {Function} parserCompletionCallback A function to execute when the retrieval finishes, taking two
         * arguments:
         * <ul>
         *     <li>AAIGridReader instance in case of success, otherwise <code>null</code></li>
         *     <li>XMLHttpRequest instance</li>
         * </ul>
         */
        AAIGridReader.retrieveFromUrl = function (url, parserCompletionCallback) {
            if (!url) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "AAIGridReader", "retrieveFromUrl", "missingUrl"));
            }

            if (!parserCompletionCallback) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "AAIGridReader", "retrieveFromUrl",
                        "The specified callback is null or undefined."));
            }

            var xhr = new XMLHttpRequest();

            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    parserCompletionCallback(new AAIGridReader(this.response), xhr);
                }
                else {
                    Logger.log(Logger.LEVEL_WARNING, "AAIGrid retrieval failed (" + xhr.statusText + "): " + url);
                    parserCompletionCallback(null, xhr);
                }
            };

            xhr.onerror = function () {
                Logger.log(Logger.LEVEL_WARNING, "AAIGrid retrieval failed: " + url);
                parserCompletionCallback(null, xhr);
            };

            xhr.ontimeout = function () {
                Logger.log(Logger.LEVEL_WARNING, "AAIGrid retrieval timed out: " + url);
                parserCompletionCallback(null, xhr);
            };

            xhr.open("GET", url, true);
            xhr.responseType = 'arraybuffer';
            xhr.send(null);
        };

        export default AAIGridReader;
    