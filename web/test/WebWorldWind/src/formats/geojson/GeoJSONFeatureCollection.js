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
 * @exports GeoJSONFeatureCollection
 */
import ArgumentError from '../../error/ArgumentError';
import GeoJSONConstants from './GeoJSONConstants';
import Logger from '../../util/Logger';
        

        /**
         * Constructs a GeoJSON FeatureCollection object. Applications typically do not call this constructor.
         * It is called by {@link GeoJSON} as GeoJSON is read.
         * @alias GeoJSONFeatureCollection
         * @constructor
         * @classdesc Contains the data associated with a GeoJSON Feature Collection Object.
         * An object of type "FeatureCollection" must have a member with the name "features".
         * The value corresponding to "features" is an array. Each element in the array is a feature object as
         * defined in {@link GeoJSONFeature}.
         * To include information on the coordinate range for feature collections, a GeoJSON object may have a member
         * named "bbox".
         * @param {Object} features An object containing the data associated with the GeoJSON FeatureCollection
         * features.
         * @param {Object} bbox An object containing the value of GeoJSON FeatureCollection bbox member.
         * @throws {ArgumentError} If the specified mandatory features parameter is null or undefined.
         */
        var GeoJSONFeatureCollection = function (features,  bbox) {

            if (!features) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSONFeatureCollection", "constructor",
                        "missingFeatures"));
            }

            if (Object.prototype.toString.call(features) !== '[object Array]') {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSONFeatureCollection", "constructor",
                        "invalidFeatures"));
            }

            // Documented in defineProperties below.
            this._features = features;

            // Documented in defineProperties below.
            this._bbox = bbox;
        };

        Object.defineProperties(GeoJSONFeatureCollection.prototype, {
            /**
             * The GeoJSON Feature Collection features as specified to this GeoJSONFeatureCollection's constructor.
             * @memberof GeoJSONFeatureCollection.prototype
             * @type {Object}
             * @readonly
             */
            features: {
                get: function () {
                    return this._features;
                }
            },
            /**
             * The GeoJSON Collection bbox member as specified to this GeoJSONFeatureCollection's constructor.
             * @memberof GeoJSONFeatureCollection.prototype
             * @type {Object}
             * @readonly
             */
            bbox: {
                get: function () {
                    return this._bbox;
                }
            }
        });

        export default GeoJSONFeatureCollection;
    
