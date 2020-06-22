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
import KmlSubStyle from './KmlSubStyle';
import NodeTransformers from '../util/KmlNodeTransformers';
    
    /**
     * Constructs an KmlColorStyle. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from KmlFiles are read. This object is abstract. Only its descendants are instantiating it.
     * @alias KmlColorStyle
     * @classdesc Contains the data associated with ColorStyle node
     * @param options {Object}
     * @param options.objectNode {Node}  Node representing ColorStyle from Kml document
     * @constructor
     * @throws {ArgumentError} If the node is null.
     * @see https://developers.google.com/kml/documentation/kmlreference#colorstyle
     * @augments KmlSubStyle
     */
    var KmlColorStyle = function (options) {
        KmlSubStyle.call(this, options);
    };

    KmlColorStyle.prototype = Object.create(KmlSubStyle.prototype);

    Object.defineProperties(KmlColorStyle.prototype, {
        /**
         * Color, which should be used. Shapes supporting colored styles must correctly apply the
         * color.
         * @memberof KmlColorStyle.prototype
         * @readonly
         * @type {String}
         */
        kmlColor: {
            get: function() {
                return this._factory.specific(this, {name: 'color', transformer: NodeTransformers.string});
            }
        },

        /**
         * Either normal or random. Normal means applying of the color as stated. Random applies linear scale based
         * on the color. More on https://developers.google.com/kml/documentation/kmlreference#colorstyle
         * @memberof KmlColorStyle.prototype
         * @readonly
         * @type {String}
         */
        kmlColorMode: {
            get: function() {
                return this._factory.specific(this, {name: 'colorMode', transformer: NodeTransformers.string});
            }
        }
    });

    /**
     * @inheritDoc
     */
    KmlColorStyle.prototype.getTagNames = function () {
        return ['LineStyle', 'PolyStyle', 'IconStyle', 'LabelStyle'];
    };

    export default KmlColorStyle;
