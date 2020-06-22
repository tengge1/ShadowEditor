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
 * @exports WmtsLayer
 */
import AbsentResourceList from '../util/AbsentResourceList';
import ArgumentError from '../error/ArgumentError';
import Logger from '../util/Logger';
import Matrix from '../geom/Matrix';
import Sector from '../geom/Sector';
import Layer from '../layer/Layer';
import MemoryCache from '../cache/MemoryCache';
import Texture from '../render/Texture';
import WmsUrlBuilder from '../util/WmsUrlBuilder';
import WmtsLayerTile from '../layer/WmtsLayerTile';
import WWMath from '../util/WWMath';
import WWUtil from '../util/WWUtil';
        

        // TODO: Test Mercator layers.
        // TODO: Support tile matrix limits.
        // TODO: Extensibility for other projections.
        // TODO: Finish parsing capabilities document (ServiceIdentification and ServiceProvider).
        // TODO: Time dimensions.

        /**
         * Constructs a WMTS image layer.
         * @alias WmtsLayer
         * @constructor
         * @augments Layer
         * @classdesc Displays a WMTS image layer.
         * @param {{}} config Specifies configuration information for the layer. Must contain the following
         * properties:
         * <ul>
         *     <li>identifier: {String} The layer name.</li>
         *     <li>service: {String} The URL of the WMTS server</li>
         *     <li>format: {String} The mime type of the image format to request, e.g., image/png.</li>
         *     <li>tileMatrixSet: {{}} The tile matrix set to use for this layer.</li>
         *     <li>style: {String} The style to use for this layer.</li>
         *     <li>title: {String} The display name for this layer.</li>
         * </ul>
         * @param {String} timeString The time parameter passed to the WMTS server when imagery is requested. May be
         * null, in which case no time parameter is passed to the server.
         * @throws {ArgumentError} If the specified layer capabilities reference is null or undefined.
         */
        var WmtsLayer = function (config, timeString) {
            if (!config) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsLayer", "constructor",
                        "No layer configuration specified."));
            }

            Layer.call(this, "WMTS Layer");

            /**
             * The WMTS layer identifier of this layer.
             * @type {String}
             * @readonly
             */
            this.layerIdentifier = config.identifier;

            /**
             * The style identifier specified to this layer's constructor.
             * @type {String}
             * @readonly
             */
            this.styleIdentifier = config.style;

            /**
             * The time string passed to this layer's constructor.
             * @type {String}
             * @readonly
             */
            this.timeString = timeString;

            /**
             * The image format specified to this layer's constructor.
             * @type {String}
             * @readonly
             */
            this.imageFormat = config.format;

            /**
             * The url specified to this layer's constructor.
             * @type {String}
             * @readonly
             */
            this.resourceUrl = config.resourceUrl;
            this.serviceUrl = config.service;

            /**
             * The tileMatrixSet specified to this layer's constructor.
             * @type {String}
             * @readonly
             */
            this.tileMatrixSet = config.tileMatrixSet;

            // Internal. Intentionally not documented.
            this.lasTtMVP = Matrix.fromIdentity();


            // Determine the layer's sector if possible. Mandatory for EPSG:4326 tile matrix sets. (Others compute
            // it from tile Matrix Set metadata.)
            // Sometimes BBOX defined in Matrix and not in Layer
            if (!config.wgs84BoundingBox && !config.boundingBox) {
                if (this.tileMatrixSet.boundingBox) {
                    this.sector = new Sector(
                        config.tileMatrixSet.boundingBox.lowerCorner[1],
                        config.tileMatrixSet.boundingBox.upperCorner[1],
                        config.tileMatrixSet.boundingBox.lowerCorner[0],
                        config.tileMatrixSet.boundingBox.upperCorner[0]);
                } else {
                    // Throw an exception if there is no bounding box.
                    throw new ArgumentError(
                        Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsLayer", "constructor",
                            "No bounding box was specified in the layer or tile matrix set capabilities."));
                }
            } else if (config.wgs84BoundingBox) {
                this.sector = config.wgs84BoundingBox.getSector();
            } else if (this.tileMatrixSet.boundingBox &&
                WmtsLayer.isEpsg4326Crs(this.tileMatrixSet.boundingBox.crs)) {
                this.sector = new Sector(
                    this.tileMatrixSet.boundingBox.lowerCorner[1],
                    this.tileMatrixSet.boundingBox.upperCorner[1],
                    this.tileMatrixSet.boundingBox.lowerCorner[0],
                    this.tileMatrixSet.boundingBox.upperCorner[0]);
            } else if (WmtsLayer.isEpsg4326Crs(this.tileMatrixSet.supportedCRS)) {
                // Throw an exception if there is no 4326 bounding box.
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsLayer", "constructor",
                        "No EPSG:4326 bounding box was specified in the layer or tile matrix set capabilities."));
            }

            // Check if the provided TileMatrixSet tile subdivision is compatible
            if (!WmtsLayer.isTileSubdivisionCompatible(this.tileMatrixSet)) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsLayer", "constructor",
                        "TileMatrixSet level division not compatible."));
            }

            // Check if the provided TileMatrixSet coordinate system is compatible
            var crs = this.tileMatrixSet.supportedCRS;
            var supportedCrs = WmtsLayer.isEpsg3857Crs(crs) || WmtsLayer.isEpsg4326Crs(crs) || WmtsLayer.isOGCCrs84(crs);
            if (!supportedCrs) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsLayer", "constructor",
                        "Provided CRS is not compatible."));
            }

            // Form a unique string to identify cache entries.
            this.cachePath = (this.resourceUrl || this.serviceUrl) +
                this.layerIdentifier + this.styleIdentifier + this.tileMatrixSet.identifier;
            if (timeString) {
                this.cachePath = this.cachePath + timeString;
            }

            /**
             * The displayName specified to this layer's constructor.
             * @type {String}
             * @readonly
             */
            this.displayName = config.title;

            this.currentTiles = [];
            this.currentTilesInvalid = true;
            this.tileCache = new MemoryCache(1000, 850);    // Allocate a cache that accommodates 1,000 tiles.
            this.currentRetrievals = [];
            this.absentResourceList = new AbsentResourceList(3, 50e3);

            this.pickEnabled = false;

            /**
             * Controls the level of detail switching for this layer. The next highest resolution level is
             * used when an image's texel size is greater than this number of pixels, up to the maximum resolution
             * of this layer.
             * @type {Number}
             * @default 1.75
             */
            this.detailControl = 1.75;
            
            /**
             * Controls how many concurrent tile requests that are allowed for this layer.
             * @type {Number}
             * @default WorldWind.configuration.layerRetrievalQueueSize;
             */
            this.retrievalQueueSize = WorldWind.configuration.layerRetrievalQueueSize;            
        };

        /**
         * Determines if the tile subdivision of the provided TileMatrixSet is compatible with WebWorldWind.
         * @param tileMatrixSet
         * @returns {boolean} true if this tile subdivision will work with WebWorldWind
         * @throws {ArgumentError} If the provided TileMatrixSet is null or empty
         */
        WmtsLayer.isTileSubdivisionCompatible = function (tileMatrixSet) {
            if (!tileMatrixSet || !tileMatrixSet.tileMatrix || tileMatrixSet.tileMatrix.length < 1) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsLayer", "isTileSubdivisionCompatible",
                        "Empty tile matrix set"));
            }

            var matrixHeightRatio, matrixWidthRatio, tileMatrix, previousTileMatrix = tileMatrixSet.tileMatrix[0];

            for (var i = 1, len = tileMatrixSet.tileMatrix.length; i < len; i++) {
                tileMatrix = tileMatrixSet.tileMatrix[i];
                matrixHeightRatio = tileMatrix.matrixHeight / previousTileMatrix.matrixHeight;
                matrixWidthRatio = tileMatrix.matrixWidth / previousTileMatrix.matrixWidth;
                previousTileMatrix = tileMatrix;


                if (matrixHeightRatio !== 2 || matrixWidthRatio !== 2) {
                    return false;
                }
            }

            return true;
        };


        /**
         * Constructs a tile matrix set object.
         * @param {{}} params Specifies parameters for the tile matrix set. Must contain the following
         * properties:
         * <ul>
         *     <li>matrixSet: {String} The matrix name.</li>
         *     <li>prefix: {Boolean} It represents if the identifier of the matrix must be prefixed by the matrix name.</li>
         *     <li>projection: {String} The projection of the tiles.</li>
         *     <li>topLeftCorner: {Array} The coordinates of the top left corner.</li>
         *     <li>extent: {Array} The boundinx box for this matrix.</li>
         *     <li>resolutions: {Array} The resolutions array.</li>
         *     <li>matrixSet: {Number} The tile size.</li>
         * </ul>
         * @throws {ArgumentError} If the specified params.matrixSet is null or undefined. The name of the matrix to
         * use for this layer.
         * @throws {ArgumentError} If the specified params.prefix is null or undefined. It represents if the
         * identifier of the matrix must be prefixed by the matrix name
         * @throws {ArgumentError} If the specified params.projection is null or undefined.
         * @throws {ArgumentError} If the specified params.extent is null or undefined.
         * @throws {ArgumentError} If the specified params.resolutions is null or undefined.
         * @throws {ArgumentError} If the specified params.tileSize is null or undefined.
         * @throws {ArgumentError} If the specified params.topLeftCorner is null or undefined.
         */
        WmtsLayer.createTileMatrixSet = function (params) {

            if (!params.matrixSet) { // matrixSet
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsLayer", "createTileMatrixSet",
                        "No matrixSet provided."));
            }
            if (!params.projection) { // projection
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsLayer", "createTileMatrixSet",
                        "No projection provided."));
            }
            if (!params.extent || params.extent.length != 4) { // extent
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsLayer", "createTileMatrixSet",
                        "No extent provided."));
            }

            // Define the boundingBox
            var boundingBox = {
                lowerCorner: [params.extent[0], params.extent[1]],
                upperCorner: [params.extent[2], params.extent[3]]
            };

            // Resolutions
            if (!params.resolutions) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsLayer", "createTileMatrixSet",
                        "No resolutions provided."));
            }

            // Tile size
            if (!params.tileSize) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsLayer", "createTileMatrixSet",
                        "No tile size provided."));
            }

            // Top left corner
            if (!params.topLeftCorner || params.topLeftCorner.length != 2) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsLayer", "createTileMatrixSet",
                        "No extent provided."));
            }

            // Prefix
            if (params.prefix === undefined) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsLayer", "createTileMatrixSet",
                        "Prefix not provided."));
            }

            // Check if the projection is supported
            if (!(WmtsLayer.isEpsg4326Crs(params.projection) || WmtsLayer.isOGCCrs84(params.projection) || WmtsLayer.isEpsg3857Crs(params.projection))) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsLayer", "createTileMatrixSet",
                        "Projection provided not supported."));
            }

            var tileMatrixSet = [],
                scale;

            // Construct the tileMatrixSet
            for (var i = 0; i < params.resolutions.length; i++) {
                // Compute the scaleDenominator
                if (WmtsLayer.isEpsg4326Crs(params.projection) || WmtsLayer.isOGCCrs84(params.projection)) {
                    scale = params.resolutions[i] * 6378137.0 * 2.0 * Math.PI / 360 / 0.00028;
                } else if (WmtsLayer.isEpsg3857Crs(params.projection)) {
                    scale = params.resolutions[i] / 0.00028;
                }

                // Compute the matrix width / height
                var unitWidth = params.tileSize * params.resolutions[i];
                var unitHeight = params.tileSize * params.resolutions[i];
                var matrixWidth = Math.ceil((params.extent[2] - params.extent[0] - 0.01 * unitWidth) / unitWidth);
                var matrixHeight = Math.ceil((params.extent[3] - params.extent[1] - 0.01 * unitHeight) / unitHeight);

                // Define the tile matrix
                var tileMatrix = {
                    identifier: params.prefix ? params.matrixSet + ":" + i : i,
                    levelNumber: i,
                    matrixHeight: matrixHeight,
                    matrixWidth: matrixWidth,
                    tileHeight: params.tileSize,
                    tileWidth: params.tileSize,
                    topLeftCorner: params.topLeftCorner,
                    scaleDenominator: scale
                };

                tileMatrixSet.push(tileMatrix);
            }

            return {
                identifier: params.matrixSet,
                supportedCRS: params.projection,
                boundingBox: boundingBox,
                tileMatrix: tileMatrixSet
            };
        };


        /**
         * Forms a configuration object for a specified {@link WmtsLayerCapabilities} layer description. The
         * configuration object created and returned is suitable for passing to the WmtsLayer constructor.
         * <p>
         *     This method also parses any time dimensions associated with the layer and returns them in the
         *     configuration object's "timeSequences" property. This property is a mixed array of Date objects
         *     and {@link PeriodicTimeSequence} objects describing the dimensions found.
         * @param wmtsLayerCapabilities {WmtsLayerCapabilities} The WMTS layer capabilities to create a configuration for.
         * @param style {string} The style to apply for this layer.  May be null, in which case the first style recognized is used.
         * @param matrixSet {string} The matrix to use for this layer.  May be null, in which case the first tileMatrixSet recognized is used.
         * @param imageFormat {string} The image format to use with this layer.  May be null, in which case the first image format recognized is used.
         * @returns {{}} A configuration object.
         * @throws {ArgumentError} If the specified WMTS layer capabilities is null or undefined.
         */
        WmtsLayer.formLayerConfiguration = function (wmtsLayerCapabilities, style, matrixSet, imageFormat) {

            var config = {};

            /**
             * The WMTS layer identifier of this layer.
             * @type {String}
             * @readonly
             */
            config.identifier = wmtsLayerCapabilities.identifier;

            // Validate that the specified image format exists, or determine one if not specified.
            if (imageFormat) {
                var formatIdentifierFound = false;
                for (var i = 0; i < wmtsLayerCapabilities.format.length; i++) {
                    if (wmtsLayerCapabilities.format[i] === imageFormat) {
                        formatIdentifierFound = true;
                        config.format = wmtsLayerCapabilities.format[i];
                        break;
                    }
                }

                if (!formatIdentifierFound) {
                    Logger.logMessage(Logger.LEVEL_WARNING, "WmtsLayer", "formLayerConfiguration",
                        "The specified image format is not available. Another one will be used.");
                    config.format = null;
                }
            }

            if (!config.format) {
                if (wmtsLayerCapabilities.format.indexOf("image/png") >= 0) {
                    config.format = "image/png";
                } else if (wmtsLayerCapabilities.format.indexOf("image/jpeg") >= 0) {
                    config.format = "image/jpeg";
                } else if (wmtsLayerCapabilities.format.indexOf("image/tiff") >= 0) {
                    config.format = "image/tiff";
                } else if (wmtsLayerCapabilities.format.indexOf("image/gif") >= 0) {
                    config.format = "image/gif";
                } else {
                    config.format = wmtsLayerCapabilities.format[0];
                }
            }

            if (!config.format) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsLayer", "formLayerConfiguration",
                        "Layer does not provide a supported image format."));
            }

            // Configure URL
            if (wmtsLayerCapabilities.resourceUrl && (wmtsLayerCapabilities.resourceUrl.length >= 1)) {
                for (var i = 0; i < wmtsLayerCapabilities.resourceUrl.length; i++) {
                    if (config.format === wmtsLayerCapabilities.resourceUrl[i].format) {
                        config.resourceUrl = wmtsLayerCapabilities.resourceUrl[i].template;
                        break;
                    }
                }
            } else { // resource-oriented interface not supported, so use KVP interface
                config.service = wmtsLayerCapabilities.capabilities.getGetTileKvpAddress();
                if (config.service) {
                    config.service = WmsUrlBuilder.fixGetMapString(config.service);
                }
            }

            if (!config.resourceUrl && !config.service) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsLayer", "formLayerConfiguration",
                        "No resource URL or KVP GetTile service URL specified in WMTS capabilities."));
            }

            // Validate that the specified style identifier exists, or determine one if not specified.
            if (style) {
                var styleIdentifierFound = false;
                for (var i = 0; i < wmtsLayerCapabilities.style.length; i++) {
                    if (wmtsLayerCapabilities.style[i].identifier === style) {
                        styleIdentifierFound = true;
                        config.style = wmtsLayerCapabilities.style[i].identifier;
                        break;
                    }
                }

                if (!styleIdentifierFound) {
                    Logger.logMessage(Logger.LEVEL_WARNING, "WmtsLayer", "formLayerConfiguration",
                        "The specified style identifier is not available. The server's default style will be used.");
                    config.style = null;
                }
            }

            if (!config.style) {
                for (i = 0; i < wmtsLayerCapabilities.style.length; i++) {
                    if (wmtsLayerCapabilities.style[i].isDefault) {
                        config.style = wmtsLayerCapabilities.style[i].identifier;
                        break;
                    }
                }
            }

            if (!config.style) {
                Logger.logMessage(Logger.LEVEL_WARNING, "WmtsLayer", "formLayerConfiguration",
                    "No default style available. A style will not be specified in tile requests.");
            }

            // Retrieve the supported tile matrix sets for testing against provided tile matrix set or for tile matrix
            // set negotiation.
            var supportedTileMatrixSets = wmtsLayerCapabilities.getLayerSupportedTileMatrixSets();

            // Validate that the specified TileMatrixSet exists and is compatible with WebWorldWind
            if (matrixSet) {
                for (var i = 0, len = supportedTileMatrixSets.length; i < len; i++) {
                    if (supportedTileMatrixSets[i].identifier === matrixSet && WmtsLayer.isTileSubdivisionCompatible(supportedTileMatrixSets[i])) {
                        config.tileMatrixSet = supportedTileMatrixSets[i];
                        break;
                    }
                }

                if (!config.tileMatrixSet) {
                    Logger.logMessage(Logger.LEVEL_WARNING, "WmtsLayer", "formLayerConfiguration",
                        "The specified tileMatrixSet is not available. Another one will be used.");
                    config.tileMatrixSet = null;
                }
            }

            if (!config.tileMatrixSet) {
                // Find the tile matrix set we want to use. Prefer EPSG:4326, then EPSG:3857.
                var tms, tms4326 = null, tms3857 = null, tmsCRS84 = null;

                for (var i = 0, len = supportedTileMatrixSets.length; i < len; i++) {
                    tms = supportedTileMatrixSets[i];

                    // check for suitable tile division
                    if (WmtsLayer.isTileSubdivisionCompatible(tms)) {
                        if (WmtsLayer.isEpsg4326Crs(tms.supportedCRS)) {
                            tms4326 = tms4326 || tms;
                        } else if (WmtsLayer.isEpsg3857Crs(tms.supportedCRS)) {
                            tms3857 = tms3857 || tms;
                        } else if (WmtsLayer.isOGCCrs84(tms.supportedCRS)) {
                            tmsCRS84 = tmsCRS84 || tms;
                        }
                    }
                }

                config.tileMatrixSet = tms4326 || tms3857 || tmsCRS84;
            }

            if (!config.tileMatrixSet) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsLayer", "formLayerConfiguration",
                        "No supported Tile Matrix Set could be found."));
            }

            // Configure boundingBox
            config.boundingBox = wmtsLayerCapabilities.boundingBox;
            config.wgs84BoundingBox = wmtsLayerCapabilities.wgs84BoundingBox;

            // Determine a default display name.
            if (wmtsLayerCapabilities.titles.length > 0) {
                config.title = wmtsLayerCapabilities.titles[0].value;
            } else {
                config.title = wmtsLayerCapabilities.identifier;
            }

            return config;
        };

        WmtsLayer.prototype = Object.create(Layer.prototype);

        WmtsLayer.prototype.doRender = function (dc) {
            if (!dc.terrain)
                return;

            if (this.currentTilesInvalid
                || !dc.modelviewProjection.equals(this.lasTtMVP)
                || dc.globeStateKey !== this.lastGlobeStateKey) {
                this.currentTilesInvalid = false;
                this.assembleTiles(dc);
            }

            this.lasTtMVP.copy(dc.modelviewProjection);
            this.lastGlobeStateKey = dc.globeStateKey;

            if (this.currentTiles.length > 0) {
                dc.surfaceTileRenderer.renderTiles(dc, this.currentTiles, this.opacity);
                dc.frameStatistics.incrementImageTileCount(this.currentTiles.length);
                this.inCurrentFrame = true;
            }
        };

        WmtsLayer.prototype.isLayerInView = function (dc) {
            return dc.terrain && dc.terrain.sector && dc.terrain.sector.intersects(this.sector);
        };

        WmtsLayer.prototype.isTileVisible = function (dc, tile) {
            if (dc.globe.projectionLimits && !tile.sector.overlaps(dc.globe.projectionLimits)) {
                return false;
            }

            return tile.extent.intersectsFrustum(dc.frustumInModelCoordinates);
        };

        WmtsLayer.prototype.assembleTiles = function (dc) {
            this.currentTiles = [];

            if (!this.topLevelTiles || (this.topLevelTiles.length === 0)) {
                this.createTopLevelTiles(dc);
            }

            for (var i = 0, len = this.topLevelTiles.length; i < len; i++) {
                var tile = this.topLevelTiles[i];

                tile.update(dc);

                this.currentAncestorTile = null;

                if (this.isTileVisible(dc, tile)) {
                    this.addTileOrDescendants(dc, tile);
                }
            }
        };

        WmtsLayer.prototype.addTileOrDescendants = function (dc, tile) {
            // Check if the new sub-tile fits in TileMatrix ranges
            if (tile.column >= tile.tileMatrix.matrixWidth) {
                tile.column = tile.column - tile.tileMatrix.matrixWidth;
            }
            if (tile.column < 0) {
                tile.column = tile.column + tile.tileMatrix.matrixWidth;
            }

            if (this.tileMeetsRenderingCriteria(dc, tile)) {
                this.addTile(dc, tile);
                return;
            }

            var ancestorTile = null;

            try {
                if (this.isTileTextureInMemory(dc, tile) || tile.tileMatrix.levelNumber === 0) {
                    ancestorTile = this.currentAncestorTile;
                    this.currentAncestorTile = tile;
                }
                var nextLevel = this.tileMatrixSet.tileMatrix[tile.tileMatrix.levelNumber + 1],
                    subTiles = tile.subdivideToCache(nextLevel, this, this.tileCache);

                for (var i = 0, len = subTiles.length; i < len; i++) {
                    var child = subTiles[i];

                    child.update(dc);

                    if (this.sector.intersects(child.sector) && this.isTileVisible(dc, child)) {
                        this.addTileOrDescendants(dc, child);
                    }
                }
            } finally {
                if (ancestorTile) {
                    this.currentAncestorTile = ancestorTile;
                }
            }
        };

        WmtsLayer.prototype.addTile = function (dc, tile) {
            tile.fallbackTile = null;

            var texture = dc.gpuResourceCache.resourceForKey(tile.imagePath);
            if (texture) {
                this.currentTiles.push(tile);

                // If the tile's texture has expired, cause it to be re-retrieved. Note that the current,
                // expired texture is still used until the updated one arrives.
                if (this.expiration && this.isTextureExpired(texture)) {
                    this.retrieveTileImage(dc, tile);
                }

                return;
            }

            this.retrieveTileImage(dc, tile);

            if (this.currentAncestorTile) {
                if (this.isTileTextureInMemory(dc, this.currentAncestorTile)) {
                    this.currentTiles.push(this.currentAncestorTile);
                }
            }
        };

        WmtsLayer.prototype.isTextureExpired = function (texture) {
            return this.expiration && (texture.creationTime.getTime() <= this.expiration.getTime());
        };

        WmtsLayer.prototype.isTileTextureInMemory = function (dc, tile) {
            return dc.gpuResourceCache.containsResource(tile.imagePath);
        };

        WmtsLayer.prototype.tileMeetsRenderingCriteria = function (dc, tile) {
            var s = this.detailControl;
            if (tile.sector.minLatitude >= 75 || tile.sector.maxLatitude <= -75) {
                s *= 1.2;
            }

            return tile.tileMatrix.levelNumber === (this.tileMatrixSet.tileMatrix.length - 1) || !tile.mustSubdivide(dc, s);
        };

        WmtsLayer.prototype.retrieveTileImage = function (dc, tile) {
            if (this.currentRetrievals.indexOf(tile.imagePath) < 0) {
                if (this.currentRetrievals.length > this.retrievalQueueSize) {
                    return;
                }                
                if (this.absentResourceList.isResourceAbsent(tile.imagePath)) {
                    return;
                }

                var url = this.resourceUrlForTile(tile, this.imageFormat),
                    image = new Image(),
                    imagePath = tile.imagePath,
                    cache = dc.gpuResourceCache,
                    canvas = dc.currentGlContext.canvas,
                    layer = this;

                if (!url) {
                    this.currentTilesInvalid = true;
                    return;
                }

                image.onload = function () {
                    Logger.log(Logger.LEVEL_INFO, "Image retrieval succeeded: " + url);
                    var texture = layer.createTexture(dc, tile, image);
                    layer.removeFromCurrentRetrievals(imagePath);

                    if (texture) {
                        cache.putResource(imagePath, texture, texture.size);

                        layer.currentTilesInvalid = true;
                        layer.absentResourceList.unmarkResourceAbsent(imagePath);

                        // Send an event to request a redraw.
                        var e = document.createEvent('Event');
                        e.initEvent(WorldWind.REDRAW_EVENT_TYPE, true, true);
                        canvas.dispatchEvent(e);
                    }
                };

                image.onerror = function () {
                    layer.removeFromCurrentRetrievals(imagePath);
                    layer.absentResourceList.markResourceAbsent(imagePath);
                    Logger.log(Logger.LEVEL_WARNING, "Image retrieval failed: " + url);
                };

                this.currentRetrievals.push(imagePath);
                image.crossOrigin = 'anonymous';
                image.src = url;
            }
        };

        WmtsLayer.prototype.resourceUrlForTile = function (tile, imageFormat) {
            var url;

            if (this.resourceUrl) {
                url = this.resourceUrl.replace("{Style}", this.styleIdentifier).replace("{TileMatrixSet}", this.tileMatrixSet.identifier).replace("{TileMatrix}", tile.tileMatrix.identifier).replace("{TileCol}", tile.column).replace("{TileRow}", tile.row);

                if (this.timeString) {
                    url = url.replace("{Time}", this.timeString);
                }
            } else {
                url = this.serviceUrl + "service=WMTS&request=GetTile&version=1.0.0";

                url += "&Layer=" + this.layerIdentifier;

                if (this.styleIdentifier) {
                    url += "&Style=" + this.styleIdentifier;
                }

                url += "&Format=" + imageFormat;

                if (this.timeString) {
                    url += "&Time=" + this.timeString;
                }

                url += "&TileMatrixSet=" + this.tileMatrixSet.identifier;
                url += "&TileMatrix=" + tile.tileMatrix.identifier;
                url += "&TileRow=" + tile.row;
                url += "&TileCol=" + tile.column;
            }

            return url;
        };

        WmtsLayer.prototype.removeFromCurrentRetrievals = function (imagePath) {
            var index = this.currentRetrievals.indexOf(imagePath);
            if (index > -1) {
                this.currentRetrievals.splice(index, 1);
            }
        };

        WmtsLayer.prototype.createTopLevelTiles = function (dc) {
            var tileMatrix = this.tileMatrixSet.tileMatrix[0];

            this.topLevelTiles = [];
            for (var j = 0; j < tileMatrix.matrixHeight; j++) {
                for (var i = 0; i < tileMatrix.matrixWidth; i++) {
                    this.topLevelTiles.push(this.createTile(tileMatrix, j, i));
                }
            }
        };

        WmtsLayer.prototype.createTile = function (tileMatrix, row, column) {
            if (WmtsLayer.isEpsg4326Crs(this.tileMatrixSet.supportedCRS)) {
                return this.createTile4326(tileMatrix, row, column);
            } else if (WmtsLayer.isEpsg3857Crs(this.tileMatrixSet.supportedCRS)) {
                return this.createTile3857(tileMatrix, row, column);
            } else if (WmtsLayer.isOGCCrs84(this.tileMatrixSet.supportedCRS)) {
                return this.createTileCrs84(tileMatrix, row, column);
            }
        };


        WmtsLayer.prototype.createTileCrs84 = function (tileMatrix, row, column) {
            var tileDeltaLat = this.sector.deltaLatitude() / tileMatrix.matrixHeight,
                tileDeltaLon = this.sector.deltaLongitude() / tileMatrix.matrixWidth,
                maxLat = tileMatrix.topLeftCorner[1] - row * tileDeltaLat,
                minLat = maxLat - tileDeltaLat,
                minLon = tileMatrix.topLeftCorner[0] + tileDeltaLon * column,
                maxLon = minLon + tileDeltaLon;

            var sector = new Sector(minLat, maxLat, minLon, maxLon);

            return this.makeTile(sector, tileMatrix, row, column);
        };


        WmtsLayer.prototype.createTile4326 = function (tileMatrix, row, column) {
            var tileDeltaLat = this.sector.deltaLatitude() / tileMatrix.matrixHeight,
                tileDeltaLon = this.sector.deltaLongitude() / tileMatrix.matrixWidth,
                maxLat = tileMatrix.topLeftCorner[0] - row * tileDeltaLat,
                minLat = maxLat - tileDeltaLat,
                minLon = tileMatrix.topLeftCorner[1] + tileDeltaLon * column,
                maxLon = minLon + tileDeltaLon;

            var sector = new Sector(minLat, maxLat, minLon, maxLon);

            return this.makeTile(sector, tileMatrix, row, column);
        };

        WmtsLayer.prototype.createTile3857 = function (tileMatrix, row, column) {
            if (!tileMatrix.mapWidth) {
                this.computeTileMatrixValues3857(tileMatrix);
            }

            var swX = WWMath.clamp(column * tileMatrix.tileWidth - 0.5, 0, tileMatrix.mapWidth),
                neY = WWMath.clamp(row * tileMatrix.tileHeight - 0.5, 0, tileMatrix.mapHeight),
                neX = WWMath.clamp(swX + (tileMatrix.tileWidth) + 0.5, 0, tileMatrix.mapWidth),
                swY = WWMath.clamp(neY + (tileMatrix.tileHeight) + 0.5, 0, tileMatrix.mapHeight),
                x, y, swLat, swLon, neLat, neLon;

            x = swX / tileMatrix.mapWidth;
            y = swY / tileMatrix.mapHeight;
            swLon = tileMatrix.topLeftCorner[0] + x * tileMatrix.tileMatrixDeltaX;
            swLat = tileMatrix.topLeftCorner[1] - y * tileMatrix.tileMatrixDeltaY;
            var swDegrees = WWMath.epsg3857ToEpsg4326(swLon, swLat);

            x = neX / tileMatrix.mapWidth;
            y = neY / tileMatrix.mapHeight;
            neLon = tileMatrix.topLeftCorner[0] + x * tileMatrix.tileMatrixDeltaX;
            neLat = tileMatrix.topLeftCorner[1] - y * tileMatrix.tileMatrixDeltaY;
            var neDegrees = WWMath.epsg3857ToEpsg4326(neLon, neLat);

            var sector = new Sector(swDegrees[0], neDegrees[0], swDegrees[1], neDegrees[1]);

            return this.makeTile(sector, tileMatrix, row, column);
        };

        WmtsLayer.prototype.computeTileMatrixValues3857 = function (tileMatrix) {
            var pixelSpan = tileMatrix.scaleDenominator * 0.28e-3,
                tileSpanX = tileMatrix.tileWidth * pixelSpan,
                tileSpanY = tileMatrix.tileHeight * pixelSpan,
                tileMatrixMaxX = tileMatrix.topLeftCorner[0] + tileSpanX * tileMatrix.matrixWidth,
                tileMatrixMinY = tileMatrix.topLeftCorner[1] - tileSpanY * tileMatrix.matrixHeight,
                bottomRightCorner = [tileMatrixMaxX, tileMatrixMinY],
                topLeftCorner = tileMatrix.topLeftCorner;

            tileMatrix.tileMatrixDeltaX = bottomRightCorner[0] - topLeftCorner[0];
            tileMatrix.tileMatrixDeltaY = topLeftCorner[1] - bottomRightCorner[1];
            tileMatrix.mapWidth = tileMatrix.tileWidth * tileMatrix.matrixWidth;
            tileMatrix.mapHeight = tileMatrix.tileHeight * tileMatrix.matrixHeight;
        };

        WmtsLayer.prototype.makeTile = function (sector, tileMatrix, row, column) {
            var path = this.cachePath + "-layer/" + tileMatrix.identifier + "/" + row + "/" + column + "."
                + WWUtil.suffixForMimeType(this.imageFormat);
            return new WmtsLayerTile(sector, tileMatrix, row, column, path);
        };

        WmtsLayer.prototype.createTexture = function (dc, tile, image) {
            if (WmtsLayer.isEpsg4326Crs(this.tileMatrixSet.supportedCRS)) {
                return new Texture(dc.currentGlContext, image);
            } else if (WmtsLayer.isEpsg3857Crs(this.tileMatrixSet.supportedCRS)) {
                return this.createTexture3857(dc, tile, image);
            } else if (WmtsLayer.isOGCCrs84(this.tileMatrixSet.supportedCRS)) {
                return new Texture(dc.currentGlContext, image);
            }
        };

        WmtsLayer.prototype.createTexture3857 = function (dc, tile, image) {
            if (!this.destCanvas) {
                // Create a canvas we can use when unprojecting retrieved images.
                this.destCanvas = document.createElement("canvas");
                this.destContext = this.destCanvas.getContext("2d");
            }

            var srcCanvas = dc.canvas2D,
                srcContext = dc.ctx2D,
                srcImageData,
                destCanvas = this.destCanvas,
                destContext = this.destContext,
                destImageData = destContext.createImageData(image.width, image.height),
                sector = tile.sector,
                tMin = WWMath.gudermannianInverse(sector.minLatitude),
                tMax = WWMath.gudermannianInverse(sector.maxLatitude),
                lat, g, srcRow, kSrc, kDest, sy, dy;

            srcCanvas.width = image.width;
            srcCanvas.height = image.height;
            destCanvas.width = image.width;
            destCanvas.height = image.height;

            // Draw the original image to a canvas so image data can be had for it.
            srcContext.drawImage(image, 0, 0, image.width, image.height);
            srcImageData = srcContext.getImageData(0, 0, image.width, image.height);

            // Unproject the retrieved image.
            for (var n = 0; n < 1; n++) {
                for (var y = 0; y < image.height; y++) {
                    sy = 1 - y / (image.height - 1);
                    lat = sy * sector.deltaLatitude() + sector.minLatitude;
                    g = WWMath.gudermannianInverse(lat);
                    dy = 1 - (g - tMin) / (tMax - tMin);
                    dy = WWMath.clamp(dy, 0, 1);
                    srcRow = Math.floor(dy * (image.height - 1));
                    for (var x = 0; x < image.width; x++) {
                        kSrc = 4 * (x + srcRow * image.width);
                        kDest = 4 * (x + y * image.width);

                        destImageData.data[kDest] = srcImageData.data[kSrc];
                        destImageData.data[kDest + 1] = srcImageData.data[kSrc + 1];
                        destImageData.data[kDest + 2] = srcImageData.data[kSrc + 2];
                        destImageData.data[kDest + 3] = srcImageData.data[kSrc + 3];
                    }
                }
            }

            destContext.putImageData(destImageData, 0, 0);

            return new Texture(dc.currentGlContext, destCanvas);
        };

        WmtsLayer.isEpsg4326Crs = function (crs) {
            return ((crs.indexOf("EPSG") >= 0) && (crs.indexOf("4326") >= 0));
        };

        WmtsLayer.isEpsg3857Crs = function (crs) {
            return (crs.indexOf("EPSG") >= 0)
                && ((crs.indexOf("3857") >= 0) || (crs.indexOf("900913") >= 0)); // 900913 is google's 3857 alias
        };

        WmtsLayer.isOGCCrs84 = function (crs) {
            return (crs.indexOf("OGC") >= 0) && (crs.indexOf("CRS84") >= 0);
        };

        export default WmtsLayer;
    
