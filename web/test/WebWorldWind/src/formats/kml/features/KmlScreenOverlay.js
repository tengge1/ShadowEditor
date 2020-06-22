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
import KmlElements from './../KmlElements';
import KmlFeature from './KmlFeature';
import KmlOverlay from './KmlOverlay';
import NodeTransformers from '../util/KmlNodeTransformers';
import Offset from '../../../util/Offset';
import ScreenImage from '../../../shapes/ScreenImage';
    

    /**
     * Constructs an KmlScreenOverlay. Applications usually don't call this constructor. It is called by {@link
        * KmlFile} as objects from Kml file are read. This object is already concrete implementation.
     * @alias KmlScreenOverlay
     * @classdesc Contains the data associated with ScreenOverlay node.
     * @param options {Object}
     * @param options.objectNode {Node} Node representing ScreenOverlay
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#screenoverlay
     * @augments KmlOverlay
     */
    var KmlScreenOverlay = function (options) {
        KmlOverlay.call(this, options);
    };

    KmlScreenOverlay.prototype = Object.create(KmlOverlay.prototype);

    Object.defineProperties(KmlScreenOverlay.prototype, {
        /**
         * Indicates the angle of rotation of the parent object. A value of 0 means no rotation. The value is an
         * angle in degrees counterclockwise starting from north. Use +-180 to indicate the rotation of the parent
         * object from
         * 0. The center of the &lt;rotation&gt;, if not (.5,.5), is specified in &lt;rotationXY&gt;.
         * @memberof KmlScreenOverlay.prototype
         * @readonly
         * @type {Number}
         */
        kmlRotation: {
            get: function () {
                return this._factory.specific(this, {name: 'rotation', transformer: NodeTransformers.number});
            }
        },

        /**
         * Either the number of pixels, a fractional component of the image, or a pixel inset indicating the x
         * component of a point on the overlay image.
         * @memberof KmlScreenOverlay.prototype
         * @readonly
         * @type {String}
         */
        kmlOverlayXYx: {
            get: function () {
                return this._factory.specific(this, {name: 'overlayXY', transformer: NodeTransformers.attribute('x'), attribute: 'kmlOverlayXYx'});
            }
        },

        /**
         * Either the number of pixels, a fractional component of the image, or a pixel inset indicating the y
         * component of a point on the overlay image.
         * @memberof KmlScreenOverlay.prototype
         * @readonly
         * @type {String}
         */
        kmlOverlayXYy: {
            get: function () {
                return this._factory.specific(this, {name: 'overlayXY', transformer: NodeTransformers.attribute('y'), attribute: 'kmlOverlayXYy'});
            }
        },

        /**
         * Units in which the x value is specified. A value of "fraction" indicates the x value is a fraction of the
         * image. A value of "pixels" indicates the x value in pixels. A value of "insetPixels" indicates the indent
         * from the right edge of the image.
         * @memberof KmlScreenOverlay.prototype
         * @readonly
         * @type {String}
         */
        kmlOverlayXYxunits: {
            get: function () {
                return this._factory.specific(this, {name: 'overlayXY', transformer: NodeTransformers.attribute('xunits'), attribute: 'kmlOverlayXYxunits'});
            }
        },

        /**
         * Units in which the y value is specified. A value of "fraction" indicates the y value is a fraction of the
         * image. A value of "pixels" indicates the y value in pixels. A value of "insetPixels" indicates the indent
         * from the top edge of the image.
         * @memberof KmlScreenOverlay.prototype
         * @readonly
         * @type {String}
         */
        kmlOverlayXYyunits: {
            get: function () {
                return this._factory.specific(this, {name: 'overlayXY', transformer: NodeTransformers.attribute('yunits'), attribute: 'kmlOverlayXYyunits'});
            }
        },

        /**
         * Either the number of pixels, a fractional component of the screen, or a pixel inset indicating the x
         * component of a point on the screen.
         * @memberof KmlScreenOverlay.prototype
         * @readonly
         * @type {String}
         */
        kmlScreenXYx: {
            get: function () {
                return this._factory.specific(this, {name: 'screenXY', transformer: NodeTransformers.attribute('x'), attribute: 'kmlScreenXYx'});
            }
        },

        /**
         * Either the number of pixels, a fractional component of the screen, or a pixel inset indicating the y
         * component of a point on the screen.
         * @memberof KmlScreenOverlay.prototype
         * @readonly
         * @type {String}
         */
        kmlScreenXYy: {
            get: function () {
                return this._factory.specific(this, {name: 'screenXY', transformer: NodeTransformers.attribute('y'), attribute: 'kmlScreenXYy'});
            }
        },

        /**
         * Units in which the x value is specified. A value of "fraction" indicates the x value is a fraction of
         * the
         * screen. A value of "pixels" indicates the x value in pixels. A value of "insetPixels" indicates the
         * indent from the right edge of the screen.
         * @memberof KmlScreenOverlay.prototype
         * @readonly
         * @type {String}
         */
        kmlScreenXYxunits: {
            get: function () {
                return this._factory.specific(this, {name: 'screenXY', transformer: NodeTransformers.attribute('xunits'), attribute: 'kmlScreenXYxunits'});
            }
        },

        /**
         * Units in which the y value is specified. A value of fraction indicates the y value is a fraction of the
         * screen. A value of "pixels" indicates the y value in pixels. A value of "insetPixels" indicates the
         * indent from the top edge of the screen.
         * @memberof KmlScreenOverlay.prototype
         * @readonly
         * @type {String}
         */
        kmlScreenXYyunits: {
            get: function () {
                return this._factory.specific(this, {name: 'screenXY', transformer: NodeTransformers.attribute('yunits'), attribute: 'kmlScreenXYyunits'});
            }
        },

        /**
         * It decides by how much will be the screen overlay rotated in x direction
         * @memberof KmlScreenOverlay.prototype
         * @readonly
         * @type {String}
         */
        kmlRotationXYx: {
            get: function () {
                return this._factory.specific(this, {name: 'rotationXY', transformer: NodeTransformers.attribute('x'), attribute: 'kmlRotationXYx'});
            }
        },

        /**
         * It decides by how much will be the screen overlay rotated in y direction
         * @memberof KmlScreenOverlay.prototype
         * @readonly
         * @type {String}
         */
        kmlRotationXYy: {
            get: function () {
                return this._factory.specific(this, {name: 'rotationXY', transformer: NodeTransformers.attribute('y'), attribute: 'kmlRotationXYy'});
            }
        },

        /**
         * Units in which the x value is specified. A value of "fraction" indicates the x value is a fraction of
         * the
         * screen. A value of "pixels" indicates the x value in pixels. A value of "insetPixels" indicates the
         * indent from the right edge of the screen.
         * @memberof KmlScreenOverlay.prototype
         * @readonly
         * @type {String}
         */
        kmlRotationXYxunits: {
            get: function () {
                return this._factory.specific(this, {name: 'rotationXY', transformer: NodeTransformers.attribute('xunits'), attribute: 'kmlRotationXYxunits'});
            }
        },

        /**
         * Units in which the y value is specified. A value of fraction indicates the y value is a fraction of the
         * screen. A value of "pixels" indicates the y value in pixels. A value of "insetPixels" indicates the
         * indent from the top edge of the screen.
         * @memberof KmlScreenOverlay.prototype
         * @readonly
         * @type {String}
         */
        kmlRotationXYyunits: {
            get: function () {
                return this._factory.specific(this, {name: 'rotationXY', transformer: NodeTransformers.attribute('yunits'), attribute: 'kmlRotationXYyunits'});
            }
        },

        /**
         * A value of +-1 indicates to use the native dimension
         * A value of 0 indicates to maintain the aspect ratio
         * A value of n sets the value of the dimension
         * @memberof KmlScreenOverlay.prototype
         * @readonly
         * @type {String}
         */
        kmlSizex: {
            get: function () {
                return this._factory.specific(this, {name: 'size', transformer: NodeTransformers.attribute('x'), attribute: 'kmlSizex'});
            }
        },

        /**
         * A value of +-1 indicates to use the native dimension
         * A value of 0 indicates to maintain the aspect ratio
         * A value of n sets the value of the dimension
         * @memberof KmlScreenOverlay.prototype
         * @readonly
         * @type {String}
         */
        kmlSizey: {
            get: function () {
                return this._factory.specific(this, {name: 'size', transformer: NodeTransformers.attribute('y'), attribute: 'kmlSizey'});
            }
        },

        /**
         * Units in which the x value is specified. A value of "fraction" indicates the x value is a fraction of
         * the
         * screen. A value of "pixels" indicates the x value in pixels. A value of "insetPixels" indicates the
         * indent from the right edge of the screen.
         * @memberof KmlScreenOverlay.prototype
         * @readonly
         * @type {String}
         */
        kmlSizexunits: {
            get: function () {
                return this._factory.specific(this, {name: 'size', transformer: NodeTransformers.attribute('xunits'), attribute: 'kmlSizexunits'});
            }
        },

        /**
         * Units in which the y value is specified. A value of fraction indicates the y value is a fraction of the
         * screen. A value of "pixels" indicates the y value in pixels. A value of "insetPixels" indicates the
         * indent from the top edge of the screen.
         * @memberof KmlScreenOverlay.prototype
         * @readonly
         * @type {String}
         */
        kmlSizeyunits: {
            get: function () {
                return this._factory.specific(this, {name: 'size', transformer: NodeTransformers.attribute('yunits'), attribute: 'kmlSizeyunits'});
            }
        }
    });

	/**
     * @inheritDoc
     */
    KmlScreenOverlay.prototype.render = function(dc, kmlOptions) {
        KmlFeature.prototype.render.call(this, dc, kmlOptions);

        if(!this._renderable) {
            if(this.kmlIcon) {
                this._renderable = new ScreenImage(
                    new Offset(
                        this.kmlScreenXYxunits,
                        this.kmlScreenXYx,
                        this.kmlScreenXYyunits,
                        this.kmlScreenXYy
                    ),
                    this.kmlIcon.kmlHref(kmlOptions.fileCache)
                );
                this._renderable.imageOffset = new Offset(
                    this.kmlOverlayXYxunits,
                    this.kmlOverlayXYx,
                    this.kmlOverlayXYyunits,
                    this.kmlOverlayXYy
                );
                dc.redrawRequested = true;
            }
        }

        if(this._renderable) {
            this._renderable.render(dc);
        }
    };

    /**
     * @inheritDoc
     */
    KmlScreenOverlay.prototype.getTagNames = function () {
        return ['ScreenOverlay'];
    };

    KmlElements.addKey(KmlScreenOverlay.prototype.getTagNames()[0], KmlScreenOverlay);

    export default KmlScreenOverlay;
