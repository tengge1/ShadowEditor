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

    

    //noinspection UnnecessaryLocalVariableJS
    /**
     * Map representing the available Elements. This is solution to circular dependency when
     * parsing some of the elements may be dependent on elements, in which they may be present.
     * Like MultiGeometry present inside of some of the Geometries.
     * @exports KmlElements
     */
    var KmlElements =  {
        /**
         * Internal storage for all key-values pairs
         */
        keys: {},

        /**
         * Adds key representing name of the node and constructor to be used.
         * @param key {String} Name of the node, by which it is retrieved. Name is case sensitive.
         * @param value {KmlObject} Value represent constructor function to be instantiated
         */
        addKey: function (key, value) {
            this.keys[key] = value;
        },

        /**
         * Returns constructor function to be instantiated.
         * @param key {String} Name of the node.
         * @returns {*} Constructor function to be instantiated.
         */
        getKey: function (key) {
            return this.keys[key];
        }
    };

    export default KmlElements;
