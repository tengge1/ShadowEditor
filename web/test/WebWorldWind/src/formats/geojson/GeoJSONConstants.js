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
 * @exports GeoJSONConstants
 */

        

        /**
         * Provides GeoJSON string constants.
         * @alias GeoJSONConstants
         * @constructor
         * @classdesc Contains some GeoJSON string constants.
         */
        var GeoJSONConstants = function () {};

        GeoJSONConstants.FIELD_TYPE = "type";
        GeoJSONConstants.FIELD_CRS = "crs";
        GeoJSONConstants.FIELD_NAME = "name";
        GeoJSONConstants.FIELD_BBOX = "bbox";
        GeoJSONConstants.FIELD_COORDINATES = "coordinates";
        GeoJSONConstants.FIELD_GEOMETRIES = "geometries";
        GeoJSONConstants.FIELD_GEOMETRY = "geometry";
        GeoJSONConstants.FIELD_PROPERTIES = "properties";
        GeoJSONConstants.FIELD_FEATURES = "features";
        GeoJSONConstants.FIELD_ID = "id";

        GeoJSONConstants.TYPE_POINT = "Point";
        GeoJSONConstants.TYPE_MULTI_POINT = "MultiPoint";
        GeoJSONConstants.TYPE_LINE_STRING = "LineString";
        GeoJSONConstants.TYPE_MULTI_LINE_STRING = "MultiLineString";
        GeoJSONConstants.TYPE_POLYGON = "Polygon";
        GeoJSONConstants.TYPE_MULTI_POLYGON = "MultiPolygon";
        GeoJSONConstants.TYPE_GEOMETRY_COLLECTION = "GeometryCollection";
        GeoJSONConstants.TYPE_FEATURE = "Feature";
        GeoJSONConstants.TYPE_FEATURE_COLLECTION = "FeatureCollection";

        GeoJSONConstants.FIELD_CRS_NAME = "name";
        GeoJSONConstants.FIELD_CRS_LINK = "link";

        // Default Named CRS string
        // OGC CRS URNs such as "urn:ogc:def:crs:OGC:1.3:CRS84" shall be preferred over legacy identifiers
        // such as "EPSG:4326"
        GeoJSONConstants.WGS84_CRS = "urn:ogc:def:crs:OGC:1.3:CRS84";
        GeoJSONConstants.EPSG4326_CRS = "EPSG:4326";

        export default GeoJSONConstants;
    


