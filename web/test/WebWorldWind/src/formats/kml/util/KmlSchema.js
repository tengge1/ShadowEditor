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
    
    /**
     * Constructs an KmlSchema. Application usually don't call this constructor. It is called by {@link KmlFile} as
     * Objects from KmlFile are read. It is concrete implementation.
     * @alias KmlSchema
     * @constructor
     * @classdesc Contains the data associated with Kml KmlSchema
     * @param options {Object}
     * @param options.objectNode {Node} Node representing the Kml KmlSchema.
     * @throws {ArgumentError} If either the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#itemicon
     * @augments KmlObject
     */
    var KmlSchema = function (options) {
        KmlObject.call(this, options);
    };

    KmlSchema.prototype = Object.create(KmlObject.prototype);

    /**
     * @inheritDoc
     */
    KmlSchema.prototype.getTagNames = function () {
        return ['Schema'];
    };

    KmlElements.addKey(KmlSchema.prototype.getTagNames()[0], KmlSchema);

    export default KmlSchema;
