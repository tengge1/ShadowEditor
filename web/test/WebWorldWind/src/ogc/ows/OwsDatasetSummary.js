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
 * @exports OwsDatasetSummary
 */
import ArgumentError from '../../error/ArgumentError';
import Logger from '../../util/Logger';
import OwsBoundingBox from '../../ogc/ows/OwsBoundingBox';
import OwsKeywords from '../../ogc/ows/OwsKeywords';
import OwsLanguageString from '../../ogc/ows/OwsLanguageString';
        

        var OwsDatasetSummary = function (element) {
            if (!element) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "OwsDatasetSummary", "constructor", "missingDomElement"));
            }

            this.assembleElement(element);
        };

        // Internal. Intentionally not documented.
        OwsDatasetSummary.prototype.assembleElement = function (element) {
            var children = element.children || element.childNodes;

            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "Title") {
                    this.titles = this.titles || [];
                    this.titles.push(new OwsLanguageString(child));
                } else if (child.localName === "Abstract") {
                    this.abstracts = this.abtracts || [];
                    this.abstracts.push(new OwsLanguageString(child));
                } else if (child.localName === "Keywords") {
                    this.keywords = this.keywords || [];
                    this.keywords.push(new OwsKeywords(child));
                } else if (child.localName === "Identifier") {
                    this.identifier = child.textContent;
                } else if (child.localName === "WGS84BoundingBox") {
                    this.wgs84BoundingBox = new OwsBoundingBox(child);
                } else if (child.localName === "BoundingBox") {
                    this.boundingBox = this.boundingBox || [];
                    this.boundingBox.push(new OwsBoundingBox(child));
                } else if (child.localName === "OutputFormat") {
                    this.outputFormat = this.outputFormat || [];
                    this.outputFormat.push(child.textContent);
                } else if (child.localName === "AvailableCRS") {
                    this.availableCrs = this.availableCrs || [];
                    this.availableCRS.push(child.textContent);
                }
                // TODO AccessConstraint, Fees, PointOfContact, Language
            }
        };

        export default OwsDatasetSummary;
    
