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
 * @exports GeoJSONGeometryPolygon
 */
import ArgumentError from '../../error/ArgumentError';
import GeoJSONGeometry from './GeoJSONGeometry';
import Logger from '../../util/Logger';
        

        /**
         * Constructs a GeoJSON geometry for a Polygon. Applications typically do not call this constructor.
         * It is called by {@link GeoJSON} as GeoJSON geometries are read.
         * @alias GeoJSONGeometryPolygon
         * @constructor
         * @classdesc Contains the data associated with a GeoJSON Polygon geometry.
         * @augments GeoJSONGeometry
         * @param {Number[]} coordinates The array containing Polygon coordinates.
         * @param {String} type A string containing type of geometry.
         * @param {Object} bbox An object containing GeoJSON bbox information.
         * @throws {ArgumentError} If the specified coordinates or type are null or undefined or if the
         * coordinates parameter is not an array of LinearRing coordinate arrays.
         */
        var GeoJSONGeometryPolygon = function (coordinates, type, bbox) {

            if (!coordinates) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSONGeometryPolygon", "constructor",
                        "missingCoordinates"));
            }

            if (coordinates[0].length < 2 || coordinates[0][0].length < 2) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSONGeometryPolygon", "constructor",
                        "invalidNumberOfCoordinates"));
            }

            if (Object.prototype.toString.call(coordinates[0]) !== '[object Array]' ||
                Object.prototype.toString.call(coordinates[0][0]) !== '[object Array]' ||
                Object.prototype.toString.call(coordinates[0][0][0]) !== '[object Number]') {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSONGeometryPolygon", "constructor",
                        "invalidCoordinatesType"));
            }

            for (var i = 0; i < coordinates.length; i++) {
                if (coordinates[i][0][0] !== coordinates[i][coordinates[i].length - 1][0] ||
                    coordinates[i][0][1] !== coordinates[i][coordinates[i].length - 1][1]) {
                    throw new ArgumentError(
                        Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSONGeometryPolygon", "constructor",
                            "invalidLinearRing"));
                }
            }

            if (!type) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSONGeometryPolygon", "constructor",
                        "missingType"));
            }

            GeoJSONGeometry.call(this, coordinates, type, bbox);
        };

        GeoJSONGeometryPolygon.prototype = Object.create(GeoJSONGeometry.prototype);

        export default GeoJSONGeometryPolygon;
    
