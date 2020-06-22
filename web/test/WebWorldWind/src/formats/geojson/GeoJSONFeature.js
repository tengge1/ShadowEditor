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
 * @exports GeoJSONFeature
 */
import ArgumentError from '../../error/ArgumentError';
import GeoJSONConstants from './GeoJSONConstants';
import Logger from '../../util/Logger';
        

        /**
         * Constructs a GeoJSON Feature object. Applications typically do not call this constructor. It is called by
         * {@link GeoJSON} as GeoJSON is read.
         * @alias GeoJSONFeature
         * @constructor
         * @classdesc Contains the data associated with a GeoJSON Feature Object.
         * A feature object must have a member with the name "geometry".
         * The value of the geometry member is a geometry object or a JSON null value.
         * A feature object must have a member with the name "properties".
         * The value of the properties member is an object (any JSON object or a JSON null value).
         * If a feature has a commonly used identifier, that identifier should be included as a member of the
         * feature object with the name "id".
         * To include information on the coordinate range for features, a GeoJSON object may have a member
         * named "bbox".
         * @param {Object} geometry An object containing the value of GeoJSON geometry member.
         * @param {Object} properties An object containing the value of GeoJSON properties member.
         * @param {Object} id An object containing the value of GeoJSON Feature id member.
         * @param {Object} bbox An object containing the value of GeoJSON Feature bbox member.
         * @throws {ArgumentError} If the specified mandatory geometries or properties are null or undefined.
         */
        var GeoJSONFeature = function (geometry, properties, id, bbox) {

            if (!geometry) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSONFeature", "constructor",
                        "missingGeometry"));
            }

            if (!geometry[GeoJSONConstants.FIELD_TYPE]) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSONFeature", "constructor",
                        "missingFeatureGeometryType"));
            }

            if (!properties) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSONFeature", "constructor",
                        "missingProperties"));
            }

            // Documented in defineProperties below.
            this._geometry = geometry;

            // Documented in defineProperties below.
            this._properties =  properties;

            // Documented in defineProperties below.
            this._id = id;

            // Documented in defineProperties below.
            this._bbox = bbox;
        };

        Object.defineProperties(GeoJSONFeature.prototype, {
            /**
             * The GeoJSON Feature geometry as specified to this GeoJSONFeature's constructor.
             * @memberof GeoJSONFeature.prototype
             * @type {Object}
             * @readonly
             */
            geometry: {
                get: function () {
                    return this._geometry;
                }
            },
            /**
             * The GeoJSON Feature properties as specified to this GeoJSONFeature's constructor.
             * @memberof GeoJSONFeature.prototype
             * @type {Object}
             * @readonly
             */
            properties: {
                get: function () {
                    return this._properties;
                }
            },
            /**
             * The GeoJSON Feature id as specified to this GeoJSONFeature's constructor.
             * @memberof GeoJSONFeature.prototype
             * @type {Object}
             * @readonly
             */
            id: {
                get: function () {
                    return this._id;
                }
            },
            /**
             * The GeoJSON Feature bbox member as specified to this GeoJSONFeature's constructor.
             * @memberof GeoJSONFeature.prototype
             * @type {Object}
             * @readonly
             */
            bbox: {
                get: function () {
                    return this._bbox;
                }
            }
        });

        export default GeoJSONFeature;

