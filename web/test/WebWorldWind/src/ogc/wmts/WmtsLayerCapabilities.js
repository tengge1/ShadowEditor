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
 * @exports WmtsLayerCapabilities
 */
import ArgumentError from '../../error/ArgumentError';
import Sector from '../../geom/Sector';
import OwsDescription from '../../ogc/ows/OwsDescription';
import Logger from '../../util/Logger';
        

        /**
         * Constructs an WMTS Layer instance from an XML DOM.
         * @alias WmtsLayerCapabilities
         * @constructor
         * @classdesc Represents a WMTS layer description from a WMTS Capabilities document. This object holds all the
         * fields specified in the associated WMTS Capabilities document.
         * @param {{}} layerElement A WMTS Layer element describing the layer.
         * @param {{}} capabilities The WMTS capabilities documented containing this layer.
         * @throws {ArgumentError} If the specified layer element is null or undefined.
         */
        var WmtsLayerCapabilities = function (layerElement, capabilities) {
            if (!layerElement) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsLayerCapabilities", "constructor", "missingDomElement"));
            }

            OwsDescription.call(this, layerElement);

            /**
             * This layer's WMTS capabilities document, as specified to the constructor of this object.
             * @type {{}}
             * @readonly
             */
            this.capabilities = capabilities;

            /**
             * The identifier of this layer description.
             * @type {String}
             * @readonly
             */
            this.identifier;

            /**
             * The titles of this layer.
             * @type {String[]}
             * @readonly
             */
            this.title;

            /**
             * The abstracts of this layer.
             * @type {String[]}
             * @readonly
             */
            this.abstract;

            /**
             * The list of keywords associated with this layer description.
             * @type {String[]}
             * @readonly
             */
            this.keywords;

            /**
             * The WGS84 bounding box associated with this layer. The returned object has the following properties:
             * "lowerCorner", "upperCorner".
             * @type {{}}
             * @readonly
             */
            this.wgs84BoundingBox;

            /**
             * The bounding boxes associated with this layer. The returned array contains objects with the following
             * properties: TODO
             * @type {Object[]}
             * @readonly
             */
            this.boundingBox;

            /**
             * The list of styles associated with this layer description, accumulated from this layer and its parent
             * layers. Each object returned may have the following properties: name {String}, title {String},
             * abstract {String}, legendUrls {Object[]}, styleSheetUrl, styleUrl. Legend urls may have the following
             * properties: width, height, format, url. Style sheet urls and style urls have the following properties:
             * format, url.
             * @type {Object[]}
             * @readonly
             */
            this.styles;

            /**
             * The formats supported by this layer.
             * @type {String[]}
             * @readonly
             */
            this.formats;

            /**
             * The Feature Info formats supported by this layer.
             * @type {String[]}
             * @readonly
             */
            this.infoFormat;

            /**
             * The dimensions associated with this layer. The returned array contains objects with the following
             * properties:
             * @type {Object[]}
             * @readonly
             */
            this.dimension;

            /**
             * The metadata associated with this layer description. Each object in the returned array has the
             * following properties: type, format, url.
             * @type {Object[]}
             * @readonly
             */
            this.metadata;

            /**
             * The tile matris sets associated with this layer.
             * @type {Object[]}
             * @readonly
             */
            this.tileMatrixSetLink;

            /**
             * The resource URLs associated with this layer description. Each object in the returned array has the
             * following properties: format, url.
             * @type {Object[]}
             * @readonly
             */
            this.resourceUrl;

            this.assembleLayer(layerElement);
        };

        WmtsLayerCapabilities.prototype = Object.create(OwsDescription.prototype);

        /**
         * Provides an array of the TileMatrixSet objects supported by this layer.
         * @returns {Array}
         */
        WmtsLayerCapabilities.prototype.getLayerSupportedTileMatrixSets = function () {
            var tileMatrixSets = [];

            for (var i = 0, lenA = this.tileMatrixSetLink.length; i < lenA; i++) {
                var supportedTileMatrixSetIdentifier = this.tileMatrixSetLink[i].tileMatrixSet;
                for (var j = 0, lenB = this.capabilities.contents.tileMatrixSet.length; j < lenB; j++) {
                    var tileMatrixSetIdentifier = this.capabilities.contents.tileMatrixSet[j].identifier;
                    if (tileMatrixSetIdentifier === supportedTileMatrixSetIdentifier) {
                        tileMatrixSets.push(this.capabilities.contents.tileMatrixSet[j]);
                    }
                }
            }

            return tileMatrixSets;
        };

        WmtsLayerCapabilities.prototype.assembleLayer = function (element) {
            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "Identifier") {
                    this.identifier = child.textContent;
                } else if (child.localName === "WGS84BoundingBox") {
                    this.wgs84BoundingBox = WmtsLayerCapabilities.assembleBoundingBox(child);
                } else if (child.localName === "BoundingBox") {
                    this.boundingBox = this.boundingBox || [];
                    this.boundingBox.push(WmtsLayerCapabilities.assembleBoundingBox(child));
                } else if (child.localName === "Style") {
                    this.style = this.style || [];
                    this.style.push(WmtsLayerCapabilities.assembleStyle(child));
                } else if (child.localName === "Format") {
                    this.format = this.format || [];
                    this.format.push(child.textContent);
                } else if (child.localName === "InfoFormat") {
                    this.infoFormat = this.infoFormat || [];
                    this.infoFormat.push(child.textContent);
                } else if (child.localName === "Dimension") {
                    this.dimension = this.dimension || [];
                    this.dimension.push(WmtsLayerCapabilities.assembleDimension(child));
                } else if (child.localName === "Metadata") {
                    this.metadata = this.metadata || [];
                    this.metadata.push(WmtsLayerCapabilities.assembleMetadata(child));
                } else if (child.localName === "ResourceURL") {
                    this.resourceUrl = this.resourceUrl || [];
                    this.resourceUrl.push(WmtsLayerCapabilities.assembleResourceUrl(child));
                } else if (child.localName === "TileMatrixSetLink") {
                    this.tileMatrixSetLink = this.tileMatrixSetLink || [];
                    this.tileMatrixSetLink.push(WmtsLayerCapabilities.assembleTileMatrixSetLink(child));
                }
            }

        };

        WmtsLayerCapabilities.assembleStyle = function (element) {
            var result = new OwsDescription(element);

            result.isDefault = element.getAttribute("isDefault");

            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "Identifier") {
                    result.identifier = child.textContent;
                } else if (child.localName === "LegendURL") {
                    result.legendUrl = result.legendUrl || [];
                    result.legendUrl.push(WmtsLayerCapabilities.assembleLegendUrl(child));
                }
            }

            return result;
        };

        WmtsLayerCapabilities.assembleBoundingBox = function (element) {
            var result = {};

            var crs = element.getAttribute("crs");
            if (crs) {
                result.crs = crs;
            }

            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "LowerCorner") {
                    var lc = child.textContent.split(" ");
                    result.lowerCorner = [parseFloat(lc[0]), parseFloat(lc[1])];
                } else if (child.localName === "UpperCorner") {
                    var uc = child.textContent.split(" ");
                    result.upperCorner = [parseFloat(uc[0]), parseFloat(uc[1])];
                }
            }

            // Add a utility which provides a Sector based on the WGS84BoundingBox element
            if (element.localName === "WGS84BoundingBox") {
                result.getSector = function () {
                    return new Sector(result.lowerCorner[1], result.upperCorner[1], result.lowerCorner[0], result.upperCorner[0]);
                }
            }

            return result;
        };

        WmtsLayerCapabilities.assembleDimension = function (element) {
            var result = new OwsDescription(element);

            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "Identifier") {
                    result.identifier = child.textContent;
                } else if (child.localName === "UOM") {
                    result.uom = {
                        name: child.getAttribute("name"),
                        reference: child.getAttribute("reference")
                    }
                } else if (child.localName == "UnitSymbol") {
                    result.unitSymbol = child.textContent;
                } else if (child.localName === "Default") {
                    result.default = child.textContent;
                } else if (child.localName === "Current") {
                    result.current = (child.textContent === "true");
                } else if (child.localName === "Value") {
                    result.value = result.value || [];
                    result.value.push(child.textContent);
                }
            }

            return result;
        };

        WmtsLayerCapabilities.assembleMetadata = function (element) { // TODO
            var result = {};

            var link = element.getAttribute("xlink:href");
            if (link) {
                result.url = link;
            }

            var about = element.getAttribute("about");
            if (link) {
                result.about = about;
            }

            var type = element.getAttribute("xlink:type");
            if (type) {
                result.type = type;
            }

            var role = element.getAttribute("xlink:role");
            if (role) {
                result.role = role;
            }

            var title = element.getAttribute("xlink:title");
            if (title) {
                result.title = title;
            }

            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "Metadata") {
                    result.metadata = WmsLayerCapabilities.assembleMetadata(child);
                }
            }

            return result;
        };

        WmtsLayerCapabilities.assembleResourceUrl = function (element) {
            var result = {};

            result.format = element.getAttribute("format");
            result.resourceType = element.getAttribute("resourceType");
            result.template = element.getAttribute("template");

            return result;
        };

        WmtsLayerCapabilities.assembleLegendUrl = function (element) {
            var result = {};

            result.format = element.getAttribute("format");
            result.minScaleDenominator = element.getAttribute("minScaleDenominator");
            result.maxScaleDenominator = element.getAttribute("maxScaleDenominator");
            result.href = element.getAttribute("xlink:href");
            result.width = element.getAttribute("width");
            result.height = element.getAttribute("height");

            return result;
        };

        WmtsLayerCapabilities.assembleTileMatrixSetLink = function (element) {
            var result = {};

            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "TileMatrixSet") {
                    result.tileMatrixSet = child.textContent;
                } else if (child.localName === "TileMatrixSetLimits") {
                    result.tileMatrixSetLimits = WmtsLayerCapabilities.assembleTileMatrixSetLimits(child);
                }
            }

            return result;
        };

        WmtsLayerCapabilities.assembleTileMatrixSetLimits = function (element) {
            var result = {};

            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "TileMatrixLimits") {
                    result.tileMatrixLimits = result.tileMatrixLimits || [];
                    result.tileMatrixLimits.push(WmtsLayerCapabilities.assembleTileMatrixLimits(child));
                }
            }

            return result;
        };

        WmtsLayerCapabilities.assembleTileMatrixLimits = function (element) {
            var result = {};

            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "TileMatrix") {
                    result.tileMatrix = child.textContent;
                } else if (child.localName === "MinTileRow") {
                    result.minTileRow = parseInt(child.textContent);
                } else if (child.localName === "MaxTileRow") {
                    result.maxTileRow = parseInt(child.textContent);
                } else if (child.localName === "MinTileCol") {
                    result.minTileCol = parseInt(child.textContent);
                } else if (child.localName === "maxTileCol") {
                    result.maxTileCol = parseInt(child.textContent);
                }
            }

            return result;
        };

        export default WmtsLayerCapabilities;
    