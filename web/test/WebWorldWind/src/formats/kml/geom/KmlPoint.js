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
 * @exports KmlPoint
 */
import Color from '../../../util/Color';
import KmlElements from '../KmlElements';
import KmlGeometry from './KmlGeometry';
import Location from '../../../geom/Location';
import NodeTransformers from '../util/KmlNodeTransformers';
import Polygon from '../../../shapes/Polygon';
import Position from '../../../geom/Position';
    
    /**
     * Constructs an KmlPoint. Application usually don't call this constructor. It is called by {@link KmlFile} as
     * Objects from KmlFile are read.
     * @alias KmlPoint
     * @constructor
     * @classdesc Contains the data associated with Kml point
     * @param options {Object}
     * @param options.objectNode {Node} Node representing Point.
     * @throws {ArgumentError} If either the node is null or the content of the Kml point contains invalid elements.
     * @see https://developers.google.com/kml/documentation/kmlreference#point
     * @augments KmlGeometry
     */
    var KmlPoint = function (options) {
        KmlGeometry.call(this, options);

        this._shape = null;
    };

    KmlPoint.prototype = Object.create(KmlGeometry.prototype);

    Object.defineProperties(KmlPoint.prototype, {
        /**
         * Position of the whole geometry.
         * @memberof KmlPoint.prototype
         * @type {Position}
         * @readonly
         */
        kmlPosition: {
            get: function() {
                // TODO Add Position transformer.
                var coordinates = this._factory.specific(this, {name: 'coordinates', transformer: NodeTransformers.string}).split(',');
                return new Position(coordinates[1], coordinates[0], coordinates[2] || 0);
            }
        },

        /**
         * In case that the point is above ground, this property decides whether there is going to be a line to the
         * ground.
         * @memberof KmlPoint.prototype
         * @type {Boolean}
         * @readonly
         */
        kmlExtrude: {
            get: function() {
                return this._factory.specific(this, {name: 'extrude', transformer: NodeTransformers.boolean});
            }
        },

        /**
         * It explains how we should treat the altitude of the point. Possible choices are explained in:
         * https://developers.google.com/kml/documentation/kmlreference#point
         * @memberof KmlPoint.prototype
         * @type {String}
         * @readonly
         */
        kmlAltitudeMode: {
            get: function() {
                return this._factory.specific(this, {name: 'altitudeMode', transformer: NodeTransformers.string});
            }
        },

        /**
         * It returns center of the point. In case of point it means the position of the point.
         * @memberof KmlPoint.prototype
         * @type {Position}
         * @readonly
         */
        kmlCenter: {
            get: function() {
                return this.kmlPosition;
            }
        }
    });
    
    /**
     * @inheritDoc
     */
    KmlPoint.prototype.getTagNames = function () {
        return ['Point'];
    };

    KmlElements.addKey(KmlPoint.prototype.getTagNames()[0], KmlPoint);

    export default KmlPoint;
