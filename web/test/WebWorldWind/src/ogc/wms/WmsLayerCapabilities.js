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
 * @exports WmsLayerCapabilities
 */
import ArgumentError from '../../error/ArgumentError';
import Logger from '../../util/Logger';
        

        /**
         * Constructs an WMS Layer instance from an XML DOM.
         * @alias WmsLayerCapabilities
         * @constructor
         * @classdesc Represents a WMS layer description from a WMS Capabilities document. This object holds all the
         * fields specified in the associated WMS Capabilities document.
         * @param {{}} layerElement A WMS Layer element describing the layer.
         * @param {{}} parentNode An object indicating the new layer object's parent object.
         * @throws {ArgumentError} If the specified layer element is null or undefined.
         */
        var WmsLayerCapabilities = function (layerElement, parentNode) {
            if (!layerElement) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmsLayerCapabilities", "constructor",
                        "Layer element is null or undefined."));
            }

            /**
             * The parent object, as specified to the constructor of this object.
             * @type {{}}
             * @readonly
             */
            this.parent = parentNode;

            /**
             * The layers that are children of this layer.
             * @type {WmsLayerCapabilities[]}
             * @readonly
             */
            this.layers;

            /**
             * The name of this layer description.
             * @type {String}
             * @readonly
             */
            this.name;

            /**
             * The title of this layer.
             * @type {String}
             * @readonly
             */
            this.title;

            /**
             * The abstract of this layer.
             * @type {String}
             * @readonly
             */
            this.abstract;

            /**
             * The list of keywords associated with this layer description.
             * @type {String[]}
             * @readonly
             */
            this.keywordList;

            /**
             * The identifiers associated with this layer description. Each identifier has the following properties:
             * authority, content.
             * @type {Object[]}
             */
            this.identifiers;

            /**
             * The metadata URLs associated with this layer description. Each object in the returned array has the
             * following properties: type, format, url.
             * @type {Object[]}
             * @readonly
             */
            this.metadataUrls;

            /**
             * The data URLs associated with this layer description. Each object in the returned array has the
             * following properties: format, url.
             * @type {Object[]}
             * @readonly
             */
            this.dataUrls;

            /**
             * The feature list URLs associated with this layer description. Each object in the returned array has the
             * following properties: format, url.
             * @type {Object[]}
             * @readonly
             */
            this.featureListUrls;

            this.assembleLayer(layerElement);
        };

        Object.defineProperties(WmsLayerCapabilities.prototype, {
            /**
             * The WMS capability section containing this layer description.
             * @type {{}}
             * @readonly
             * @memberof WmsLayerCapabilities.prototype
             */
            capability: {
                get: function () {
                    var o = this;

                    while (o && (o instanceof WmsLayerCapabilities)) {
                        o = o.parent;
                    }

                    return o;
                }
            },

            /**
             * The WMS queryable attribute.
             * @type {Boolean}
             * @readonly
             * @memberof WmsLayerCapabilities.prototype
             */
            queryable: {
                get: function () {
                    return WmsLayerCapabilities.replace(this, "_queryable");
                }
            },

            /**
             * The WMS cascaded attribute.
             * @type {Boolean}
             * @readonly
             * @memberof WmsLayerCapabilities.prototype
             */
            cascaded: {
                get: function () {
                    return WmsLayerCapabilities.replace(this, "_cascaded");
                }
            },

            /**
             * The WMS opaque attribute.
             * @type {Boolean}
             * @readonly
             * @memberof WmsLayerCapabilities.prototype
             */
            opaque: {
                get: function () {
                    return WmsLayerCapabilities.replace(this, "_opaque");
                }
            },

            /**
             * The WMS noSubsets attribute.
             * @type {Boolean}
             * @readonly
             * @memberof WmsLayerCapabilities.prototype
             */
            noSubsets: {
                get: function () {
                    return WmsLayerCapabilities.replace(this, "_noSubsets");
                }
            },

            /**
             * The WMS fixedWidth attribute.
             * @type {Number}
             * @readonly
             * @memberof WmsLayerCapabilities.prototype
             */
            fixedWidth: {
                get: function () {
                    return WmsLayerCapabilities.replace(this, "_fixedWidth");
                }
            },

            /**
             * The WMS fixedHeight attribute.
             * @type {Number}
             * @readonly
             * @memberof WmsLayerCapabilities.prototype
             */
            fixedHeight: {
                get: function () {
                    return WmsLayerCapabilities.replace(this, "_fixedHeight");
                }
            },

            /**
             * The list of styles associated with this layer description, accumulated from this layer and its parent
             * layers. Each object returned may have the following properties: name {String}, title {String},
             * abstract {String}, legendUrls {Object[]}, styleSheetUrl, styleUrl. Legend urls may have the following
             * properties: width, height, format, url. Style sheet urls and style urls have the following properties:
             * format, url.
             * @type {Object[]}
             * @readonly
             * @memberof WmsLayerCapabilities.prototype
             */
            styles: {
                get: function () {
                    return WmsLayerCapabilities.accumulate(this, "_styles", []);
                }
            },

            /**
             * The list of coordinate system descriptions associated with this layer, accumulated from this layer
             * and its parent layers. WMS servers implementing WMS version 1.3.0 and above have this field.
             * @type {String[]}
             * @readonly
             * @memberof WmsLayerCapabilities.prototype
             */
            crses: {
                get: function () {
                    return WmsLayerCapabilities.accumulate(this, "_crses", []);
                }
            },

            /**
             * The list of coordinate system descriptions associated with this layer, accumulated from this layer
             * and its parent layers. WMS servers implementing WMS version 1.1.1 and below have this field.
             * @type {String[]}
             * @readonly
             * @memberof WmsLayerCapabilities.prototype
             */
            srses: {
                get: function () {
                    return WmsLayerCapabilities.accumulate(this, "_srses", []);
                }
            },

            /**
             * This layer description's geographic bounding box. WMS servers implementing WMS 1.3.0 and above have
             * this field. The returned object has properties for each of the WMS-specified fields. For example,
             * "westBoundingLongitude".
             * @type {{}}
             * @readonly
             * @memberof WmsLayerCapabilities.prototype
             */
            geographicBoundingBox: {
                get: function () {
                    return WmsLayerCapabilities.replace(this, "_geographicBoundingBox");
                }
            },

            /**
             * This layer description's geographic bounding box. WMS servers implementing WMS 1.1.1 and below have
             * this field. The returned object has properties for each of the WMS-specified fields. For example,
             * "maxx".
             * @type {{}}
             * @readonly
             * @memberof WmsLayerCapabilities.prototype
             */
            latLonBoundingBox: { // WMS 1.1.1
                get: function () {
                    return WmsLayerCapabilities.replace(this, "_latLonBoundingBox");
                }
            },

            /**
             * The bounding boxes associated with this layer description. The returned object has properties for each
             * of the defined attributes. For example, "minx".
             * @type {{}}
             * @readonly
             * @memberof WmsLayerCapabilities.prototype
             */
            boundingBoxes: {
                get: function () {
                    return WmsLayerCapabilities.replace(this, "_boundingBoxes");
                }
            },

            /**
             * The list of dimensions associated with this layer description, accumulated from this layer and its
             * parent layers. WMS servers implementing WMS version 1.3.0 and above provide this field.
             * @type {String[]}
             * @readonly
             * @memberof WmsLayerCapabilities.prototype
             */
            dimensions: {
                get: function () {
                    var accumulatedDimensions = [],
                        layer = this;

                    // Accumulate only dimensions with unique names with descendants overriding ancestors.
                    while (layer && (layer instanceof WmsLayerCapabilities)) {
                        if (layer._dimensions && layer._dimensions.length > 0) {
                            layer._dimensions.forEach(function (ancestorDimension) {
                                var name = ancestorDimension.name;
                                var include = true;
                                accumulatedDimensions.forEach(function (descendantDimension) {
                                    if (descendantDimension.name === name) {
                                        include = false;
                                    }
                                });
                                if (include) {
                                    accumulatedDimensions.push(ancestorDimension);
                                }
                            });
                        }

                        layer = layer.parent;
                    }

                    return accumulatedDimensions.length > 0 ? accumulatedDimensions : undefined;
                }
            },

            /**
             * The list of extents associated with this layer description, accumulated from this layer and its
             * parent layers. WMS servers implementing WMS version 1.3.0 and above provide this field.
             * @type {String[]}
             * @readonly
             * @memberof WmsLayerCapabilities.prototype
             */
            extents: {
                get: function () {
                    var accumulatedDimensions = [],
                        layer = this;

                    // Accumulate only extents with unique names with descendants overriding ancestors.
                    while (layer && (layer instanceof WmsLayerCapabilities)) {
                        if (layer._extents && layer._extents.length > 0) {
                            layer._extents.forEach(function (ancestorDimension) {
                                var name = ancestorDimension.name;
                                var include = true;
                                accumulatedDimensions.forEach(function (descendantDimension) {
                                    if (descendantDimension.name === name) {
                                        include = false;
                                    }
                                });
                                if (include) {
                                    accumulatedDimensions.push(ancestorDimension);
                                }
                            });
                        }

                        layer = layer.parent;
                    }

                    return accumulatedDimensions.length > 0 ? accumulatedDimensions : undefined;
                }
            },

            /**
             * The attribution element associated with this layer description. The returned object has the following
             * properties: title {String}, url {String}, logoUrl {{format, url}}.
             * @type {{}}
             * @readonly
             * @memberof WmsLayerCapabilities.prototype
             */
            attribution: {
                get: function () {
                    return WmsLayerCapabilities.replace(this, "_attribution");
                }
            },

            /**
             * The authority URLs associated with this layer description, accumulated from this layer and its parent
             * layers. The returned objects have the following properties: name {String}, url {String}.
             * @type {Object[]}
             * @readonly
             * @memberof WmsLayerCapabilities.prototype
             */
            authorityUrls: {
                get: function () {
                    return WmsLayerCapabilities.accumulate(this, "_authorityUrls", []);
                }
            },

            /**
             * The minimum-scale-denominator associated with this layer description.
             * WMS servers implementing WMS version 1.3.0 and above provide this field.
             * @type {Number}
             * @readonly
             * @memberof WmsLayerCapabilities.prototype
             */
            minScaleDenominator: {
                get: function () {
                    return WmsLayerCapabilities.replace(this, "_minScaleDenominator");
                }
            },

            /**
             * The maximum-scale-denominator associated with this layer description.
             * WMS servers implementing WMS version 1.3.0 and above provide this field.
             * @type {Number}
             * @readonly
             * @memberof WmsLayerCapabilities.prototype
             */
            maxScaleDenominator: {
                get: function () {
                    return WmsLayerCapabilities.replace(this, "_maxScaleDenominator");
                }
            },

            /**
             * The scale hint associated with this layer description.
             * WMS servers implementing WMS version 1.1.1 and below provide this field.
             * @type {Number}
             * @readonly
             * @memberof WmsLayerCapabilities.prototype
             */
            scaleHint: {
                get: function () {
                    return WmsLayerCapabilities.replace(this, "_scaleHint");
                }
            }
        });

        WmsLayerCapabilities.prototype.style = function(name) {
            if (!name) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmsLayerCapabilities", "style",
                        "Style name is null or undefined."));
            }

            var styles = this.styles;
            if (!styles) {
                return null;
            }

            for (var i = 0, len = styles.length, style; i < len; i++) {
                style = styles[i];
                if (style.name === name) {
                    return style;
                }
            }
        }

        WmsLayerCapabilities.accumulate = function (layer, propertyName, accumulation) {
            // Accumulate all of the named properties in the specified layer and its ancestors.
            while (layer && (layer instanceof WmsLayerCapabilities)) {
                var property = layer[propertyName];

                if (property) {
                    for (var i = 0; i < property.length; i++) {
                        accumulation.push(property[i]);
                    }
                }

                layer = layer.parent;
            }

            return accumulation.length > 0 ? accumulation : null;
        };

        WmsLayerCapabilities.replace = function (layer, propertyName) {
            // Find the first property instance encountered from the specified layer upwards through its ancestors.
            while (layer && (layer instanceof WmsLayerCapabilities)) {
                var property = layer[propertyName];

                if (property) {
                    return property;
                } else {
                    layer = layer.parent;
                }
            }
        };

        WmsLayerCapabilities.prototype.assembleLayer = function (layerElement) {
            var elements, attrValue, c, e;

            attrValue = layerElement.getAttribute("queryable");
            if (attrValue) {
                this._queryable = attrValue === "1" || attrValue === "true"
            }

            attrValue = layerElement.getAttribute("opaque");
            if (attrValue) {
                this._opaque = attrValue === "1" || attrValue === "true"
            }

            attrValue = layerElement.getAttribute("noSubsets");
            if (attrValue) {
                this._noSubsets = attrValue === "1" || attrValue === "true"
            }

            attrValue = layerElement.getAttribute("cascaded");
            if (attrValue) {
                this._cascaded = parseInt("10");
            }

            attrValue = layerElement.getAttribute("fixedWidth");
            if (attrValue) {
                this._fixedWidth = parseInt("10");
            }

            attrValue = layerElement.getAttribute("fixedHeight");
            if (attrValue) {
                this._fixedHeight = parseInt("10");
            }

            var children = layerElement.children || layerElement.childNodes;
            for (c = 0; c < children.length; c++) {
                var childElement = children[c];

                if (childElement.localName === "Layer") {
                    if (!this.layers) {
                        this.layers = [];
                    }
                    this.layers.push(new WmsLayerCapabilities(childElement, this));

                } else if (childElement.localName === "Name") {
                    this.name = childElement.textContent;

                } else if (childElement.localName === "Title") {
                    this.title = childElement.textContent;

                } else if (childElement.localName === "Abstract") {
                    this.abstract = childElement.textContent;

                } else if (childElement.localName === "KeywordList") {
                    this.keywordList = this.keywordList || [];

                    var children2 = childElement.children || childElement.childNodes;
                    for (var c2 = 0; c2 < children2.length; c2++) {
                        var child2 = children2[c2];

                        if (child2.localName === "Keyword") {
                            this.keywordList.push(child2.textContent);
                        }
                    }
                } else if (childElement.localName === "Style") {
                    if (!this._styles) {
                        this._styles = [];
                    }
                    this._styles.push(WmsLayerCapabilities.assembleStyle(childElement))

                } else if (childElement.localName === "CRS") {
                    if (!this._crses) {
                        this._crses = [];
                    }
                    this._crses.push(childElement.textContent);

                } else if (childElement.localName === "SRS") { // WMS 1.1.1
                    if (!this._srses) {
                        this._srses = [];
                    }
                    this._srses.push(childElement.textContent);

                } else if (childElement.localName === "EX_GeographicBoundingBox") {
                    this._geographicBoundingBox = WmsLayerCapabilities.assembleGeographicBoundingBox(childElement);

                } else if (childElement.localName === "LatLonBoundingBox") { // WMS 1.1.1
                    this._geographicBoundingBox = WmsLayerCapabilities.assembleLatLonBoundingBox(childElement);

                } else if (childElement.localName === "BoundingBox") {
                    if (!this._boundingBoxes) {
                        this._boundingBoxes = [];
                    }
                    this._boundingBoxes.push(WmsLayerCapabilities.assembleBoundingBox(childElement));

                } else if (childElement.localName === "Dimension") {
                    if (!this._dimensions) {
                        this._dimensions = [];
                    }
                    this._dimensions.push(WmsLayerCapabilities.assembleDimension(childElement));

                } else if (childElement.localName === "Extent") { // WMS 1.1.1
                    if (!this._extents) {
                        this._extents = [];
                    }
                    this._extents.push(WmsLayerCapabilities.assembleDimension(childElement)); // same schema as 1.3.0 Dimension

                } else if (childElement.localName === "Attribution") {
                    this._attribution = WmsLayerCapabilities.assembleAttribution(childElement);

                } else if (childElement.localName === "AuthorityURL") {
                    if (!this._authorityUrls) {
                        this._authorityUrls = [];
                    }
                    this._authorityUrls.push(WmsLayerCapabilities.assembleAuthorityUrl(childElement));

                } else if (childElement.localName === "Identifier") {
                    if (!this.identifiers) {
                        this.identifiers = [];
                    }
                    this.identifiers.push(WmsLayerCapabilities.assembleIdentifier(childElement));

                } else if (childElement.localName === "MetadataURL") {
                    if (!this.metadataUrls) {
                        this.metadataUrls = [];
                    }
                    this.metadataUrls.push(WmsLayerCapabilities.assembleMetadataUrl(childElement));

                } else if (childElement.localName === "DataURL") {
                    if (!this.dataUrls) {
                        this.dataUrls = [];
                    }
                    this.dataUrls.push(WmsLayerCapabilities.assembleUrl(childElement));

                } else if (childElement.localName === "FeatureListURL") {
                    if (!this.featureListUrls) {
                        this.featureListUrls = [];
                    }
                    this.featureListUrls.push(WmsLayerCapabilities.assembleUrl(childElement));

                } else if (childElement.localName === "MinScaleDenominator") {
                    this._minScaleDenominator = parseFloat(childElement.textContent);

                } else if (childElement.localName === "MaxScaleDenominator") {
                    this._maxScaleDenominator = parseFloat(childElement.textContent);

                } else if (childElement.localName === "ScaleHint") { // WMS 1.1.1
                    this._scaleHint = {};
                    this._scaleHint.min = WmsLayerCapabilities.getFloatAttribute(childElement, "min");
                    this._scaleHint.max = WmsLayerCapabilities.getFloatAttribute(childElement, "max");
                }
            }
        };

        WmsLayerCapabilities.assembleStyle = function (styleElement) {
            var result = {};

            var children = styleElement.children || styleElement.childNodes;
            for (var c = 0; c < children.length; c++) {
                var childElement = children[c];

                if (childElement.localName === "Name") {
                    result.name = childElement.textContent;

                } else if (childElement.localName === "Title") {
                    result.title = childElement.textContent;

                } else if (childElement.localName === "Abstract") {
                    result.abstract = childElement.textContent;

                } else if (childElement.localName === "LegendURL") {
                    if (!result.legendUrls) {
                        result.legendUrls = [];
                    }
                    result.legendUrls.push(WmsLayerCapabilities.assembleLegendUrl(childElement));

                } else if (childElement.localName === "StyleSheetURL") {
                    result.styleSheetUrl = WmsLayerCapabilities.assembleUrl(childElement);

                } else if (childElement.localName === "StyleURL") {
                    result.styleUrl = WmsLayerCapabilities.assembleUrl(childElement);
                }
            }

            return result;
        };

        WmsLayerCapabilities.assembleGeographicBoundingBox = function (bboxElement) {
            var result = {};

            var children = bboxElement.children || bboxElement.childNodes;
            for (var c = 0; c < children.length; c++) {
                var childElement = children[c];

                if (childElement.localName === "westBoundLongitude") {
                    result.westBoundLongitude = parseFloat(childElement.textContent);

                } else if (childElement.localName === "eastBoundLongitude") {
                    result.eastBoundLongitude = parseFloat(childElement.textContent);

                } else if (childElement.localName === "southBoundLatitude") {
                    result.southBoundLatitude = parseFloat(childElement.textContent);

                } else if (childElement.localName === "northBoundLatitude") {
                    result.northBoundLatitude = parseFloat(childElement.textContent);
                }
            }

            return result;
        };

        WmsLayerCapabilities.assembleLatLonBoundingBox = function (bboxElement) { // WMS 1.1.1
            var result = {};

            result.minx = WmsLayerCapabilities.getFloatAttribute(bboxElement, "minx");
            result.miny = WmsLayerCapabilities.getFloatAttribute(bboxElement, "miny");
            result.maxx = WmsLayerCapabilities.getFloatAttribute(bboxElement, "maxx");
            result.maxy = WmsLayerCapabilities.getFloatAttribute(bboxElement, "maxy");

            return result;
        };

        WmsLayerCapabilities.assembleBoundingBox = function (bboxElement) {
            var result = {};

            result.crs = bboxElement.getAttribute("CRS");
            result.minx = WmsLayerCapabilities.getFloatAttribute(bboxElement, "minx");
            result.miny = WmsLayerCapabilities.getFloatAttribute(bboxElement, "miny");
            result.maxx = WmsLayerCapabilities.getFloatAttribute(bboxElement, "maxx");
            result.maxy = WmsLayerCapabilities.getFloatAttribute(bboxElement, "maxy");
            result.resx = WmsLayerCapabilities.getFloatAttribute(bboxElement, "resx");
            result.resy = WmsLayerCapabilities.getFloatAttribute(bboxElement, "resy");

            return result;
        };

        WmsLayerCapabilities.assembleDimension = function (dimensionElement) {
            var result = {};

            result.name = dimensionElement.getAttribute("name");
            result.units = dimensionElement.getAttribute("units");
            result.unitSymbol = dimensionElement.getAttribute("unitSymbol");
            result.default = dimensionElement.getAttribute("default");
            result.multipleValues = dimensionElement.getAttribute("multipleValues");
            if (result.multipleValues) {
                result.multipleValues = result.multipleValues === "true" || result.multipleValues === "1";
            }
            result.nearestValue = dimensionElement.getAttribute("nearestValue");
            if (result.nearestValue) {
                result.nearestValue = result.nearestValue === "true" || result.nearestValue === "1";
            }
            result.current = dimensionElement.getAttribute("current");
            if (result.current) {
                result.current = result.current === "true" || result.current === "1";
            }

            result.content = dimensionElement.textContent;

            return result;
        };

        WmsLayerCapabilities.assembleAttribution = function (attributionElement) {
            var result = {};

            var children = attributionElement.children || attributionElement.childNodes;
            for (var c = 0; c < children.length; c++) {
                var childElement = children[c];

                if (childElement.localName === "Title") {
                    result.title = childElement.textContent;

                } else if (childElement.localName === "OnlineResource") {
                    result.url = childElement.getAttribute("xlink:href");

                } else if (childElement.localName === "LogoUrul") {
                    result.logoUrl = WmsLayerCapabilities.assembleLogoUrl(childElement);
                }
            }

            return result;
        };

        WmsLayerCapabilities.assembleAuthorityUrl = function (urlElement) {
            var result = {};

            result.name = urlElement.getAttribute("name");

            var children = urlElement.children || urlElement.childNodes;
            for (var c = 0; c < children.length; c++) {
                var childElement = children[c];

                if (childElement.localName === "OnlineResource") {
                    result.url = childElement.getAttribute("xlink:href");
                }
            }

            return result;
        };

        WmsLayerCapabilities.assembleIdentifier = function (identifierElement) {
            var result = {};

            result.authority = identifierElement.getAttribute("authority");
            result.content = identifierElement.textContent;

            return result;
        };

        WmsLayerCapabilities.assembleMetadataUrl = function (urlElement) {
            var result = {};

            result.type = urlElement.getAttribute("type");

            var children = urlElement.children || urlElement.childNodes;
            for (var c = 0; c < children.length; c++) {
                var childElement = children[c];

                if (childElement.localName === "Format") {
                    result.format = childElement.textContent;

                } else if (childElement.localName === "OnlineResource") {
                    result.url = childElement.getAttribute("xlink:href");
                }
            }

            return result;
        };

        WmsLayerCapabilities.assembleLegendUrl = function (urlElement) {
            var result = {};

            result.width = WmsLayerCapabilities.getIntegerAttribute(urlElement, "width");
            result.height = WmsLayerCapabilities.getIntegerAttribute(urlElement, "height");

            var children = urlElement.children || urlElement.childNodes;
            for (var c = 0; c < children.length; c++) {
                var childElement = children[c];

                if (childElement.localName === "Format") {
                    result.format = childElement.textContent;

                } else if (childElement.localName === "OnlineResource") {
                    result.url = childElement.getAttribute("xlink:href");
                }
            }

            return result;
        };

        WmsLayerCapabilities.assembleLogoUrl = function (urlElement) {
            var result = {};

            result.width = WmsLayerCapabilities.getIntegerAttribute(urlElement, "width");
            result.height = WmsLayerCapabilities.getIntegerAttribute(urlElement, "height");

            var children = urlElement.children || urlElement.childNodes;
            for (var c = 0; c < children.length; c++) {
                var childElement = children[c];

                if (childElement.localName === "Format") {
                    result.format = childElement.textContent;

                } else if (childElement.localName === "OnlineResource") {
                    result.url = childElement.getAttribute("xlink:href");
                }
            }

            return result;
        };

        WmsLayerCapabilities.assembleUrl = function (urlElement) {
            var result = {};

            var children = urlElement.children || urlElement.childNodes;
            for (var c = 0; c < children.length; c++) {
                var childElement = children[c];

                if (childElement.localName === "Format") {
                    result.format = childElement.textContent;

                } else if (childElement.localName === "OnlineResource") {
                    result.url = childElement.getAttribute("xlink:href");
                }
            }

            return result;
        };

        WmsLayerCapabilities.getIntegerAttribute = function (element, attrName) {
            var result = element.getAttribute(attrName);

            if (result) {
                result = parseInt(result);
            } else {
                result = undefined;
            }

            return result;
        };

        WmsLayerCapabilities.getFloatAttribute = function (element, attrName) {
            var result = element.getAttribute(attrName);

            if (result) {
                result = parseFloat(result);
            } else {
                result = undefined;
            }

            return result;
        };

        export default WmsLayerCapabilities;
    