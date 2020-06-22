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
     * This class represents abstraction for KmlAttribute. It is possible to test its existence, retrieve value and set
     * value.
     * @alias KmlAttribute
     * @param node {Node} Node on which the attribute exists
     * @param name {String} Name of the attribute
     * @constructor
     */
    var KmlAttribute = function(node, name) {
        this.node = node;
        this.name = name;
    };

    /**
     * It returns value of the attribute. If the attribute doesn't exists it returns null.
     * @returns {String|null}
     */
    KmlAttribute.prototype.value = function(){
        return (this.node.attributes && this.node.attributes.getNamedItem(this.name)&&
            this.node.attributes.getNamedItem(this.name).value) || null;
    };

    /**
     * It returns true if there exists attribute with given name.
     * @returns {boolean}
     */
    KmlAttribute.prototype.exists = function() {
        return this.value() != null;
    };

    /**
     * Value which should be set to the attribute. 
     * @param value {String}
     */
    KmlAttribute.prototype.save = function(value) {
        this.node.setAttribute(this.name, value);
    };

    export default KmlAttribute;
