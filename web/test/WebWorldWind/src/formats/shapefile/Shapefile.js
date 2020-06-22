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
 * @exports Shapefile
 */
import Angle from '../../geom/Angle';
import ArgumentError from '../../error/ArgumentError';
import ByteBuffer from '../../util/ByteBuffer';
import Color from '../../util/Color';
import DBaseFile from '../../formats/shapefile/DBaseFile';
import Location from '../../geom/Location';
import Logger from '../../util/Logger';
import NotYetImplementedError from '../../error/NotYetImplementedError';
import Path from '../../shapes/Path';
import Placemark from '../../shapes/Placemark';
import PlacemarkAttributes from '../../shapes/PlacemarkAttributes';
import Polygon from '../../shapes/Polygon';
import Position from '../../geom/Position';
import PrjFile from '../../formats/shapefile/PrjFile';
import RenderableLayer from '../../layer/RenderableLayer';
import ShapeAttributes from '../../shapes/ShapeAttributes';
import ShapefileRecord from '../../formats/shapefile/ShapefileRecord';
import ShapefileRecordMultiPoint from '../../formats/shapefile/ShapefileRecordMultiPoint';
import ShapefileRecordNull from '../../formats/shapefile/ShapefileRecordNull';
import ShapefileRecordPoint from '../../formats/shapefile/ShapefileRecordPoint';
import ShapefileRecordPolygon from '../../formats/shapefile/ShapefileRecordPolygon';
import ShapefileRecordPolyline from '../../formats/shapefile/ShapefileRecordPolyline';
import SurfacePolygon from '../../shapes/SurfacePolygon';
import SurfacePolyline from '../../shapes/SurfacePolyline';
        

        /**
         * Constructs a shapefile object for a specified shapefile URL. Call [load]{@link Shapefile#load} to retrieve the
         * shapefile and create shapes for it.
         * @alias Shapefile
         * @constructor
         * @classdesc Parses a shapefile and creates shapes representing its contents. Points in the shapefile are
         * represented by [Placemarks]{@link Placemark}, lines are represented by [Paths]{@link Path} or
         * [SurfacePolylines]{@link SurfacePolyline}, and polygons
         * are represented by [Polygons]{@link Polygon} or [SurfacePolygons]{@link SurfacePolygon}.
         * A parser completion callback may be specified and is
         * called when the shapefile is fully parsed but before shapes are created.
         * <p>
         * An attribute callback may also be specified to examine each record and configure the shape created for it.
         * This function enables the application to assign independent attributes to each
         * shape. An argument to this function provides any attributes specified in an attribute file (.dbf)
         * accompanying the shapefile. That attribute file is automatically detected, retrieved and parsed along
         * with the shapefile.
         * @param {String} url The location of the shapefile.
         * @throws {ArgumentError} If the specified URL is null or undefined.
         */
        var Shapefile = function (url) {
            if (!url) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "Shapefile", "constructor", "missingUrl"));
            }

            // Documented in defineProperties below.
            this._url = url;

            // Documented in defineProperties below.
            this._shapeType = null;

            // Documented in defineProperties below.
            this._layer = null;

            // Documented in defineProperties below.
            this._shapeConfigurationCallback = this.defaultShapeConfigurationCallback;

            this._parserCompletionCallback = this.defaultParserCompletionCallback;

            // Internal use only. Intentionally not documented.
            this._buffer = null;

            // Internal use only. Intentionally not documented.
            this.attributeFile = new DBaseFile(url.replace(".shp", ".dbf"));

            // Internal use only. Intentionally not documented.
            this.projectionFile = new PrjFile(url.replace(".shp", ".prj"));

            this.defaultPlacemarkAttributes = new PlacemarkAttributes(null);
            this.defaultShapeAttributes = new ShapeAttributes(null);
        };

        Object.defineProperties(Shapefile.prototype, {
            /**
             * The shapefile URL as specified to this shapefile's constructor.
             * @memberof Shapefile.prototype
             * @type {String}
             * @readonly
             */
            url: {
                get: function () {
                    return this._url;
                }
            },

            /**
             * The shape type of the shapefile. The type can be one of the following:
             * <ul>
             *     <li>WorldWind.POINT</li>
             *     <li>WorldWind.MULTI_POINT</li>
             *     <li>WorldWind.POLYLINE</li>
             *     <li>WorldWind.POLYGON</li>
             * </ul>
             * This value is defined during shapefile loading.
             * @memberof Shapefile.prototype
             * @type {String}
             * @readonly
             */
            shapeType: {
                get: function () {
                    return this._shapeType;
                }
            },

            /**
             * The layer containing the shapes representing the records in this shapefile, as specified to this
             * shapefile's constructor or created by the constructor if no layer was specified.
             * @memberof Shapefile.prototype
             * @type {RenderableLayer}
             * @readonly
             */
            layer: {
                get: function () {
                    return this._layer;
                }
            },

            /**
             * The completion callback specified to [load]{@link Shapefile#load}. This function is called when
             * shapefile parsing is done but before creating shapes for the shapefile. It's single argument is
             * this shapefile.
             * @memberof Shapefile.prototype
             * @type {Function}
             * @default [defaultParserCompletionCallback]{@link Shapefile#defaultParserCompletionCallback}
             * @readonly
             */
            parserCompletionCallback: {
                get: function () {
                    return this._parserCompletionCallback;
                }
            },

            /**
             * The attribute callback specified to [load]{@link Shapefile#load}.
             * See that method's description for details.
             * @memberof Shapefile.prototype
             * @type {Function}
             * @default [defaultShapeConfigurationCallback]{@link Shapefile#defaultShapeConfigurationCallback}
             * @readonly
             */
            shapeConfigurationCallback: {
                get: function () {
                    return this._shapeConfigurationCallback;
                }
            }
        });

        /**
         * Retrieves the shapefile, parses it and creates shapes representing its contents. The result is a layer
         * containing the created shapes. A function can be specified to be called when parsing is complete.
         * A function can also be specified to be called for each shapefile record so that the attributes and
         * other properties of the shape created for it can be assigned.
         *
         * @param {Function} parserCompletionCallback An optional function called when shapefile loading is complete but
         * shape creation has not begun. If none is specified,
         * [defaultParserCompletionCallback]{@link Shapefile#defaultParserCompletionCallback} is called. That function creates
         * WorldWind shapes for the parsed shapefile records.
         * The single argument to the callback function is this shapefile object. When the callback function is
         * called, the layer containing the shapes is available via this shapefile's
         * [layer]{@link Shapefile#layer} property.
         *
         * @param {Function} shapeConfigurationCallback An optional function called by the addRenderablesFor*
         * methods just prior to creating a shape for the indicated shapefile record. This function
         * can be used to assign attributes to newly created shapes. The callback function's first argument is an
         * object containing the properties read from the corresponding shapefile attributes file, if any.
         * This file, which has a .dbf suffix, is automatically detected, retrieved and parsed if it exists. The second
         * argument to the callback function is the {@link ShapefileRecord} currently being operated on. The return
         * value of the callback function must be either an object whose properties define attributes and other
         * information for the shape, or null, in which case no shape is created for that record. See the following
         * methods for descriptions of the configuration properties they recognize:
         * <ul>
         *     <li>[addRenderablesForPoint]{@link Shapefile#addRenderablesForPoints}</li>
         *     <li>[addRenderablesForMultiPoint]{@link Shapefile#addRenderablesForMultiPoints}</li>
         *     <li>[addRenderablesForPolylines]{@link Shapefile#addRenderablesForPolylines}</li>
         *     <li>[addRenderablesForPolygons]{@link Shapefile#addRenderablesForPolygons}</li>
         * </ul>
         *
         * @param {RenderableLayer} layer A {@link RenderableLayer} to hold the shapes created for each shapefile
         * record. If null, a new layer is created and assigned to this object's [layer]{@link Shapefile#layer}
         * property.
         */
        Shapefile.prototype.load = function (parserCompletionCallback, shapeConfigurationCallback, layer) {
            if (parserCompletionCallback) {
                this._parserCompletionCallback = parserCompletionCallback;
            }

            if (shapeConfigurationCallback) {
                this._shapeConfigurationCallback = shapeConfigurationCallback;
            }

            this._layer = layer || new RenderableLayer();

            // Load primary and secondary files in the following order:
            //      1) Projection file,
            //      2) Attribute file, and
            //      3) Shapefile.
            // This is done because the projection and attribute files modify the interpretation of the shapefile.
            var projectionFileCallback = (function () {
                var attributeFileCallback = (function () {
                    this.requestUrl(this.url);
                }).bind(this);

                this.attributeFile.load(attributeFileCallback);
            }).bind(this);

            this.projectionFile.load(projectionFileCallback);
        };

        /**
         * The default parser completion callback, called if none was specified to the [load]{@link Shapefile#load} method.
         * This default callback merely calls [addRenderablesForShapefile]{@link Shapefile#addRenderablesForShapefile}
         * to create shapes for this shapefile's records.
         * @param {Shapefile} shapefile This shapefile.
         */
        Shapefile.prototype.defaultParserCompletionCallback = function (shapefile) {
            this.addRenderablesForShapefile(this.layer);
        };

        /**
         * The default [shapeConfigurationCallback]{@link Shapefile#shapeConfigurationCallback} for this shapefile.
         * It is called if none was specified to the [load]{@link Shapefile#load} method.
         * This method assigns shared, default attributes to the shapes created for each record. Any changes to these
         * attributes will have an effect in all shapes created by this shapefile.
         * <p>
         * For polygon records, the record's attributes are checked for an attribute named "height", "Height",
         * or "HEIGHT". If found, the returned shape configuration contains a height property holding the
         * value associated with the record attribute. This causes the default shape creation function,
         * [addRenderablesForPolygons]{@link Shapefile#addRenderablesForPolygons}, to create a
         * {@link Polygon} with its extrude property set to true and position altitudes equal to the specified
         * height value.
         * <p>
         * For all records, the record's attributes are checked for an attribute named "name", "Name" or "NAME".
         * If found, the returned shape configuration contains a name property holding the value associated with
         * the record attribute. This value is specified as the label displayName property for all shapes created.
         * For {@link Placemark} shapes it is also specified as the placemark label.
         * It is specified as the displayName for all other shapes.
         *
         * @param {{}} attributes An object containing the attribute-value pairs found in the database file
         * associated with this shapefile. See [load]{@link Shapefile#load} for more information.
         * @param {ShapefileRecord} record The current shapefile record.
         * @returns {{}} An object with properties as described above.
         */
        Shapefile.prototype.defaultShapeConfigurationCallback = function (attributes, record) {
            var configuration = {};

            var name = attributes.values.name || attributes.values.Name || attributes.values.NAME;
            if (name) {
                configuration.name = name;
            }

            if (record.isPointType()) {
                configuration.attributes = this.defaultPlacemarkAttributes;
            } else if (record.isMultiPointType()) {
                configuration.attributes = this.defaultPlacemarkAttributes;
            } else if (record.isPolylineType()) {
                configuration.attributes = this.defaultShapeAttributes;
            } else if (record.isPolygonType()) {
                configuration.attributes = this.defaultShapeAttributes;
                var height = attributes.values.height || attributes.values.Height || attributes.values.HEIGHT;
                if (height) {
                    configuration.height = height;
                }
            }

            return configuration;
        };

        /**
         * Iterates over this shapefile's records and creates shapes for them. See the following methods for the
         * details of the shapes created and their use of the
         * [shapeConfigurationCallback]{@link Shapefile#shapeConfigurationCallback}:
         * <ul>
         *     <li>[addRenderablesForPoints]{@link Shapefile#addRenderablesForPoints}</li>
         *     <li>[addRenderablesForMultiPoints]{@link Shapefile#addRenderablesForMultiPoints}</li>
         *     <li>[addRenderablesForPolylines]{@link Shapefile#addRenderablesForPolylines}</li>
         *     <li>[addRenderablesForPolygons]{@link Shapefile#addRenderablesForPolygons}</li>
         * </ul>
         * @param {RenderableLayer} layer The layer in which to place the newly created shapes.
         * @throws {ArgumentError} If the specified layer is null or undefined.
         */
        Shapefile.prototype.addRenderablesForShapefile = function (layer) {
            if (!layer) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "Shapefile", "addRenderablesForShapefile", "missingLayer"));
            }

            if (this.isPointType()) {
                this.addRenderablesForPoints(layer);
            } else if (this.isMultiPointType()) {
                this.addRenderablesForMultiPoints(layer);
            } else if (this.isPolylineType()) {
                this.addRenderablesForPolylines(layer);
            } else if (this.isPolygonType()) {
                this.addRenderablesForPolygons(layer);
            }
        };

        /**
         * Iterates over this shapefile's records and creates {@link Placemark}s for the shapefile's point records.
         * One placemark is created for each record.
         * Applications typically do not call this method directly. It is called by
         * [addRenderablesForShapefile]{@link Shapefile#addRenderablesForShapefile}.
         * <p>
         * This method invokes this shapefile's
         * [shapeConfigurationCallback]{@link Shapefile#shapeConfigurationCallback} once for each record.
         * If that function returns null, the record is skipped. If it returns non-null, the returned value is
         * assumed to be an object with any or all of the following optional properties:
         * <ul>
         *     <li><i>attributes:</i> A {@link PlacemarkAttributes} object to assign to the placemark created
         *     for the record.</li>
         *     <li><i>highlightAttributes:</i> A {@link PlacemarkAttributes} object to assign to the
         *     highlight attributes of the placemark
         *     created for the record.</li>
         *     <li><i>altitudeMode:</i> The [altitude mode]{@link AbstractShape#altitudeMode} to apply to the
         *     created placemark. If not specified,
         *     [WorldWind.RELATIVE_TO_GROUND]{@link WorldWind#RELATIVE_TO_GROUND} is used.</li>
         *     <li><i>name:</i> A String to assign as the created placemark's label.</li>
         *     <li><i>altitude:</i> A Number indicating the altitude of the created placemark.
         *     If not specified, the altitude of all created placemarks is 0.</li>
         *     <li><i>pickDelegate:</i> An object returned as the userObject when this feature is picked.</li>
         *     <li><i>userProperties:</i> An ad hoc object assigned to the renderable.</li>
         * </ul>
         * @param {RenderableLayer} layer The layer in which to place the newly created shapes.
         * @throws {ArgumentError} If the specified layer is null or undefined.
         */
        Shapefile.prototype.addRenderablesForPoints = function (layer) {
            if (!layer) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "Shapefile", "addRenderablesForPoints", "missingLayer"));
            }

            // Note: for points, there should be only ONE part, and only ONE point per record.
            for (var record = this.next(); !!record; record = this.next()) {
                var configuration = this.shapeConfigurationCallback(record.attributes, record),
                    altitude = (configuration && configuration.altitude) ? configuration.altitude : 0;

                if (!configuration) {
                    continue;
                }

                for (var part = 0, parts = record.numberOfParts; part < parts; part += 1) {
                    var points = record.pointBuffer(part);
                    for (var idx = 0, len = points.length; idx < len; idx += 2) {
                        var longitude = points[idx],
                            latitude = points[idx + 1],
                            position = new Position(latitude, longitude, altitude),
                            placemark = new Placemark(position, false, configuration.attributes);

                        placemark.altitudeMode = configuration.altitudeMode || WorldWind.RELATIVE_TO_GROUND;
                        if (configuration.highlightAttributes) {
                            placemark.highlightAttributes = configuration.highlightAttributes;
                        }
                        if (configuration.name) {
                            placemark.label = configuration.name;
                        }
                        if (configuration.pickDelegate) {
                            placemark.pickDelegate = configuration.pickDelegate;
                        }
                        if (configuration.userProperties) {
                            placemark.userProperties = configuration.userProperties;
                        }
                        layer.addRenderable(placemark);
                    }
                }
            }
        };

        /**
         * Iterates over this shapefile's records and creates {@link Placemark}s for each point in the shapefile's
         * multi-point records.
         * One placemark is created for each point.
         * Applications typically do not call this method directly. It is called by
         * [addRenderablesForShapefile]{@link Shapefile#addRenderablesForShapefile}.
         * <p>
         * This method invokes this shapefile's
         * [shapeConfigurationCallback]{@link Shapefile#shapeConfigurationCallback} once for each record.
         * If that function returns null, the record is skipped. If it returns non-null, the returned value is
         * assumed to be an object with any or all of the following optional properties:
         * <ul>
         *     <li><i>attributes:</i> A {@link PlacemarkAttributes} object to assign to the placemarks created
         *     for the record.</li>
         *     <li><i>highlightAttributes:</i> A {@link PlacemarkAttributes} object to assign to the
         *     highlight attributes of the placemarks created for the record.</li>
         *     <li><i>altitudeMode:</i> The [altitude mode]{@link AbstractShape#altitudeMode} to apply to the
         *     created placemarks. If not specified,
         *     [WorldWind.RELATIVE_TO_GROUND]{@link WorldWind#RELATIVE_TO_GROUND} is used.</li>
         *     <li><i>label:</i> A String to assign as the created placemarks' label.</li>
         *     <li><i>altitude:</i> A Number indicating the altitude of the created placemarks.
         *     If not specified, the altitude of all created placemarks is 0.</li>
         *     <li><i>name:</i> A String to assign as the created placemarks' label.</li>
         *     <li><i>pickDelegate:</i> An object returned as the userObject when this feature is picked.</li>
         *     <li><i>userProperties:</i> An ad hoc object assigned to the renderable.</li>
         * </ul>
         * @param {RenderableLayer} layer The layer in which to place the newly created shapes.
         * @throws {ArgumentError} If the specified layer is null or undefined.
         */
        Shapefile.prototype.addRenderablesForMultiPoints = function (layer) {
            if (!layer) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "Shapefile", "addRenderablesForMultiPoints", "missingLayer"));
            }

            // Note: for multi-points, there should only be ONE part.
            for (var record = this.next(); !!record; record = this.next()) {
                var configuration = this.shapeConfigurationCallback(record.attributes, record),
                    altitude = (configuration && configuration.altitude) ? configuration.altitude : 0;

                if (!configuration) {
                    continue;
                }

                for (var part = 0, parts = record.numberOfParts; part < parts; part += 1) {
                    var points = record.pointBuffer(part);
                    for (var idx = 0, len = points.length; idx < len; idx += 2) {
                        var longitude = points[idx],
                            latitude = points[idx + 1],
                            position = new Position(latitude, longitude, altitude),
                            placemark = new Placemark(position, false, configuration.attributes);

                        placemark.altitudeMode = configuration.altitudeMode || WorldWind.RELATIVE_TO_GROUND;
                        if (configuration.highlightAttributes) {
                            placemark.highlightAttributes = configuration.highlightAttributes;
                        }
                        if (configuration.name) {
                            placemark.label = configuration.name;
                        }
                        if (configuration.pickDelegate) {
                            placemark.pickDelegate = configuration.pickDelegate;
                        }
                        if (configuration.userProperties) {
                            placemark.userProperties = configuration.userProperties;
                        }
                        layer.addRenderable(placemark);
                    }
                }
            }
        };

        /**
         * Iterates over this shapefile's records and creates {@link Path}s or {@link SurfacePolyline}s for the
         * shapefile's polyline records, depending on the altitude optionally returned by the
         * [shapeConfigurationCallback]{@link Shapefile#shapeConfigurationCallback}.
         * One shape is created for each record.
         * Applications typically do not call this method directly. It is called by
         * [addRenderablesForShapefile]{@link Shapefile#addRenderablesForShapefile}.
         * <p>
         * This method invokes this shapefile's
         * [shapeConfigurationCallback]{@link Shapefile#shapeConfigurationCallback} once for each record.
         * If that function returns null, the record is skipped. If it returns non-null, the returned value is
         * assumed to be an object with any or all of the following optional properties:
         * <ul>
         *     <li><i>attributes:</i> A {@link ShapeAttributes} object to assign to the shape created
         *     for the record.</li>
         *     <li><i>highlightAttributes:</i> A {@link ShapeAttributes} object to assign to the highlight
         *     attributes of the shape created for the record.</li>
         *     <li><i>altitudeMode:</i> The [altitude mode]{@link AbstractShape#altitudeMode} to apply to the
         *     created shape. If not specified,
         *     [WorldWind.RELATIVE_TO_GROUND]{@link WorldWind#RELATIVE_TO_GROUND} is used.
         *     <li><i>altitude:</i> A Number indicating the altitude of the created shape.
         *     If unspecified or 0, a {@link SurfacePolyline} is created for the record, otherwise a
         *     {@link Path} is created.</li>
         *     <li><i>name:</i> A String to assign as the created shape's displayName property.</li>
         *     <li><i>pickDelegate:</i> An object returned as the userObject when this feature is picked.</li>
         *     <li><i>userProperties:</i> An ad hoc object assigned to the renderable.</li>
         * </ul>
         * @param {RenderableLayer} layer The layer in which to place the newly created shapes.
         * @throws {ArgumentError} If the specified layer is null or undefined.
         */
        Shapefile.prototype.addRenderablesForPolylines = function (layer) {
            if (!layer) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "Shapefile", "addRenderablesForPolylines", "missingLayer"));
            }

            for (var record = this.next(); !!record; record = this.next()) {
                var configuration = this.shapeConfigurationCallback(record.attributes, record),
                    altitude = (configuration && configuration.altitude) ? configuration.altitude : 0;

                if (!configuration) {
                    continue;
                }

                for (var part = 0, parts = record.numberOfParts; part < parts; part += 1) {
                    var points = record.pointBuffer(part);

                    var positions = [];

                    for (var idx = 0, len = points.length; idx < len; idx += 2) {
                        var longitude = points[idx],
                            latitude = points[idx + 1],
                            position = !altitude ?
                                new Location(latitude, longitude) : new Position(latitude, longitude, altitude);

                        positions.push(position);
                    }

                    var shape;
                    if (!altitude) {
                        shape = new SurfacePolyline(positions, configuration.attributes);
                    } else {
                        shape = new Path(positions, configuration.attributes);
                        shape.altitudeMode = configuration.altitudeMode || WorldWind.RELATIVE_TO_GROUND;
                    }

                    if (configuration.highlightAttributes) {
                        shape.highlightAttributes = configuration.highlightAttributes;
                    }
                    if (configuration.name) {
                        shape.displayName = configuration.name;
                    }
                    if (configuration.pickDelegate) {
                        shape.pickDelegate = configuration.pickDelegate;
                    }
                    if (configuration.userProperties) {
                        shape.userProperties = configuration.userProperties;
                    }
                    layer.addRenderable(shape);
                }
            }
        };

        /**
         * Iterates over this shapefile's records and creates {@link Polygon}s or {@link SurfacePolygon}s for the
         * shapefile's polygon records, depending on the altitude and height optionally returned by the
         * [shapeConfigurationCallback]{@link Shapefile#shapeConfigurationCallback}.
         * One shape is created for each record.
         * Applications typically do not call this method directly. It is called by
         * [addRenderablesForShapefile]{@link Shapefile#addRenderablesForShapefile}.
         * <p>
         * This method invokes this shapefile's
         * [shapeConfigurationCallback]{@link Shapefile#shapeConfigurationCallback} once for each record.
         * If that function returns null, the record is skipped. If it returns non-null, the returned value is
         * assumed to be an object with any or all of the following optional properties:
         * <ul>
         *     <li><i>attributes:</i> A {@link ShapeAttributes} object to assign to the shape created
         *     for the record.</li>
         *     <li><i>highlightAttributes:</i> A {@link ShapeAttributes} object to assign to the highlight
         *     attributes of the shape created for the record.</li>
         *     <li><i>altitudeMode:</i> The [altitude mode]{@link AbstractShape#altitudeMode} to apply to the
         *     created shape. If not specified,
         *     [WorldWind.RELATIVE_TO_GROUND]{@link WorldWind#RELATIVE_TO_GROUND} is used.
         *     If the altitude is 0, this property is ignored.</li>
         *     <li><i>altitude:</i> A Number indicating the altitude of the created shape.
         *     If unspecified or 0 and the <i>height</i> property (see next line) is undefined or 0,
         *     a {@link SurfacePolygon} is created for the record, otherwise a {@link Polygon} is created.</li>
         *     <li><i>height:</i> A Number indicating polygon height. If defined and non-zero, a
         *     {@link Polygon} is created for this record with its position altitudes set to the specified height
         *     relative to ground and its [extrude]{@link Polygon#extrude} property set to true to create an
         *     extruded polygon. A height specified here overrides an altitude if both are specified.</li>
         *     <li><i>name:</i> A String to assign as the created shape's displayName property.</li>
         *     <li><i>pickDelegate:</i> An object returned as the userObject when this feature is picked.</li>
         *     <li><i>userProperties:</i> An ad hoc object assigned to the renderable.</li>
         * </ul>
         * @param {RenderableLayer} layer The layer in which to place the newly created shapes.
         * @throws {ArgumentError} If the specified layer is null or undefined.
         */
        Shapefile.prototype.addRenderablesForPolygons = function (layer) {
            if (!layer) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "Shapefile", "addRenderablesForPolygons", "missingLayer"));
            }

            for (var record = this.next(); !!record; record = this.next()) {
                var configuration = this.shapeConfigurationCallback(record.attributes, record);

                var boundaries = [],
                    position,
                    height = configuration.height,
                    altitude = configuration.altitude;

                for (var part = 0, parts = record.numberOfParts; part < parts; part += 1) {
                    var points = record.pointBuffer(part),
                        positions = [];

                    // The shapefile duplicates the first and last point in each record, but WW shapes do not
                    // require this. So skip the last point in each record.
                    for (var idx = 0, len = points.length - 2; idx < len; idx += 2) {
                        var longitude = points[idx],
                            latitude = points[idx + 1];

                        if (height) {
                            position = new Position(latitude, longitude, height);
                        } else if (altitude) {
                            position = new Position(latitude, longitude, altitude);
                        } else {
                            position = new Location(latitude, longitude);
                        }

                        positions.push(position);
                    }

                    boundaries.push(positions);
                }

                var shape;
                if (height) {
                    shape = new Polygon(boundaries, configuration.attributes);
                    shape.extrude = true;
                    shape.altitudeMode = configuration.altitudeMode || WorldWind.RELATIVE_TO_GROUND;
                } else if (!altitude) {
                    shape = new SurfacePolygon(boundaries, configuration.attributes);
                } else {
                    shape = new Polygon(boundaries, configuration.attributes);
                    shape.altitudeMode = configuration.altitudeMode || WorldWind.RELATIVE_TO_GROUND;
                }

                if (configuration.highlightAttributes) {
                    shape.highlightAttributes = configuration.highlightAttributes;
                }
                if (configuration.name) {
                    shape.displayName = configuration.name;
                }
                if (configuration.pickDelegate) {
                    shape.pickDelegate = configuration.pickDelegate;
                }
                if (configuration.userProperties) {
                    shape.userProperties = configuration.userProperties;
                }
                layer.addRenderable(shape);
            }
        };

        /**
         * Returns the next {@link ShapefileRecord} in the shapefile, or null if no more records exist. This method
         * can be used to iterate through the shapefile records. Only one such iteration is possible.
         *
         * @returns {ShapefileRecord} The next shapefile record in the shapefile, or null if no more records exist.
         */
        Shapefile.prototype.next = function () {
            while (this._buffer.position < this._buffer.limit()) {
                var record = this.readRecord(this._buffer);
                if (!(record instanceof ShapefileRecordNull)) {
                    return record;
                }
            }

            // If you get hear, the shapefile is out of records.
            return null;
        };

        // Intentionally not documented.
        Shapefile.prototype.requestUrl = function (url) {
            var xhr = new XMLHttpRequest();

            xhr.open("GET", url, true);
            xhr.responseType = 'arraybuffer';
            xhr.onreadystatechange = (function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        this._buffer = new ByteBuffer(xhr.response);

                        this.parse();
                    }
                    else {
                        Logger.log(Logger.LEVEL_WARNING,
                            "Shapefile retrieval failed (" + xhr.statusText + "): " + url);
                    }

                    if (!!this._parserCompletionCallback) {
                        this._parserCompletionCallback(this);
                    }
                }
            }).bind(this);

            xhr.onerror = function () {
                Logger.log(Logger.LEVEL_WARNING, "Shapefile retrieval failed: " + url);

                if (!!this._parserCompletionCallback) {
                    this._parserCompletionCallback(this);
                }
            };

            xhr.ontimeout = function () {
                Logger.log(Logger.LEVEL_WARNING, "Shapefile retrieval timed out: " + url);

                if (!!this._parserCompletionCallback) {
                    this._parserCompletionCallback(this);
                }
            };

            xhr.send(null);
        };

        // Internal use only. Intentionally not documented.
        Shapefile.prototype.parse = function () {
            try {
                var header = this.readHeader(this._buffer);
                this._shapeType = header.shapeType;
            }
            catch (e) {
                console.log(e);
            }
            finally {
            }
        };

        // Intentionally not documented.
        Shapefile.prototype.readHeader = function (buffer) {
            buffer.order(ByteBuffer.BIG_ENDIAN);
            var fileCode = buffer.getInt32();
            if (fileCode != Shapefile.FILE_CODE) {
                // Let the caller catch and log the message.
                throw new Error(Logger.log(Logger.LEVEL_SEVERE, "Shapefile header is invalid"));
            }

            // Skip 5 unused ints.
            buffer.skipInt32s(5);

            // File length.
            var lengthInWords = buffer.getInt32();

            // Switch to little endian for the remaining part.
            buffer.order(ByteBuffer.LITTLE_ENDIAN);

            // Read remaining header data.
            var version = buffer.getInt32();
            var type = buffer.getInt32();

            var rect = this.readBoundingRectangle(buffer);

            // Check whether the shape type is supported.
            var shapeType = this.getShapeType(type);
            if (shapeType == null) {
                // Let the caller catch and log the message.
                // TODO: ??? figure out the correct type of error to throw
                throw new Error(Logger.log(Logger.LEVEL_SEVERE, "Shapefile type is unsupported: " + type.toString()));
            }

            // Assemble header
            var header = {
                'fileLength': lengthInWords * 2, // One word = 2 bytes.
                'version': version,
                'shapeType': shapeType,
                'boundingRectangle': rect.coords,
                'normalizePoints': rect.isNormalized
            };

            // Skip over bounds for measures and Z.
            buffer.skipDoubles(4);

            return header;
        };

        //**************************************************************//
        //********************  Bounding Rectangle  ********************//
        //**************************************************************//

        /*
         * Stores a bounding rectangle's coordinates, and if the coordinates are normalized. If isNormalized is
         * true, this indicates that the original coordinate values are out of range and required
         * normalization. The shapefile and shapefile records use this to determine which records must have their point
         * coordinates normalized. Normalization is rarely needed, and this enables the shapefile to normalize only point
         * coordinates associated with records that require it.
         *
         * The Javascript implementation inherits from the following Java implementation:
         * protected static class BoundingRectangle
         * {
         *    // Four-element array of the bounding rectangle's coordinates, ordered as follows: (minY, maxY, minX, maxX).
         *    public double[] coords;
         *    // True if the coordinates are normalized, and false otherwise.
         *    public boolean isNormalized;
         * }
         *
         *  In Javascript, this is represented as the object {'coords': coords, 'isNormalized': isNormalized}
         */

        // Intentionally not documented.
        Shapefile.prototype.readBoundingRectangle = function (buffer) {
            if (!this.projectionFile) {
                return this.readUnspecifiedBoundingRectangle(buffer);
            }
            else if (this.projectionFile.isGeographicCoordinateSystem()) {
                return this.readGeographicBoundingRectangle(buffer);
            }
            else if (this.projectionFile.isProjectedCoordinateSystem()) {
                return this.readProjectedBoundingRectangle(buffer);
            }
            else {
                return this.readUnspecifiedBoundingRectangle(buffer);
            }
        };

        // Intentionally not documented.
        Shapefile.prototype.readUnspecifiedBoundingRectangle = function (buffer) {
            // Read the bounding rectangle coordinates in the following order: minY, maxY, minX, maxX.
            var coords = this.readBoundingRectangleCoordinates(buffer);
            return {'coords': coords, 'isNormalized': false};
        };

        // Intentionally not documented.
        Shapefile.prototype.readGeographicBoundingRectangle = function (buffer) {
            // Read the bounding rectangle coordinates in the following order: minLat, maxLat, minLon, maxLon.
            var coords = this.readBoundingRectangleCoordinates(buffer),
                isNormalized = false,
                normalizedLat = 0;

            // The bounding rectangle's min latitude exceeds -90. Set the min latitude to -90. Correct the max latitude if
            // the normalized min latitude is greater than the max latitude.
            if (coords[0] < -90) {
                normalizedLat = Angle.normalizedDegreesLatitude(coords[0]);

                coords[0] = 90;
                isNormalized = true;

                if (coords[1] < normalizedLat) {
                    coords[1] = normalizedLat;
                }
            }

            // The bounding rectangle's max latitude exceeds +90. Set the max latitude to +90. Correct the min latitude if
            // the normalized max latitude is less than the min latitude.
            if (coords[1] > 90) {
                normalizedLat = Angle.normalizedDegreesLatitude(coords[1]);

                coords[1] = 90;
                isNormalized = true;

                if (coords[0] > normalizedLat)
                    coords[0] = normalizedLat;
            }

            // The bounding rectangle's longitudes exceed +-180, therefore the rectangle spans the international
            // dateline. Set the longitude bound to (-180, 180) to contain the dateline spanning rectangle.
            if (coords[2] < -180 || coords[3] > 180) {
                coords[2] = -180;
                coords[3] = 180;
                isNormalized = true;
            }

            return {'coords': coords, 'isNormalized': isNormalized};
        };

        // Intentionally not documented.
        Shapefile.prototype.readProjectedBoundingRectangle = function (buffer) {
            throw new NotYetImplementedError(
                Logger.log(Logger.LEVEL_SEVERE, "Shapefile.readProjectedBoundingRectangle() not yet implemented"));

            // TODO: complete the implementation; the Java implementation is summarized below.
            //Object o = this.getValue(AVKey.PROJECTION_NAME);
            //
            //if (AVKey.PROJECTION_UTM.equals(o)) {
            //    // Read the bounding rectangle coordinates in the following order: minEast, minNorth, maxEast, maxNorth.
            //    var coords = ShapefileUtils.readDoubleArray(buffer, 4);
            //    // Convert the UTM bounding rectangle to a geographic bounding rectangle. The zone and hemisphere parameters
            //    // have already been validated in validateBounds.
            //    var zone = (Integer) this.getValue(AVKey.PROJECTION_ZONE);
            //    var hemisphere = (String) this.getValue(AVKey.PROJECTION_HEMISPHERE);
            //    Sector sector = Sector.fromUTMRectangle(zone, hemisphere, coords[0], coords[2], coords[1], coords[3]);
            //    // Return an array with bounding rectangle coordinates in the following order: minLon, maxLon, minLat, maxLat.
            //    BoundingRectangle rect = new BoundingRectangle();
            //    rect.coords = sector.toArrayDegrees();
            //    return rect;
            //}
            //else {
            //    // The Shapefile's coordinate system projection is unsupported. This should never happen because the
            //    // projection is validated during initialization, but we check anyway. Let the caller catch and log the
            //    // message.
            //    throw new Error(Logger.log(Logger.LEVEL_SEVERE, "Shapefile has an unsupported projection"));
            //}
        };

        // Intentionally not documented.
        Shapefile.prototype.readBoundingRectangleCoordinates = function (buffer) {
            // Read the bounding rectangle coordinates in the following order: minX, minY, maxX, maxY.
            var minx = buffer.getDouble(),
                miny = buffer.getDouble(),
                maxx = buffer.getDouble(),
                maxy = buffer.getDouble();

            // Return an array with bounding rectangle coordinates in the following order: minY, maxY, minX, maxX.
            return [miny, maxy, minx, maxx];
        };

        //**************************************************************//
        //********************  Shape Records  *************************//
        //**************************************************************//

        // Intentionally not documented.
        Shapefile.prototype.readRecord = function (buffer) {
            // The buffer current position is assumed to be set at the start of the record and will be set to the
            // start of the next record after this method has completed.
            var record = this.createRecord(buffer);

            if (record != null) {
                // Read the record's attribute data.
                if (this.attributeFile != null && this.attributeFile.hasNext()) {
                    var attributes = this.attributeFile.nextRecord();
                    record.setAttributes(attributes);
                }
            }

            return record;
        };

        // Intentionally not documented.
        Shapefile.prototype.createRecord = function (buffer) {
            // Select proper record class
            if (this.isNullType()) {
                return this.createNull(buffer);
            }
            else if (this.isPointType()) {
                return this.createPoint(buffer);
            }
            else if (this.isMultiPointType()) {
                return this.createMultiPoint(buffer);
            }
            else if (this.isPolygonType()) {
                return this.createPolygon(buffer);
            }
            else if (this.isPolylineType()) {
                return this.createPolyline(buffer);
            }

            return null;
        };

        // Intentionally not documented.
        Shapefile.prototype.createNull = function (buffer) {
            return new ShapefileRecordNull(this, buffer);
        };

        // Intentionally not documented.
        Shapefile.prototype.createPoint = function (buffer) {
            return new ShapefileRecordPoint(this, buffer);
        };

        // Intentionally not documented.
        Shapefile.prototype.createMultiPoint = function (buffer) {
            return new ShapefileRecordMultiPoint(this, buffer);
        };

        // Intentionally not documented.
        Shapefile.prototype.createPolyline = function (buffer) {
            return new ShapefileRecordPolyline(this, buffer);
        };

        // Intentionally not documented.
        Shapefile.prototype.createPolygon = function (buffer) {
            return new ShapefileRecordPolygon(this, buffer);
        };

        // Intentionally not documented.
        Shapefile.prototype.getShapeType = function (shapeType) {
            // Cases commented out indicate shape types not implemented
            switch (shapeType) {
                case 0:
                    return Shapefile.NULL;
                case 1:
                    return Shapefile.POINT;
                case 3:
                    return Shapefile.POLYLINE;
                case 5:
                    return Shapefile.POLYGON;
                case 8:
                    return Shapefile.MULTI_POINT;

                case 11:
                    return Shapefile.POINT_Z;
                case 13:
                    return Shapefile.POLYLINE_Z;
                case 15:
                    return Shapefile.POLYGON_Z;
                case 18:
                    return Shapefile.MULTI_POINT_Z;

                case 21:
                    return Shapefile.POINT_M;
                case 23:
                    return Shapefile.POLYLINE_M;
                case 25:
                    return Shapefile.POLYGON_M;
                case 28:
                    return Shapefile.MULTI_POINT_M;

//            case 31:
//                return Shapefile.SHAPE_MULTI_PATCH;

                default:
                    return null; // unsupported shape type
            }
        };

        //**************************************************************//
        //********************  Utilities  *****************************//
        //**************************************************************//

        /**
         * Indicates whether this shapefile contains optional measure values.
         *
         * @return {Boolean} True if this shapefile is one that contains measure values.
         */
        Shapefile.prototype.isMeasureType = function () {
            return Shapefile.measureTypes.hasOwnProperty(this._shapeType);
        };

        /**
         * Indicates whether this shapefile contains Z values.
         *
         * @return {Boolean} True if this shapefile contains Z values.
         */
        Shapefile.prototype.isZType = function () {
            return Shapefile.zTypes.hasOwnProperty(this._shapeType);
        };

        /**
         * Indicates whether this shapefile is [Shapefile.NULL]{@link Shapefile#NULL}.
         *
         * @return {Boolean} True if this shapefile is a null type.
         */
        Shapefile.prototype.isNullType = function () {
            return this._shapeType === Shapefile.NULL;
        };

        /**
         * Indicates whether this shapefile is either
         * [Shapefile.POINT]{@link Shapefile#POINT},
         * [Shapefile.POINT_M]{@link Shapefile#POINT_M}
         * or [Shapefile.POINT_Z]{@link Shapefile#POINT_Z}.
         *
         * @return {Boolean} True if the shapefile is a point type.
         */
        Shapefile.prototype.isPointType = function () {
            return Shapefile.pointTypes.hasOwnProperty(this._shapeType);
        };

        /**
         * Indicates whether this shapefile is either
         * [Shapefile.MULTI_POINT]{@link Shapefile#MULTI_POINT},
         * [Shapefile.MULTI_POINT_M]{@link Shapefile#MULTI_POINT_M}
         * or [Shapefile.MULTI_POINT_Z]{@link Shapefile#MULTI_POINT_Z}.
         *
         * @return {Boolean} True if this shapefile is a multi-point type.
         */
        Shapefile.prototype.isMultiPointType = function () {
            return Shapefile.multiPointTypes.hasOwnProperty(this._shapeType);
        };

        /**
         * Indicates whether this shapefile is either
         * [Shapefile.POLYLINE]{@link Shapefile#POLYLINE},
         * [Shapefile.POLYLINE_M]{@link Shapefile#POLYLINE_M}
         * or [Shapefile.POLYLINE_Z]{@link Shapefile#POLYLINE_Z}.
         *
         * @return {Boolean} True if this shapefile is a polyline type.
         */
        Shapefile.prototype.isPolylineType = function () {
            return Shapefile.polylineTypes.hasOwnProperty(this._shapeType);
        };

        /**
         * Indicates whether this shapefile is either
         * [Shapefile.POLYGON]{@link Shapefile#POLYGON},
         * [Shapefile.POLYGON_M]{@link Shapefile#POLYGON_M}
         * or [Shapefile.POLYGON_Z]{@link Shapefile#POLYGON_Z}.
         *
         * @return {Boolean} True if this shapefile is a polygon type.
         */
        Shapefile.prototype.isPolygonType = function () {
            return Shapefile.polygonTypes.hasOwnProperty(this._shapeType);
        };

        Shapefile.NULL = "null";
        Shapefile.POINT = "point";
        Shapefile.MULTI_POINT = "multiPoint";
        Shapefile.POLYLINE = "polyline";
        Shapefile.POLYGON = "polygon";

        Shapefile.POINT_M = Shapefile.POINT + "M";
        Shapefile.MULTI_POINT_M = Shapefile.MULTI_POINT + "M";
        Shapefile.POLYLINE_M = Shapefile.POLYLINE + "M";
        Shapefile.POLYGON_M = Shapefile.POLYGON + "M";

        Shapefile.POINT_Z = Shapefile.POINT + "Z";
        Shapefile.MULTI_POINT_Z = Shapefile.MULTI_POINT + "Z";
        Shapefile.POLYLINE_Z = Shapefile.POLYLINE + "Z";
        Shapefile.POLYGON_Z = Shapefile.POLYGON + "Z";

        Shapefile.SHAPE_MULTI_PATCH = "multiPatch";

        // Internal use only. Intentionally not documented.
        Shapefile.measureTypes = {
            pointM: Shapefile.POINT_M,
            pointZ: Shapefile.POINT_Z,
            multiPointM: Shapefile.MULTI_POINT_M,
            multiPointZ: Shapefile.MULTI_POINT_Z,
            polylineM: Shapefile.POLYLINE_M,
            polylineZ: Shapefile.POLYLINE_Z,
            polygonM: Shapefile.POLYGON_M,
            polygonZ: Shapefile.POLYGON_Z
        };

        // Internal use only. Intentionally not documented.
        Shapefile.zTypes = {
            pointZ: Shapefile.POINT_Z,
            multiPointZ: Shapefile.MULTI_POINT_Z,
            polylineZ: Shapefile.POLYLINE_Z,
            polygonZ: Shapefile.POLYGON_Z
        };

        // Internal use only. Intentionally not documented.
        Shapefile.pointTypes = {
            point: Shapefile.POINT,
            pointZ: Shapefile.POINT_Z,
            pointM: Shapefile.POINT_M
        };

        // Internal use only. Intentionally not documented.
        Shapefile.multiPointTypes = {
            multiPoint: Shapefile.MULTI_POINT,
            multiPointZ: Shapefile.MULTI_POINT_Z,
            multiPointM: Shapefile.MULTI_POINT_M
        };

        // Internal use only. Intentionally not documented.
        Shapefile.polylineTypes = {
            polyline: Shapefile.POLYLINE,
            polylineZ: Shapefile.POLYLINE_Z,
            polylineM: Shapefile.POLYLINE_M
        };

        // Internal use only. Intentionally not documented.
        Shapefile.polygonTypes = {
            polygon: Shapefile.POLYGON,
            polygonZ: Shapefile.POLYGON_Z,
            polygonM: Shapefile.POLYGON_M
        };

        // Intentionally not documented.
        Shapefile.FILE_CODE = 0x0000270A;

        export default Shapefile;
    