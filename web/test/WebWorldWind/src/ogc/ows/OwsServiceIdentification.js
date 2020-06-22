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
 * @exports OwsServiceIdentification
 */
import ArgumentError from '../../error/ArgumentError';
import Logger from '../../util/Logger';
import OwsDescription from '../../ogc/ows/OwsDescription';
        

        /**
         * Constructs an OWS Service Identification instance from an XML DOM.
         * @alias OwsServiceIdentification
         * @constructor
         * @classdesc Represents an OWS Service Identification section of an OGC capabilities document.
         * This object holds as properties all the fields specified in the OWS Service Identification.
         * Fields can be accessed as properties named according to their document names converted to camel case.
         * For example, "serviceType" and "title".
         * Note that fields with multiple possible values are returned as arrays, such as "titles" and "abstracts".
         * @param {Element} element An XML DOM element representing the OWS Service Identification section.
         * @throws {ArgumentError} If the specified XML DOM element is null or undefined.
         */
        var OwsServiceIdentification = function (element) {
            if (!element) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "OwsServiceIdentification", "constructor", "missingDomElement"));
            }

            OwsDescription.call(this, element);

            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "ServiceType") {
                    this.serviceType = child.textContent;
                } else if (child.localName === "ServiceTypeVersion") {
                    this.serviceTypeVersions = this.serviceTypeVersions || [];
                    this.serviceTypeVersions.push(child.textContent);
                } else if (child.localName === "Profile") {
                    this.profile = this.profile || [];
                    this.profile.push(child.textContent);
                } else if (child.localName === "Fees") {
                    this.fees = child.textContent;
                } else if (child.localName === "AccessConstraints") {
                    this.accessConstraints = this.accessConstraints || [];
                    this.accessConstraints.push(child.textContent);
                }
            }
        };

        OwsServiceIdentification.prototype = Object.create(OwsDescription.prototype);

        export default OwsServiceIdentification;
    