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
import Path from '../../../shapes/Path';
import ShapeAttributes from '../../../shapes/ShapeAttributes';
import SurfacePolyline from '../../../shapes/SurfacePolyline';
import WktElements from '../WktElements';
import WktObject from './WktObject';
import WktType from '../WktType';
    /**
     * It represents WKT LineString.
     * @alias WktLineString
     * @augments WktObject
     * @constructor
     */
    var WktLineString = function () {
        WktObject.call(this, WktType.SupportedGeometries.LINE_STRING);
    };

    WktLineString.prototype = Object.create(WktObject.prototype);

    /**
     * In case of 2D return SurfacePolyline, in case of 3D returns Path.
     * @inheritDoc
     * @return {Path[]|SurfacePolyline[]}
     */
    WktLineString.prototype.shapes = function () {
        if (this._is3d) {
            return [new Path(this.coordinates, new ShapeAttributes(null))];
        } else {
            return [new SurfacePolyline(this.coordinates, new ShapeAttributes(null))];
        }
    };

    WktElements['LINESTRING'] = WktLineString;

    export default WktLineString;
