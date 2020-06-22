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
 * @exports GeoJSONParser
 */
import ArgumentError from '../../error/ArgumentError';
import Color from '../../util/Color';
import GeoJSONConstants from './GeoJSONConstants';
import GeoJSONCRS from './GeoJSONCRS';
import GeoJSONFeature from './GeoJSONFeature';
import GeoJSONFeatureCollection from './GeoJSONFeatureCollection';
import GeoJSONGeometry from './GeoJSONGeometry';
import GeoJSONGeometryCollection from './GeoJSONGeometryCollection';
import GeoJSONGeometryLineString from './GeoJSONGeometryLineString';
import GeoJSONGeometryMultiLineString from './GeoJSONGeometryMultiLineString';
import GeoJSONGeometryMultiPoint from './GeoJSONGeometryMultiPoint';
import GeoJSONGeometryMultiPolygon from './GeoJSONGeometryMultiPolygon';
import GeoJSONGeometryPoint from './GeoJSONGeometryPoint';
import GeoJSONGeometryPolygon from './GeoJSONGeometryPolygon';
import Location from '../../geom/Location';
import Logger from '../../util/Logger';
import Placemark from '../../shapes/Placemark';
import PlacemarkAttributes from '../../shapes/PlacemarkAttributes';
import Polygon from '../../shapes/Polygon';
import Position from '../../geom/Position';
import Proj4 from '../../util/proj4-src';
import RenderableLayer from '../../layer/RenderableLayer';
import ShapeAttributes from '../../shapes/ShapeAttributes';
import SurfacePolygon from '../../shapes/SurfacePolygon';
import SurfacePolyline from '../../shapes/SurfacePolyline';
        

        /**
         * Constructs a GeoJSON object for a specified GeoJSON data source. Call [load]{@link GeoJSONParser#load} to
         * retrieve the GeoJSON and create shapes for it.
         * @alias GeoJSONParser
         * @constructor
         * @classdesc Parses a GeoJSON and creates shapes representing its contents. Points and MultiPoints in
         * the GeoJSON are represented by [Placemarks]{@link Placemark}, Lines and MultiLines are represented by
         * [SurfacePolylines]{@link SurfacePolyline}, and Polygons and MultiPolygons are represented
         * by [SurfacePolygons]{@link SurfacePolygon}.
         * <p>
         * An attribute callback may also be specified to examine each geometry and configure the shape created for it.
         * This function enables the application to assign independent attributes to each
         * shape. An argument to this function provides any attributes specified in a properties member of GeoJSON
         * feature.
         * @param {String|Object} dataSource The data source of the GeoJSON. Can be a URL to an external resource,
         * or a JSON string, or a JavaScript object representing a parsed GeoJSON string.
         * @throws {ArgumentError} If the specified data source is null or undefined.
         */
        var GeoJSONParser = function (dataSource) {
            if (!dataSource) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "constructor", "missingDataSource"));
            }

            // Documented in defineProperties below.
            this._dataSource = dataSource;

            // Documented in defineProperties below.
            this._geoJSONObject = null;

            // Documented in defineProperties below.
            this._geoJSONType = null;

            // Documented in defineProperties below.
            this._crs = null;

            // Documented in defineProperties below.
            this._layer = null;

            // Documented in defineProperties below.
            this._parserCompletionCallback = null;

            // Documented in defineProperties below.
            this._shapeConfigurationCallback = this.defaultShapeConfigurationCallback;


            this.defaultPlacemarkAttributes = new PlacemarkAttributes(null);

            this.defaultShapeAttributes = new ShapeAttributes(null);

            this.setProj4jsAliases();
        };

        Object.defineProperties(GeoJSONParser.prototype, {
            /**
             * The GeoJSON data source as specified to this GeoJSON's constructor.
             * @memberof GeoJSONParser.prototype
             * @type {String|Object}
             * @readonly
             */
            dataSource: {
                get: function () {
                    return this._dataSource;
                }
            },

            /**
             * The GeoJSON object resulting from the parsing of GeoJSON string.
             * @memberof GeoJSONParser.prototype
             * @type {Object}
             * @readonly
             */
            geoJSONObject: {
                get: function () {
                    return this._geoJSONObject;
                }
            },

            /**
             * The type of the GeoJSON. The type can be one of the following:
             * <ul>
             *     <li>GeoJSONConstants.TYPE_POINT</li>
             *     <li>GeoJSONConstants.TYPE_MULTI_POINT</li>
             *     <li>GeoJSONConstants.TYPE_LINE_STRING</li>
             *     <li>GeoJSONConstants.TYPE_MULTI_LINE_STRING</li>
             *     <li>GeoJSONConstants.TYPE_POLYGON</li>
             *     <li>GeoJSONConstants.TYPE_MULTI_POLYGON</li>
             *     <li>GeoJSONConstants.TYPE_GEOMETRY_COLLECTION</li>
             *     <li>GeoJSONConstants.TYPE_FEATURE</li>
             *     <li>GeoJSONConstants.TYPE_FEATURE_COLLECTION</li>
             * </ul>
             * This value is defined after GeoJSON parsing.
             * @memberof GeoJSONParser.prototype
             * @type {String}
             * @readonly
             */
            geoJSONType: {
                get: function () {
                    return this._geoJSONType;
                }
            },

            /**
             *
             */
            crs: {
                get: function () {
                    return this._crs;
                }
            },

            /**
             * The layer containing the shapes representing the geometries in this GeoJSON, as specified to this
             * GeoJSON's constructor or created by the constructor if no layer was specified.
             * @memberof GeoJSONParser.prototype
             * @type {RenderableLayer}
             * @readonly
             */
            layer: {
                get: function () {
                    return this._layer;
                }
            },

            /** The completion callback specified to [load]{@link GeoJSONParser#load}. An optional function called when
             * the GeoJSON loading is complete and
             * all the shapes have been added to the layer.
             * @memberof GeoJSONParser.prototype
             * @type {Function}
             * @readonly
             */
            parserCompletionCallback: {
                get: function () {
                    return this._parserCompletionCallback;
                }
            },

            /**
             * The attribute callback specified to [load]{@link GeoJSONParser#load}.
             * See that method's description for details.
             * @memberof GeoJSONParser.prototype
             * @type {Function}
             * @default [defaultShapeConfigurationCallback]{@link GeoJSONParser#defaultShapeConfigurationCallback}
             * @readonly
             */
            shapeConfigurationCallback: {
                get: function () {
                    return this._shapeConfigurationCallback;
                }
            }
        });

        /**
         * Retrieves the GeoJSON, parses it and creates shapes representing its contents. The result is a layer
         * containing the created shapes. A function can also be specified to be called for each GeoJSON geometry so
         * that the attributes and other properties of the shape created for it can be assigned.
         * @param {Function} parserCompletionCallback An optional function called when the GeoJSON loading is
         * complete and all the shapes have been added to the layer.
         * @param {Function} shapeConfigurationCallback An optional function called by the addRenderablesFor*
         * methods just prior to creating a shape for the indicated GeoJSON geometry. This function
         * can be used to assign attributes to newly created shapes. The callback function's first argument is the
         * current geometry object.  The second argument to the callback function is the object containing the
         * properties read from the corresponding GeoJSON properties member, if any.
         * See the following methods for descriptions of the configuration properties they recognize:
         * <ul>
         *     <li>[addRenderablesForPoint]{@link GeoJSONParser#addRenderablesForPoint}</li>
         *     <li>[addRenderablesForMultiPoint]{@link GeoJSONParser#addRenderablesForMultiPoint}</li>
         *     <li>[addRenderablesForLineString]{@link GeoJSONParser#addRenderablesForLineString}</li>
         *     <li>[addRenderablesForMultiLineString]{@link GeoJSONParser#addRenderablesForMultiLineString}</li>
         *     <li>[addRenderablesForPolygon]{@link GeoJSONParser#addRenderablesForPolygon}</li>
         *     <li>[addRenderablesForMultiPolygon]{@link GeoJSONParser#addRenderablesForMultiPolygon}</li>
         *     <li>[addRenderablesForGeometryCollection]{@link GeoJSONParser#addRenderablesForGeometryCollection}</li>
         *     <li>[addRenderablesForFeature]{@link GeoJSONParser#addRenderablesForFeature}</li>
         *     <li>[addRenderablesForFeatureCollection]{@link GeoJSONParser#addRenderablesForFeatureCollection}</li>
         * </ul>
         *
         * @param {RenderableLayer} layer A {@link RenderableLayer} to hold the shapes created for each GeoJSON
         * geometry. If null, a new layer is created and assigned to this object's [layer]{@link GeoJSONParser#layer}
         * property.
         */

        GeoJSONParser.prototype.load = function (parserCompletionCallback, shapeConfigurationCallback, layer) {
            if (parserCompletionCallback) {
                this._parserCompletionCallback = parserCompletionCallback;
            }

            if (shapeConfigurationCallback) {
                this._shapeConfigurationCallback = shapeConfigurationCallback;
            }

            this._layer = layer || new RenderableLayer();

            var dataSourceType = (typeof this.dataSource);
            if (dataSourceType === 'string') {
                var obj = GeoJSONParser.tryParseJSONString(this.dataSource);
                if (obj !== null) {
                    this.handle(obj);
                } else {
                    this.requestUrl(this.dataSource);
                }
            } else if (dataSourceType === 'object') {
                this.handle(this.dataSource);
            } else {
                Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "load",
                    "Unsupported data source type: " + dataSourceType);
            }
        };

        /**
         * The default [shapeConfigurationCallback]{@link GeoJSONParser#shapeConfigurationCallback} for this GeoJSON.
         * It is called if none was specified to the [load]{@link GeoJSONParser#load} method.
         * This method assigns shared, default attributes to the shapes created for each geometry. Any changes to these
         * attributes will have an effect in all shapes created by this GeoJSON.
         * <p>
         * For all geometry, the GeoJSON's properties are checked for an attribute named "name", "Name" or "NAME".
         * If found, the returned shape configuration contains a name property holding the value associated with
         * the attribute. This value is specified as the label displayName property for all shapes created.
         * For {@link Placemark} shapes it is also specified as the placemark label.
         * It is specified as the displayName for all other shapes.
         *
         * @param {GeoJSONGeometry} geometry An object containing the geometry associated with this GeoJSON.
         * @param {Object} properties An object containing the attribute-value pairs found in GeoJSON feature
         * properties member.
         * @returns {Object} An object with properties as described above.
         */
        GeoJSONParser.prototype.defaultShapeConfigurationCallback = function (geometry, properties) {
            var configuration = {};

            var name = properties.name || properties.Name || properties.NAME;
            if (name) {
                configuration.name = name;
            }

            if (geometry.isPointType() || geometry.isMultiPointType()) {
                configuration.attributes = this.defaultPlacemarkAttributes;
            } else if (geometry.isLineStringType() || geometry.isMultiLineStringType()) {
                configuration.attributes = this.defaultShapeAttributes;
            } else if (geometry.isPolygonType() || geometry.isMultiPolygonType()) {
                configuration.attributes = this.defaultShapeAttributes;
            }

            return configuration;
        };

        // Get GeoJSON string using XMLHttpRequest. Internal use only.
        GeoJSONParser.prototype.requestUrl = function (url) {
            var xhr = new XMLHttpRequest();

            xhr.open("GET", url, true);
            xhr.responseType = 'text';
            xhr.onreadystatechange = (function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        this.handle(GeoJSONParser.tryParseJSONString(xhr.response));
                    }
                    else {
                        Logger.log(Logger.LEVEL_WARNING,
                            "GeoJSON retrieval failed (" + xhr.statusText + "): " + url);
                    }
                }
            }).bind(this);

            xhr.onerror = function () {
                Logger.log(Logger.LEVEL_WARNING, "GeoJSON retrieval failed: " + url);
            };

            xhr.ontimeout = function () {
                Logger.log(Logger.LEVEL_WARNING, "GeoJSON retrieval timed out: " + url);
            };

            xhr.send(null);
        };

        // Handles the object created from the GeoJSON data source. Internal use only.
        GeoJSONParser.prototype.handle = function (obj) {
            if (!obj) {
                Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "handle", "Invalid GeoJSON object");
            }

            this._geoJSONObject = obj;

            if (Object.prototype.toString.call(this.geoJSONObject) === '[object Array]') {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "handle",
                        "invalidGeoJSONObjectLength"));
            }

            if (this.geoJSONObject.hasOwnProperty(GeoJSONConstants.FIELD_TYPE)) {
                this.setGeoJSONType();
                this.setGeoJSONCRS();
            } else {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "handle",
                        "missingGeoJSONType"));
            }

            if (!!this._parserCompletionCallback && typeof this._parserCompletionCallback === "function") {
                this._parserCompletionCallback(this.layer);
            }
        };

        // Set GeoJSON CRS object.
        // If no crs member can be so acquired, the default CRS shall apply to the GeoJSON object.
        // The crs member should be on the top-level GeoJSON object in a hierarchy (in feature collection, feature,
        // geometry order) and should not be repeated or overridden on children or grandchildren of the object.
        // Internal use only.
        GeoJSONParser.prototype.setGeoJSONCRS = function () {
            if (this.geoJSONObject[GeoJSONConstants.FIELD_CRS]){
                this._crs = new GeoJSONCRS (
                    this.geoJSONObject[GeoJSONConstants.FIELD_CRS][GeoJSONConstants.FIELD_TYPE],
                    this.geoJSONObject[GeoJSONConstants.FIELD_CRS][GeoJSONConstants.FIELD_PROPERTIES]);

                var crsCallback = (function() {
                    this.addRenderablesForGeoJSON(this.layer);
                }).bind(this);

                this.crs.setCRSString(crsCallback);
            }
            else{
                // If no CRS, consider default one
                this.addRenderablesForGeoJSON(this.layer);
            }
        };

        /**
         * Iterates over this GeoJSON's geometries and creates shapes for them. See the following methods for the
         * details of the shapes created and their use of the
         * [shapeConfigurationCallback]{@link GeoJSONParser#shapeConfigurationCallback}:
         * <ul>
         *     <li>[addRenderablesForGeometry]{@link GeoJSONParser#addRenderablesForGeometry}</li>
         *     <li>[addRenderablesForGeometryCollection]{@link GeoJSONParser#addRenderablesForGeometryCollection}</li>
         *     <li>[addRenderablesForFeature]{@link GeoJSONParser#addRenderablesForFeature}</li>
         *     <li>[addRenderablesForFeatureCollection]{@link GeoJSONParser#addRenderablesForFeatureCollection}</li>
         * </ul>
         * @param {RenderableLayer} layer The layer in which to place the newly created shapes.
         * @throws {ArgumentError} If the specified layer is null or undefined.
         */
        GeoJSONParser.prototype.addRenderablesForGeoJSON = function (layer) {
            if (!layer) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForGeoJSON", "missingLayer"));
            }

            switch(this.geoJSONType) {
                case GeoJSONConstants.TYPE_FEATURE:
                    var feature = new  GeoJSONFeature(
                        this.geoJSONObject[GeoJSONConstants.FIELD_GEOMETRY],
                        this.geoJSONObject[GeoJSONConstants.FIELD_PROPERTIES],
                        this.geoJSONObject[GeoJSONConstants.FIELD_ID],
                        this.geoJSONObject[GeoJSONConstants.FIELD_BBOX]
                    );
                    this.addRenderablesForFeature(
                        layer,
                        feature);
                    break;
                case GeoJSONConstants.TYPE_FEATURE_COLLECTION:
                    var featureCollection = new GeoJSONFeatureCollection(
                        this.geoJSONObject[GeoJSONConstants.FIELD_FEATURES],
                        this.geoJSONObject[GeoJSONConstants.FIELD_BBOX]
                    );
                    this.addRenderablesForFeatureCollection(
                        layer,
                        featureCollection);
                    break;
                case GeoJSONConstants.TYPE_GEOMETRY_COLLECTION:
                    var geometryCollection = new GeoJSONGeometryCollection(
                        this.geoJSONObject[GeoJSONConstants.FIELD_GEOMETRIES],
                        this.geoJSONObject[GeoJSONConstants.FIELD_BBOX]);
                    this.addRenderablesForGeometryCollection(
                        layer,
                        geometryCollection,
                        null);
                    break;
                default:
                    this.addRenderablesForGeometry(
                        layer,
                        this.geoJSONObject,
                        null);
                    break;
            }
        };

        /**
         * Creates shape for a geometry. See the following methods for the
         * details of the shapes created and their use of the
         * [shapeConfigurationCallback]{@link GeoJSONParser#shapeConfigurationCallback}:
         * <ul>
         *     <li>[addRenderablesForPoint]{@link GeoJSONParser#addRenderablesForPoint}</li>
         *     <li>[addRenderablesForMultiPoint]{@link GeoJSONParser#addRenderablesForMultiPoint}</li>
         *     <li>[addRenderablesForLineString]{@link GeoJSONParser#addRenderablesForLineString}</li>
         *     <li>[addRenderablesForMultiLineString]{@link GeoJSONParser#addRenderablesForMultiLineString}</li>
         *     <li>[addRenderablesForPolygon]{@link GeoJSONParser#addRenderablesForPolygon}</li>
         *     <li>[addRenderablesForMultiPolygon]{@link GeoJSONParser#addRenderablesForMultiPolygon}</li>
         * </ul>
         * @param {RenderableLayer} layer The layer in which to place the newly created shapes.
         * @param {GeoJSONGeometry} geometry An object containing the current geometry.
         * @param {Object} properties An object containing the attribute-value pairs found in GeoJSON feature
         * properties member.
         * @throws {ArgumentError} If the specified layer is null or undefined.
         * @throws {ArgumentError} If the geometry is null or undefined.
         */
        GeoJSONParser.prototype.addRenderablesForGeometry = function (layer, geometry, properties){
            if (!layer) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForGeometry", "missingLayer"));
            }

            if (!geometry) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForGeometry", "missingGeometry"));
            }

            switch(geometry[GeoJSONConstants.FIELD_TYPE]){
                case GeoJSONConstants.TYPE_POINT:
                    var pointGeometry = new GeoJSONGeometryPoint(
                        geometry[GeoJSONConstants.FIELD_COORDINATES],
                        geometry[GeoJSONConstants.FIELD_TYPE],
                        geometry[GeoJSONConstants.FIELD_BBOX]);
                    this.addRenderablesForPoint(
                        layer,
                        pointGeometry,
                        properties ? properties : null);
                    break;
                case GeoJSONConstants.TYPE_MULTI_POINT:
                    var multiPointGeometry = new GeoJSONGeometryMultiPoint(
                        geometry[GeoJSONConstants.FIELD_COORDINATES],
                        geometry[GeoJSONConstants.FIELD_TYPE],
                        geometry[GeoJSONConstants.FIELD_BBOX]);
                    this.addRenderablesForMultiPoint(
                        layer,
                        multiPointGeometry,
                        properties ? properties : null);
                    break;
                case GeoJSONConstants.TYPE_LINE_STRING:
                    var lineStringGeometry = new GeoJSONGeometryLineString(
                        geometry[GeoJSONConstants.FIELD_COORDINATES],
                        geometry[GeoJSONConstants.FIELD_TYPE],
                        geometry[GeoJSONConstants.FIELD_BBOX]);
                    this.addRenderablesForLineString(
                        layer,
                        lineStringGeometry,
                        properties ? properties : null);
                    break;
                case GeoJSONConstants.TYPE_MULTI_LINE_STRING:
                    var multiLineStringGeometry = new GeoJSONGeometryMultiLineString(
                        geometry[GeoJSONConstants.FIELD_COORDINATES],
                        geometry[GeoJSONConstants.FIELD_TYPE],
                        geometry[GeoJSONConstants.FIELD_BBOX]);
                    this.addRenderablesForMultiLineString(
                        layer,
                        multiLineStringGeometry,
                        properties ? properties : null);
                    break;
                case GeoJSONConstants.TYPE_POLYGON:
                    var polygonGeometry = new GeoJSONGeometryPolygon(
                        geometry[GeoJSONConstants.FIELD_COORDINATES],
                        geometry[GeoJSONConstants.FIELD_TYPE],
                        geometry[GeoJSONConstants.FIELD_BBOX]
                    );
                    this.addRenderablesForPolygon(
                        layer,
                        polygonGeometry,
                        properties ? properties : null);
                    break;
                case GeoJSONConstants.TYPE_MULTI_POLYGON:
                    var multiPolygonGeometry = new GeoJSONGeometryMultiPolygon(
                        geometry[GeoJSONConstants.FIELD_COORDINATES],
                        geometry[GeoJSONConstants.FIELD_TYPE],
                        geometry[GeoJSONConstants.FIELD_BBOX]);
                    this.addRenderablesForMultiPolygon(
                        layer,
                        multiPolygonGeometry,
                        properties ? properties : null);
                    break;
                default:
                    break;
            }
        }

        /**
         * Creates a {@link Placemark} for a Point geometry.
         * Applications typically do not call this method directly. It is called by
         * [addRenderablesForGeometry]{@link GeoJSONParser#addRenderablesForGeometry}.
         * <p>
         * This method invokes this GeoJSON's
         * [shapeConfigurationCallback]{@link GeoJSONParser#shapeConfigurationCallback} for the geometry.
         * @param {RenderableLayer} layer The layer in which to place the newly created shapes.
         * @param {GeoJSONGeometryPoint} geometry The Point geometry object.
         * @param {Object} properties The properties related to the Point geometry.
         * @throws {ArgumentError} If the specified layer is null or undefined.
         * @throws {ArgumentError} If the specified geometry is null or undefined.
         */
        GeoJSONParser.prototype.addRenderablesForPoint = function (layer, geometry, properties) {
            if (!layer) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForPoint", "missingLayer"));
            }

            if (!geometry) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForPoint", "missingGeometry"));
            }

            var configuration = this.shapeConfigurationCallback(geometry, properties);

            if (!this.crs || this.crs.isCRSSupported()) {
                var longitude = geometry.coordinates[0],
                    latitude = geometry.coordinates[1],
                    altitude = geometry.coordinates[2] ?  geometry.coordinates[2] : 0;

                var reprojectedCoordinate = this.getReprojectedIfRequired(
                    latitude,
                    longitude,
                    this.crs);
                var position = new Position(reprojectedCoordinate[1], reprojectedCoordinate[0], altitude);
                var placemark = new Placemark(
                    position,
                    false,
                    configuration && configuration.attributes ? configuration.attributes : null);

                placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
                if (configuration && configuration.name){
                    placemark.label = configuration.name;
                }
                if (configuration.highlightAttributes) {
                    placemark.highlightAttributes = configuration.highlightAttributes;
                }
                if (configuration && configuration.pickDelegate) {
                    placemark.pickDelegate = configuration.pickDelegate;
                }
                if (configuration && configuration.userProperties) {
                    placemark.userProperties = configuration.userProperties;
                }
                layer.addRenderable(placemark);
            }
        };

        /**
         * Creates {@link Placemark}s for a MultiPoint geometry.
         * Applications typically do not call this method directly. It is called by
         * [addRenderablesForGeometry]{@link GeoJSONParser#addRenderablesForGeometry}.
         * <p>
         * This method invokes this GeoJSON's
         * [shapeConfigurationCallback]{@link GeoJSONParser#shapeConfigurationCallback} for the geometry.
         * @param {RenderableLayer} layer The layer in which to place the newly created shapes.
         * @param {GeoJSONGeometryMultiPoint} geometry The MultiPoint geometry object.
         * @param {Object} properties The properties related to the MultiPoint geometry.
         * @throws {ArgumentError} If the specified layer is null or undefined.
         * @throws {ArgumentError} If the specified geometry is null or undefined.
         */
        GeoJSONParser.prototype.addRenderablesForMultiPoint = function (layer, geometry, properties) {
            if (!layer) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForMultiPoint",
                        "missingLayer"));
            }

            if (!geometry) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForMultiPoint",
                        "missingGeometry"));
            }

            var configuration = this.shapeConfigurationCallback(geometry, properties);

            if (!this.crs || this.crs.isCRSSupported()) {
                for (var pointIndex = 0, points = geometry.coordinates.length; pointIndex < points; pointIndex += 1){
                    var longitude = geometry.coordinates[pointIndex][0],
                        latitude = geometry.coordinates[pointIndex][1],
                        altitude = geometry.coordinates[pointIndex][2] ?  geometry.coordinates[pointIndex][2] : 0;

                    var reprojectedCoordinate = this.getReprojectedIfRequired(
                        latitude,
                        longitude,
                        this.crs);
                    var position = new Position(reprojectedCoordinate[1], reprojectedCoordinate[0], altitude);
                    var placemark = new Placemark(
                        position,
                        false,
                        configuration && configuration.attributes ? configuration.attributes : null);
                    placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
                    if (configuration && configuration.name){
                        placemark.label = configuration.name;
                    }
                    if (configuration.highlightAttributes) {
                        placemark.highlightAttributes = configuration.highlightAttributes;
                    }
                    if (configuration && configuration.pickDelegate) {
                        placemark.pickDelegate = configuration.pickDelegate;
                    }
                    if (configuration && configuration.userProperties) {
                        placemark.userProperties = configuration.userProperties;
                    }
                    layer.addRenderable(placemark);
                }
            }
        };

        /**
         * Creates a {@link SurfacePolyline} for a LineString geometry.
         * Applications typically do not call this method directly. It is called by
         * [addRenderablesForGeometry]{@link GeoJSONParser#addRenderablesForGeometry}.
         * <p>
         * This method invokes this GeoJSON's
         * [shapeConfigurationCallback]{@link GeoJSONParser#shapeConfigurationCallback} for the geometry.
         * @param {RenderableLayer} layer The layer in which to place the newly created shapes.
         * @param {GeoJSONGeometryLineString} geometry The LineString geometry object.
         * @param {Object} properties The properties related to the LineString geometry.
         * @throws {ArgumentError} If the specified layer is null or undefined.
         * @throws {ArgumentError} If the specified geometry is null or undefined.
         */
        GeoJSONParser.prototype.addRenderablesForLineString = function (layer, geometry, properties) {
            if (!layer) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForLineString",
                        "missingLayer"));
            }

            if (!geometry) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForLineString",
                        "missingGeometry"));
            }

            var configuration = this.shapeConfigurationCallback(geometry, properties);

            if (!this.crs || this.crs.isCRSSupported()) {
                var positions = [];
                for (var pointsIndex = 0, points = geometry.coordinates; pointsIndex < points.length; pointsIndex++) {
                    var longitude = points[pointsIndex][0],
                        latitude = points[pointsIndex][1];
                    //altitude = points[pointsIndex][2] ?  points[pointsIndex][2] : 0,
                    var reprojectedCoordinate = this.getReprojectedIfRequired(
                        latitude,
                        longitude,
                        this.crs);
                    var position = new Location(reprojectedCoordinate[1], reprojectedCoordinate[0]);
                    positions.push(position);
                }

                var shape;
                shape = new SurfacePolyline(
                    positions,
                    configuration && configuration.attributes ? configuration.attributes : null);
                if (configuration.highlightAttributes) {
                    shape.highlightAttributes = configuration.highlightAttributes;
                }
                if (configuration && configuration.pickDelegate) {
                    shape.pickDelegate = configuration.pickDelegate;
                }
                if (configuration && configuration.userProperties) {
                    shape.userProperties = configuration.userProperties;
                }
                layer.addRenderable(shape);
            }
        };

        /**
         * Creates {@link SurfacePolyline}s for a MultiLineString geometry.
         * Applications typically do not call this method directly. It is called by
         * [addRenderablesForGeometry]{@link GeoJSONParser#addRenderablesForGeometry}.
         * <p>
         * This method invokes this GeoJSON's
         * [shapeConfigurationCallback]{@link GeoJSONParser#shapeConfigurationCallback} for the geometry.
         * @param {RenderableLayer} layer The layer in which to place the newly created shapes.
         * @param {GeoJSONGeometryMultiLineString} geometry The MultiLineString geometry object.
         * @param {Object} properties The properties related to the MultiLineString geometry.
         * @throws {ArgumentError} If the specified layer is null or undefined.
         * @throws {ArgumentError} If the specified geometry is null or undefined.
         */
        GeoJSONParser.prototype.addRenderablesForMultiLineString = function (layer, geometry, properties) {
            if (!layer) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForMultiLineString",
                        "missingLayer"));
            }

            if (!geometry) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForMultiLineString",
                        "missingGeometry"));
            }

            var configuration = this.shapeConfigurationCallback(geometry, properties);

            if (!this.crs || this.crs.isCRSSupported()) {
                for (var linesIndex = 0, lines = geometry.coordinates; linesIndex < lines.length; linesIndex++) {
                    var positions = [];

                    for (var positionIndex = 0, points = lines[linesIndex]; positionIndex < points.length;
                         positionIndex++) {
                        var longitude = points[positionIndex][0],
                            latitude = points[positionIndex][1];
                        //altitude = points[positionIndex][2] ?  points[positionIndex][2] : 0,
                        var reprojectedCoordinate = this.getReprojectedIfRequired(
                            latitude,
                            longitude,
                            this.crs);
                        var position = new Location(reprojectedCoordinate[1], reprojectedCoordinate[0]);
                        positions.push(position);
                    }

                    var shape;
                    shape = new SurfacePolyline(
                        positions,
                        configuration && configuration.attributes ? configuration.attributes : null);
                    if (configuration.highlightAttributes) {
                        shape.highlightAttributes = configuration.highlightAttributes;
                    }
                    if (configuration && configuration.pickDelegate) {
                        shape.pickDelegate = configuration.pickDelegate;
                    }
                    if (configuration && configuration.userProperties) {
                        shape.userProperties = configuration.userProperties;
                    }
                    layer.addRenderable(shape);
                }
            }
        };

        /**
         * Creates a {@link SurfacePolygon} for a Polygon geometry.
         * Applications typically do not call this method directly. It is called by
         * [addRenderablesForGeometry]{@link GeoJSONParser#addRenderablesForGeometry}.
         * <p>
         * This method invokes this GeoJSON's
         * [shapeConfigurationCallback]{@link GeoJSONParser#shapeConfigurationCallback} for the geometry.
         * @param {RenderableLayer} layer The layer in which to place the newly created shapes.
         * @param {GeoJSONGeometryPolygon} geometry The Polygon geometry object.
         * @param {Object} properties The properties related to the Polygon geometry.
         * @throws {ArgumentError} If the specified layer is null or undefined.
         * @throws {ArgumentError} If the specified geometry is null or undefined.
         */
        GeoJSONParser.prototype.addRenderablesForPolygon = function (layer, geometry, properties) {
            if (!layer) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForPolygon", "missingLayer"));
            }

            if (!geometry) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForPolygon", "missingGeometry"));
            }

            var configuration = this.shapeConfigurationCallback(geometry, properties);

            if (!this.crs || this.crs.isCRSSupported()) {
                var pBoundaries = [];
                for (var boundariesIndex = 0, boundaries = geometry.coordinates;
                     boundariesIndex < boundaries.length; boundariesIndex++) {
                    var positions = [];

                    for (var positionIndex = 0, points = boundaries[boundariesIndex];
                         positionIndex < points.length; positionIndex++) {
                        var longitude = points[positionIndex][0],
                            latitude = points[positionIndex][1];
                        //altitude = points[positionIndex][2] ?  points[positionIndex][2] : 0,
                        var reprojectedCoordinate = this.getReprojectedIfRequired(
                            latitude,
                            longitude,
                            this.crs);
                        var position = new Location(reprojectedCoordinate[1], reprojectedCoordinate[0]);
                        positions.push(position);
                    }
                    pBoundaries.push(positions);
                }

                    var shape;
                    shape = new SurfacePolygon(
                        pBoundaries,
                        configuration && configuration.attributes ? configuration.attributes : null);
                    if (configuration.highlightAttributes) {
                        shape.highlightAttributes = configuration.highlightAttributes;
                    }
                    if (configuration && configuration.pickDelegate) {
                        shape.pickDelegate = configuration.pickDelegate;
                    }
                    if (configuration && configuration.userProperties) {
                        shape.userProperties = configuration.userProperties;
                    }                    layer.addRenderable(shape);
            }
        };

        /**
         * Creates {@link SurfacePolygon}s for a MultiPolygon geometry.
         * Applications typically do not call this method directly. It is called by
         * [addRenderablesForGeometry]{@link GeoJSONParser#addRenderablesForGeometry}.
         * <p>
         * This method invokes this GeoJSON's
         * [shapeConfigurationCallback]{@link GeoJSONParser#shapeConfigurationCallback} for the geometry.
         * @param {RenderableLayer} layer The layer in which to place the newly created shapes.
         * @param {GeoJSONGeometryMultiPolygon} geometry The MultiPolygon geometry object.
         * @param {Object} properties The properties related to the MultiPolygon geometry.
         * @throws {ArgumentError} If the specified layer is null or undefined.
         * @throws {ArgumentError} If the specified geometry is null or undefined.
         */
        GeoJSONParser.prototype.addRenderablesForMultiPolygon = function (layer, geometry, properties) {
            if (!layer) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForMultiPolygon",
                        "missingLayer"));
            }

            if (!geometry) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForMultiPolygon",
                        "missingGeometry"));
            }

            var configuration = this.shapeConfigurationCallback(geometry, properties);

            if (!this.crs || this.crs.isCRSSupported()) {
                for (var polygonsIndex = 0, polygons = geometry.coordinates;
                     polygonsIndex < polygons.length; polygonsIndex++) {
                    var boundaries = [];
                    for (var boundariesIndex = 0; boundariesIndex < polygons[polygonsIndex].length; boundariesIndex++) {
                        var positions = [];
                        for (var positionIndex = 0, points = polygons[polygonsIndex][boundariesIndex];
                             positionIndex < points.length; positionIndex++) {
                            var longitude = points[positionIndex][0],
                                latitude = points[positionIndex][1];
                            //altitude = points[positionIndex][2] ?  points[positionIndex][2] : 0,;

                            var reprojectedCoordinate = this.getReprojectedIfRequired(
                                latitude,
                                longitude,
                                this.crs);
                            var position = new Location(reprojectedCoordinate[1], reprojectedCoordinate[0]);
                            positions.push(position);
                        }
                        boundaries.push(positions);
                    }
                    var shape;
                    shape = new SurfacePolygon(
                        boundaries,
                        configuration && configuration.attributes ? configuration.attributes : null);
                    if (configuration.highlightAttributes) {
                        shape.highlightAttributes = configuration.highlightAttributes;
                    }
                    if (configuration && configuration.pickDelegate) {
                        shape.pickDelegate = configuration.pickDelegate;
                    }
                    if (configuration && configuration.userProperties) {
                        shape.userProperties = configuration.userProperties;
                    }
                    layer.addRenderable(shape);
                }
            }
        };

        /**
         * Iterates over the GeoJSON GeometryCollection geometries and creates {@link GeoJSONGeometry}s for them.
         * Applications typically do not call this method directly. It is called by
         * [addRenderablesForGeoJSON]{@link GeoJSONParser#addRenderablesForGeoJSON}.
         * @param {RenderableLayer} layer The layer in which to place the newly created shapes.
         * @param {GeoJSONGeometryCollection} geometryCollection The GeometryCollection object.
         * @param {Object} properties The properties related to the GeometryCollection geometry.
         * @throws {ArgumentError} If the specified layer is null or undefined.
         * @throws {ArgumentError} If the specified featureCollection is null or undefined.
         */
        GeoJSONParser.prototype.addRenderablesForGeometryCollection = function (layer, geometryCollection, properties) {
            if (!layer) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForGeometryCollection",
                        "missingLayer"));
            }

            if (!geometryCollection) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForGeometryCollection",
                        "missingGeometryCollection"));
            }


            for (var geometryIndex = 0, geometries = geometryCollection.geometries;
                 geometryIndex < geometries.length; geometryIndex++) {
                if(geometries[geometryIndex].hasOwnProperty(GeoJSONConstants.FIELD_TYPE)){
                    this.addRenderablesForGeometry(layer, geometries[geometryIndex], properties);
                }
            }
        };

        /**
         * Calls [addRenderablesForGeometry]{@link GeoJSONParser#addRenderablesForGeometry} or
         * [addRenderablesForGeometryCollection]{@link GeoJSONParser#addRenderablesForGeometryCollection}
         * depending on the type of feature geometry.
         * Applications typically do not call this method directly. It is called by
         * [addRenderablesForGeoJSON]{@link GeoJSONParser#addRenderablesForGeoJSON}.
         * @param {RenderableLayer} layer The layer in which to place the newly created shapes.
         * @param {GeoJSONFeature} feature The Feature object.
         * @throws {ArgumentError} If the specified layer is null or undefined.
         * @throws {ArgumentError} If the specified feature is null or undefined.
         */
        GeoJSONParser.prototype.addRenderablesForFeature = function (layer, feature) {
            if (!layer) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForFeature", "missingLayer"));
            }

            if (!feature) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForFeature", "missingFeature"));
            }

            if (feature.geometry.type === GeoJSONConstants.TYPE_GEOMETRY_COLLECTION) {
                var geometryCollection = new GeoJSONGeometryCollection(
                    feature.geometry.geometries,
                    feature.bbox);
                this.addRenderablesForGeometryCollection(
                    layer,
                    geometryCollection,
                    feature.properties);
            }
            else {
                this.addRenderablesForGeometry(
                    layer,
                    feature.geometry,
                    feature.properties
                );
            }
        };

        /**
         * Iterates over the GeoJSON FeatureCollection features and creates {@link GeoJSONFeature}s for them.
         * Applications typically do not call this method directly. It is called by
         * [addRenderablesForGeoJSON]{@link GeoJSONParser#addRenderablesForGeoJSON}.
         * @param {RenderableLayer} layer The layer in which to place the newly created shapes.
         * @param {GeoJSONFeatureCollection} featureCollection The FeatureCollection object.
         * @throws {ArgumentError} If the specified layer is null or undefined.
         * @throws {ArgumentError} If the specified featureCollection is null or undefined.
         */
        GeoJSONParser.prototype.addRenderablesForFeatureCollection = function (layer, featureCollection) {
            if (!layer) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForFeatureCollection",
                        "missingLayer"));
            }

            if (!featureCollection) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForFeatureCollection",
                        "missingFeatureCollection"));
            }

            if (featureCollection.features.length > 0) {
                for (var featureIndex = 0; featureIndex < featureCollection.features.length; featureIndex++) {
                    var feature = new GeoJSONFeature(
                        featureCollection.features[featureIndex][GeoJSONConstants.FIELD_GEOMETRY],
                        featureCollection.features[featureIndex][GeoJSONConstants.FIELD_PROPERTIES],
                        featureCollection.features[featureIndex][GeoJSONConstants.FIELD_ID],
                        featureCollection.features[featureIndex][GeoJSONConstants.FIELD_BBOX]);
                    this.addRenderablesForFeature(
                        layer,
                        feature);
                }
            }
        };

        // Set type of GeoJSON object. Internal use ony.
        GeoJSONParser.prototype.setGeoJSONType = function () {
            switch (this.geoJSONObject[GeoJSONConstants.FIELD_TYPE]) {
                case GeoJSONConstants.TYPE_POINT:
                    this._geoJSONType = GeoJSONConstants.TYPE_POINT;
                    break;
                case GeoJSONConstants.TYPE_MULTI_POINT:
                    this._geoJSONType = GeoJSONConstants.TYPE_MULTI_POINT;
                    break;
                case GeoJSONConstants.TYPE_LINE_STRING:
                    this._geoJSONType = GeoJSONConstants.TYPE_LINE_STRING;
                    break;
                case GeoJSONConstants.TYPE_MULTI_LINE_STRING:
                    this._geoJSONType = GeoJSONConstants.TYPE_MULTI_LINE_STRING;
                    break;
                case GeoJSONConstants.TYPE_POLYGON:
                    this._geoJSONType = GeoJSONConstants.TYPE_POLYGON;
                    break;
                case GeoJSONConstants.TYPE_MULTI_POLYGON:
                    this._geoJSONType = GeoJSONConstants.TYPE_MULTI_POLYGON;
                    break;
                case GeoJSONConstants.TYPE_GEOMETRY_COLLECTION:
                    this._geoJSONType = GeoJSONConstants.TYPE_GEOMETRY_COLLECTION;
                    break;
                case GeoJSONConstants.TYPE_FEATURE:
                    this._geoJSONType = GeoJSONConstants.TYPE_FEATURE;
                    break;
                case GeoJSONConstants.TYPE_FEATURE_COLLECTION:
                    this._geoJSONType = GeoJSONConstants.TYPE_FEATURE_COLLECTION;
                    break;
                default:
                    throw new ArgumentError(
                        Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "setGeoJSONType", "invalidGeoJSONType"));
            }
        };

        /**
         * Reprojects GeoJSON geometry coordinates if required using proj4js.
         *
         * @param {Number} latitude The latitude coordinate of the geometry.
         * @param {Number} longitude The longitude coordinate of the geometry.
         * @param {GeoJSONCRS} crsObject The GeoJSON CRS object.
         * @returns {Number[]} An array containing reprojected coordinates.
         * @throws {ArgumentError} If the specified latitude is null or undefined.
         * @throws {ArgumentError} If the specified longitude is null or undefined.
         * @throws {ArgumentError} If the specified crsObject is null or undefined.
         */
        GeoJSONParser.prototype.getReprojectedIfRequired = function (latitude, longitude, crsObject) {
            if (!latitude && latitude !== 0.0) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "getReprojectedIfRequired",
                        "missingLatitude"));
            }

            if (!longitude && longitude !== 0.0) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "getReprojectedIfRequired",
                        "missingLongitude"));
            }

            if (!crsObject || crsObject.isDefault()){
                return [longitude, latitude];
            }
            else{
                return Proj4(crsObject.projectionString, GeoJSONConstants.EPSG4326_CRS, [longitude, latitude]);
            }
        };

        // Use this function to add aliases for some projection strings that proj4js doesn't recognize.
        GeoJSONParser.prototype.setProj4jsAliases = function () {
            Proj4.defs([
                [
                    "urn:ogc:def:crs:EPSG::4326",
                    Proj4.defs('EPSG:4326')
                ],
                [
                    'urn:ogc:def:crs:OGC:1.3:CRS84',
                    Proj4.defs('EPSG:4326')
                ],
                [
                    'urn:ogc:def:crs:EPSG::3857',
                    Proj4.defs('EPSG:3857')
                ]
            ]);
        };

        /**
         * Tries to parse a JSON string into a JavaScript object.
         * @param {String} str the string to try to parse.
         * @returns {Object} the object if the string is valid JSON; otherwise null.
         */
        GeoJSONParser.tryParseJSONString = function (str) {
            try {
                return JSON.parse(str);
            } catch (e) {
                return null;
            }
        };

        export default GeoJSONParser;
    
