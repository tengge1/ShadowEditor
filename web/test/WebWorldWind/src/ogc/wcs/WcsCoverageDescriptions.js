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
 * @exports WcsCoverageDescriptions
 */
import ArgumentError from '../../error/ArgumentError';
import GmlBoundedBy from '../../ogc/gml/GmlBoundedBy';
import GmlDomainSet from '../../ogc/gml/GmlDomainSet';
import GmlRectifiedGrid from '../../ogc/gml/GmlRectifiedGrid';
import Logger from '../../util/Logger';
import OwsKeywords from '../../ogc/ows/OwsKeywords';
import Sector from '../../geom/Sector';
        

        /**
         * Constructs a simple javascript object representation of an OGC WCS Describe Coverage XML response.
         * @alias WcsCoverageDescriptions
         * @constructor
         * @classdesc Represents the common properties of a WCS CoverageDescription document. Common properties are
         * parsed and mapped to a plain javascript object model. Most fields can be accessed as properties named
         * according to their document names converted to camel case. This model supports version 1.0.0 and 2.0.x of the
         * WCS specification. Not all properties are mapped to this representative javascript object model, but the
         * provided XML DOM is maintained in xmlDom property for reference.
         * @param {{}} xmlDom an XML DOM representing the WCS DescribeCoverage document.
         * @throws {ArgumentError} If the specified XML DOM is null or undefined.
         */
        var WcsCoverageDescriptions = function (xmlDom) {
            if (!xmlDom) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WcsCoverageDescriptions", "constructor", "missingDom"));
            }

            /**
             * The original unmodified XML document. Referenced for use in advanced cases.
             * @type {{}}
             */
            this.xmlDom = xmlDom;

            this.assembleDocument();
        };

        /**
         * Get the bounding Sector for the provided coverage id or name.
         * @param coverageId the coverageId or name
         * @returns {Sector} the bounding Sector
         */
        WcsCoverageDescriptions.prototype.getSector = function (coverageId) {
            if (!coverageId) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WcsCoverageDescriptions", "getSector", "missingId"));
            }
            var coverage = this.getCoverage(coverageId), envelope;

            if (!coverage) {
                return null;
            }

            if (this.version === "1.0.0") {
                envelope = coverage.lonLatEnvelope.pos;
                return new Sector(
                    envelope[0][1],
                    envelope[1][1],
                    envelope[0][0],
                    envelope[1][0]);
            } else if (this.version === "2.0.1" || this.version === "2.0.0") {
                envelope = coverage.boundedBy.envelope;
                return new Sector(
                    envelope.lower[0],
                    envelope.upper[0],
                    envelope.lower[1],
                    envelope.upper[1]);
            }

            return null;
        };

        /**
         * Calculates the resolution of the provided coverage id in degrees.
         * @param coverageId the coverage id or name
         * @returns {number} resolution in degrees
         */
        WcsCoverageDescriptions.prototype.getResolution = function (coverageId) {
            if (!coverageId) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WcsCoverageDescriptions", "getResolution", "missingId"));
            }
            var coverage = this.getCoverage(coverageId), sector = this.getSector(coverageId), xLow, yLow, xHigh, yHigh,
                xRes, yRes;

            if (!coverage) {
                return null;
            }

            if (this.version === "1.0.0") {
                xLow = coverage.domainSet.spatialDomain.rectifiedGrid.limits.low[0];
                yLow = coverage.domainSet.spatialDomain.rectifiedGrid.limits.low[1];
                xHigh = coverage.domainSet.spatialDomain.rectifiedGrid.limits.high[0];
                yHigh = coverage.domainSet.spatialDomain.rectifiedGrid.limits.high[1];
            } else if (this.version === "2.0.1" || this.version === "2.0.0") {
                xLow = coverage.domainSet.rectifiedGrid.limits.low[0];
                yLow = coverage.domainSet.rectifiedGrid.limits.low[1];
                xHigh = coverage.domainSet.rectifiedGrid.limits.high[0];
                yHigh = coverage.domainSet.rectifiedGrid.limits.high[1];
            }

            xRes = sector.deltaLongitude() / (xHigh - xLow);
            yRes = sector.deltaLatitude() / (yHigh - yLow);

            return Math.max(xRes, yRes);
        };

        /**
         * Returns an array of the supported coordinates reference systems for the provided coverage.
         * @param coverageId the coverage id or name
         */
        WcsCoverageDescriptions.prototype.getSupportedCrs = function (coverageId) {
            if (!coverageId) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WcsCoverageDescriptions", "getSupportedCrs", "missingId"));
            }
            var coverage = this.getCoverage(coverageId), crses = [];

            if (!coverage) {
                return null;
            }

            if (this.version === "1.0.0") {
                return coverage.supportedCrs.requests;
            } else if (this.version === "2.0.1" || this.version === "2.0.0") {
                crses.push(coverage.boundedBy.envelope.srsName);
                return crses;
            }

            return null;
        };

        // Internal. Intentionally not documented.
        WcsCoverageDescriptions.prototype.getCoverage = function (coverageId) {
            for (var i = 0, len = this.coverages.length; i < len; i++) {
                if (coverageId === (this.coverages[i].coverageId || this.coverages[i].name)) {
                    return this.coverages[i];
                }
            }

            return null;
        };

        // Internal. Intentionally not documented.
        WcsCoverageDescriptions.prototype.assembleDocument = function () {
            // Determine version and update sequence
            var root = this.xmlDom.documentElement;

            if (root.localName === "CoverageDescription") {
                this.assembleDocument100(root);
                this.version = "1.0.0";
            } else if (root.localName === "CoverageDescriptions") {
                this.assembleDocument20x(root);
                this.version = root.getAttribute("version") || "2.0.1"; // work around for geoserver bug
            } else {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WcsCapabilities", "assembleDocument", "unsupportedVersion"));
            }
        };

        // Internal. Intentionally not documented.
        WcsCoverageDescriptions.prototype.assembleDocument100 = function (element) {
            this.version = element.getAttribute("version");

            var children = element.children || element.childNodes;

            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "CoverageOffering") {
                    this.coverages = this.coverages || [];
                    this.coverages.push(this.assembleCoverages100(child));
                }
            }
        };

        // Internal. Intentionally not documented.
        WcsCoverageDescriptions.prototype.assembleDocument20x = function (element) {
            var children = element.children || element.childNodes;

            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "CoverageDescription") {
                    this.coverages = this.coverages || [];
                    this.coverages.push(this.assembleCoverages20x(child));
                }
            }
        };

        // Internal. Intentionally not documented.
        WcsCoverageDescriptions.prototype.assembleCoverages100 = function (element) {
            var children = element.children || element.childNodes, coverage = {};
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "name") {
                    coverage.name = child.textContent;
                } else if (child.localName === "description") {
                    coverage.description = child.textContent;
                } else if (child.localName === "label") {
                    coverage.label = child.textContent;
                } else if (child.localName === "keywords") {
                    // the OWS keywords namespace isn't used but the format is similar
                    coverage.keywords = new OwsKeywords(child).keywords;
                } else if (child.localName === "lonLatEnvelope") {
                    coverage.lonLatEnvelope = this.assembleLonLatEnvelope100(child);
                } else if (child.localName === "supportedCRSs") {
                    coverage.supportedCrs = this.assembleSupportedCrs100(child);
                } else if (child.localName === "supportedFormats") {
                    coverage.supportedFormats = this.assembleSupportedFormats100(child);
                } else if (child.localName === "supportedInterpolations") {
                    coverage.supportedInterpolations = this.assembleSupportedInterpolations100(child);
                } else if (child.localName === "domainSet") {
                    coverage.domainSet = this.assembleDomainSet100(child);
                } else if (child.localName === "rangeSet") {
                    coverage.rangeSet = this.assembleRangeSet100(child);
                }
            }

            return coverage;
        };

        // Internal. Intentionally not documented.
        WcsCoverageDescriptions.prototype.assembleCoverages20x = function (element) {
            var children = element.children || element.childNodes, coverage = {};
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "CoverageId") {
                    coverage.coverageId = child.textContent;
                } else if (child.localName === "domainSet") {
                    coverage.domainSet = new GmlDomainSet(child);
                } else if (child.localName === "boundedBy") {
                    coverage.boundedBy = new GmlBoundedBy(child);
                } else if (child.localName === "ServiceParameters") {
                    coverage.serviceParameters = this.assembleServiceParameters20x(child);
                } else if (child.localName === "rangeType") {
                    // The information from rangeType is not required for forming a request. Instead of implementing a
                    // complex parser for the SWE DataRecord, a reference to the particular dom element will be provided
                    coverage.rangeType = child;
                }
            }

            return coverage;
        };

        // Internal. Intentionally not documented.
        WcsCoverageDescriptions.prototype.assembleServiceParameters20x = function (element) {
            var children = element.children || element.childNodes, serviceParameters = {};

            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "nativeFormat") {
                    serviceParameters.nativeFormat = child.textContent;
                } else if (child.localName === "CoverageSubtype") {
                    serviceParameters.coverageSubtype = child.textContent;
                }
                // TODO CoverageSubtypeParent, Extension
            }

            return serviceParameters;
        };

        // Internal. Intentionally not documented.
        WcsCoverageDescriptions.prototype.assembleLonLatEnvelope100 = function (element) {
            var children = element.children || element.childNodes, latLonEnvelope = {};

            latLonEnvelope.srsName = element.getAttribute("srsName");

            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "pos") {
                    latLonEnvelope.pos = latLonEnvelope.pos || [];
                    latLonEnvelope.pos.push(WcsCoverageDescriptions.parseSpacedFloatArray(child.textContent));
                }
            }

            return latLonEnvelope;
        };

        // Internal. Intentionally not documented.
        WcsCoverageDescriptions.prototype.assembleSupportedCrs100 = function (element) {
            var children = element.children || element.childNodes, supportedCrs = {};

            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "requestResponseCRSs") {
                    supportedCrs.requests = supportedCrs.requests || [];
                    supportedCrs.requests.push(child.textContent);
                    supportedCrs.responses = supportedCrs.responses || [];
                    supportedCrs.responses.push(child.textContent);
                } else if (child.localName === "requestCRSs") {
                    supportedCrs.requests = supportedCrs.requests || [];
                    supportedCrs.push(child.textContent);
                } else if (child.localName === "responseCRSs") {
                    supportedCrs.responses = supportedCrs.responses || [];
                    supportedCrs.push(child.textContent);
                } else if (child.localName === "NativeCRSs") {
                    supportedCrs.nativeCrs = supportedCrs.nativeCrs || [];
                    supportedCrs.push(child.textContent);
                }
            }

            return supportedCrs;
        };

        // Internal. Intentionally not documented.
        WcsCoverageDescriptions.prototype.assembleSupportedFormats100 = function (element) {
            var children = element.children || element.childNodes, supportedFormats = {};

            supportedFormats.nativeFormat = element.getAttribute("nativeFormat");

            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "formats") {
                    supportedFormats.formats = supportedFormats.formats || [];
                    supportedFormats.formats.push(child.textContent);
                }
            }

            return supportedFormats;
        };

        // Internal. Intentionally not documented.
        WcsCoverageDescriptions.prototype.assembleSupportedInterpolations100 = function (element) {
            var children = element.children || element.childNodes, supportedInterpolations = {};

            supportedInterpolations.default = element.getAttribute("default");

            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "interpolationMethod") {
                    supportedInterpolations.methods = supportedInterpolations.methods || [];
                    supportedInterpolations.methods.push(child.textContent);
                }
            }

            return supportedInterpolations;
        };

        // Internal. Intentionally not documented.
        WcsCoverageDescriptions.prototype.assembleDomainSet100 = function (element) {
            var children = element.children || element.childNodes, domainSet = {};

            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "spatialDomain") {
                    domainSet.spatialDomain = this.assembleSpatialDomain100(child);
                }
            }

            return domainSet;
        };

        // Internal. Intentionally not documented.
        WcsCoverageDescriptions.prototype.assembleSpatialDomain100 = function (element) {
            var children = element.children || element.childNodes, spatialDomain = {};

            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "Envelope") {
                    spatialDomain.envelope = this.assembleLonLatEnvelope100(child);
                } else if (child.localName === "RectifiedGrid") {
                    spatialDomain.rectifiedGrid = new GmlRectifiedGrid(child);
                }
            }

            return spatialDomain;
        };

        // Internal. Intentionally not documented.
        WcsCoverageDescriptions.prototype.assembleRangeSet100 = function (element) {
            var children = element.children || element.childNodes, rangeSet = {};

            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "RangeSet") {
                    // Jump into the first similarly named element
                    return this.assembleRangeSetElement100(child);
                }
            }
        };

        // Internal. Intentionally not documented.
        WcsCoverageDescriptions.prototype.assembleRangeSetElement100 = function (element) {
            var children = element.children || element.childNodes, rangeSet = {};

            rangeSet.semantic = element.getAttribute("semantic");
            rangeSet.refSys = element.getAttribute("refSys");
            rangeSet.refSysLable = element.getAttribute("refSysLabel");

            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "name") {
                    rangeSet.name = child.textContent;
                } else if (child.localName === "label") {
                    rangeSet.label = child.textContent;
                } else if (child.localName === "axisDescription") {
                    rangeSet.axisDescriptions = this.assembleRangeSetAxisDescription100(child);
                }
            }

            return rangeSet;
        };

        // Internal. Intentionally not documented.
        WcsCoverageDescriptions.prototype.assembleRangeSetAxisDescription100 = function (element) {
            var children = element.children || element.childNodes, axisDescriptions = [];

            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "AxisDescription") {
                    axisDescriptions.push(this.assembleRangeSetAxisDescriptionElement100(child));
                }
            }

            return axisDescriptions;
        };

        // Internal. Intentionally not documented.
        WcsCoverageDescriptions.prototype.assembleRangeSetAxisDescriptionElement100 = function (element) {
            var children = element.children || element.childNodes, axisDescription = {};

            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "name") {
                    axisDescription.name = child.textContent;
                } else if (child.localName === "label") {
                    axisDescription.label = child.textContent;
                } else if (child.localName === "values") {
                    axisDescription.values = this.assembleRangeSetValues100(child);
                }
            }

            return axisDescription;
        };

        // Internal. Intentionally not documented.
        WcsCoverageDescriptions.prototype.assembleRangeSetValues100 = function (element) {
            var children = element.children || element.childNodes, values = {};

            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "singleValue") {
                    values.singleValue = child.textContent;
                }
                // TODO intervals value type
            }

            return values;
        };

        // Internal. Intentionally not documented.
        WcsCoverageDescriptions.parseSpacedFloatArray = function (line) {
            var result = [], elements = line.split(/\s+/);

            for (var i = 0; i < elements.length; i++) {
                result.push(parseFloat(elements[i]));
            }

            return result;
        };

        export default WcsCoverageDescriptions;
    
