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
 * @exports GeoTiffConstants
 */

        

        /**
         * Provides all of the GeoTIFF tag constants.
         * @alias GeoTiff
         * @constructor
         * @classdesc Contains all of the TIFF tags that are used to store GeoTIFF information of any type.
         */
        var GeoTiffConstants = {
            /**
             * An object containing all GeoTiff specific tags.
             * @memberof GeoTiff
             * @type {Object}
             */
            Tag: {
                'MODEL_PIXEL_SCALE': 33550,
                'MODEL_TRANSFORMATION': 34264,
                'MODEL_TIEPOINT': 33922,
                'GEO_KEY_DIRECTORY': 34735,
                'GEO_DOUBLE_PARAMS': 34736,
                'GEO_ASCII_PARAMS': 34737,

                //gdal
                'GDAL_NODATA': 42113,
                'GDAL_METADATA': 42112
            },

            /**
             * An object containing all GeoTiff specific keys.
             * @memberof GeoTiff
             * @type {Object}
             */
            Key: {
                // GeoTIFF Configuration Keys
                'GTModelTypeGeoKey': 1024,
                'GTRasterTypeGeoKey': 1025,
                'GTCitationGeoKey': 1026,

                // Geographic CS Parameter Keys
                'GeographicTypeGeoKey': 2048,
                'GeogCitationGeoKey': 2049,
                'GeogGeodeticDatumGeoKey': 2050,
                'GeogPrimeMeridianGeoKey': 2051,
                'GeogLinearUnitsGeoKey': 2052,
                'GeogLinearUnitSizeGeoKey': 2053,
                'GeogAngularUnitsGeoKey': 2054,
                'GeogAngularUnitSizeGeoKey': 2055,
                'GeogEllipsoidGeoKey': 2056,
                'GeogSemiMajorAxisGeoKey': 2057,
                'GeogSemiMinorAxisGeoKey': 2058,
                'GeogInvFlatteningGeoKey': 2059,
                'GeogAzimuthUnitsGeoKey': 2060,
                'GeogPrimeMeridianLongGeoKey': 2061,
                'GeogTOWGS84GeoKey': 2062,

                // Projected CS Parameter Keys
                'ProjectedCSTypeGeoKey': 3072,
                'PCSCitationGeoKey': 3073,
                'ProjectionGeoKey': 3074,
                'ProjCoordTransGeoKey': 3075,
                'ProjLinearUnitsGeoKey': 3076,
                'ProjLinearUnitSizeGeoKey': 3077,
                'ProjStdParallel1GeoKey': 3078,
                'ProjStdParallel2GeoKey': 3079,
                'ProjNatOriginLongGeoKey': 3080,
                'ProjNatOriginLatGeoKey': 3081,
                'ProjFalseEastingGeoKey': 3082,
                'ProjFalseNorthingGeoKey': 3083,
                'ProjFalseOriginLongGeoKey': 3084,
                'ProjFalseOriginLatGeoKey': 3085,
                'ProjFalseOriginEastingGeoKey': 3086,
                'ProjFalseOriginNorthingGeoKey': 3087,
                'ProjCenterLongGeoKey': 3088,
                'ProjCenterLatGeoKey': 3089,
                'ProjCenterEastingGeoKey': 3090,
                'ProjCenterNorthingGeoKey': 3091,
                'ProjScaleAtNatOriginGeoKey': 3092,
                'ProjScaleAtCenterGeoKey': 3093,
                'ProjAzimuthAngleGeoKey': 3094,
                'ProjStraightVertPoleLongGeoKey': 3095,

                // Vertical CS Keys
                'VerticalCSTypeGeoKey': 4096,
                'VerticalCitationGeoKey': 4097,
                'VerticalDatumGeoKey': 4098,
                'VerticalUnitsGeoKey': 4099
            }
        };

        export default GeoTiffConstants;
    