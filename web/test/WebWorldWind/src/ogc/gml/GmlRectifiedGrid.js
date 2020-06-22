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
 * @exports GmlRectifiedGrid
 */
import ArgumentError from '../../error/ArgumentError';
import Logger from '../../util/Logger';
        

        var GmlRectifiedGrid = function (element) {
            if (!element) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GmlRectifiedGrid", "constructor", "missingDom"));
            }

            this.assembleElement(element);
        };

        // Internal. Intentionally not documented.
        GmlRectifiedGrid.prototype.assembleElement = function (element) {
            var children = element.children || element.childNodes;

            this.captureAttributes(element);

            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "description") {
                    this.description = child.textContent;
                } else if (child.localName === "descriptionReference") {
                    this.descriptionReference = child.getAttribute("xlink:href");
                } else if (child.localName === "identifier") {
                    this.identifier = child.textContent;
                } else if (child.localName === "name") {
                    this.names = this.names || [];
                    this.names.push(child.textContent);
                } else if (child.localName === "limits") {
                    this.limits = this.assembleLimits(child);
                } else if (child.localName === "axisLabels") {
                    this.axisLabels = child.textContent.split(/\s+/);
                } else if (child.localName === "axisName") {
                    this.axisNames = this.axisNames || [];
                    this.axisNames.push(child.textContent);
                } else if (child.localName === "origin") {
                    this.origin = this.assembleOrigin(child);
                } else if (child.localName === "offsetVector") {
                    this.offsetVector = this.offsetVector || [];
                    this.offsetVector.push(this.assembleOffsetVector(child));
                }
            }
        };

        // Internal. Intentionally not documented.
        GmlRectifiedGrid.prototype.captureAttributes = function (element) {
            this.id = element.getAttribute("gml:id");
            this.srsName = element.getAttribute("srsName");
            this.srsDimension = element.getAttribute("srsDimension");
            this.axisLabels = element.getAttribute("axisLabels");
            if (this.axisLabels) {
                this.axisLabels = this.axisLabels.split(/\s+/);
            }
            this.uomLabels = element.getAttribute("uomLabels");
            if (this.uomLabels) {
                this.uomLabels = this.uomLabels.split(/\s+/);
            }
            this.dimension = parseInt(element.getAttribute("dimension"));
        };

        // Internal. Intentionally not documented.
        GmlRectifiedGrid.prototype.assembleLimits = function (element) {
            var children = element.children || element.childNodes;

            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "GridEnvelope") {
                    return this.assembleGridEnvelope(child);
                }
            }
        };

        // Internal. Intentionally not documented.
        GmlRectifiedGrid.prototype.assembleGridEnvelope = function (element) {
            var children = element.children || element.childNodes, envelop = {};

            for (var c = 0; c < children.length; c++) {
                var child = children[c];
                envelop[child.localName] = child.textContent.split(/\s+/);
            }

            return envelop;
        };

        // Internal. Intentionally not documented.
        GmlRectifiedGrid.prototype.assembleOrigin = function (element) {
            var origin = {};
            origin.type = element.getAttribute("xlink:type");
            origin.href = element.getAttribute("xlink:href");
            origin.role = element.getAttribute("xlink:role");
            origin.arcrole = element.getAttribute("xlink:arcrole");
            origin.title = element.getAttribute("xlink:title");
            origin.show = element.getAttribute("xlink:show");
            origin.actuate = element.getAttribute("xlink:actuate");
            origin.nilReason = element.getAttribute("nilReason");
            origin.remoteSchema = element.getAttribute("gml:remoteSchema");
            origin.owns = element.getAttribute("owns");

            var children = element.children || element.childNodes;

            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "Point") {
                    origin.point = this.assemblePoint(child);
                } else if (child.localName === "pos") {
                    origin.pos = this.assemblePos(child);
                }
            }

            return origin;
        };

        // Internal. Intentionally not documented.
        GmlRectifiedGrid.prototype.assemblePoint = function (element) {
            var point = {}, pos = {};
            point.id = element.getAttribute("gml:id");
            point.srsName = element.getAttribute("srsName");
            point.srsDimension = element.getAttribute("srsDimension");
            point.axisLabels = element.getAttribute("axisLabels");
            if (point.axisLabels) {
                point.axisLabels = point.axisLabels.split(/\s+/);
            }
            point.uomLabels = element.getAttribute("uomLabels");
            if (point.uomLabels) {
                point.uomLabels = point.uomLabels.split(/\s+/);
            }

            var children = element.children || element.childNodes;

            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "description") {
                    point.description = child.textContent;
                } else if (child.localName === "descriptionReference") {
                    point.descriptionReference = this.assembleOrigin(child);
                } else if (child.localName === "identifier") {
                    point.identifier = child.textContent;
                } else if (child.localName === "name") {
                    point.name = child.textContent;
                } else if (child.localName === "pos") {
                    point.pos = this.assemblePos(child);
                }
            }

            return point;
        };

        // Internal. Intentionally not documented.
        GmlRectifiedGrid.prototype.assemblePos = function (child) {
            var pos = {};
            pos.srsName = child.getAttribute("srsName");
            pos.srsDimension = parseInt(child.getAttribute("srsDimension"));
            pos.axisLabels = child.getAttribute("axisLabels");
            if (pos.axisLabels) {
                pos.axisLabels = pos.axisLabels.split(/\s+/);
            }
            pos.uomLabels = child.getAttribute("uomLabels");
            if (pos.uomLabels) {
                pos.uomLabels = pos.uomLabels.split(/\s+/);
            }
            pos.pos = child.textContent;
            if (pos.pos) {
                pos.pos = pos.pos.split(/\s+/);
                for (var p = 0; p < pos.pos.length; p++) {
                    pos.pos[p] = parseFloat(pos.pos[p]);
                }
            }

            return pos;
        };

        // Internal. Intentionally not documented.
        GmlRectifiedGrid.prototype.assembleOffsetVector = function (element) {
            var children = element.children || element.childNodes, offsetVector = {}, rawValues;

            // Collect and store associated attributes
            offsetVector.srsName = element.getAttribute("srsName");
            offsetVector.srsDimension = parseInt(element.getAttribute("srsDimension"));
            offsetVector.axisLabels = element.getAttribute("axisLabels");
            if (offsetVector.axisLabels) {
                offsetVector.axisLabels = offsetVector.axisLabels.split(/\s+/);
            }
            offsetVector.uomLabels = element.getAttribute("uomLabels");
            if (offsetVector.uomLabels) {
                offsetVector.uomLabels = offsetVector.uomLabels.split(/\s+/);
            }

            rawValues = element.textContent.split(/\s+/);
            offsetVector.values = [];
            for (var i = 0; i < rawValues.length; i++) {
                offsetVector.values.push(parseFloat(rawValues[i]));
            }

            return offsetVector;
        };

        export default GmlRectifiedGrid;
    
