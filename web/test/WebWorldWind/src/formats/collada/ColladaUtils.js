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

import Logger from '../../util/Logger';
    

    /**
     * Provides utilities for the ColladaLoader.
     * @exports ColladaUtils
     */
    var ColladaUtils = {

        /**
         * Packs data from a node in an array.
         * Internal. Applications should not call this function.
         * @param {Node} xmlNode A node from which to extract values.
         */
        getRawValues: function (xmlNode) {
            if (!xmlNode) {
                return null;
            }

            var text = xmlNode.textContent;
            text = text.replace(/\n/gi, " ");
            text = text.replace(/\s+/gi, " ");
            text = text.trim();

            if (text.length === 0) {
                return null;
            }

            return text.split(" ");
        },

        /**
         * Packs data from a node as a Float32Array.
         * Internal. Applications should not call this function.
         * @param {Node} xmlNode A node from which to extract values.
         */
        bufferDataFloat32: function (xmlNode) {

            var rawValues = this.getRawValues(xmlNode);
            if (!rawValues) {
                return null;
            }

            var len = rawValues.length;

            var bufferData = new Float32Array(len);
            for (var i = 0; i < len; i++) {
                bufferData[i] = parseFloat(rawValues[i]);
            }

            return bufferData;
        },

        /**
         * Packs data from a node as a UInt32Array.
         * Internal. Applications should not call this function.
         * @param {Node} xmlNode A node from which to extract values.
         */
        bufferDataUInt32: function (xmlNode) {

            var rawValues = this.getRawValues(xmlNode);
            if (!rawValues) {
                return null;
            }

            var len = rawValues.length;

            var bufferData = new Uint32Array(len);
            for (var i = 0; i < len; i++) {
                bufferData[i] = parseInt(rawValues[i]);
            }

            return bufferData;
        },

        /**
         * Returns the first child of a node.
         * Internal. Applications should not call this function.
         * @param {Node} xmlNode The tag to look in.
         * @param {String} nodeName Optional parameter, the name of the child.
         */
        getFirstChildElement: function (xmlNode, nodeName) {

            var childs = xmlNode.childNodes;

            for (var i = 0; i < childs.length; ++i) {

                var item = childs.item(i);

                if (item.nodeType !== 1) {
                    continue;
                }

                if ((item.nodeName && !nodeName) || (nodeName && nodeName === item.nodeName)) {
                    return item;
                }
            }

            return null;
        },

        /**
         * Returns the filename without slashes.
         * Internal. Applications should not call this function.
         * @param {String} filePath
         */
        getFilename: function (filePath) {

            var pos = filePath.lastIndexOf("\\");
            if (pos !== -1) {
                filePath = filePath.substr(pos + 1);
            }

            pos = filePath.lastIndexOf("/");
            if (pos !== -1) {
                filePath = filePath.substr(pos + 1);
            }

            return filePath;
        },

        /**
         * Replaces the spaces in a string with an "_".
         * Internal. Applications should not call this function.
         * @param {String} str
         */
        replaceSpace: function (str) {
            if (!str) {
                return "";
            }
            return str.replace(/ /g, "_");
        },

        /**
         * Finds a node by id.
         * Internal. Applications should not call this function.
         * @param {NodeList} nodes A list of nodes to look in.
         * @param {String} id The id of the node to search for.
         */
        querySelectorById: function (nodes, id) {
            for (var i = 0; i < nodes.length; i++) {
                var attrId = nodes.item(i).getAttribute("id");
                if (!attrId) {
                    continue;
                }
                if (attrId.toString() === id) {
                    return nodes.item(i);
                }
            }
            return null;
        },

        /**
         * Determines the rendering method for a texture.
         * The method can be CLAMP or REPEAT.
         * Internal. Applications should not call this function.
         * @param {Number[]} uvs The uvs array.
         */
        getTextureType: function (uvs) {
            var clamp = true;

            for (var i = 0, len = uvs.length; i < len; i++) {
                if (uvs[i] < 0 || uvs[i] > 1) {
                    clamp = false;
                    break;
                }
            }

            return clamp;
        },

        /**
         * Fetches a file.
         * @param {String} url The path to the collada file.
         * @param {Function} cb A callback function to call when the collada file loaded.
         */
        fetchFile: function (url, cb) {

            var request = new XMLHttpRequest();

            request.onload = function () {
                if (this.status >= 200 && this.status < 400) {
                    cb(this.response);
                }
                else {
                    Logger.log(Logger.LEVEL_SEVERE, "sever error: " + this.status);
                    cb(null);
                }
            };

            request.onerror = function (e) {
                Logger.log(Logger.LEVEL_SEVERE, "connection error: " + e);
                cb(null);
            };

            request.open("get", url, true);

            request.send();
        }
    };

    export default ColladaUtils;
