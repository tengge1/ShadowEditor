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
import KmlColorStyle from './KmlColorStyle';
import KmlElements from './../KmlElements';
import NodeTransformers from '../util/KmlNodeTransformers';
    

    /**
     * Constructs an KmlLineStyle object.  Applications shouldn't use this constructor. It is used by
     * {@link KmlFile}. KmlLineStyle represents one line style.
     * @param options {Object}
     * @param options.objectNode {Node} Node representing this line style.
     * @constructor
     * @alias KmlLineStyle
     * @classdesc Class representing LineStyle element of KmlFile
     * @see https://developers.google.com/kml/documentation/kmlreference#linestyle
     * @augments KmlColorStyle
     */
    var KmlLineStyle = function (options) {
        KmlColorStyle.call(this, options);
    };

    KmlLineStyle.prototype = Object.create(KmlColorStyle.prototype);

    Object.defineProperties(KmlLineStyle.prototype, {
        /**
         * Width of the line in pixels.
         * @memberof KmlLineStyle.prototype
         * @readonly
         * @type {Number}
         */
        kmlWidth: {
            get: function() {
                return this._factory.specific(this, {name: 'width', transformer: NodeTransformers.number});
            }
        },

        /**
         * Color applied to outer width. Ignored by Polygon and LinearRing.
         * @memberof KmlLineStyle.prototype
         * @readonly
         * @type {String}
         */
        kmlOuterColor: {
            get: function() {
                return this._factory.specific(this, {name: 'gx:outerColor', transformer: NodeTransformers.string});
            }
        },

        /**
         * Value between 0.0 and 1.0 specifies the proportion of the line used by outerColor. Only applies to line
         * setting width with physical width.
         * @memberof KmlLineStyle.prototype
         * @readonly
         * @type {Number}
         */
        kmlOuterWidth: {
            get: function() {
                return this._factory.specific(this, {name: 'gx:outerWidth', transformer: NodeTransformers.number});
            }
        },

        /**
         * Physical width of the line in meters.
         * @memberof KmlLineStyle.prototype
         * @readonly
         * @type {Number}
         */
        kmlPhysicalWidth: {
            get: function() {
                return this._factory.specific(this, {name: 'gx:physicalWidth', transformer: NodeTransformers.number});
            }
        },

        /**
         * A boolean defining whether or not to display a text label on a LineString. A LineString's label is
         * contained in the &lt;name&gt; element that is a sibling of &lt;LineString&gt; (i.e. contained within the same
         * &lt;Placemark&gt; element).
         * @memberof KmlLineStyle.prototype
         * @readonly
         * @type {Boolean}
         */
        kmlLabelVisibility: {
            get: function() {
                return this._factory.specific(this, {name: 'gx:labelVisibility', transformer: NodeTransformers.boolean});
            }
        }
    });

    KmlLineStyle.update = function (style, options) {
        var shapeOptions = options || {};
        style = style || {};

        shapeOptions._outlineColor = style.kmlColor && Color.colorFromKmlHex(style.kmlColor) || Color.WHITE;
        shapeOptions._outlineWidth = style.kmlWidth || 10.0;

        return shapeOptions;
    };

    /**
     * @inheritDoc
     */
    KmlLineStyle.prototype.getTagNames = function () {
        return ['LineStyle'];
    };

    KmlElements.addKey(KmlLineStyle.prototype.getTagNames()[0], KmlLineStyle);

    export default KmlLineStyle;
