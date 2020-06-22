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
 * @exports WcsCapabilities
 */
import ArgumentError from '../../error/ArgumentError';
import Logger from '../../util/Logger';
import OwsDatasetSummary from '../../ogc/ows/OwsDatasetSummary';
import OwsKeywords from '../../ogc/ows/OwsKeywords';
import OwsOperationsMetadata from '../../ogc/ows/OwsOperationsMetadata';
import OwsServiceIdentification from '../../ogc/ows/OwsServiceIdentification';
import OwsServiceProvider from '../../ogc/ows/OwsServiceProvider';
        

        /**
         * Constructs an OGC WCS Capabilities instance from an XML DOM.
         * @alias WcsCapabilities
         * @constructor
         * @classdesc Represents the common properties of a WCS Capabilities document. Common properties are parsed and
         * mapped to a plain javascript object model. Most fields can be accessed as properties named according to their
         * document names converted to camel case. This model supports version 1.0.0 and 2.0.x of the WCS specification.
         * Not all properties are mapped to this representative javascript object model, but the provided XML dom is
         * maintained in xmlDom property for reference.
         * @param {{}} xmlDom an XML DOM representing the WCS Capabilities document.
         * @throws {ArgumentError} If the specified XML DOM is null or undefined.
         */
        var WcsCapabilities = function (xmlDom) {
            if (!xmlDom) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WcsCapabilities", "constructor", "missingDom"));
            }

            /**
             * The original unmodified XML document. Referenced for use in advanced cases.
             * @type {{}}
             */
            this.xmlDom = xmlDom;

            this.assembleDocument();
        };

        /**
         * Returns the GetCoverage base url as detailed in the capabilities document
         */
        WcsCapabilities.prototype.getCoverageBaseUrl = function () {
            if (this.version === "1.0.0") {
                return this.capability.request.getCoverage.get;
            } else if (this.version === "2.0.1" || this.version === "2.0.0") {
                return this.operationsMetadata.getOperationMetadataByName("GetCoverage").dcp[0].getMethods[0].url;
            }

            return null;
        };

        // Internal. Intentionally not documented.
        WcsCapabilities.prototype.assembleDocument = function () {
            // Determine version and update sequence
            var root = this.xmlDom.documentElement;

            this.version = root.getAttribute("version");
            this.updateSequence = root.getAttribute("updateSequence");

            // WCS 1.0.0 does not utilize OWS Common GetCapabilities service and capability descriptions.
            if (this.version === "1.0.0") {
                this.assembleDocument100(root);
            } else if (this.version === "2.0.0" || this.version === "2.0.1") {
                this.assembleDocument20x(root);
            } else {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WcsCapabilities", "assembleDocument", "unsupportedVersion"));
            }
        };

        // Internal. Intentionally not documented.
        WcsCapabilities.prototype.assembleDocument100 = function (root) {
            var children = root.children || root.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "Service") {
                    this.service = this.assembleService100(child);
                } else if (child.localName === "Capability") {
                    this.capability = this.assembleCapability100(child);
                } else if (child.localName === "ContentMetadata") {
                    this.assembleContents100(child);
                }
            }
        };

        // Internal. Intentionally not documented.
        WcsCapabilities.prototype.assembleDocument20x = function (root) {
            var children = root.children || root.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "ServiceIdentification") {
                    this.serviceIdentification = new OwsServiceIdentification(child);
                } else if (child.localName === "ServiceProvider") {
                    this.serviceProvider = new OwsServiceProvider(child);
                } else if (child.localName === "OperationsMetadata") {
                    this.operationsMetadata = new OwsOperationsMetadata(child);
                } else if (child.localName === "ServiceMetadata") {
                    this.serviceMetadata = this.assembleServiceMetadata(child);
                } else if (child.localName === "Contents") {
                    this.assembleContents20x(child);
                }
            }
        };

        // Internal. Intentionally not documented.
        WcsCapabilities.prototype.assembleContents100 = function (element) {
            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "CoverageOfferingBrief") {
                    this.coverages = this.coverages || [];
                    this.coverages.push(this.assembleCoverages100(child));
                }
            }
        };

        WcsCapabilities.prototype.assembleContents20x = function (element) {
            var children = element.children || element.childNodes, coverage;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "CoverageSummary") {
                    coverage = new OwsDatasetSummary(child);
                    this.assembleDatasetAugment20x(child, coverage);
                    this.coverages = this.coverages || [];
                    this.coverages.push(coverage);
                }
            }
        };

        // Internal. Intentionally not documented.
        WcsCapabilities.prototype.assembleDatasetAugment20x = function (element, coverage) {
            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "CoverageId") {
                    coverage.coverageId = child.textContent;
                } else if (child.localName === "CoverageSubtype") {
                    coverage.subType = coverage.subType || [];
                    coverage.subType.push(child.textContent);
                }
            }
        };

        // Internal. Intentionally not documented.
        WcsCapabilities.prototype.assembleCoverages100 = function (element) {
            var children = element.children || element.childNodes, coverage = {};
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "name") {
                    coverage.name = child.textContent;
                } else if (child.localName === "description") {
                    coverage.description = child.textContent;
                } else if (child.localName === "label") {
                    coverage.label = child.textContent;
                } else if (child.localName === "Keywords") {
                    // WCS 1.0.0 does not use OWS Keywords by namespace, but the implementation is identical
                    coverage.keywords = coverage.keywords || [];
                    coverage.keywords.push(new OwsKeywords(child));
                } else if (child.localName === "lonLatEnvelope") {
                    coverage.wgs84BoundingBox = this.assembleLatLonBoundingBox(child);
                }
            }

            return coverage;
        };

        // Internal. Intentionally not documented.
        WcsCapabilities.prototype.assembleService100 = function (element) {
            var children = element.children || element.childNodes, service = {};
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "description") {
                    service.description = child.textContent;
                } else if (child.localName === "name") {
                    service.name = child.textContent;
                } else if (child.localName === "label") {
                    service.label = child.textContent;
                } else if (child.localName === "fees") {
                    service.fees = child.textContent;
                } else if (child.localName === "accessConstraints") {
                    service.accessConstraints = service.accessConstraints || [];
                    service.accessConstraints.push(child.textContent);
                } else if (child.localName === "Keywords") {
                    // WCS 1.0.0 doesn't use the ogc namespace keywords, but the implementation is identical
                    service.keywords = new OwsKeywords(child);
                }

            }

            return service;
        };

        // Internal. Intentionally not documented.
        WcsCapabilities.prototype.assembleCapability100 = function (element) {
            var children = element.children || element.childNodes, capability = {};
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "Request") {
                    capability.request = this.assembleRequestCapabilities100(child);
                } else if (child.localName === "Exception") {
                    child = child.children || child.childNodes;
                    child = child[0];
                    // child should now be the Format element
                    capability.exception = capability.exception || [];
                    capability.exception.push(child.textContent);
                }
            }

            return capability;
        };

        // Internal. Intentionally not documented.
        WcsCapabilities.prototype.assembleRequestCapabilities100 = function (element) {
            var children = element.children || element.childNodes, request = {};
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "GetCapabilities") {
                    request.getCapabilities = this.assembleDCPType100(child);
                } else if (child.localName === "DescribeCoverage") {
                    request.describeCoverage = this.assembleDCPType100(child);
                } else if (child.localName === "GetCoverage") {
                    request.getCoverage = this.assembleDCPType100(child);
                }
            }

            return request;
        };

        // Internal. Intentionally not documented.
        WcsCapabilities.prototype.assembleDCPType100 = function (element) {
            var children = element.children || element.childNodes, dcpType = {};
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "DCPType") {
                    this.assembleHttp100(child, dcpType);
                }
            }

            return dcpType;
        };

        // Internal. Intentionally not documented.
        WcsCapabilities.prototype.assembleHttp100 = function (element, dcpType) {
            var children = element.children || element.childNodes;

            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "HTTP") {
                    return this.assembleMethod100(child, dcpType);
                }
            }
        };

        // Internal. Intentionally not documented.
        WcsCapabilities.prototype.assembleMethod100 = function (element, dcpType) {
            var children = element.children || element.childNodes;

            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "Get") {
                    dcpType["get"] = this.assembleOnlineResource100(child);
                } else if (child.localName === "Post") {
                    dcpType["post"] = this.assembleOnlineResource100(child);
                }
            }
        };

        // Internal. Intentionally not documented.
        WcsCapabilities.prototype.assembleOnlineResource100 = function (element) {
            var children = element.children || element.childNodes;

            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "OnlineResource") {
                    return child.getAttribute("xlink:href");
                }
            }
        };

        // Internal. Intentionally not documented.
        WcsCapabilities.prototype.assembleLatLonBoundingBox = function (element) {
            var children = element.children || element.childNodes, boundingBox = {}, previousValue, lonOne, lonTwo;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "pos") {
                    if (!previousValue) {
                        previousValue = child.textContent;
                        lonOne = parseFloat(previousValue.split(/\s+/)[0]);
                    } else {
                        lonTwo = parseFloat(child.textContent.split(/\s+/)[0]);
                        if (lonOne < lonTwo) {
                            boundingBox.lowerCorner = previousValue;
                            boundingBox.upperCorner = child.textContent;
                        } else {
                            boundingBox.lowerCorner = child.textContent;
                            boundingBox.upperCorner = previousValue;
                        }
                    }
                }
            }

            return boundingBox;
        };

        // Internal. Intentionally not documented.
        WcsCapabilities.prototype.assembleServiceMetadata = function (element) {
            var children = element.children || element.childNodes, serviceMetadata = {};
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "formatSupported") {
                    serviceMetadata.formatsSupported = serviceMetadata.formatsSupported || [];
                    serviceMetadata.formatsSupported.push(child.textContent);
                } else if (child.localName === "Extension") {
                    serviceMetadata.extension = this.assembleServiceMetadataExtension(child);
                }
            }

            return serviceMetadata;
        };

        // Internal. Intentionally not documented.
        WcsCapabilities.prototype.assembleServiceMetadataExtension = function (element) {
            var children = element.children || element.childNodes, len = children.length, extension = {};
            for (var c = 0; c < len; c++) {
                var child = children[c];

                if (child.localName === "crsSupported") {
                    extension.crsSupported = extension.crsSupported || [];
                    extension.crsSupported.push(child.textContent);
                } else if (child.localName === "interpolationSupported") {
                    extension.interpolationSupported = extension.interpolationSupported || [];
                    extension.interpolationSupported.push(child.textContent);
                }
            }

            return extension;
        };

        export default WcsCapabilities;
    
