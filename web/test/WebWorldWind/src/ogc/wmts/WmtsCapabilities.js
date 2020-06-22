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
 * @exports WmtsCapabilities
 */
import ArgumentError from '../../error/ArgumentError';
import Logger from '../../util/Logger';
import OwsDescription from '../../ogc/ows/OwsDescription';
import OwsLanguageString from '../../ogc/ows/OwsLanguageString';
import OwsOperationsMetadata from '../../ogc/ows/OwsOperationsMetadata';
import OwsServiceIdentification from '../../ogc/ows/OwsServiceIdentification';
import OwsServiceProvider from '../../ogc/ows/OwsServiceProvider';
import WmsCapabilities from '../../ogc/wms/WmsCapabilities';
import WmtsLayerCapabilities from '../../ogc/wmts/WmtsLayerCapabilities';
        

        /**
         * Constructs an OGC WMTS capabilities document from an XML DOM.
         * @alias WmtsCapabilities
         * @constructor
         * @classdesc Represents an OGC WMTS capabilities document.
         * This object holds as properties all the fields specified in the OGC WMTS capabilities document.
         * Most fields can be accessed as properties named according to their document names converted to camel case.
         * For example, "serviceIdentification" and "contents".
         * @param {{}} xmlDom An XML DOM representing the OGC WMTS capabilities document.
         * @throws {ArgumentError} If the specified XML DOM is null or undefined.
         */
        var WmtsCapabilities = function (xmlDom) {
            if (!xmlDom) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsCapabilities", "constructor", "No XML DOM specified."));
            }

            this.assembleDocument(xmlDom);
        };

        /**
         * Provides all of the layers associated with this WMTS. This method is for convienence and returns the layer
         * array captured in the contents of this WmtsCapabilities object.
         * @returns {WmtsLayerCapabilities[]}
         */
        WmtsCapabilities.prototype.getLayers = function () {
            return this.contents.layer;
        };

        /**
         * Retrieve the WmtsLayerCapabilities object for the provided identifier.
         * @param identifier
         * @returns {WmtsLayerCapabilities} object for the provided identifier or null if no identifier was found in the
         * WmtsCapabilities object.
         * @throws {ArgumentError} If the specified identifier is null or undefined.
         */
        WmtsCapabilities.prototype.getLayer = function (identifier) {
            if (!identifier) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsCapabilities", "getLayer", "empty identifier"));
            }

            for (var i = 0, len = this.contents.layer.length; i < len; i++) {
                var wmtsLayerCapabilities = this.contents.layer[i];
                if (wmtsLayerCapabilities.identifier === identifier) {
                    return wmtsLayerCapabilities;
                }
            }

            return null;
        };

        WmtsCapabilities.prototype.assembleDocument = function (dom) {
            var root = dom.documentElement;

            this.version = root.getAttribute("version");
            this.updateSequence = root.getAttribute("updateSequence");

            var children = root.children || root.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "ServiceIdentification") {
                    this.serviceIdentification = new OwsServiceIdentification(child);
                } else if (child.localName === "ServiceProvider") {
                    this.serviceProvider = new OwsServiceProvider(child);
                } else if (child.localName === "OperationsMetadata") {
                    this.operationsMetadata = new OwsOperationsMetadata(child);
                } else if (child.localName === "Contents") {
                    this.contents = this.assembleContents(child);
                } else if (child.localName === "Themes") {
                    this.themes = WmtsCapabilities.assembleThemes(child);
                } else if (child.localName === "ServiceMetadataURL") {
                    this.serviceMetadataUrls = this.serviceMetadataUrls || [];
                    this.serviceMetadataUrls.push(WmtsCapabilities.assembleServiceMetadataURL(child));
                }
            }
        };

        WmtsCapabilities.prototype.assembleContents = function (element) {
            var contents = {};

            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "Layer") {
                    contents.layer = contents.layer || [];
                    try {
                        contents.layer.push(new WmtsLayerCapabilities(child, this));
                    } catch (e) {
                        Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsCapabilities", "constructor",
                            "Exception reading WMTS layer description: " + e.message);
                    }
                } else if (child.localName === "TileMatrixSet") {
                    contents.tileMatrixSet = contents.tileMatrixSet || [];
                    try {
                        contents.tileMatrixSet.push(WmtsCapabilities.assembleTileMatrixSet(child));
                    } catch (e) {
                        Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsCapabilities", "constructor",
                            "Exception reading WMTS tile matrix set description: " + e.message);
                    }
                }
                // TODO: OtherSource
            }

            return contents;
        };

        WmtsCapabilities.assembleTileMatrixSet = function (element) {
            var tileMatrixSet = new OwsDescription(element);

            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "Identifier") {
                    tileMatrixSet.identifier = child.textContent;
                } else if (child.localName === "SupportedCRS") {
                    tileMatrixSet.supportedCRS = child.textContent;
                } else if (child.localName === "WellKnownScaleSet") {
                    tileMatrixSet.wellKnownScaleSet = child.textContent;
                } else if (child.localName === "BoundingBox") {
                    tileMatrixSet.boundingBox = WmtsLayerCapabilities.assembleBoundingBox(child);
                } else if (child.localName === "TileMatrix") {
                    tileMatrixSet.tileMatrix = tileMatrixSet.tileMatrix || [];
                    tileMatrixSet.tileMatrix.push(WmtsCapabilities.assembleTileMatrix(child));
                }
            }

            WmtsCapabilities.sortTileMatrices(tileMatrixSet);

            for (var i = 0; i < tileMatrixSet.tileMatrix.length; i++) {
                tileMatrixSet.tileMatrix[i].levelNumber = i;
            }

            return tileMatrixSet;
        };

        WmtsCapabilities.assembleTileMatrix = function (element) {
            var tileMatrix = new OwsDescription(element);

            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "Identifier") {
                    tileMatrix.identifier = child.textContent;
                } else if (child.localName === "ScaleDenominator") {
                    tileMatrix.scaleDenominator = parseFloat(child.textContent);
                } else if (child.localName === "TileWidth") {
                    tileMatrix.tileWidth = parseFloat(child.textContent);
                } else if (child.localName === "TileHeight") {
                    tileMatrix.tileHeight = parseFloat(child.textContent);
                } else if (child.localName === "MatrixWidth") {
                    tileMatrix.matrixWidth = parseFloat(child.textContent);
                } else if (child.localName === "MatrixHeight") {
                    tileMatrix.matrixHeight = parseFloat(child.textContent);
                } else if (child.localName === "TopLeftCorner") {
                    var values = child.textContent.split(" ");
                    tileMatrix.topLeftCorner = [parseFloat(values[0]), parseFloat(values[1])];
                }
            }

            return tileMatrix;
        };

        WmtsCapabilities.assembleThemes = function (element) {
            var themes;

            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];
                if (child.localName === "Theme") {
                    themes = themes || [];
                    themes.push(WmtsCapabilities.assembleTheme(child));
                }
            }

            return themes;
        };

        WmtsCapabilities.assembleTheme = function (element) {
            var theme = new OwsDescription(element);

            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "Identifier") {
                    theme.identifier = child.textContent;
                } else if (child.localName === "LayerRef") {
                    theme.layerRef = theme.layerRef || [];
                    theme.layerRef.push(child.textContent);
                } else if (child.localName === "Theme") {
                    theme.themes = theme.themes || [];
                    theme.themes.push(WmtsCapabilities.assembleTheme(child));
                }
            }

            return theme;
        };

        WmtsCapabilities.assembleServiceMetadataURL = function (element) {
            var result = {};

            var link = element.getAttribute("xlink:href");
            if (link) {
                result.url = link;
            }

            return result;
        };

        /**
         * Sorts a tile matrix set by the tile matrices scale denominator.
         * @param tileMatrixSet
         */
        WmtsCapabilities.sortTileMatrices = function (tileMatrixSet) {
            // This operation is not required by the WMTS specification. The WMTS specification assumes Tile Matrix
            // selection based on a scale denominator value. Web WorldWind currently matches the tile's Level to the
            // corresponding Tile Matrix index in the Tile Matrix Set. If the Tile Matrices are not ordered in a
            // typical pyramid fashion, this could result in undefined behavior. Sorting the matrices by the scale
            // denominator should ensure the WorldWind Level will match the Tile Matrix index. This operation will not
            // be required once a system which matches the scale denominator is implemented.
            tileMatrixSet.tileMatrix.sort(function (a, b) {
                return b.scaleDenominator - a.scaleDenominator;
            });
        };

        WmtsCapabilities.prototype.getGetTileKvpAddress = function () {
            for (var i = 0; i < this.operationsMetadata.operation.length; i++) {
                var operation = this.operationsMetadata.operation[i];
                if (operation.name === "GetTile") {
                    return operation.dcp[0].getMethods[0].url;
                }
            }

            return null;
        };

        export default WmtsCapabilities;
    