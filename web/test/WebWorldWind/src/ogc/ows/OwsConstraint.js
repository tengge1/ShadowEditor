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
 * @exports OwsConstraint
 */
import ArgumentError from '../../error/ArgumentError';
import Logger from '../../util/Logger';
        

        /**
         * Constructs an OWS Constraint instance from an XML DOM.
         * @alias OwsConstraint
         * @constructor
         * @classdesc Represents an OWS Constraint element of an OGC capabilities document.
         * This object holds as properties all the fields specified in the OWS Constraint definition.
         * Fields can be accessed as properties named according to their document names converted to camel case.
         * For example, "operation".
         * @param {Element} element An XML DOM element representing the OWS Constraint element.
         * @throws {ArgumentError} If the specified XML DOM element is null or undefined.
         */
        var OwsConstraint = function (element) {
            if (!element) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "OwsConstraint", "constructor", "missingDomElement"));
            }

            this.name = element.getAttribute("name");

            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "AllowedValues") {
                    this.allowedValues = this.allowedValues || [];

                    var childrenValues = child.children || child.childNodes;
                    for (var cc = 0; cc < childrenValues.length; cc++) {
                        if (childrenValues[cc].localName === "Value") {
                            this.allowedValues.push(childrenValues[cc].textContent);
                        }
                    }
                } else if (child.localName === "AnyValue") {
                    this.anyValue = true;
                } else if (child.localName === "NoValues") {
                    this.noValues = true;
                }
                // TODO: ValuesReference
            }

        };

        export default OwsConstraint;
    