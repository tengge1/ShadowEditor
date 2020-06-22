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
 * @exports WcsUrlBuilder
 */
import ArgumentError from '../../error/ArgumentError';
import Logger from '../../util/Logger';
        

        /**
         * Constructs key value pair (KVP) WCS GetCoverage urls.
         * @param coverageId the coverage id or name
         * @param webCoverageService the WebCoverageService providing the coverage
         * @constructor
         */
        var WcsUrlBuilder = function (coverageId, webCoverageService) {
            if (!coverageId) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WcsUrlBuilder", "constructor", "missingId"));
            }

            if (!webCoverageService) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WcsUrlBuilder", "constructor", "missingWebCoverageService"));
            }

            /**
             * The Coverage id or name.
             * @type {*|String}
             */
            this.coverageId = coverageId;

            /**
             * The WebCoverageService object which provided this coverage.
             * @type {*|WebCoverageService|String}
             */
            this.service = webCoverageService;
        };

        /**
         * Creates a key value pair WCS GetCoverage URL for the given Tile and format.
         * @param tile
         * @param format
         * @returns {string} the url for the coverage
         */
        WcsUrlBuilder.prototype.urlForTile = function (tile, format) {
            if (!tile) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WcsUrlBuilder", "urlForTile", "missingTile"));
            }

            if (!format) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WcsUrlBuilder", "urlForTile",
                        "The specified format is null or undefined."));
            }

            var version = this.service.capabilities.version;
            var requestUrl = this.fixGetCoverageString(this.service.capabilities.getCoverageBaseUrl());
            requestUrl += "SERVICE=WCS";
            requestUrl += "&REQUEST=GetCoverage";

            if (version === "1.0.0") {
                return this.buildUrl100(tile, format, requestUrl);
            } else if (version === "2.0.1" || version === "2.0.0") {
                return this.buildUrl20x(tile, format, requestUrl);
            }
        };

        // Internal use only
        WcsUrlBuilder.prototype.buildUrl100 = function (tile, format, requestUrl) {
            var sector = tile.sector;

            requestUrl += "&VERSION=1.0.0";
            requestUrl += "&COVERAGE=" + this.coverageId;
            requestUrl += "&CRS=EPSG:4326";
            requestUrl += "&WIDTH=" + tile.tileWidth;
            requestUrl += "&HEIGHT=" + tile.tileHeight;
            requestUrl += "&FORMAT=" + format;
            requestUrl += "&BBOX=" + sector.minLongitude + "," + sector.minLatitude + "," + sector.maxLongitude +
                "," + sector.maxLatitude;

            return encodeURI(requestUrl);
        };

        // Internal use only
        WcsUrlBuilder.prototype.buildUrl20x = function (tile, format, requestUrl) {
            var sector = tile.sector, latLabel, lonLabel, coverageDescription, scaleLabels, axisLabels;

            // find the associated coverage description
            for (var i = 0, len = this.service.coverageDescriptions.coverages.length; i < len; i++) {
                if (this.coverageId === this.service.coverageDescriptions.coverages[i].coverageId) {
                    coverageDescription = this.service.coverageDescriptions.coverages[i];
                    break;
                }
            }

            scaleLabels = coverageDescription.domainSet.rectifiedGrid.axisLabels;
            axisLabels = coverageDescription.boundedBy.envelope.axisLabels;
            if (axisLabels[0].toLowerCase().indexOf("lat") >= 0) {
                latLabel = axisLabels[0];
                lonLabel = axisLabels[1];
            } else {
                latLabel = axisLabels[1];
                lonLabel = axisLabels[0];
            }

            requestUrl += "&VERSION=" + this.service.capabilities.version;
            requestUrl += "&COVERAGEID=" + this.coverageId;
            requestUrl += "&FORMAT=" + format;
            requestUrl += "&SCALESIZE=" + scaleLabels[0] + "(" + tile.tileWidth + "),";
            requestUrl += scaleLabels[1] + "(" + tile.tileHeight + ")";
            requestUrl += "&OVERVIEWPOLICY=NEAREST"; // specific to geoserver to increase performance
            requestUrl += "&SUBSET=" + latLabel + "(" + sector.minLatitude + "," + sector.maxLatitude + ")";
            requestUrl += "&SUBSET=" + lonLabel + "(" + sector.minLongitude + "," + sector.maxLongitude + ")";

            return encodeURI(requestUrl);
        };

        // Intentionally not documented - copied from WmsUrlBuilder see issue #154
        WcsUrlBuilder.prototype.fixGetCoverageString = function (serviceAddress) {
            if (!serviceAddress) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmsUrlBuilder", "fixGetMapString",
                        "The specified service address is null or undefined."));
            }

            var index = serviceAddress.indexOf("?");

            if (index < 0) { // if string contains no question mark
                serviceAddress = serviceAddress + "?"; // add one
            } else if (index !== serviceAddress.length - 1) { // else if question mark not at end of string
                index = serviceAddress.search(/&$/);
                if (index < 0) {
                    serviceAddress = serviceAddress + "&"; // add a parameter separator
                }
            }

            return serviceAddress;
        };

        export default WcsUrlBuilder;
    
