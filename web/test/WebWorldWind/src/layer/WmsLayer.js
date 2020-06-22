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
 * @exports WmsLayer
 */
import ArgumentError from '../error/ArgumentError';
import Location from '../geom/Location';
import Logger from '../util/Logger';
import PeriodicTimeSequence from '../util/PeriodicTimeSequence';
import Sector from '../geom/Sector';
import TiledImageLayer from '../layer/TiledImageLayer';
import WmsUrlBuilder from '../util/WmsUrlBuilder';
        

        /**
         * Constructs a WMS image layer.
         * @alias WmsLayer
         * @constructor
         * @augments TiledImageLayer
         * @classdesc Displays a WMS image layer.
         * @param {{}} config Specifies configuration information for the layer. Must contain the following
         * properties:
         * <ul>
         *     <li>service: {String} The URL of the WMS server.</li>
         *     <li>layerNames: {String} A comma separated list of the names of the WMS layers to include in this layer.</li>
         *     <li>sector: {Sector} The sector spanned by this layer.</li>
         *     <li>levelZeroDelta: {Location} The level-zero tile delta to use for this layer.</li>
         *     <li>numLevels: {Number} The number of levels to make for this layer.</li>
         *     <li>format: {String} The mime type of the image format to request, e.g., image/png.</li>
         *     <li>size: {Number} The size in pixels of tiles for this layer.</li>
         *     <li>coordinateSystem (optional): {String} The coordinate system to use for this layer, e.g., EPSG:4326.</li>
         *     <li>styleNames (optional): {String} A comma separated list of the styles to include in this layer.</li>
         * </ul>
         * The function [WmsLayer.formLayerConfiguration]{@link WmsLayer#formLayerConfiguration} will create an
         * appropriate configuration object given a {@link WmsLayerCapabilities} object.
         * @param {String} timeString The time parameter passed to the WMS server when imagery is requested. May be
         * null, in which case no time parameter is passed to the server.
         * @throws {ArgumentError} If the specified configuration is null or undefined.
         */
        var WmsLayer = function (config, timeString) {
            if (!config) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmsLayer", "constructor", "No configuration specified."));
            }

            var cachePath = config.service + config.layerNames + config.styleNames;
            if (timeString) {
                cachePath = cachePath + timeString;
            }

            TiledImageLayer.call(this, config.sector, config.levelZeroDelta, config.numLevels, config.format,
                cachePath, config.size, config.size);

            this.displayName = config.title;
            this.pickEnabled = false;

            this.urlBuilder = new WmsUrlBuilder(config.service, config.layerNames, config.styleNames, config.version,
                timeString);
            if (config.coordinateSystem) {
                this.urlBuilder.crs = config.coordinateSystem;
            }

            /**
             * The time string passed to this layer's constructor.
             * @type {String}
             * @readonly
             */
            this.timeString = timeString;
        };

        WmsLayer.prototype = Object.create(TiledImageLayer.prototype);

        /**
         * Forms a configuration object for a specified {@link WmsLayerCapabilities} layer description. The
         * configuration object created and returned is suitable for passing to the WmsLayer constructor.
         * <p>
         *     This method also parses any time dimensions associated with the layer and returns them in the
         *     configuration object's "timeSequences" property. This property is a mixed array of Date objects
         *     and {@link PeriodicTimeSequence} objects describing the dimensions found.
         * @param wmsLayerCapabilities {WmsLayerCapabilities} The WMS layer capabilities to create a configuration for.
         * @returns {{}} A configuration object.
         * @throws {ArgumentError} If the specified WMS layer capabilities is null or undefined.
         */
        WmsLayer.formLayerConfiguration = function (wmsLayerCapabilities) {
            var config = {
                title: wmsLayerCapabilities.title,
                version: wmsLayerCapabilities.capability.capsDoc.version
            };

            // Determine the layer's sector.
            var bbox = wmsLayerCapabilities.geographicBoundingBox || wmsLayerCapabilities.latLonBoundingBox;
            if (bbox && bbox.westBoundLongitude) {
                config.sector = new Sector(bbox.southBoundLatitude, bbox.northBoundLatitude,
                    bbox.westBoundLongitude, bbox.eastBoundLongitude);
            } else if (bbox && bbox.minx) {
                config.sector = new Sector(bbox.miny, bbox.maxy, bbox.minx, bbox.maxx);
            } else {
                config.sector = Sector.FULL_SPHERE;
            }

            // Determine level 0 delta.
            config.levelZeroDelta = new Location(36, 36); // TODO: How to determine best delta

            // Determine number of levels.
            config.numLevels = 19; // TODO: How to determine appropriate num levels

            config.size = 256;

            // Assign layer name.
            config.layerNames = wmsLayerCapabilities.name;

            // Determine image format
            var getMapInfo = wmsLayerCapabilities.capability.request.getMap,
                formats = getMapInfo.formats;

            if (formats.indexOf("image/png") >= 0) {
                config.format = "image/png";
            } else if (formats.indexOf("image/jpeg") >= 0) {
                config.format = "image/jpeg";
            } else if (formats.indexOf("image/tiff") >= 0) {
                config.format = "image/tiff";
            } else if (formats.indexOf("image/gif") >= 0) {
                config.format = "image/gif";
            }

            // Determine the GetMap service address.
            config.service = getMapInfo.getUrl;

            // Determine the coordinate system to use.
            var coordinateSystems = wmsLayerCapabilities.crses; // WMS 1.3.0 and greater
            if (!coordinateSystems) {
                coordinateSystems = wmsLayerCapabilities.srses; // WMS 1.1.1 and lower
            }

            if (coordinateSystems) {
                if ((coordinateSystems.indexOf("EPSG:4326") >= 0) || (coordinateSystems.indexOf("epsg:4326") >= 0)) {
                    config.coordinateSystem = "EPSG:4326";
                } else if ((coordinateSystems.indexOf("CRS84") >= 0) || (coordinateSystems.indexOf("CRS:84") >= 0)) {
                    config.coordinateSystem = "CRS:84";
                }
            }

            var dimensions = WmsLayer.parseTimeDimensions(wmsLayerCapabilities);
            if (dimensions && dimensions.length > 0) {
                config.timeSequences = dimensions;
            }

            return config;
        };

        WmsLayer.parseTimeDimensions = function (wmsLayerCapabilities) {
            var dimensions = wmsLayerCapabilities.extents || wmsLayerCapabilities.dimensions,
                parsedDimensions = null;

            if (dimensions) {
                parsedDimensions = [];

                for (var i = 0; i < dimensions.length; i++) {
                    var dimension = dimensions[i];

                    if (dimension.name.toLowerCase() === "time" &&
                        (!dimension.units || dimension.units.toLowerCase() === "iso8601")) {
                        var individualDimensions = dimension.content.split(",");

                        for (var j = 0; j < individualDimensions.length; j++) {
                            var individualDimension = individualDimensions[j],
                                splitDimension = individualDimension.split("/");

                            if (splitDimension.length === 1) {
                                parsedDimensions.push(new Date(individualDimension));
                            } else if (splitDimension.length === 3) {
                                parsedDimensions.push(new PeriodicTimeSequence(individualDimension));
                            }
                        }
                    }
                }
            }

            return parsedDimensions;
        };

        export default WmsLayer;
    