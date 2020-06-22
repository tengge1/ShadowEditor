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
/**
 * @exports KmlTimePrimitive
 */
import KmlObject from './KmlObject';
    
    /**
     * Constructs an KmlTimePrimitive. Applications usually don't call this constructor. It is called by {@link KmlFile}
     * as objects from KmlFile are read.
     * @alias KmlTimePrimitive
     * @classdesc It is ancestor for all TimePrimitives - TimeSpan and TimeStamp
     * @param options {Object}
     * @param options.objectNode {Node} Node representing Kml TimePrimitive.
     * @constructor
     * @see https://developers.google.com/kml/documentation/kmlreference#timeprimitive
     * @augments KmlObject
     */
    var KmlTimePrimitive = function (options) {
        KmlObject.call(this, options);
    };

    KmlTimePrimitive.prototype = Object.create(KmlObject.prototype);

    /**
     * It returns range applicable to current time.
     * @returns {{from: Date, to: Date}}
     */
    KmlTimePrimitive.prototype.timeRange = function() {
        var from, to;
        if(this.kmlBegin) {
            to = from = this.kmlBegin.valueOf();
        }
        if(this.kmlEnd) {
            to = this.kmlEnd.valueOf();
            if(!from) {
                from = to;
            }
        }

        if(this.kmlWhen) {
            to = from = this.kmlWhen.valueOf();
        }

        return {
            from: from,
            to: to
        };
    };

    /**
     * @inheritDoc
     */
    KmlTimePrimitive.prototype.getTagNames = function () {
        return ['TimeSpan', 'TimeStamp'];
    };

    export default KmlTimePrimitive;
