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
 * @exports GmlBoundedBy
 */
import ArgumentError from '../../error/ArgumentError';
import Logger from '../../util/Logger';
        

        var GmlBoundedBy = function (element) {
            if (!element) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GmlAbstractGeometry", "constructor", "missingDom"));
            }

            this.assembleElement(element);
        };

        // Internal. Intentionally not documented.
        GmlBoundedBy.prototype.assembleElement = function (element) {
            var children = element.children || element.childNodes;
            this.nilReason = element.getAttribute("nilReason");

            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "Envelope") {
                    this.envelope = this.assembleEnvelope(child);
                }
            }
        };

        // Internal. Intentionally not documented.
        GmlBoundedBy.prototype.assembleEnvelope = function (element) {
            var children = element.children || element.childNodes, envelop = {};

            envelop.srsName = element.getAttribute("srsName");
            envelop.srsDimension = parseInt(element.getAttribute("srsDimension"));
            envelop.axisLabels = element.getAttribute("axisLabels");
            if (envelop.axisLabels) {
                envelop.axisLabels = envelop.axisLabels.split(/\s+/);
            }
            envelop.uomLabels = element.getAttribute("uomLabels");
            if (envelop.uomLabels) {
                envelop.uomLabels = envelop.uomLabels.split(/\s+/);
            }

            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "lowerCorner") {
                    envelop.lower = child.textContent.split(/\s+/);
                    for (var i = 0; i < envelop.lower.length; i++) {
                        envelop.lower[i] = parseFloat(envelop.lower[i]);
                    }
                } else if (child.localName === "upperCorner") {
                    envelop.upper = child.textContent.split(/\s+/);
                    for (var i = 0; i < envelop.upper.length; i++) {
                        envelop.upper[i] = parseFloat(envelop.upper[i]);
                    }
                }
            }

            return envelop;
        };

        export default GmlBoundedBy;
    
