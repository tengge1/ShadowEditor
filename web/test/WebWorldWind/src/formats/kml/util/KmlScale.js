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
import KmlObject from '../KmlObject';
import NodeTransformers from './KmlNodeTransformers';
    

    /**
     * Constructs a KmlScale. Application usually don't call this constructor. It is called by {@link KmlFile} as
     * Objects from KmlFile are read. It is concrete implementation.
     * @alias KmlScale
     * @constructor
     * @classdesc Contains the data associated with Kml KmlScale
     * @param options {Object}
     * @param options.objectNode {Node} Node representing the Kml KmlScale
     * @throws {ArgumentError} If either the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#scale
     * @augments KmlObject
     */
    var KmlScale = function (options) {
        KmlObject.call(this, options);
    };

    KmlScale.prototype = Object.create(KmlObject.prototype);

    Object.defineProperties(KmlScale.prototype, {
        /**
         * Scales model along x axis
         * @memberof KmlScale.prototype
         * @readonly
         * @type {Number}
         */
        kmlX: {
            get: function() {
                return this._factory.specific(this, {name: 'x', transformer: NodeTransformers.number});
            }
        },

        /**
         * Scales model along y axis
         * @memberof KmlScale.prototype
         * @readonly
         * @type {Number}
         */
        kmlY: {
            get: function() {
                return this._factory.specific(this, {name: 'y', transformer: NodeTransformers.number});
            }
        },

        /**
         * Scales model along z axis
         * @memberof KmlScale.prototype
         * @readonly
         * @type {Number}
         */
        kmlZ: {
            get: function() {
                return this._factory.specific(this, {name: 'z', transformer: NodeTransformers.number});
            }
        }
    });

    /**
     * @inheritDoc
     */
    KmlScale.prototype.getTagNames = function () {
        return ['Scale'];
    };

    KmlElements.addKey(KmlScale.prototype.getTagNames()[0], KmlScale);

    export default KmlScale;

