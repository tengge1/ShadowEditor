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
 * @exports OwsBoundingBox
 */
import ArgumentError from '../../error/ArgumentError';
import Logger from '../../util/Logger';
import Sector from '../../geom/Sector';
        

        var OwsBoundingBox = function (element) {
            if (!element) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "OwsBoundingBox", "constructor", "missingDomElement"));
            }

            this.assembleElement(element);
        };

        // Internal. Intentionally not documented.
        OwsBoundingBox.prototype.assembleElement = function (element) {
            this.crs = element.localName === "WGS84BoundingBox" ? "WGS84" : element.getAttribute("crs");

            this.dimensions = element.getAttribute("dimensions");

            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "LowerCorner") {
                    this.lowerCorner = child.textContent;
                } else if (child.localName === "UpperCorner") {
                    this.upperCorner = child.textContent;
                }
            }
        };

        // Internal. Intentionally not documented.
        OwsBoundingBox.prototype.getSector = function () {
            var minLat, minLon, maxLat, maxLon, vals;

            if (this.crs.indexOf("WGS84") !== -1 || this.crs.indexOf("EPSG:4326") !== -1) {
                vals = this.lowerCorner.split(/\s+/);
                minLon = vals[0];
                minLat = vals[1];
                vals = this.upperCorner.split(/\s+/);
                maxLon = vals[0];
                maxLat = vals[1];
                return new Sector(minLat, maxLat, minLon, maxLon);
            } else {
                return null;
            }
        };

        export default OwsBoundingBox;
    
