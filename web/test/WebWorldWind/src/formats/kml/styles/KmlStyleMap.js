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
import Pair from '../util/KmlPair';
import Promise from '../../../util/Promise';
    
    /**
     * Constructs an KmlStyleMap. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from Kml file are read. This object is already concrete implementation.
     * @alias KmlStyleMap
     * @classdesc Contains the data associated with StyleMap node.
     * @param node {Node} Node representing style map in the document.
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#stylemap
     * @augments KmlSubStyle
     */
    var KmlStyleMap = function (node) {
        KmlSubStyle.call(this, node);
    };

    KmlStyleMap.prototype = Object.create(KmlSubStyle.prototype);

    Object.defineProperties(KmlStyleMap.prototype, {
        /**
         * Defines a key/value pair that maps a mode (normal or highlight) to the predefined &lt;styleUrl&gt;.
         * &lt;Pair&gt;
         * contains two elements (both are required):
         * &lt;key&gt;, which identifies the key
         * &lt;styleUrl&gt; or &lt;Style&gt;, which references the style. In &lt;styleUrl&gt;, for referenced style elements that are
         *  local to the KML document, a simple # referencing is used. For styles that are contained in external
         * files, use a full URL along with # referencing.
         * @memberof KmlStyleMap.prototype
         * @readonly
         * @type {Pair[]}
         */
        kmlPairs: {
            get: function () {
                return this._factory.all(this);
            }
        },

        isMap: {
            get: function() {
                return true;
            }
        }
    });

    /**
     * Resolve the information from style map and create the options with normal and highlight.
     * @param styleResolver {StyleResolver} Resolver used to handle the potential remoteness of the style. The style
     *   itself can be located in any file.
     * @return {Promise} Promise of the resolved style.
     */
    KmlStyleMap.prototype.resolve = function(styleResolver) {
        // Create promise which resolves, when all styles are resolved.
        var results = {};
        var promises = this.kmlPairs.map(function(pair) {
            var key = pair.kmlKey;
            return pair.getStyle(styleResolver).then(function(pStyle){
                results[key] = pStyle.normal;
            });
        });

        return Promise.all(promises).then(function(){
            if(!results['normal']){
                results['normal'] = null;
            }

            if(!results['highlight']){
                results['highlight'] =  null;
            }

            return results;
        });
    };

    /**
     * @inheritDoc
     */
    KmlStyleMap.prototype.getTagNames = function() {
        return ['StyleMap'];
    };

    KmlElements.addKey(KmlStyleMap.prototype.getTagNames()[0], KmlStyleMap);

    export default KmlStyleMap;
