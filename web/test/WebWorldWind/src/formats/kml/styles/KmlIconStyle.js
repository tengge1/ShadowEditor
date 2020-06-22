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
import KmlColorStyle from './KmlColorStyle';
import KmlElements from './../KmlElements';
import KmlIcon from '../KmlIcon';
import NodeTransformers from '../util/KmlNodeTransformers';
    
    /**
     * Constructs an KmlIconStyle. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from KmlFile are read. This object is already concrete implementation.
     * @alias KmlIconStyle
     * @classdesc Contains the data associated with IconStyle node
     * @param options {Object}
     * @param options.objectNode {Node} Node representing IconStyle in the document.
     * @returns {KmlIconStyle}
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined
     * @see https://developers.google.com/kml/documentation/kmlreference#iconstyle
     * @augments KmlColorStyle
     */
    var KmlIconStyle = function (options) {
        KmlColorStyle.call(this, options);
    };

    KmlIconStyle.prototype = Object.create(KmlColorStyle.prototype);

    Object.defineProperties(KmlIconStyle.prototype, {
        /**
         * Scale in which to resize the icon.
         * @memberof KmlIconStyle.prototype
         * @readonly
         * @type {Number}
         */
        kmlScale: {
            get: function () {
                return this._factory.specific(this, {name: 'scale', transformer: NodeTransformers.number});
            }
        },

        /**
         * Direction in degrees of the icon.
         * @memberof KmlIconStyle.prototype
         * @readonly
         * @type {Number}
         */
        kmlHeading: {
            get: function () {
                return this._factory.specific(this, {name: 'heading', transformer: NodeTransformers.number});
            }
        },

        /**
         * Custom Icon. If the icon is part of the IconStyle, only href is allowed for the icon.
         * @memberof KmlIconStyle.prototype
         * @readonly
         * @type {KmlIcon}
         */
        kmlIcon: {
            get: function () {
                return this._factory.any(this, {
                    name: KmlIcon.prototype.getTagNames()
                });
            }
        },

        /**
         * Either the number of pixels, a fractional component of the icon, or a pixel inset indicating the x
         * component of a point on the icon.
         * @memberof KmlIconStyle.prototype
         * @readonly
         * @type {String}
         */
        kmlHotSpotX: {
            get: function () {
                return this._factory.specific(this, {name: 'hotSpot', transformer: NodeTransformers.attribute('x')});
            }
        },

        /**
         * Either the number of pixels, a fractional component of the icon, or a pixel inset indicating the y
         * component of a point on the icon.
         * @memberof KmlIconStyle.prototype
         * @readonly
         * @type {String}
         */
        kmlHotSpotY: {
            get: function () {
                return this._factory.specific(this, {name: 'hotSpot', transformer: NodeTransformers.attribute('y')});
            }
        },

        /**
         * Units in which the x value is specified. A value of fraction indicates the x value is a fraction of the
         * icon. A value of pixels indicates the x value in pixels. A value of insetPixels indicates the indent from
         * the right edge of the icon.
         * @memberof KmlIconStyle.prototype
         * @readonly
         * @type {String}
         */
        kmlHotSpotXUnits: {
            get: function () {
                return this._factory.specific(this, {name: 'hotSpot', transformer: NodeTransformers.attribute('xunits')});
            }
        },

        /**
         * Units in which the y value is specified. A value of fraction indicates the y value is a fraction of the
         * icon. A value of pixels indicates the y value in pixels. A value of insetPixels indicates the indent from
         * the top edge of the icon.
         * @memberof KmlIconStyle.prototype
         * @readonly
         * @type {String}
         */
        kmlHotSpotYUnits: {
            get: function () {
                return this._factory.specific(this, {name: 'hotSpot', transformer: NodeTransformers.attribute('yunits')});
            }
        }
    });

    KmlIconStyle.update = function(style, options, fileCache) {
        style = style || {};
        var shapeOptions = options || {};

        shapeOptions._imageScale = style.kmlScale || 1;
        shapeOptions._imageSource = style.kmlIcon && style.kmlIcon.kmlHref(fileCache) || null;

        return shapeOptions;
    };

    /**
     * @inheritDoc
     */
    KmlIconStyle.prototype.getTagNames = function () {
        return ['IconStyle'];
    };

    KmlElements.addKey(KmlIconStyle.prototype.getTagNames()[0], KmlIconStyle);

    export default KmlIconStyle;
