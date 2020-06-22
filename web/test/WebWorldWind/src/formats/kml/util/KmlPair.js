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
import KmlStyleSelector from '../styles/KmlStyleSelector';
import NodeTransformers from './KmlNodeTransformers';
    

    /**
     * Constructs a KmlPair. Application usually don't call this constructor. It is called by {@link KmlFile} as
     * Objects from KmlFile are read. It is concrete implementation.
     * @alias KmlPair
     * @constructor
     * @classdesc Contains the data associated with Kml KmlPair
     * @param options {Object}
     * @param options.objectNode {Node} Node representing the Kml KmlPair.
     * @throws {ArgumentError} If either the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#pair
     * @augments KmlObject
     */
    var KmlPair = function (options) {
        KmlObject.call(this, options);
    };

    KmlPair.prototype = Object.create(KmlObject.prototype);

    Object.defineProperties(KmlPair.prototype, {
        /**
         * Identifies the key
         * @memberof KmlPair.prototype
         * @readonly
         * @type {String}
         */
        kmlKey: {
            get: function() {
                return this._factory.specific(this, {name: 'key', transformer: NodeTransformers.string});
            }
        },

        /**
         * References the style using Url. If part of the same document start with the prefix #
         * @memberof KmlPair.prototype
         * @readonly
         * @type {String}
         */
        kmlStyleUrl: {
            get: function() {
                return this._factory.specific(this, {name: 'styleUrl', transformer: NodeTransformers.string});
            }
        },

        /**
         * Definition of styles applied to this KmlPair.
         * @memberof KmlPair.prototype
         * @readonly
         * @type {KmlStyle}
         */
        kmlStyleSelector: {
            get: function() {
                return this._factory.any(this, {
                    name: KmlStyleSelector.prototype.getTagNames()
                });
            }
        }
    });

    /**
     * @inheritDoc
     */
    KmlPair.prototype.getTagNames = function () {
        return ['Pair'];
    };

    /**
     * @inheritDoc
     */
    KmlPair.prototype.getStyle = function(styleResolver) {
        return styleResolver.handleRemoteStyle(this.kmlStyleUrl, this.kmlStyleSelector);
    };

    KmlElements.addKey(KmlPair.prototype.getTagNames()[0], KmlPair);

    export default KmlPair;
