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
import NodeTransformers from './KmlNodeTransformers';
    

    /**
     * Simple factory, which understands the mapping between the XML and the internal Elements.
     * @constructor
     * @alias KmlElementsFactory
     * @params options {Object}
     * @params options.controls {Control[]} Defaults to empty array
     */
    var KmlElementsFactory = function (options) {
        this.options = options || {};
        this.options.controls = this.options.controls || [];
    };

    /**
     * It retrieves specific child of the element. This one can retrieve primitive as well as KmlObject. Transformer
     * is used to get relevant value from the node.
     * @param element {KmlObject} Element whose children are considered.
     * @param options {Object}
     * @param options.name {String} Name of the element to retrieve from the element
     * @param options.transformer {Function} Function returning correct value. It accepts the node and returns value.
     *  This mechanism can be used for the attributes as well.
     * @return Relevant value.
     */
    KmlElementsFactory.prototype.specific = function (element, options) {
        var parentNode = element.node;
        var result = null;
        var self = this;
        [].forEach.call(parentNode.childNodes, function (node) {
            if (node.nodeName == options.name) {
                result = options.transformer(node, element, self.options.controls);
            }
        });
        return result;
    };

    /**
     * It returns child which is among the ones in the options.name. It is meant to be used when any descendant is
     * accepted.
     * @param element {KmlObject} Element whose children are scanned.
     * @param options {Object}
     * @param options.name {String[]} All names which are accepted to return.
     * @return {KmlObject} Kml representation of given node
     */
    KmlElementsFactory.prototype.any = function (element, options) {
        var parentNode = element.node;

        var result = null;
        var self = this;
        [].forEach.call(parentNode.childNodes, function (node) {
            if (options.name.indexOf(node.nodeName) != -1) {
                result = NodeTransformers.kmlObject(node, element, self.options.controls);
            }
        });
        return result;
    };

    /**
     * It returns all children, which it is possible to map on the KmlObject.
     * @param element {KmlObject} Element whose children we want to retrieve.
     * @return {KmlObject[]} All KmlObjects present in given node.
     */
    KmlElementsFactory.prototype.all = function (element) {
        var parentNode = element.node;
        
        var results = [];
        var self = this;
        [].forEach.call(parentNode.childNodes, function (node) {
            var createdElement = NodeTransformers.kmlObject(node, element, self.options.controls);
            if (createdElement) {
                results.push(createdElement);
            }
        });
        return results;
    };

    var applicationWide = new KmlElementsFactory();
    /**
     * It returns application wide instance of the factory.
     * @returns {KmlElementsFactory} Singleton instance of factory for Application.
     */
    KmlElementsFactory.applicationWide = function () {
        return applicationWide;
    };

    export default KmlElementsFactory;
