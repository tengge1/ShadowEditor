/*
 * Copyright 2003-2006, 2009, 2017, United States Government, as represented by the Administrator of the
 * National Aeronautics and Space Administration. All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @exports WktExporter
 */
import ArgumentError from '../../error/ArgumentError';
import Logger from '../../util/Logger';
import WktType from './WktType';
        

        /**
         * Provides WKT exporter functions.
         * The following renderables can be exported:
         * <ul>
         *     <li>WorldWind.Placemark</li>
         *     <li>WorldWind.SurfaceCircle</li>
         *     <li>WorldWind.SurfacePolyline</li>
         *     <li>WorldWind.SurfacePolygon</li>
         *     <li>WorldWind.SurfaceEllipse</li>
         *     <li>WorldWind.SurfaceRectangle</li>
         *     <li>WorldWind.SurfaceSector</li>
         *     <li>WorldWind.Path</li>
         *     <li>WorldWind.Polygon</li>
         * </ul>
         * @exports WktExporter
         */
        var WktExporter = {

            /**
             * Exports a [Renderable]{@link Renderable} in WKT format.
             * @param {Renderable} renderable The renderable to export.
             * @throws {ArgumentError} If the specified renderable is null or undefined.
             * @returns {String} WKT format.
             */
            exportRenderable: function (renderable) {
                if (!renderable) {
                    throw new ArgumentError(
                        Logger.logMessage(Logger.LEVEL_SEVERE, "WktExporter", "exportRenderable",
                            "missingRenderable"));
                }

                if (renderable instanceof WorldWind.Placemark) {
                    return this.exportPlacemark(renderable);
                }
                else if (renderable instanceof WorldWind.Path) {
                    return this.exportPath(renderable);
                }
                else if (renderable instanceof WorldWind.Polygon) {
                    return this.exportPolygon(renderable);
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
                else {
                    Logger.log(Logger.LEVEL_WARNING, "Export renderable not implemented: " + renderable);
                    return null;
                }
            },

            /**
             * Exports a list of [Renderable]{@link Renderable} in WKT format of type GeometryCollection.
             * @param {Renderable[]} renderables The renderables to export.
             * @throws {ArgumentError} If the specified renderable is null or undefined.
             * @returns {String} WKT format.
             */
            exportRenderables: function (renderables) {
                if (!renderables) {
                    throw new ArgumentError(
                        Logger.logMessage(Logger.LEVEL_SEVERE, "WktExporter", "exportRenderables",
                            "missingRenderables"));
                }

                if (renderables.length == 0) {
                    return;
                }

                if (renderables.length > 1) {
                    var sb = WktType.SupportedGeometries.GEOMETRY_COLLECTION + '(';

                    for (var i = 0; i < renderables.length; i++) {
                        var exportedRenderable = this.exportRenderable(renderables[i]);

                        if (exportedRenderable) {
                            sb = sb + exportedRenderable;
                            sb = sb + ',';
                        }
                    }
                    sb = sb.substring(0, sb.length - 1);
                    sb = sb + ')';

                    return sb;
                }
                else {
                    return this.exportRenderable(renderables[0]);
                }
            },

            /**
             * Exports a [Layer]{@link Layer} in WKT format of type GeometryCollection.
             * @param {Layer} layer The layer to export.
             * @throws {ArgumentError} If the specified argument is null or undefined.
             * @returns {String} WKT format.
             */
            exportLayer: function (layer) {
                if (!layer) {
                    throw new ArgumentError(
                        Logger.logMessage(Logger.LEVEL_SEVERE, "WktExporter", "exportLayer",
                            "missingLayer"));
                }

                return this.exportRenderables(layer.renderables);
            },

            /**
             * Exports a [Placemark]{@link Placemark} in WKT format of type Point.
             * @param {Placemark} renderable The Placemark object.
             * @throws {ArgumentError} If the specified argument is null or undefined.
             * @returns {String} WKT format.
             */
            exportPlacemark: function (renderable) {
                if (!(renderable instanceof WorldWind.Placemark)) {
                    throw new ArgumentError(
                        Logger.logMessage(Logger.LEVEL_SEVERE, "WktExporter", "exportPlacemark",
                            "invalidTypeOfRenderable"));
                }

                var sb = WktType.SupportedGeometries.POINT + '(';
                sb = sb + renderable.position.longitude + ' ' + renderable.position.latitude;
                sb = sb + ')';
                return sb;
            },

            /**
             * Exports a [Path]{@link Path} in WKT format of type LineString.
             * @param {SurfacePolyline} renderable The Path object.
             * @throws {ArgumentError} If the specified argument is null or undefined.
             * @returns {String} WKT format.
             */
            exportPath: function (renderable) {
                if (!(renderable instanceof WorldWind.Path)) {
                    throw new ArgumentError(
                        Logger.logMessage(Logger.LEVEL_SEVERE, "WktExporter", "exportPath",
                            "invalidTypeOfRenderable"));
                }

                var sb = WktType.SupportedGeometries.LINE_STRING + '(';
                for (var i = 0; i < renderable.positions.length; i++) {
                    sb = sb + renderable.positions[i].longitude + ' ' +
                        renderable.positions[i].latitude;
                }
                sb = sb.substring(0, sb.length - 2);
                sb = sb + ')';
                return sb;
            },

            /**
             * Exports a [Polygon]{@link Polygon} in WKT format of type Polygon.
             * @param {Polygon} renderable The Polygon object.
             * @throws {ArgumentError} If the specified argument is null or undefined.
             * @returns {String} WKT format.
             */
            exportPolygon: function (renderable) {
                if (!(renderable instanceof WorldWind.Polygon)) {
                    throw new ArgumentError(
                        Logger.logMessage(Logger.LEVEL_SEVERE, "WktExporter", "exportPolygon",
                            "invalidTypeOfRenderable"));
                }

                var sb = WktType.SupportedGeometries.POLYGON + '(';
                if (renderable.boundaries.length > 0 && renderable.boundaries[0].length > 2) {
                    //with holes
                    for (var i = 0; i < renderable.boundaries.length; i++) {
                        sb = sb + '(';
                        for (var j = 0; j < renderable.boundaries[i].length; j++) {
                            sb = sb + renderable.boundaries[i][j].longitude + ' ' +
                                renderable.boundaries[i][j].latitude;
                            sb = sb + ', ';
                        }
                        sb = sb.substring(0, sb.length - 2);
                        sb = sb + ')';
                        sb = sb + ', ';
                    }
                    sb = sb.substring(0, sb.length - 2);
                }
                else {
                    //no holes
                    sb = sb + '(';
                    for (var i = 0; i < renderable.boundaries.length; i++) {
                        sb = sb + renderable.boundaries[i].longitude + ' ' +
                            renderable.boundaries[i].latitude;
                        sb = sb + ', ';
                    }

                    sb = sb.substring(0, sb.length - 2);
                    sb = sb + ')';
                }
                sb = sb + ')';
                return sb;
            },

            /**
             * Exports a [SurfacePolyline]{@link SurfacePolyline} in WKT format of type LineString.
             * @param {SurfacePolyline} renderable The SurfacePolyline object.
             * @throws {ArgumentError} If the specified argument is null or undefined.
             * @returns {String} WKT format.
             */
            exportSurfacePolyline: function (renderable) {
                if (!(renderable instanceof WorldWind.SurfacePolyline)) {
                    throw new ArgumentError(
                        Logger.logMessage(Logger.LEVEL_SEVERE, "WktExporter", "exportSurfacePolyline",
                            "invalidTypeOfRenderable"));
                }

                var sb = WktType.SupportedGeometries.LINE_STRING + '(';
                for (var i = 0; i < renderable.boundaries.length; i++) {
                    sb = sb + renderable.boundaries[i].longitude + ' ' +
                        renderable.boundaries[i].latitude;
                    sb = sb + ', ';
                }
                sb = sb.substring(0, sb.length - 2);
                sb = sb + ')';
                return sb;
            },

            /**
             * Exports a [SurfacePolygon]{@link SurfacePolygon} in WKT format of type Polygon.
             * @param {SurfacePolygon} renderable The SurfacePolygon object.
             * @throws {ArgumentError} If the specified argument is null or undefined.
             * @returns {String} WKT format.
             */
            exportSurfacePolygon: function (renderable) {
                if (!(renderable instanceof WorldWind.SurfacePolygon)) {
                    throw new ArgumentError(
                        Logger.logMessage(Logger.LEVEL_SEVERE, "WktExporter", "exportSurfacePolygon",
                            "invalidTypeOfRenderable"));
                }

                var sb = WktType.SupportedGeometries.POLYGON + '(';
                if (renderable.boundaries.length > 0 && renderable.boundaries[0].length > 2) {
                    //with holes
                    for (var i = 0; i < renderable.boundaries.length; i++) {
                        sb = sb + '(';
                        for (var j = 0; j < renderable.boundaries[i].length; j++) {
                            sb = sb + renderable.boundaries[i][j].longitude + ' ' +
                                renderable.boundaries[i][j].latitude;
                            sb = sb + ', ';
                        }
                        sb = sb.substring(0, sb.length - 2);
                        sb = sb + ')';
                        sb = sb + ', ';
                    }
                    sb = sb.substring(0, sb.length - 2);
                }
                else {
                    //no holes
                    sb = sb + '(';
                    for (var i = 0; i < renderable.boundaries.length; i++) {
                        sb = sb + renderable.boundaries[i].longitude + ' ' +
                            renderable.boundaries[i].latitude;
                        sb = sb + ', ';
                    }
                    sb = sb.substring(0, sb.length - 2);
                    sb = sb + ')';
                }
                sb = sb + ')';
                return sb;
            },

            /**
             * Exports a [SurfaceEllipse]{@link SurfaceEllipse} in WKT format of type Polygon.
             * @param {SurfaceEllipse} renderable The SurfaceEllipse object.
             * @throws {ArgumentError} If the specified argument is null or undefined.
             * @returns {String} WKT format.
             */
            exportSurfaceEllipse: function (renderable) {
                if (!(renderable instanceof WorldWind.SurfaceEllipse)) {
                    throw new ArgumentError(
                        Logger.logMessage(Logger.LEVEL_SEVERE, "WktExporter", "exportSurfaceEllipse",
                            "invalidTypeOfRenderable"));
                }

                var sb = WktType.SupportedGeometries.POLYGON + '(';
                sb = sb + '(';
                for (var i = 0; i < renderable._boundaries.length; i++) {
                    sb = sb + renderable._boundaries[i].longitude + ' ' +
                        renderable._boundaries[i].latitude;
                    sb = sb + ', ';
                }

                sb = sb.substring(0, sb.length - 2);

                sb = sb + ')';
                sb = sb + ')';
                return sb;
            },

            /**
             * Exports a [SurfaceCircle]{@link SurfaceCircle} in WKT format of type Polygon.
             * @param {SurfaceCircle} renderable The SurfaceCircle object.
             * @throws {ArgumentError} If the specified argument is null or undefined.
             * @returns {String} WKT format.
             */
            exportSurfaceCircle: function (renderable) {
                if (!(renderable instanceof WorldWind.SurfaceCircle)) {
                    throw new ArgumentError(
                        Logger.logMessage(Logger.LEVEL_SEVERE, "WktExporter", "exportSurfaceCircle",
                                "invalidTypeOfRenderable"));
                }

                var sb = WktType.SupportedGeometries.POLYGON + '(';
                sb = sb + '(';
                for (var i = 0; i < renderable._boundaries.length; i++) {
                    sb = sb + renderable._boundaries[i].longitude + ' ' +
                        renderable._boundaries[i].latitude;
                    sb = sb + ', ';
                }

                sb = sb.substring(0, sb.length - 2);

                sb = sb + ')';
                sb = sb + ')';
                return sb;
            },

            /**
             * Exports a [SurfaceRectangle]{@link SurfaceRectangle} in WKT format of type Polygon.
             * @param {SurfaceRectangle} renderable The SurfaceRectangle object.
             * @throws {ArgumentError} If the specified argument is null or undefined.
             * @returns {String} WKT format.
             */
            exportSurfaceRectangle: function (renderable) {
                if (!(renderable instanceof WorldWind.SurfaceRectangle)) {
                    throw new ArgumentError(
                        Logger.logMessage(Logger.LEVEL_SEVERE, "WktExporter", "exportSurfaceRectangle",
                            "invalidTypeOfRenderable"));
                }

                var sb = WktType.SupportedGeometries.POLYGON + '(';
                sb = sb + '(';
                for (var i = 0; i < renderable._boundaries.length; i++) {
                    sb = sb + renderable._boundaries[i].longitude + ' ' +
                        renderable._boundaries[i].latitude;
                    sb = sb + ', ';
                }

                sb = sb.substring(0, sb.length - 2);

                sb = sb + ')';
                sb = sb + ')';
                return sb;
            },

            /**
             * Exports a [SurfaceSector]{@link SurfaceSector} in WKT format of type Polygon.
             * @param {SurfaceSector} renderable The SurfaceSector object.
             * @throws {ArgumentError} If the specified argument is null or undefined.
             * @returns {String} WKT format.
             */
            exportSurfaceSector: function (renderable) {
                if (!(renderable instanceof WorldWind.SurfaceSector)) {
                    throw new ArgumentError(
                        Logger.logMessage(Logger.LEVEL_SEVERE, "WktExporter", "exportSurfaceSector",
                            "invalidTypeOfRenderable"));
                }

                var sb = WktType.SupportedGeometries.POLYGON + '(';
                sb = sb + '(';
                for (var i = 0; i < renderable._boundaries.length; i++) {
                    sb = sb + renderable._boundaries[i].longitude + ' ' +
                        renderable._boundaries[i].latitude;
                    sb = sb + ', ';
                }

                sb = sb.substring(0, sb.length - 2);

                sb = sb + ')';
                sb = sb + ')';
                return sb;
            }
        };

        export default WktExporter;
    