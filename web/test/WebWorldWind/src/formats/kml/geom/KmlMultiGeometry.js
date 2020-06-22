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
import KmlElements from './../KmlElements';
import KmlGeometry from './KmlGeometry';
import Position from '../../../geom/Position';
    

    /**
     * Constructs an KmlMultiGeometry object. KmlMultiGeometry is object, which contains other geometry objects. This
     * class isn't intended to be used outside of the KmlObject hierarchy. It is already concrete implementation.
     * @param options {Object}
     * @param options.objectNode {Node} Node representing current geometry
     * @param options.style {Promise} Promise of style to be applied to current geometry
     * @constructor
     * @classdesc Class representing MultiGeometry Element of Kml Document.
     * @alias KmlMultiGeometry
     * @see https://developers.google.com/kml/documentation/kmlreference#multigeometry
     * @augments KmlGeometry
     */
    var KmlMultiGeometry = function (options) {
        KmlGeometry.call(this, options);
        this._style = options.style;
    };

    KmlMultiGeometry.prototype = Object.create(KmlGeometry.prototype);

    Object.defineProperties(KmlMultiGeometry.prototype, {
        /**
         * It returns all shapes currently present in this node.
         * @memberof KmlMultiGeometry.prototype
         * @type {KmlObject[]}
         * @readonly
         */
        kmlShapes: {
            get: function () {
                return this._factory.all(this);
            }
        },

        /**
         * Center of all the geometries implemented as average of centers of all shapes.
         * @memberof KmlMultiGeometry.prototype
         * @type {Position}
         * @readonly
         */
        kmlCenter: {
            get: function () {
                var positions = this.kmlShapes.map(function (shape) {
                    return shape.kmlCenter;
                });
                var midLatitude = 0;
                var midLongitude = 0;
                var midAltitude = 0;
                positions.forEach(function (position) {
                    midLatitude += position.latitude;
                    midLongitude += position.longitude;
                    midAltitude += position.altitude;
                });
                return new Position(
                    midLatitude / positions.length,
                    midLongitude / positions.length,
                    midAltitude / positions.length
                );
            }
        }
    });

	/**
     * @inheritDoc
     */
    KmlMultiGeometry.prototype.render = function(dc, kmlOptions) {
        KmlGeometry.prototype.render.call(this, dc, kmlOptions);

        this.kmlShapes.forEach(function(shape) {
            shape.render(dc, kmlOptions);
        });
    };

    /**
     * @inheritDoc
     */
    KmlMultiGeometry.prototype.getTagNames = function () {
        return ["MultiGeometry"];
    };

    KmlElements.addKey(KmlMultiGeometry.prototype.getTagNames()[0], KmlMultiGeometry);

    export default KmlMultiGeometry;
