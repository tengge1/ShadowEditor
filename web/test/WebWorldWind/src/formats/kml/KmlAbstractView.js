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
import KmlObject from './KmlObject';
import KmlElements from './KmlElements';
import KmlTimePrimitive from './KmlTimePrimitive';
    // TODO Fix to use current implementations.
    
    /**
     * Constructs an KmlAbstractView. Applications usually don't call this constructor. It is called by {@link KmlFile}
     * as objects from Kml file are read. This object is already concrete implementation.
     * @alias KmlAbstractView
     * @classdesc Contains the data associated with AbstractView node.
     * @param options {Object}
     * @param options.objectNode {Node} Node representing abstract view in the document.
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#abstractview
     * @augments KmlObject
     */
    var KmlAbstractView = function (options) {
        KmlObject.call(this, options);
    };

    KmlAbstractView.prototype = Object.create(KmlObject.prototype);

    Object.defineProperties(KmlAbstractView.prototype, {
        /**
         * Time associated with current view. It shouldn't be displayed outside of this time frame.
         * @memberof KmlAbstractView.prototype
         * @readonly
         * @type {KmlTimePrimitive}
         */
        kmlTimePrimitive: {
            get: function() {
                return this._factory.any(this, {
                    name: KmlTimePrimitive.prototype.getTagNames()
                });
            }
        }
    });

    /**
     * @inheritDoc
     */
    KmlAbstractView.prototype.getTagNames = function () {
        return ['Camera', 'LookAt'];
    };

    export default KmlAbstractView;
