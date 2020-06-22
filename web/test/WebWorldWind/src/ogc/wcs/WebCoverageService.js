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
 * @exports WebCoverageService
 */
import ArgumentError from '../../error/ArgumentError';
import Logger from '../../util/Logger';
import Promise from '../../util/Promise';
import WcsCapabilities from '../../ogc/wcs/WcsCapabilities';
import WcsCoverage from '../../ogc/wcs/WcsCoverage';
import WcsCoverageDescriptions from '../../ogc/wcs/WcsCoverageDescriptions';
        

        /**
         * Provides a list of coverages from a Web Coverage Service including the capabilities and coverage description
         * documents. For automated configuration, utilize the create function which provides a Promise with a fully
         * configured WebCoverageService.
         * @constructor
         */
        var WebCoverageService = function () {

            /**
             * The URL for the Web Coverage Service
             */
            this.serviceAddress = null;

            /**
             * A collection of WcsCoverages available from this service. Not populated until service is initialized by
             * the connect method.
             * @type {Array}
             */
            this.coverages = [];

            /**
             * The WCS GetCapabilities document for this service.
             * @type {WcsCapabilities}
             */
            this.capabilities = null;

            /**
             * A map of the coverages to their corresponding DescribeCoverage documents.
             * @type {WcsCoverageDescriptions}
             */
            this.coverageDescriptions = null;
        };

        /**
         * The XML namespace for WCS version 1.0.0.
         * @type {string}
         */
        WebCoverageService.WCS_XLMNS = "http://www.opengis.net/wcs";

        /**
         * The XML namespace for WCS version 2.0.0 and 2.0.1.
         * @type {string}
         */
        WebCoverageService.WCS_2_XLMNS = "http://www.opengis.net/wcs/2.0";

        /**
         * Contacts the Web Coverage Service specified by the service address. This function handles version negotiation
         * and capabilities and describe coverage document retrieval. The return is a Promise to a fully initialized
         * WebCoverageService which includes an array of WcsCoverage objects available from this service.
         * @param serviceAddress the url of the WebCoverageService
         * @returns {PromiseLike<WebCoverageService>}
         */
        WebCoverageService.create = function (serviceAddress) {
            if (!serviceAddress) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WebCoverageService", "constructor", "missingUrl"));
            }

            var service = new WebCoverageService();
            service.serviceAddress = serviceAddress;

            return service.retrieveCapabilities()
                .then(function (wcsCapabilities) {
                    service.capabilities = wcsCapabilities;
                    return service.retrieveCoverageDescriptions(wcsCapabilities);
                })
                .then(function (coverages) {
                    service.parseCoverages(coverages);
                    return service;
                });
        };

        /**
         * Returns the coverage associated with the provided id or name
         * @param coverageId the requested coverage id or name
         * @returns {WcsCoverage}
         */
        WebCoverageService.prototype.getCoverage = function (coverageId) {
            // TODO
        };

        // Internal use only
        WebCoverageService.prototype.retrieveCapabilities = function () {
            var self = this, version;

            return self.retrieveXml(self.buildCapabilitiesXmlRequest("2.0.1"))
                .then(function (xmlDom) {
                    // Check if the server supports our preferred version of 2.0.1
                    version = xmlDom.documentElement.getAttribute("version");
                    if (version === "2.0.1" || version === "2.0.0") {
                        return xmlDom;
                    } else {
                        // If needed, try the server again with a 1.0.0 request
                        return self.retrieveXml(self.buildCapabilitiesXmlRequest("1.0.0"));
                    }
                })
                // Parse the result
                .then(function (xmlDom) {
                    return new WcsCapabilities(xmlDom);
                });
        };

        // Internal use only
        WebCoverageService.prototype.retrieveCoverageDescriptions = function () {
            return this.retrieveXml(this.buildDescribeCoverageXmlRequest());
        };

        // Internal use only
        WebCoverageService.prototype.parseCoverages = function (xmlDom) {
            this.coverageDescriptions = new WcsCoverageDescriptions(xmlDom);
            var coverageCount = this.coverageDescriptions.coverages.length;
            var coverageId, coverage;

            for (var i = 0; i < coverageCount; i++) {
                coverageId = this.coverageDescriptions.coverages[i].coverageId
                    || this.coverageDescriptions.coverages[i].name;
                coverage = new WcsCoverage(coverageId, this);
                this.coverages.push(coverage);
            }
        };

        // Internal use only
        WebCoverageService.prototype.retrieveXml = function (request) {
            return new Promise(function (resolve, reject) {
                var xhr = new XMLHttpRequest();
                xhr.open("POST", request.url);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            resolve(xhr.responseXML);
                        } else {
                            reject(new Error(
                                Logger.logMessage(Logger.LEVEL_WARNING,
                                    "XML retrieval failed (" + xhr.statusText + "): " + request.url)));
                        }
                    }
                };
                xhr.onerror = function () {
                    reject(new Error(
                        Logger.logMessage(Logger.LEVEL_WARNING, "XML retrieval failed: " + request.url)));
                };
                xhr.ontimeout = function () {
                    reject(new Error(
                        Logger.logMessage(Logger.LEVEL_WARNING, "XML retrieval timed out: " + request.url)));
                };
                xhr.send(request.body);
            });
        };

        // Internal use only
        WebCoverageService.prototype.buildCapabilitiesXmlRequest = function (version) {
            var capabilitiesElement = this.createBaseWcsElement("GetCapabilities", version);

            return {
                url: this.serviceAddress,
                body: new XMLSerializer().serializeToString(capabilitiesElement)
            };
        };

        // Internal use only
        WebCoverageService.prototype.buildDescribeCoverageXmlRequest = function () {
            var version = this.capabilities.version, describeElement, coverageElement, requestUrl,
                coverageCount = this.capabilities.coverages.length;

            describeElement = this.createBaseWcsElement("DescribeCoverage", version);
            if (version === "1.0.0") {
                requestUrl = this.capabilities.capability.request.describeCoverage.get;
            } else if (version === "2.0.1" || version === "2.0.0") {
                requestUrl = this.capabilities.operationsMetadata.getOperationMetadataByName("DescribeCoverage").dcp[0].getMethods[0].url;
            }

            for (var i = 0; i < coverageCount; i++) {
                if (version === "1.0.0") {
                    coverageElement = document.createElementNS(WebCoverageService.WCS_XLMNS, "Coverage");
                    coverageElement.appendChild(document.createTextNode(this.capabilities.coverages[i].name));
                } else if (version === "2.0.1" || version === "2.0.0") {
                    coverageElement = document.createElementNS(WebCoverageService.WCS_2_XLMNS, "CoverageId");
                    coverageElement.appendChild(document.createTextNode(this.capabilities.coverages[i].coverageId));
                }
                describeElement.appendChild(coverageElement);
            }

            return {
                url: requestUrl,
                body: new XMLSerializer().serializeToString(describeElement)
            };
        };

        // Internal use only
        WebCoverageService.prototype.createBaseWcsElement = function (elementName, version) {
            var el;

            if (version === "1.0.0") {
                el = document.createElementNS(WebCoverageService.WCS_XLMNS, elementName);
                el.setAttribute("version", "1.0.0");
            } else if (version === "2.0.1" || version === "2.0.0") {
                el = document.createElementNS(WebCoverageService.WCS_2_XLMNS, elementName);
                el.setAttribute("version", version);
            }

            el.setAttribute("service", "WCS");

            return el;
        };

        export default WebCoverageService;
    
