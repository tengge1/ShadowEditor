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
 * @exports OwsDescription
 */
import ArgumentError from '../../error/ArgumentError';
import Logger from '../../util/Logger';
import OwsLanguageString from '../../ogc/ows/OwsLanguageString';
        

        /**
         * Constructs an OWS Description instance from an XML DOM.
         * @alias OwsDescription
         * @constructor
         * @classdesc Represents an OWS Description element of an OGC document.
         * This object holds as properties all the fields specified in the OWS Description definition.
         * Fields can be accessed as properties named according to their document names converted to camel case.
         * For example, "value".
         * @param {Element} element An XML DOM element representing the OWS Description element.
         * @throws {ArgumentError} If the specified XML DOM element is null or undefined.
         */
        var OwsDescription = function (element) {
            if (!element) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "OwsDescription", "assembleDescriptions", "missingDomElement"));
            }

            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "Title") {
                    this.titles = this.titles || [];
                    this.titles.push(new OwsLanguageString(child));
                } else if (child.localName === "Abstract") {
                    this.abstracts = this.abstracts || [];
                    this.abstracts.push(new OwsLanguageString(child));
                } else if (child.localName === "Keywords") {
                    this.keywords = this.keywords || [];
                    var keywords = child.children || child.childNodes;
                    for (var i = 0; i < keywords.length; i++) {
                        var keyword = keywords[i];
                        // In IE 11, child.childNodes can contain more than just Element objects, checking localName has the side effect of ensuring the correct object type.
                        if (keyword.localName === "Keyword") {
                            this.keywords.push(new OwsLanguageString(keyword));
                        }
                    }
                }
            }

        };

        export default OwsDescription;
    