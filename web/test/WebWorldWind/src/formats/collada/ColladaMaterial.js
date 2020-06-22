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
 * @exports ColladaMaterial
 */

import ColladaUtils from './ColladaUtils';
    

    /**
     * Constructs a ColladaMaterial
     * @alias ColladaMaterial
     * @constructor
     * @classdesc Represents a collada material and it's effects.
     * @param {String} materialId The id of a material node
     */
    var ColladaMaterial = function (materialId) {
        this.id = materialId;
        this.newParams = [];
    };

    /**
     * Parses an effect node.
     * Internal. Applications should not call this function.
     * @param {Node} element An effect node.
     */
    ColladaMaterial.prototype.parse = function (element) {

        for (var i = 0; i < element.childNodes.length; i++) {

            var child = element.childNodes[i];

            if (child.nodeType !== 1) {
                continue;
            }

            switch (child.nodeName) {

                case 'profile_COMMON':
                    this.parseProfileCommon(child);
                    break;

                default:
                    break;
            }
        }

        return this;
    };

    /**
     * Parses the profile_COMMON node.
     * Internal. Applications should not call this function.
     * @param {Node} element The profile_COMMON node.
     */
    ColladaMaterial.prototype.parseProfileCommon = function (element) {

        for (var i = 0; i < element.childNodes.length; i++) {

            var child = element.childNodes[i];

            if (child.nodeType !== 1) {
                continue;
            }

            switch (child.nodeName) {

                case 'newparam':
                    this.parseNewparam(child);
                    break;

                case 'image':
                    break;

                case 'technique':
                    this.parseTechnique(child);
                    break;

                default:
                    break;
            }
        }

    };

    /**
     * Parses the newparam node.
     * Internal. Applications should not call this function.
     * @param {Node} element The newparam node.
     */
    ColladaMaterial.prototype.parseNewparam = function (element) {
        var sid = element.getAttribute('sid');

        for (var i = 0; i < element.childNodes.length; i++) {

            var child = element.childNodes[i];

            if (child.nodeType !== 1) {
                continue;
            }

            switch (child.nodeName) {

                case 'surface':
                    var initFrom = child.querySelector("init_from");
                    if (initFrom) {
                        this.newParams.push({
                            sid: sid,
                            type: 'surface',
                            initFrom: initFrom.textContent
                        });
                    }
                    break;

                case 'sampler2D':
                    var source = child.querySelector("source");
                    this.newParams.push({
                        sid: sid,
                        type: 'sampler2D',
                        source: source.textContent
                    });
                    break;

                case 'extra':
                    break;

                default:
                    break;

            }

        }
    };

    /**
     * Parses the technique node.
     * Internal. Applications should not call this function.
     * @param {Node} element The technique node.
     */
    ColladaMaterial.prototype.parseTechnique = function (element) {

        for (var i = 0; i < element.childNodes.length; i++) {

            var child = element.childNodes[i];

            if (child.nodeType !== 1) {
                continue;
            }

            switch (child.nodeName) {

                case 'constant':
                case 'lambert':
                case 'blinn':
                case 'phong':
                    this.techniqueType = child.nodeName;
                    this.parseTechniqueType(child);
                    break;

                case 'extra':
                    break;

                default:
                    break;

            }

        }
    };

    /**
     * Parses the technique type for this effect.
     * Internal. Applications should not call this function.
     * @param {Node} element The technique type node.
     */
    ColladaMaterial.prototype.parseTechniqueType = function (element) {

        for (var i = 0; i < element.childNodes.length; i++) {

            var child = element.childNodes[i];

            if (child.nodeType !== 1 || !child.nodeName) {
                continue;
            }

            var nodeName = child.nodeName;

            var nodeValue = ColladaUtils.getFirstChildElement(child);

            if (!nodeValue) {
                continue;
            }

            switch (nodeValue.nodeName) {

                case 'color':
                    this[nodeName] = ColladaUtils.bufferDataFloat32(nodeValue).subarray(0, 4);
                    break;

                case 'float':
                    this[nodeName] = ColladaUtils.bufferDataFloat32(nodeValue)[0];
                    break;

                case 'texture':
                    var texture = nodeValue.getAttribute("texture");

                    var pos = this.newParams.map(function (newParam) {
                        return newParam.sid;
                    }).indexOf(texture);

                    var source = this.newParams[pos].source;

                    pos = this.newParams.map(function (newParam) {
                        return newParam.sid;
                    }).indexOf(source);

                    var initFrom = this.newParams[pos].initFrom;

                    if (!this.textures) {
                        this.textures = {};
                    }

                    this.textures[nodeName] = {mapId: initFrom};

                    break;

                default:
                    break;

            }

        }
    };

    export default ColladaMaterial;
