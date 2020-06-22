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
import Attribute from './KmlAttribute';
import KmlElements from '../KmlElements';
import Position from '../../../geom/Position';
import WWUtil from '../../../util/WWUtil';
    /**
     * Provides ways for transforming xml nodes to KML objects.
     * @exports KmlNodeTransformers
     */
    var KmlNodeTransformers = function(){};

    // Primitives
    /**
     * Transforms node to its String value.
     * @param node {Node} Node to transform
     * @returns {String} Text representation of node value.
     */
    KmlNodeTransformers.string = function (node) {
        return String(getTextOfNode(node));
    };

    /**
     * Transforms node to its Numeric value.
     * @param node {Node} Node to transform
     * @returns {Number} Numeric representation of node value.
     */
    KmlNodeTransformers.number = function (node) {
        return Number(getTextOfNode(node));
    };

    /**
     * Transforms node to its boolean value.
     * @param node {Node} Node to transform
     * @returns {Boolean} Boolean representation of node value.
     */
    KmlNodeTransformers.boolean = function (node) {
        return WWUtil.transformToBoolean(getTextOfNode(node));
    };

    /**
     * Transform node to the date
     * @param node {Node} Node to transform
     * @returns {Date} Date representing current node.
     */
    KmlNodeTransformers.date = function(node) {
        return WWUtil.date(getTextOfNode(node));
    };

    /**
     * This function retrieves the current value for node.
     * @param node {Node} Node for which we want to retrieve the value.
     * @returns {String} Text value of the node.
     */
    function getTextOfNode(node) {
        var result;
        if (node != null && node.childNodes[0]) {
            result = node.childNodes[0].nodeValue;
        } else if (node != null) {
            result = "";
        }
        return result;
    }
    // End of primitive transformers

    /**
     * This function retrieves relevant KmlObject to the Node. If there is such element it returns created element,
     * otherwise it returns null
     * @param node {Node} Node to transform
     * @param parent {KmlObject} Parent to current node.
     * @param controls {Array} Array of controls.
     * @returns {KmlObject|null} KmlObject representation for the node.
     */
    KmlNodeTransformers.kmlObject = function (node, parent, controls) {
        var nameOfElement = node.nodeName;
        var constructor = KmlElements.getKey(nameOfElement);
        if (!constructor) {
            return null;
        }
        return new constructor({objectNode: node, parent: parent, controls: controls});
    };

    /**
     * It takes the node and transforms it to the LinearRing this was created to solve the mismatch between name of the
     * element and type of the element.
     * @param node {Node} Node to transform
     * @param parent {KmlObject} Parent to current node.
     * @param controls {Array} Array of controls.
     * @returns {KmlLinearRing} Transformed Linear Ring.
     */
    KmlNodeTransformers.linearRing = function(node, parent, controls) {
        var constructor = KmlElements.getKey("LinearRing");
        if (!constructor) {
            return null;
        }
        var linearRingNode = null;
        Array.prototype.forEach.call(node.childNodes, function(pNode){
            if(pNode.nodeName.toUpperCase() == "LinearRing".toUpperCase()) {
                linearRingNode = pNode;
            }
        });
        return new constructor({objectNode: linearRingNode, parent: parent, controls: controls});
    };

    /**
     * It takes the node and returns al positions included in it.
     * @param node {Node} Node to transform
     * @returns {Position[]} All included positions. Positions are separated by space.
     */
    KmlNodeTransformers.positions = function(node) {
        var positions = [];
        var coordinates = getTextOfNode(node).trim().replace(/\s+/g, ' ').split(' ');
        coordinates.forEach(function (pCoordinates) {
            pCoordinates = pCoordinates.split(',');
            positions.push(new Position(Number(pCoordinates[1]), Number(pCoordinates[0]), Number(pCoordinates[2] || 0)));
        });
        return positions;
    };

    /**
     * This transforming function works with attributes.
     * @param name {String} Name of the attribute to retrieve.
     * @returns {Function} Transformer function.
     */
    KmlNodeTransformers.attribute = function(name) {
        return function(node) {
            return new Attribute(node, name).value();
        };
    };
    
    export default KmlNodeTransformers;
