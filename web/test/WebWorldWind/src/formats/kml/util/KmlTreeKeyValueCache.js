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
import WWUtil from '../../../util/WWUtil';
    

    /**
     * Cache working on a basic principle of storing the data as a pair of key, value. Currently the values are
     * never invalidated.
     * @alias KmlTreeKeyValueCache
     * @constructor
     * @classdesc Represents internally used cache which stores data in a tree like structure.
     */
    var KmlTreeKeyValueCache = function() {
        this.map = {};
    };

	/**
     * Adds new element to the cache. It accepts level, key and value in order
     * @param level {Object} Anything that can be used as a key in JavaScript object
     * @param key {Object} Anything that can be used as a key in JavaScript object
     * @param value {Object} The value to be stored in the cache on given level and value. Value must started with #
     */
    KmlTreeKeyValueCache.prototype.add = function(level, key, value){
        if(!this.map[level]) {
            this.map[level] = {};
        }
        this.map[level][key] = value;
    };

	/**
     * It returns value for key stored at certain level. If there is no such level, it returns null. If there is such leave then the key starting with # gets treated a bit differently.
     * @param level {Object} Anything that can be used as a key in JavaScript object
     * @param key {Object} Anything that can be used as a key in JavaScript object
     * @returns {Object|null}
     */
    KmlTreeKeyValueCache.prototype.value = function(level, key) {
        if(!this.map[level]){
            return null;
        }
        if(key.indexOf("#") == -1) {
            var currentLevel = this.level(level);
            for(var keyFromLevel in currentLevel) {
                if(!currentLevel.hasOwnProperty(keyFromLevel)){
                    continue;
                }

                if(WWUtil.startsWith(keyFromLevel, key)){
                    return currentLevel[keyFromLevel];
                }
            }
        }
        return this.map[level][key] || null;
    };

	/**
     * It returns the whole level of the data. If there is none then undefined is returned.
     * @param level {Object} Anything that can be used as a key in JavaScript object
     * @returns {Object|null}
     */
    KmlTreeKeyValueCache.prototype.level = function(level) {
        return this.map[level];
    };

	/**
     * It removes the data from the map if such data exists.
     * @param level {Object} Anything that can be used as a key in JavaScript object
     * @param key {Object} Anything that can be used as a key in JavaScript object
     */
    KmlTreeKeyValueCache.prototype.remove = function(level, key) {
        delete this.map[level][key];
    };

    var applicationLevelCache = new KmlTreeKeyValueCache();
    KmlTreeKeyValueCache.applicationLevelCache = function() {
        return applicationLevelCache;
    };

    export default KmlTreeKeyValueCache;
