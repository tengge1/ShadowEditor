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
import KmlFeature from './KmlFeature';
    

    /**
     * Constructs an KmlTour. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from Kml file are read. This object is already concrete implementation.
     * @alias KmlTour
     * @classdesc Contains the data associated with Tour node.
     * @param options {Object}
     * @param options.objectNode {Node} Node representing Tour.
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#gxtour
     * @augments KmlFeature
     */
    var KmlTour = function (options) {
        KmlFeature.call(this, options);
    };

    KmlTour.prototype = Object.create(KmlFeature.prototype);

    /**
     * @inheritDoc
     */
    KmlTour.prototype.getTagNames = function () {
        return ['gx:Tour'];
    };

    KmlElements.addKey(KmlTour.prototype.getTagNames()[0], KmlTour);

    export default KmlTour;
