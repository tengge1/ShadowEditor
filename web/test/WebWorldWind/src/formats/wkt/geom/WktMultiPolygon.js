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
     * It represents multiple polygons.
     * @alias WktMultiPolygon
     * @augments WktObject
     * @constructor
     */
    var WktMultiPolygon = function () {
        WktObject.call(this, WktType.SupportedGeometries.MULTI_POLYGON);

        /**
         * Internal object boundaries for used polygons. Some polygons may have inner and outer boundaries.
         * @type {Array}
         */
        this.objectBoundaries = [];

        /**
         * Used to decide what objects do we add the boundaries to.
         * @type {number}
         */
        this.currentIndex = 0;
    };

    WktMultiPolygon.prototype = Object.create(WktObject.prototype);

    /**
     * In case of right parenthesis, it means either that the boundaries ends or that the object ends or that the WKT
     * object ends.
     *
     * @inheritDoc
     * @private
     */
    WktMultiPolygon.prototype.rightParenthesis = function(options) {
        WktObject.prototype.rightParenthesis.call(this, options);

        // MultiPolygon object is distinguished by )),
        if(options.tokens[options.tokens.length -1].type != WktType.TokenType.RIGHT_PARENTHESIS) {
            this.addBoundaries();
            // MultiPolygon boundaries are distinguished by ),
        } else if(options.tokens[options.tokens.length -1].type == WktType.TokenType.RIGHT_PARENTHESIS &&
            options.tokens[options.tokens.length -2].type != WktType.TokenType.RIGHT_PARENTHESIS) {
            this.addObject();
        }
    };

    /**
     * It adds outer or inner boundaries to current polygon.
     * @private
     */
    WktMultiPolygon.prototype.addBoundaries = function() {
        if(!this.objectBoundaries[this.currentIndex]) {
            this.objectBoundaries[this.currentIndex] = [];
        }
        this.objectBoundaries[this.currentIndex].push(this.coordinates.slice());
        this.coordinates = [];
    };

    /**
     * It ends boundaries for current polygon.
     * @private
     */
    WktMultiPolygon.prototype.addObject = function() {
        this.currentIndex++;
    };

    /**
     * It returns array of SurfacePolygon in 2D or array of Polygons in 3D
     * @inheritDoc
     * @return {Polygon[]|SurfacePolygon[]}
     */
    WktMultiPolygon.prototype.shapes = function () {
        if (this._is3d) {
            return this.objectBoundaries.map(function (boundaries) {
                return new Polygon(boundaries, new ShapeAttributes(null));
            }.bind(this));
        } else {
            return this.objectBoundaries.map(function (boundaries) {
                return new SurfacePolygon(boundaries, new ShapeAttributes(null));
            }.bind(this));
        }
    };

    WktElements['MULTIPOLYGON'] = WktMultiPolygon;

    export default WktMultiPolygon;
