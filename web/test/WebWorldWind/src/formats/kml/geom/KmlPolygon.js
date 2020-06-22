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
import Color from '../../../util/Color';
import KmlElements from '../KmlElements';
import KmlGeometry from './KmlGeometry';
import KmlLinearRing from './KmlLinearRing';
import KmlStyle from '../styles/KmlStyle';
import Location from '../../../geom/Location';
import NodeTransformers from '../util/KmlNodeTransformers';
import Polygon from '../../../shapes/Polygon';
import ShapeAttributes from '../../../shapes/ShapeAttributes';
import SurfacePolygon from '../../../shapes/SurfacePolygon';
    
    /**
     * Constructs an KmlPolygon. Application usually don't call this constructor. It is called by {@link KmlFile} as
     * Objects from KmlFile are read. It is concrete implementation.
     * It is Polygon and KmlGeometry.
     * @alias KmlPolygon
     * @constructor
     * @classdesc Contains the data associated with Kml polygon
     * @param options {Object}
     * @param options.objectNode {Node} Node representing Polygon
     * @param options.style {Promise} Promise of styles to be applied to this Polygon.
     * @throws {ArgumentError} If either the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#polygon
     */
    var KmlPolygon = function (options) {
        KmlGeometry.call(this, options);

        this.initialized = false;
    };

    KmlPolygon.prototype = Object.create(KmlGeometry.prototype);

    Object.defineProperties(KmlPolygon.prototype, {
        /**
         * In case that the polygon is above ground, this property decides whether there is going to be a line to
         * the ground.
         * @memberof KmlPolygon.prototype
         * @type {Boolean}
         * @readonly
         */
        kmlExtrude: {
            get: function () {
                return this._factory.specific(this, {name: 'extrude', transformer: NodeTransformers.boolean});
            }
        },

        /**
         * Whether tessellation should be used for current node.
         * @memberof KmlPolygon.prototype
         * @readonly
         * @type {Boolean}
         */
        kmlTessellate: {
            get: function () {
                return this._factory.specific(this, {name: 'tessellate', transformer: NodeTransformers.boolean});
            }
        },

        /**
         * It explains how we should treat the altitude of the polygon. Possible choices are explained in:
         * https://developers.google.com/kml/documentation/kmlreference#point
         * @memberof KmlPolygon.prototype
         * @type {String}
         * @readonly
         */
        kmlAltitudeMode: {
            get: function () {
                return this._factory.specific(this, {name: 'altitudeMode', transformer: NodeTransformers.string});
            }
        },

        /**
         * Outer boundary of this polygon represented as a LinearRing.
         * @memberof KmlPolygon.prototype
         * @type {KmlLinearRing}
         * @readonly
         */
        kmlOuterBoundary: {
            get: function () {
                return this._factory.specific(this, {
                    name: 'outerBoundaryIs',
                    transformer: NodeTransformers.linearRing
                });
            }
        },

        /**
         * Inner boundary of this polygon represented as a LinearRing. Optional property
         * @memberof KmlPolygon.prototype.
         * @type {KmlLinearRing}
         * @readonly
         */
        kmlInnerBoundary: {
            get: function () {
                return this._factory.specific(this, {
                    name: 'innerBoundaryIs',
                    transformer: NodeTransformers.linearRing
                });
            }
        },

        /**
         * It returns center of outer boundaries of the polygon.
         * @memberof KmlPolygon.prototype
         * @readonly
         * @type {Position}
         */
        kmlCenter: {
            get: function () {
                return this.kmlOuterBoundary.kmlCenter;
            }
        }
    });

    /**
     * Internal use only. Once create the instance of actual polygon.
     * @param styles {Object|null}
     * @param styles.normal {KmlStyle} Style to apply when not highlighted
     * @param styles.highlight {KmlStyle} Style to apply when item is highlighted. Currently ignored.
     */
    KmlPolygon.prototype.createPolygon = function (styles, fileCache) {
        console.log(this.kmlInnerBoundary && this.kmlInnerBoundary.kmlAltitudeMode === WorldWind.CLAMP_TO_GROUND);
        // TODO: KML boundaries are displaying graphic glitches when the camera is zoomed out
        if (
            !this.isValidAltitudeMode(this.kmlAltitudeMode) ||
            this.kmlAltitudeMode === WorldWind.CLAMP_TO_GROUND ||
            (this.kmlInnerBoundary && this.kmlInnerBoundary.kmlAltitudeMode === WorldWind.CLAMP_TO_GROUND) ||
            (this.kmlOuterBoundary && this.kmlOuterBoundary.kmlAltitudeMode === WorldWind.CLAMP_TO_GROUND)
        ) {
            this._renderable = new SurfacePolygon(this.prepareLocations(), this.prepareAttributes(styles.normal, fileCache));
        } else {
            this._renderable = new Polygon(this.prepareLocations(), this.prepareAttributes(styles.normal, fileCache));
        }
        if (styles.highlight) {
            this._renderable.highlightAttributes = this.prepareAttributes(styles.highlight, fileCache);
        }
        this.moveValidProperties();
    };

    /**
     * @inheritDoc
     */
    KmlPolygon.prototype.render = function (dc, kmlOptions) {
        KmlGeometry.prototype.render.call(this, dc, kmlOptions);

        if (kmlOptions.lastStyle && !this._renderable) {
            this.createPolygon(kmlOptions.lastStyle, kmlOptions.fileCache);
            dc.redrawRequested = true;
        }

        if (this._renderable) {
            this._renderable.enabled = this.enabled;
            this._renderable.render(dc);
        }
    };

    // For internal use only. Intentionally left undocumented.
    KmlPolygon.prototype.moveValidProperties = function () {
        this._renderable.extrude = this.kmlExtrude || true;
        this._renderable.altitudeMode = this.kmlAltitudeMode || WorldWind.CLAMP_TO_GROUND;
    };

    /**
     * @inheritDoc
     */
    KmlPolygon.prototype.prepareAttributes = function (style, fileCache) {
        var shapeOptions = style && style.generate(fileCache) || {};

        shapeOptions._drawVerticals = this.kmlExtrude || false;
        shapeOptions._applyLighting = true;
        shapeOptions._depthTest = true;
        shapeOptions._outlineStippleFactor = 0;
        shapeOptions._outlineStipplePattern = 61680;
        shapeOptions._enableLighting = true;

        return new ShapeAttributes(KmlStyle.shapeAttributes(shapeOptions));
    };

    /**
     * @inheritDoc
     */
    KmlPolygon.prototype.prepareLocations = function () {
        var locations = [];
        if (this.kmlInnerBoundary != null) {
            locations[0] = this.kmlInnerBoundary.kmlPositions;
            locations[1] = this.kmlOuterBoundary.kmlPositions;
        } else {
            locations = this.kmlOuterBoundary.kmlPositions;
        }
        return locations;
    };

    /**
     * @inheritDoc
     */
    KmlPolygon.prototype.isValidAltitudeMode = function (altMode) {
        return WorldWind.CLAMP_TO_GROUND === altMode
            || WorldWind.RELATIVE_TO_GROUND === altMode
            || WorldWind.ABSOLUTE === altMode;

    };

    /**
     * @inheritDoc
     */
    KmlPolygon.prototype.getStyle = function () {
        return this._style;
    };

    /**
     * @inheritDoc
     */
    KmlPolygon.prototype.getTagNames = function () {
        return ['Polygon'];
    };

    KmlElements.addKey(KmlPolygon.prototype.getTagNames()[0], KmlPolygon);

    export default KmlPolygon;
