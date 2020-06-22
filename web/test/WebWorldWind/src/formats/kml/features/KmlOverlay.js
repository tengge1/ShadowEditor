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
import KmlFeature from './KmlFeature';
import KmlIcon from './../KmlIcon';
import NodeTransformers from '../util/KmlNodeTransformers';
    

    /**
     * Constructs an KmlOverlay. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from Kml file are read. This object is already concrete implementation.
     * @alias KmlOverlay
     * @classdesc Contains the data associated with Overlay node.
     * @param options {Object}
     * @param options.objectNode {Node} Node representing Overlay
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#overlay
     * @augments KmlFeature
     */
    var KmlOverlay = function (options) {
        KmlFeature.call(this, options);
    };

    KmlOverlay.prototype = Object.create(KmlFeature.prototype);

    Object.defineProperties(KmlOverlay.prototype, {
        /**
         * Color values are expressed in hexadecimal notation, including opacity (alpha) values. The order of
         * expression is alpha, blue, green, red (aabbggrr). The range of values for any one color is 0 to 255 (00
         * to ff). For opacity, 00 is fully transparent and ff is fully opaque. For example, if you want to apply a
         * blue color with
         * 50 percent opacity to an overlay, you would specify the following: &lt;color&gt;7fff0000&lt;/color&gt;
         * @memberof KmlOverlay.prototype
         * @readonly
         * @type {String}
         */
        kmlColor: {
            get: function() {
                return this._factory.specific(this, {name: 'color', transformer: NodeTransformers.string});
            }
        },

        /**
         * This element defines the stacking order for the images in overlapping overlays. Overlays with higher
         * &lt;drawOrder&gt; values are drawn on top of overlays with lower &lt;drawOrder&gt; values.
         * @memberof KmlOverlay.prototype
         * @readonly
         * @type {Number}
         */
        kmlDrawOrder: {
            get: function() {
                return this._factory.specific(this, {name: 'drawOrder', transformer: NodeTransformers.string});
            }
        },

        /**
         * Defines the image associated with the Overlay. The &lt;href&gt; element defines the location of the image to
         * be
         * used as the Overlay. This location can be either on a local file system or on a web server. If this
         * element is omitted or contains no &lt;href&gt;, a rectangle is drawn using the color and size defined by the
         * ground or screen overlay.
         * @memberof KmlOverlay.prototype
         * @readonly
         * @type {KmlIcon}
         */
        kmlIcon: {
            get: function(){
                return this._factory.any(this, {
                    name: KmlIcon.prototype.getTagNames()
                });
            }
        }
    });

    /**
     * @inheritDoc
     */
    KmlOverlay.prototype.getTagNames = function () {
        return ['PhotoOverlay', 'ScreenOverlay', 'GroundOverlay'];
    };

    export default KmlOverlay;
