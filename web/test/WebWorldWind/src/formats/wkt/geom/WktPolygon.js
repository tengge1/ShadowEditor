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
import Polygon from '../../../shapes/Polygon';
import ShapeAttributes from '../../../shapes/ShapeAttributes';
import SurfacePolygon from '../../../shapes/SurfacePolygon';
import WktElements from '../WktElements';
import WktObject from './WktObject';
import WktType from '../WktType';
    /**
     * It represents the polygon.
     * @alias WktPolygon
     * @augments WktObject
     * @constructor
     */
    var WktPolygon = function () {
        WktObject.call(this, WktType.SupportedGeometries.POLYGON);

        this._renderable = null;
    };

    WktPolygon.prototype = Object.create(WktObject.prototype);

    /**
     * @inheritDoc
     */
    WktPolygon.prototype.commaWithoutCoordinates = function() {
        this.outerBoundaries = this.coordinates.slice();
        this.coordinates = [];
    };

    /**
     * It returns SurfacePolygon for 2D. It returns Polygon for 3D.
     * @inheritDoc
     * @return {Polygon[]|SurfacePolyline[]}
     */
    WktPolygon.prototype.shapes = function () {
        if (this._is3d) {
            if(this.outerBoundaries) {
                return [new Polygon([this.outerBoundaries, this.coordinates], new ShapeAttributes(null))];
            } else {
                return [new Polygon(this.coordinates, new ShapeAttributes(null))];
            }
        } else {
            if(this.outerBoundaries) {
                return [new SurfacePolygon([this.outerBoundaries, this.coordinates], new ShapeAttributes(null))];
            } else {
                return [new SurfacePolygon(this.coordinates, new ShapeAttributes(null))];
            }
        }
    };

    WktElements['POLYGON'] = WktPolygon;

    export default WktPolygon;
