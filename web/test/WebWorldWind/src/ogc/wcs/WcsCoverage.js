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
 * @exports WcsCoverage
 */
import ArgumentError from '../../error/ArgumentError';
import Logger from '../../util/Logger';
import WcsUrlBuilder from '../../ogc/wcs/WcsUrlBuilder';
        

        /**
         * A simple object representation of a Web Coverage Service coverage. Provides utility methods and properties
         * for use in common WCS Coverage operations.
         * @param {String} coverageId the name or id of the coverage
         * @param {WebCoverageService} webCoverageService the WebCoverageService providing the coverage
         * @constructor
         */
        var WcsCoverage = function (coverageId, webCoverageService) {
            if (!coverageId) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WcsCoverage", "constructor", "missingId"));
            }

            if (!webCoverageService) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WcsCoverage", "constructor", "missingWebCoverageService"));
            }

            /**
             * The Web Coverage Service Coverages id or name as assigned by the providing service.
             * @type {String}
             */
            this.coverageId = coverageId;

            /**
             * The WebCoverageService responsible for managing this Coverage and Web Coverage Service.
             * @type {WebCoverageService}
             */
            this.service = webCoverageService;

            /**
             * The Sector representing the bounds of the coverage.
             * @type {Sector}
             */
            this.sector = this.service.coverageDescriptions.getSector(this.coverageId);

            /**
             * The resolution of the coverage, in degrees.
             * @type {Number}
             */
            this.resolution = this.service.coverageDescriptions.getResolution(this.coverageId);

            /**
             * A configuration object for use by TiledElevationCoverage.
             * @type {{}}
             */
            this.elevationConfig = this.createElevationConfig();
        };

        /**
         * Preferred formats used for fuzzy comparison to available formats.
         * @type {string[]}
         */
        WcsCoverage.PREFERRED_FORMATS = {
            "GeoTIFF" : true,
            "image/tiff": true,
            "TIFF": true
        };

        /**
         * The default data format.
         * @type {string}
         */
        WcsCoverage.DEFAULT_FORMAT = "image/tiff";

        // Internal use only
        WcsCoverage.prototype.createElevationConfig = function () {
            return {
                resolution: this.resolution,
                coverageSector: this.sector,
                retrievalImageFormat: this.determineFormatFromService(),
                urlBuilder: new WcsUrlBuilder(this.coverageId, this.service)
            };
        };

        // Internal use only
        WcsCoverage.prototype.determineFormatFromService = function () {
            var version = this.service.capabilities.version, availableFormats, format, coverageDescription, i, len;

            // find the service supported format identifiers
            if (version === "1.0.0") {
                // find the associated coverage description
                for (i = 0, len = this.service.coverageDescriptions.coverages.length; i < len; i++) {
                    if (this.coverageId === this.service.coverageDescriptions.coverages[i].name) {
                        availableFormats = this.service.coverageDescriptions.coverages[i].supportedFormats.formats;
                        break;
                    }
                }
            } else if (version === "2.0.1" || version === "2.0.0") {
                availableFormats = this.service.capabilities.serviceMetadata.formatsSupported;
            }

            if (!availableFormats) {
                return WcsCoverage.DEFAULT_FORMAT;
            }

            for (i = 0, len = availableFormats.length; i < len; i++) {
                if (WcsCoverage.PREFERRED_FORMATS.hasOwnProperty(availableFormats[i])) {
                    return availableFormats[i];
                }
            }

            return WcsCoverage.DEFAULT_FORMAT;
        };

        export default WcsCoverage;
    
