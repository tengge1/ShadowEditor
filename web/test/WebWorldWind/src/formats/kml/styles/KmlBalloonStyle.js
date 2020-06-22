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
import KmlElements from '../KmlElements';
import KmlSubStyle from './KmlSubStyle';
import NodeTransformers from '../util/KmlNodeTransformers';
    
    /**
     * Constructs an KmlBalloonStyle. Applications usually don't call this constructor. It is called by {@link KmlFile}
     * as objects from KmlFile are read. This object is already concrete implementation.
     * @alias KmlBalloonStyle
     * @classdesc Contains the data associated with BalloonStyle node
     * @param options {Object}
     * @param options.objectNode {Node} Node representing BalloonStyle
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined
     * @see https://developers.google.com/kml/documentation/kmlreference#balloonstyle
     * @augments KmlSubStyle
     */
    var KmlBalloonStyle = function (options) {
        KmlSubStyle.call(this, options);
    };

    KmlBalloonStyle.prototype = Object.create(KmlSubStyle.prototype);

    Object.defineProperties(KmlBalloonStyle.prototype, {
        /**
         * Represents background color of the balloon. It expects hexadecimal notation without #.
         * @memberof KmlBalloonStyle.prototype
         * @readonly
         * @type {String}
         */
        kmlBgColor: {
            get: function(){
                return this._factory.specific(this, {name: 'bgColor', transformer: NodeTransformers.string});
            }
        },

        /**
         * Represents color of the text in the balloon. It expects hexadecimal notation without #.
         * @memberof KmlBalloonStyle.prototype
         * @readonly
         * @type {String}
         */
        kmlTextColor: {
            get: function() {
                return this._factory.specific(this, {name: 'textColor', transformer: NodeTransformers.string});
            }
        },

        /**
         * Text which should be displayed in the balloon, otherwise feature name and description is displayed.
         * @memberof KmlBalloonStyle.prototype
         * @readonly
         * @type {String}
         */
        kmlText: {
            get: function(){
                return this._factory.specific(this, {name: 'text', transformer: NodeTransformers.string});
            }
        },

        /**
         * Either display or hide. When hide don't show the balloon at all.
         * @memberof KmlBalloonStyle.prototype
         * @readonly
         * @type {String}
         */
        kmlDisplayMode: {
            get: function() {
                return this._factory.specific(this, {name: 'displayMode', transformer: NodeTransformers.string});
            }
        }
    });

    KmlBalloonStyle.update = function(){

    };

    /**
     * @inheritDoc
     */
    KmlBalloonStyle.prototype.getTagNames = function() {
        return ['BalloonStyle'];
    };

    KmlElements.addKey(KmlBalloonStyle.prototype.getTagNames()[0], KmlBalloonStyle);

    export default KmlBalloonStyle;
