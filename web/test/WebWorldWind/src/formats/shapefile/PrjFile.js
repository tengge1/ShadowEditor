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
 * @exports PrjFile
 */
import ArgumentError from '../../error/ArgumentError';
import Logger from '../../util/Logger';
import NotYetImplementedError from '../../error/NotYetImplementedError';
        

        /**
         * Constructs an object for a projection descriptor file at a specified URL.
         * Applications typically do not call this constructor.
         * It is called by {@link Shapefile} to read the projection descriptor.
         * @alias PrjFile
         * @constructor
         * @classdesc Parses a projection descriptor file.
         * @param {String} url The location of the dBase file.
         * @throws {ArgumentError} If the specified URL is null or undefined.
         */
        var PrjFile = function(url) {
            if (!url) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "DBaseFile", "constructor", "missingUrl"));
            }

            // Internal use only. Intentionally not documented.
            this._url = url;

            // Internal use only. Intentionally not documented.
            this._completionCallback = null;

            // Internal use only. Intentionally not documented.
            this._params = null;
        };

        Object.defineProperties(PrjFile.prototype, {
            /**
             * The URL as specified to this projection file's constructor.
             * @memberof PrjFile.prototype
             * @type {String}
             * @readonly
             */
            url: {
                get: function () {
                    return this._url;
                }
            },
            /**
             * The OGC coordinate system descriptor.
             * @member PrjFile.prototype
             * @type {Object}
             * @readonly
             */
            coordinateSystem: {
                get: function () {
                    if (!this.params) {
                        return null;
                    }
                    else {
                        return this.params[PrjFile.COORDINATE_SYSTEM];
                    }
                }
            },
            /**
             * The full parameter descriptor.
             * @member PrjFile.prototype
             * @type {Object}
             * @readonly
             */
            params: {
                get: function () {
                    return this._params;
                }
            }
        });

        PrjFile.prototype.load = function(completionCallback) {
            this._completionCallback = completionCallback;

            this.requestUrl(this._url);
        };
        /**
         * TODO: this common code; refactor!
         * Internal use only.
         * Request data from the URL.
         * @param {String} url The URL for the requested data.
         */
        PrjFile.prototype.requestUrl = function(url) {
            var xhr = new XMLHttpRequest();

            xhr.open("GET", url, true);
            xhr.responseType = 'arraybuffer';
            xhr.onreadystatechange = (function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var text = String.fromCharCode.apply(null, new Uint8Array(xhr.response));
                        this._params = this.decodeOGCCoordinateSystem(text);
                    }
                    else {
                        Logger.log(Logger.LEVEL_WARNING,
                            "PrjFile retrieval failed (" + xhr.statusText + "): " + url);
                    }

                    if (!!this._completionCallback) {
                        this._completionCallback(this);
                    }
                }
            }).bind(this);

            xhr.onerror = (function () {
                Logger.log(Logger.LEVEL_WARNING, "PrjFile retrieval failed: " + url);

                if (!!this._completionCallback) {
                    this._completionCallback(this);
                }
            }).bind(this);

            xhr.ontimeout = (function () {
                Logger.log(Logger.LEVEL_WARNING, "PrjFile retrieval timed out: " + url);

                if (!!this._completionCallback) {
                    this._completionCallback(this);
                }
            }).bind(this);

            xhr.send(null);
        };

        /**
         * Retrieves the coordinate system and its parameters from an OGC coordinate system encoded as well-known text. For
         * details, see to the OGC Coordinate Transform Service (CT) specification at <a
         * href="https://www.opengeospatial.org/standards/ct">https://www.opengeospatial.org/standards/ct</a>. This recognizes
         * Geographic and UTM coordinate systems.
         *
         * If an exception occurs while parsing the coordinate system text, the parameter list is left unchanged.
         *
         * @param {String} text   A string containing an OGC coordinate system in well-known text format.
         *
         * @return {Object} An object containing key/value pairs extracted from the PRJ data.
         *
         * @throws ArgumentError If text is null.
         */
        PrjFile.prototype.decodeOGCCoordinateSystem = function(text) {
            if (!text) {
                new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "PrjFile", "decodeOGCCoordinateSystem", "missingText")
                );
            }

            var params = {};

            // Convert the coordinate system text to upper case. The coordinate system regular expressions match against
            // upper case characters.
            text = text.trim().toUpperCase();

            if (PrjFile.GEOGCS_WKT_PATTERN.test(text)) {
                params[PrjFile.COORDINATE_SYSTEM] = PrjFile.COORDINATE_SYSTEM_GEOGRAPHIC;
            }
            else {
                var result = text.match(PrjFile.PROJCS_WKT_PATTERN);
                if (!!result) {
                    params[PrfFile.COORDINATE_SYSTEM] = PrjFile.COORDINATE_SYSTEM_PROJECTED;

                    throw new NotYetImplementedError(Logger.log(Logger.LEVEL_SEVERE,
                        "PrjFile implementation  for projected coordinate systems in incomplete."));
                    // TODO: Complete the implementation; the Java implementation is summarized below.
                    //String
                    //csText = csMatcher.group(1);
                    //Matcher
                    //projMatcher = UTM_NAME_WKT_PATTERN.matcher(csText);
                    //if (projMatcher.matches()) {
                    //    params.setValue(AVKey.PROJECTION_NAME, AVKey.PROJECTION_UTM);
                    //
                    //    // Parse the UTM zone from the coordinate system name.
                    //    String
                    //    s = projMatcher.group(1);
                    //    if (s != null) {
                    //        Integer
                    //        i = WWUtil.makeInteger(s.trim());
                    //        if (i != null && i >= 1 && i <= 60)
                    //            params.setValue(AVKey.PROJECTION_ZONE, i);
                    //    }
                    //
                    //    if (params.getValue(AVKey.PROJECTION_ZONE) == null)
                    //        Logging.logger().warning(Logging.getMessage("generic.ZoneIsInvalid", s));
                    //
                    //    // Parse the UTM hemisphere form the coordinate system name.
                    //    s = projMatcher.group(2);
                    //    if (s != null) {
                    //        s = s.trim();
                    //        if (s.startsWith("N") || s.startsWith("n"))
                    //            params.setValue(AVKey.PROJECTION_HEMISPHERE, AVKey.NORTH);
                    //        else if (s.startsWith("S") || s.startsWith("s"))
                    //            params.setValue(AVKey.PROJECTION_HEMISPHERE, AVKey.SOUTH);
                    //    }
                    //
                    //    if (params.getValue(AVKey.PROJECTION_HEMISPHERE) == null)
                    //        Logging.logger().warning(Logging.getMessage("generic.HemisphereIsInvalid", s));
                    //}
                    //else {
                    //    params.setValue(AVKey.PROJECTION_NAME, AVKey.PROJECTION_UNKNOWN);
                    //}
                }
                else {
                    params[PrjFile.COORDINATE_SYSTEM] = PrjFile.COORDINATE_SYSTEM_UNKNOWN;
                }
            }

            return params;
        };

        /**
         * Indicates that an unknown coordinate system was encountered.
         * @returns {Boolean} True if an unknown coordinate system was encountered.
         */
        PrjFile.prototype.isUnknownCoordinateSystem = function() {
            return !this.params || this.params.coordinateSystem === PrjFile.COORDINATE_SYSTEM_UNKNOWN;
        };

        /**
         * Indicates that a known coordinate system was encountered.
         * @returns {Boolean} True if a known coordinate system was encountered.
         */
        PrjFile.prototype.isKnownCoordinateSystem = function() {
            return !!this.params && this.params.coordinateSystem !== PrjFile.COORDINATE_SYSTEM_UNKNOWN;
        };

        /**
         * Indicates that a geographic coordinate system was encountered.
         * @returns {Boolean} True if a geographic coordinate system was encountered.
         */
        PrjFile.prototype.isGeographicCoordinateSystem = function() {
            return !!this.params && this.params.coordinateSystem === PrjFile.COORDINATE_SYSTEM_GEOGRAPHIC;
        };

        /**
         * Indicates that a projected coordinate system was encountered.
         * @returns {boolean} True if a projected coordinate system was encountered.
         */
        PrjFile.prototype.isProjectedCoordinateSystem = function() {
            return !!this.params && this.params.coordinateSystem === PrjFile.COORDINATE_SYSTEM_PROJECTED;
        };

        /** Pattern matching the geographic coordinate system keyword in an OGC coordinate system well-known text. */
        PrjFile.GEOGCS_WKT_PATTERN = new RegExp("\\{*GEOGCS[\\[\\(](.*)[\\]\\)]\\}*");

        /** Pattern matching the projected coordinate system keyword in an OGC coordinate system well-known text. */
        PrjFile.PROJCS_WKT_PATTERN = new RegExp("\\{*PROJCS[\\[\\(](.*)[\\]\\)]\\}*");

        /** Pattern matching the UTM name in an projected coordinate system's well-known text. */
        PrjFile.UTM_NAME_WKT_PATTERN = new RegExp(".*UTM.*ZONE.*?(\\d+).*?([\\w\\s]+).*?");

        /**
         * A key for a coordinate system description.
         * @type {String}
         */
        PrjFile.COORDINATE_SYSTEM = 'Coordinate_system';

        /**
         * A geographic coordinate system description.
         * @type {String}
         */
        PrjFile.COORDINATE_SYSTEM_GEOGRAPHIC = 'Coordinate_system_geographic';

        /**
         * A projected coordinate system description.
         * @type {String}
         */
        PrjFile.COORDINATE_SYSTEM_PROJECTED = 'Coordinate_system_projected';

        /**
         * An unknown coordinate system.
         * @type {String}
         */
        PrjFile.COORDINATE_SYSTEM_UNKNOWN = 'Coordinate_system_unknown';

        /**
         * The key for the name of the projection.
         * @type {String}
         */
        PrjFile.PROJECTION_NAME = 'Projection_name';

        /**
         * A UTM projection descriptor.
         * @type {String}
         */
        PrjFile.PROJECTION_UTM = 'Projection_UTM';

        /**
         * The key for the UTM projection zone.
         * @type {String}
         */
        PrjFile.PROJECTION_ZONE = 'Projection_zone';

        /**
         * The key for the hemisphere descriptor.
         * @type {String}
         */
        PrjFile.PROJECTION_HEMISPHERE = 'Projection_hemisphere';

        /**
         * The descriptor for the northern hemisphere.
         * @type {String}
         */
        PrjFile.PROJECTION_HEMISPHERE_NORTH = 'Projection_hemisphere_north';

        /**
         * The descriptor for the southern hemisphere.
         * @type {String}
         */
        PrjFile.PROJECTION_HEMISPHERE_SOUTH = 'Projection_hemisphere_south';


        export default PrjFile;
    