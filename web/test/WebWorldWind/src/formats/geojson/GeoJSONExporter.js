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
 * @exports GeoJSONExporter
 */
import ArgumentError from '../../error/ArgumentError';
import GeoJSONConstants from './GeoJSONConstants';
import Logger from '../../util/Logger';
        

        /**
         * Provides GeoJSON exporter functions.
         * The following renderables can be exported:
         * <ul>
         *     <li>WorldWind.Placemark</li>
         *     <li>WorldWind.SurfacePolyline</li>
         *     <li>WorldWind.SurfacePolygon</li>
         *     <li>WorldWind.SurfaceEllipse</li>
         *     <li>WorldWind.SurfaceRectangle</li>
         *     <li>WorldWind.Path</li>
         *     <li>WorldWind.Polygon</li>
         * </ul>
         * @exports GeoJSONExporter
         */
        var GeoJSONExporter = {

            /**
             * Exports a [Renderable]{@link Renderable} in GeoJSON format.
             * @param {Renderable} renderable The renderable to export.
             * @throws {ArgumentError} If the specified renderable is null or undefined.
             * @returns {String} GeoJSON format.
             */
            exportRenderable: function (renderable) {
                if (!renderable) {
                    throw new ArgumentError(
                        Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSONExporter", "exportRenderable",
                            "missingRenderable"));
                }

                if (renderable instanceof WorldWind.Placemark) {
                    return this.exportPlacemark(renderable);
                }
                else if (renderable instanceof WorldWind.SurfacePolyline) {
                    return this.exportSurfacePolyline(renderable);
                }
                else if (renderable instanceof WorldWind.SurfacePolygon) {
                    return this.exportSurfacePolygon(renderable);
                }
                else if (renderable instanceof WorldWind.SurfaceEllipse) {
                    return this.exportSurfaceEllipse(renderable);
                }
                else if (renderable instanceof WorldWind.SurfaceCircle) {
                    return this.exportSurfaceCircle(renderable);
                }
                else if (renderable instanceof WorldWind.SurfaceRectangle) {
                    return this.exportSurfaceRectangle(renderable);
                }
                else if (renderable instanceof WorldWind.SurfaceSector) {
                    return this.exportSurfaceSector(renderable);
                }
                else if (renderable instanceof WorldWind.Path) {
                    return this.exportPath(renderable);
                }
                else if (renderable instanceof WorldWind.Polygon) {
                    return this.exportPolygon(renderable);
                }
                else {
                    Logger.log(Logger.LEVEL_WARNING, "Export renderable not implemented: " + renderable);
                    return null;
                }
            },

            /**
             * Exports a list of [Renderable]{@link Renderable} in GeoJSON format of type GeometryCollection.
             * @param {Renderable[]} renderables The renderables to export.
             * @throws {ArgumentError} If the specified renderable is null or undefined.
             * @returns {String} GeoJSON format.
             */
            exportRenderables: function (renderables) {
                if (!renderables) {
                    throw new ArgumentError(
                        Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSONExporter", "exportRenderables",
                            "missingRenderables"));
                }

                if (renderables.length == 0)
                    return;

                if (renderables.length > 1) {
                    var sb = '{';
                    sb = sb + '"' + GeoJSONConstants.FIELD_TYPE + '":"' + GeoJSONConstants.TYPE_GEOMETRY_COLLECTION + '"';
                    sb = sb + ',"' + GeoJSONConstants.FIELD_GEOMETRIES + '":[';
                    for (var i = 0; i < renderables.length; i++) {
                        var exportedRenderable = this.exportRenderable(renderables[i])
                        if (exportedRenderable) {
                            sb = sb + exportedRenderable;
                            sb = sb + ',';
                        }
                    }
                    if (sb.slice(-1) === ',') {
                        sb = sb.substring(0, sb.length - 1);
                    }
                    sb = sb + ']';
                    sb = sb + '}';

                    return sb;
                }
                else {
                    return this.exportRenderable(renderables[0]);
                }
            },

            /**
             * Exports a [Layer]{@link Layer} in GeoJSON format of type GeometryCollection.
             * @param {Layer} layer The layer to export.
             * @throws {ArgumentError} If the specified argument is null or undefined.
             * @returns {String} GeoJSON format.
             */
            exportLayer: function (layer) {
                if (!layer) {
                    throw new ArgumentError(
                        Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSONExporter", "exportLayer",
                            "missingLayer"));
                }

                return this.exportRenderables(layer.renderables);
            },

            /**
             * Exports a [Placemark]{@link Placemark} in GeoJSON format of type Point.
             * @param {Placemark} renderable The Placemark object.
             * @throws {ArgumentError} If the specified argument is null or undefined.
             * @returns {String} GeoJSON format.
             */
            exportPlacemark: function (renderable) {
                if (!(renderable instanceof WorldWind.Placemark)) {
                    throw new ArgumentError(
                        Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSONExporter", "exportPlacemark",
                            "invalidTypeOfRenderable"));
                }

                var sb = '{';
                sb = sb + '"' + GeoJSONConstants.FIELD_TYPE + '":"' + GeoJSONConstants.TYPE_POINT + '",';
                sb = sb + '"' + GeoJSONConstants.FIELD_COORDINATES + '":';
                sb = sb + '[' + renderable.position.longitude + ',' + renderable.position.latitude + ']';
                sb = sb + '}';
                return sb;
            },

            /**
             * Exports a [SurfacePolyline]{@link SurfacePolyline} in GeoJSON format of type LineString.
             * @param {SurfacePolyline} renderable The SurfacePolyline object.
             * @throws {ArgumentError} If the specified argument is null or undefined.
             * @returns {String} GeoJSON format.
             */
            exportSurfacePolyline: function (renderable) {
                if (!(renderable instanceof WorldWind.SurfacePolyline)) {
                    throw new ArgumentError(
                        Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSONExporter", "exportSurfacePolyline",
                            "invalidTypeOfRenderable"));
                }

                var sb = '{';
                sb = sb + '"' + GeoJSONConstants.FIELD_TYPE + '":"' + GeoJSONConstants.TYPE_LINE_STRING + '",';
                sb = sb + '"' + GeoJSONConstants.FIELD_COORDINATES + '":[';
                for (var i = 0; i < renderable.boundaries.length; i++) {
                    sb = sb + '[' + renderable.boundaries[i].longitude + ',' +
                        renderable.boundaries[i].latitude + ']';
                    if (i !== renderable.boundaries.length - 1) {
                        sb = sb + ',';
                    }
                }
                sb = sb + ']';
                sb = sb + '}';
                return sb;
            },

            /**
             * Exports a [SurfacePolygon]{@link SurfacePolygon} in GeoJSON format of type Polygon.
             * @param {SurfacePolygon} renderable The SurfacePolygon object.
             * @throws {ArgumentError} If the specified argument is null or undefined.
             * @returns {String} GeoJSON format.
             */
            exportSurfacePolygon: function (renderable) {
                if (!(renderable instanceof WorldWind.SurfacePolygon)) {
                    throw new ArgumentError(
                        Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSONExporter", "exportSurfacePolygon",
                            "invalidTypeOfRenderable"));
                }

                var sb = '{';
                sb = sb + '"' + GeoJSONConstants.FIELD_TYPE + '":"' + GeoJSONConstants.TYPE_POLYGON + '",';
                sb = sb + '"' + GeoJSONConstants.FIELD_COORDINATES + '":[';
                if (renderable.boundaries.length > 0 && renderable.boundaries[0].length > 2) {
                    //with holes
                    for (var i = 0; i < renderable.boundaries.length; i++) {
                        sb = sb + '[';
                        for (var j = 0; j < renderable.boundaries[i].length; j++) {
                            sb = sb + '[' + renderable.boundaries[i][j].longitude + ',' +
                                renderable.boundaries[i][j].latitude + ']';
                            sb = sb + ',';

                            if (j === renderable.boundaries[i].length - 1) {
                                sb = sb + '[' + renderable.boundaries[i][0].longitude + ',' +
                                    renderable.boundaries[i][0].latitude + ']';
                            }
                        }
                        sb = sb + ']';
                        if (i !== renderable.boundaries.length - 1) {
                            sb = sb + ',';
                        }
                    }
                }
                else {
                    //no holes
                    sb = sb + '[';
                    for (var i = 0; i < renderable.boundaries.length; i++) {
                        sb = sb + '[' + renderable.boundaries[i].longitude + ',' +
                            renderable.boundaries[i].latitude + ']';
                        sb = sb + ',';

                        if (i === renderable.boundaries.length - 1) {
                            sb = sb + '[' + renderable.boundaries[0].longitude + ',' +
                                renderable.boundaries[0].latitude + ']';
                        }
                    }
                    sb = sb + ']';
                }
                sb = sb + ']';
                sb = sb + '}';
                return sb;
            },

            /**
             * Exports a [SurfaceEllipse]{@link SurfaceEllipse} in GeoJSON format of type Polygon.
             * @param {SurfaceEllipse} renderable The SurfaceEllipse object.
             * @throws {ArgumentError} If the specified argument is null or undefined.
             * @returns {String} GeoJSON format.
             */
            exportSurfaceEllipse: function (renderable) {
                if (!(renderable instanceof WorldWind.SurfaceEllipse)) {
                    throw new ArgumentError(
                        Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSONExporter", "exportSurfaceEllipse",
                            "invalidTypeOfRenderable"));
                }

                var sb = '{';
                sb = sb + '"' + GeoJSONConstants.FIELD_TYPE + '":"' + GeoJSONConstants.TYPE_POLYGON + '",';
                sb = sb + '"' + GeoJSONConstants.FIELD_COORDINATES + '":[';
                sb = sb + '[';
                for (var i = 0; i < renderable._boundaries.length; i++) {
                    sb = sb + '[' + renderable._boundaries[i].longitude + ',' +
                        renderable._boundaries[i].latitude + ']';
                    sb = sb + ',';

                    if (i === renderable._boundaries.length - 1) {
                        sb = sb + '[' + renderable._boundaries[0].longitude + ',' +
                            renderable._boundaries[0].latitude + ']';
                    }
                }
                sb = sb + ']';
                sb = sb + ']';
                sb = sb + '}';
                return sb;
            },

            /**
             * Exports a [SurfaceCircle]{@link SurfaceCircle} in GeoJSON format of type Polygon.
             * @param {SurfaceCircle} renderable The SurfaceCircle object.
             * @throws {ArgumentError} If the specified argument is null or undefined.
             * @returns {String} GeoJSON format.
             */
            exportSurfaceCircle: function (renderable) {
                if (!(renderable instanceof WorldWind.SurfaceCircle)) {
                    throw new ArgumentError(
                        Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSONExporter", "exportSurfaceCircle",
                            "invalidTypeOfRenderable"));
                }

                var sb = '{';
                sb = sb + '"' + GeoJSONConstants.FIELD_TYPE + '":"' + GeoJSONConstants.TYPE_POLYGON + '",';
                sb = sb + '"' + GeoJSONConstants.FIELD_COORDINATES + '":[';
                sb = sb + '[';
                for (var i = renderable._boundaries.length - 1; i >= 0 ; i--) {
                    sb = sb + '[' + renderable._boundaries[i].longitude + ',' +
                        renderable._boundaries[i].latitude + ']';
                    sb = sb + ',';

                    if (i === 0) {
                        sb = sb + '[' + renderable._boundaries[renderable._boundaries.length-1].longitude + ',' +
                            renderable._boundaries[renderable._boundaries.length-1].latitude + ']';
                    }
                }
                sb = sb + ']';
                sb = sb + ']';
                sb = sb + '}';
                return sb;
            },

            /**
             * Exports a [SurfaceRectangle]{@link SurfaceRectangle} in GeoJSON format of type Polygon.
             * @param {SurfaceRectangle} renderable The SurfaceRectangle object.
             * @throws {ArgumentError} If the specified argument is null or undefined.
             * @returns {String} GeoJSON format.
             */
            exportSurfaceRectangle: function (renderable) {
                if (!(renderable instanceof WorldWind.SurfaceRectangle)) {
                    throw new ArgumentError(
                        Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSONExporter", "exportSurfaceRectangle",
                            "invalidTypeOfRenderable"));
                }

                var sb = '{';
                sb = sb + '"' + GeoJSONConstants.FIELD_TYPE + '":"' + GeoJSONConstants.TYPE_POLYGON + '",';
                sb = sb + '"' + GeoJSONConstants.FIELD_COORDINATES + '":[';
                sb = sb + '[';
                for (var i = 0; i < renderable._boundaries.length; i++) {
                    sb = sb + '[' + renderable._boundaries[i].longitude + ',' +
                        renderable._boundaries[i].latitude + ']';
                    sb = sb + ',';

                    if (i === renderable._boundaries.length - 1) {
                        sb = sb + '[' + renderable._boundaries[0].longitude + ',' +
                            renderable._boundaries[0].latitude + ']';
                    }
                }
                sb = sb + ']';
                sb = sb + ']';
                sb = sb + '}';
                return sb;
            },

            /**
             * Exports a [SurfaceSector]{@link SurfaceSector} in GeoJSON format of type Polygon.
             * @param {SurfaceSector} renderable The SurfaceSector object.
             * @throws {ArgumentError} If the specified argument is null or undefined.
             * @returns {String} GeoJSON format.
             */
            exportSurfaceSector: function (renderable) {
                if (!(renderable instanceof WorldWind.SurfaceSector)) {
                    throw new ArgumentError(
                        Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSONExporter", "exportSurfaceSector",
                            "invalidTypeOfRenderable"));
                }

                var sb = '{';
                sb = sb + '"' + GeoJSONConstants.FIELD_TYPE + '":"' + GeoJSONConstants.TYPE_POLYGON + '",';
                sb = sb + '"' + GeoJSONConstants.FIELD_COORDINATES + '":[';
                sb = sb + '[';

                //right-hand rule
                renderable._boundaries.reverse();

                for (var i = 0; i < renderable._boundaries.length; i++) {
                    sb = sb + '[' + renderable._boundaries[i].longitude + ',' +
                        renderable._boundaries[i].latitude + ']';
                    sb = sb + ',';

                    if (i === renderable._boundaries.length - 1) {
                        sb = sb + '[' + renderable._boundaries[0].longitude + ',' +
                            renderable._boundaries[0].latitude + ']';
                    }
                }
                sb = sb + ']';
                sb = sb + ']';
                sb = sb + '}';
                return sb;
            },

            /**
             * Exports a [Path]{@link Path} in GeoJSON format of type LineString.
             * @param {Path} renderable The Path object.
             * @throws {ArgumentError} If the specified argument is null or undefined.
             * @returns {String} GeoJSON format.
             */
            exportPath: function (renderable) {
                if (!(renderable instanceof WorldWind.Path)) {
                    throw new ArgumentError(
                        Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSONExporter", "exportPath",
                            "invalidTypeOfRenderable"));
                }

                var sb = '{';
                sb = sb + '"' + GeoJSONConstants.FIELD_TYPE + '":"' + GeoJSONConstants.TYPE_LINE_STRING + '",';
                sb = sb + '"' + GeoJSONConstants.FIELD_COORDINATES + '":[';
                for (var i = 0; i < renderable.positions.length; i++) {
                    sb = sb + '[' + renderable.positions[i].longitude + ',' +
                        renderable.positions[i].latitude + ',' +
                        renderable.positions[i].altitude + ']';
                    if (i !== renderable.positions.length - 1) {
                        sb = sb + ',';
                    }
                }
                sb = sb + ']';
                sb = sb + '}';
                return sb;
            },

            /**
             * Exports a [Polygon]{@link Polygon} in GeoJSON format of type Polygon.
             * @param {Polygon} renderable The Polygon object.
             * @throws {ArgumentError} If the specified argument is null or undefined.
             * @returns {String} GeoJSON format.
             */
            exportPolygon: function (renderable) {
                if (!(renderable instanceof WorldWind.Polygon)) {
                    throw new ArgumentError(
                        Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSONExporter", "exportPolygon",
                            "invalidTypeOfRenderable"));
                }

                var sb = '{';
                sb = sb + '"' + GeoJSONConstants.FIELD_TYPE + '":"' + GeoJSONConstants.TYPE_POLYGON + '",';
                sb = sb + '"' + GeoJSONConstants.FIELD_COORDINATES + '":[';
                if (renderable.boundaries.length > 0 && renderable.boundaries[0].length > 2) {
                    //with holes
                    for (var i = 0; i < renderable.boundaries.length; i++) {
                        sb = sb + '[';
                        for (var j = 0; j < renderable.boundaries[i].length; j++) {
                            sb = sb + '[' + renderable.boundaries[i][j].longitude + ',' +
                                renderable.boundaries[i][j].latitude + ',' +
                                renderable.boundaries[i][j].altitude + ']';
                            sb = sb + ',';

                            if (j === renderable.boundaries[i].length - 1) {
                                sb = sb + '[' + renderable.boundaries[i][0].longitude + ',' +
                                    renderable.boundaries[i][0].latitude + ',' +
                                    renderable.boundaries[i][0].altitude + ']';
                            }
                        }
                        sb = sb + ']';
                        if (i !== renderable.boundaries.length - 1) {
                            sb = sb + ',';
                        }
                    }
                }
                else {
                    //no holes
                    sb = sb + '[';
                    for (var i = 0; i < renderable.boundaries.length; i++) {
                        sb = sb + '[' + renderable.boundaries[i].longitude + ',' +
                            renderable.boundaries[i].latitude + ',' +
                            renderable.boundaries[i].altitude + ']';
                        sb = sb + ',';

                        if (i === renderable.boundaries.length - 1) {
                            sb = sb + '[' + renderable.boundaries[0].longitude + ',' +
                                renderable.boundaries[0].latitude + ',' +
                                renderable.boundaries[0].altitude + ']';
                        }
                    }
                    sb = sb + ']';
                }
                sb = sb + ']';
                sb = sb + '}';
                return sb;
            }
        };

        export default GeoJSONExporter;
    