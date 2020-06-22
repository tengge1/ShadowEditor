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
     * Constructs an KmlPolyStyle. Application usually don't call this constructor. It is called by {@link KmlFile} as
     * Objects from KmlFile are read. It is concrete implementation.
     * @alias KmlPolyStyle
     * @constructor
     * @classdesc Contains the data associated with Kml poly style
     * @param options {Object}
     * @param options.objectNode {Node} Node representing the Kml poly style.
     * @throws {ArgumentError} If either the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#polystyle
     * @augments KmlColorStyle
     */
    var KmlPolyStyle = function (options) {
        KmlColorStyle.call(this, options);
    };

    KmlPolyStyle.prototype = Object.create(KmlColorStyle.prototype);

    Object.defineProperties(KmlPolyStyle.prototype, {
        /**
         * If true the polygon's surface will be filled with color
         * @memberof KmlPolyStyle.prototype
         * @readonly
         * @type {Boolean}
         */
        kmlFill: {
            get: function(){
                return this._factory.specific(this, {name: 'fill', transformer: NodeTransformers.boolean});
            }
        },

        /**
         * Specifies whether outline polygon. Outline style is defined by line style if present.
         * @memberof KmlPolyStyle.prototype
         * @readonly
         * @type {Boolean}
         */
        kmlOutline: {
            get: function(){
                return this._factory.specific(this, {name: 'outline', transformer: NodeTransformers.boolean});
            }
        }
    });


    KmlPolyStyle.update = function (style, options) {
        style = style || {};
        var shapeOptions = options || {};
        shapeOptions._drawInterior = style.kmlFill || true;
        shapeOptions._drawOutline = style.kmlOutline || false;
        shapeOptions._outlineColor = options._outlineColor || Color.WHITE;
        shapeOptions._interiorColor = style.kmlColor && Color.colorFromKmlHex(style.kmlColor) || Color.WHITE;
        shapeOptions._colorMode = style.kmlColorMode || 'normal'; // TODO Not yet supported.

        return shapeOptions;
    };

    /**
     * @inheritDoc
     */
    KmlPolyStyle.prototype.getTagNames = function () {
        return ['PolyStyle'];
    };

    KmlElements.addKey(KmlPolyStyle.prototype.getTagNames()[0], KmlPolyStyle);

    export default KmlPolyStyle;
