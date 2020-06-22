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
import KmlElements from './KmlElements';
import KmlObject from './KmlObject';
import NodeTransformers from './util/KmlNodeTransformers';
    

    /**
     * Constructs an KmlLod. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from Kml file are read. This object is already concrete implementation.
     * @alias KmlLod
     * @classdesc Contains the data associated with Lod node.
     * @param options {Object}
     * @param options.objectNode {Node} Node representing lod in the document.
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#lod
     * @augments KmlObject
     */
    var KmlLod = function (options) {
        KmlObject.call(this, options);
    };

    KmlLod.prototype = Object.create(KmlObject.prototype);

    Object.defineProperties(KmlLod.prototype, {
        /**
         * Defines a square in screen space, with sides of the specified value in pixels. For example, 128 defines
         * a
         * square of 128 x 128 pixels. The region's bounding box must be larger than this square (and smaller than
         * the maxLodPixels square) in order for the Region to be active.
         *
         * More details are available in the Working with Regions chapter of the Developer's Guide, as well as the
         *  Google Earth Outreach documentation's Avoiding Overload with Regions tutorial.
         * @memberof KmlLod.prototype
         * @readonly
         * @type {Number}
         */
        kmlMinLodPixels: {
            get: function () {
                return this._factory.specific(this, {name: 'minLodPixels', transformer: NodeTransformers.number});
            }
        },

        /**
         * Measurement in screen pixels that represents the maximum limit of the visibility range for a given
         * Region. A value of -1, the default, indicates "active to infinite size."
         * @memberof KmlLod.prototype
         * @readonly
         * @type {Number}
         */
        kmlMaxLodPixels: {
            get: function () {
                return this._factory.specific(this, {name: 'maxLodPixels', transformer: NodeTransformers.number});
            }
        },

        /**
         * Distance over which the geometry fades, from fully opaque to fully transparent. This ramp value,
         * expressed in screen pixels, is applied at the minimum end of the LOD (visibility) limits.
         * @memberof KmlLod.prototype
         * @readonly
         * @type {Number}
         */
        kmlMinFadeExtent: {
            get: function () {
                return this._factory.specific(this, {name: 'minFadeExtent', transformer: NodeTransformers.number});
            }
        },

        /**
         * Distance over which the geometry fades, from fully transparent to fully opaque. This ramp value,
         * expressed in screen pixels, is applied at the maximum end of the LOD (visibility) limits.
         * @memberof KmlLod.prototype
         * @readonly
         * @type {Number}
         */
        kmlMaxFadeExtent: {
            get: function () {
                return this._factory.specific(this, {name: 'maxFadeExtent', transformer: NodeTransformers.number});
            }
        }
    });

    /**
     * @inheritDoc
     */
    KmlLod.prototype.getTagNames = function () {
        return ['Lod'];
    };

    KmlElements.addKey(KmlLod.prototype.getTagNames()[0], KmlLod);

    export default KmlLod;
