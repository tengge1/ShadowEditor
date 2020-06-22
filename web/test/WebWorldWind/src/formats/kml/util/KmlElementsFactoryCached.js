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
import KmlElementsFactory from './KmlElementsFactory';
import TreeKeyValueCache from './KmlTreeKeyValueCache';
import WWUtil from '../../../util/WWUtil';
    

    /**
     * More complex factory, which retrieves the values from cache and in case the value isn't present there it
     * stores the value in cache.
     * @constructor
     * @alias KmlElementsFactoryCached
     */
    var KmlElementsFactoryCached = function(options) {
        this.internalFactory = new KmlElementsFactory(options);
        this.cache = TreeKeyValueCache.applicationLevelCache();
    };

    /**
     * It adds caching functionality on top of the KmlElementsFactory all method.
     * @param element {KmlObject} Element whose children are considered
     * @returns {KmlObject[]} All objects among the elements children
     * @see KmlElementsFactory.prototype.all
     */
    KmlElementsFactoryCached.prototype.all = function(element){
        var parentNode = element.node;
        var children = this.cache.level(this.cacheKey(element.node, "All"));
        if (children) {
            var results = [];
            for(var key in children) {
                if(children.hasOwnProperty(key)) {
                    results.push(children[key]);
                }
            }
            return results;
        }

        var elements = this.internalFactory.all(element);

        if(elements && elements.length) {
            var self = this;
            elements.forEach(function (pElement) {
                self.cache.add(self.cacheKey(parentNode, "All"), self.cacheKey(pElement.node), pElement);
            });
        }
        return elements;
    };

    /**
     * It adds caching functionality on top of the KmlElementsFactory specific method.
     * @param element {KmlObject} Element whose children are considered
     * @param options {Object}
     * @param options.name {String} Name of the element to retrieve from the element
     * @param options.transformer {Function} Function returning correct value. It accepts the node and returns value.
     *  This mechanism can be used for the attributes as well.
     * @returns Relevant value.
     * @see KmlElementsFactory.prototype.specific
     */
    KmlElementsFactoryCached.prototype.specific = function(element, options){
        var parentNode = element.node;
        var name = options.name;
        if(options.attribute) {
            name = options.attribute + name;
        }
        var child = this.cache.value(this.cacheKey(parentNode), name);
        if (child) {
            return child;
        }

        var result = this.internalFactory.specific(element, options);
        if(result && result.node) {
            this.cache.add(this.cacheKey(parentNode), this.cacheKey(result.node), result);
        } else if(result) {
            this.cache.add(this.cacheKey(parentNode), name, result);
        }
        return result;
    };

    /**
     * It adds caching functionality on top of the KmlElementsFactory any method.
     * @param element {KmlObject} Element whose children are considered
     * @param options {Object}
     * @param options.name {String[]} Array of the names among which should be the one we are looking for.
     * @returns {KmlObject|null} KmlObject if there is one with the passed in name.
     * @see KmlElementsFactory.prototype.any
     */
    KmlElementsFactoryCached.prototype.any = function(element, options){
        var parentNode = element.node;

        var self = this;
        var child = null;
        var potentialChild;
        options.name.forEach(function(name){
            potentialChild = self.cache.value(self.cacheKey(parentNode), name);
            if(potentialChild) {
                child = potentialChild;
            }
        });
        if (child) {
            return child;
        }

        var result = this.internalFactory.any(element, options);

        if(result) {
            this.cache.add(self.cacheKey(parentNode), self.cacheKey(result.node), result);
        }
        return result;
    };

    /**
     * It creates cache key based on the node. In case the node doesn't have any id, it also creates id for this
     * element. This id is used for storing the value in the cache.
     * @param node {Node} Node for which generate the key.
     * @param prefix {String|undefined} Prefix for the level
     * @returns {String} Value representing the key.
     */
    KmlElementsFactoryCached.prototype.cacheKey = function(node, prefix) {
        var idAttribute = new Attribute(node, "id");
        if (!idAttribute.exists()) {
            idAttribute.save(WWUtil.guid());
        }
        var result = node.nodeName + "#" + idAttribute.value();
        if(prefix) {
            result = prefix + result;
        }
        return result;
    };

    var applicationWide = new KmlElementsFactoryCached();
    /**
     * It returns application wide instance of the factory.
     * @returns {KmlElementsFactoryCached} Singleton instance of factory for Application.
     */
    KmlElementsFactoryCached.applicationWide = function(){
        return applicationWide;
    };

    export default KmlElementsFactoryCached;
