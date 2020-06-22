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
     * It represents multiple line string as one object.
     * @alias WktMultiLineString
     * @augments WktObject
     * @constructor
     */
    var WktMultiLineString = function () {
        WktObject.call(this, WktType.SupportedGeometries.MULTI_LINE_STRING);

        this.objectBoundaries = [];
    };

    WktMultiLineString.prototype = Object.create(WktObject.prototype);

    /**
     * Specific for Multi objects as it depicts the boundaries.
     */
    WktMultiLineString.prototype.commaWithoutCoordinates = function() {
        this.objectBoundaries.push(this.coordinates.slice());
        this.coordinates = [];
    };

    /**
     * In case of 2D it returns SurfacePolyline, In case of 3D return Path.
     * @inheritDoc
     * @return {Path[]|SurfacePolyline[]}
     */
    WktMultiLineString.prototype.shapes = function() {
        this.commaWithoutCoordinates(); // This needs to be more careful and probably move to the stuff

        if(this._is3d){
            return this.objectBoundaries.map(function(boundaries){
                return new Path(boundaries, new ShapeAttributes(null));
            }.bind(this));
        } else {
            return this.objectBoundaries.map(function(boundaries){
                return new SurfacePolyline(boundaries, new ShapeAttributes(null));
            }.bind(this));
        }
    };

    WktElements['MULTILINESTRING'] = WktMultiLineString;

    export default WktMultiLineString;
