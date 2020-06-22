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
import Placemark from '../../../shapes/Placemark';
import PlacemarkAttributes from '../../../shapes/PlacemarkAttributes';
import WktElements from '../WktElements';
import WktObject from './WktObject';
import WktPoint from './WktPoint';
import WktType from '../WktType';
    /**
     * It represents multiple points.
     * @alias WktMultiPoint
     * @augments WktObject
     * @constructor
     */
    var WktMultiPoint = function () {
        WktObject.call(this, WktType.SupportedGeometries.MULTI_POINT);
    };

    WktMultiPoint.prototype = Object.create(WktObject.prototype);

    /**
     * Specific for Multi objects as it depicts the boundaries.
     */
    WktMultiPoint.prototype.commaWithoutCoordinates = function() {};

    /**
     * It returns Placemark for each point.
     * @inheritDoc
     * @return {Placemark[]}
     */
    WktMultiPoint.prototype.shapes = function() {
        return this.coordinates.map(function(coordinate){
            return WktPoint.placemark(coordinate);
        }.bind(this));
    };

    WktElements['MULTIPOINT'] = WktMultiPoint;

    export default WktMultiPoint;
