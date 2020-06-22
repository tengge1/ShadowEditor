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
 * @exports ColladaLoader
 */

import ArgumentError from '../../error/ArgumentError';
import ColladaAsset from './ColladaAsset';
import ColladaImage from './ColladaImage';
import ColladaMaterial from './ColladaMaterial';
import ColladaMesh from './ColladaMesh';
import ColladaNode from './ColladaNode';
import ColladaScene from './ColladaScene';
import ColladaUtils from './ColladaUtils';
import Logger from '../../util/Logger';
        

        /**
         * Constructs a ColladaLoader
         * @alias ColladaLoader
         * @constructor
         * @classdesc Represents a Collada Loader. Fetches and parses a collada document and returns the
         * necessary information to render the collada model.
         * @param {Position} position The model's geographic position.
         * @param {Object} config Configuration options for the loader.
         * <ul>
         *  <li>dirPath - the path to the directory where the collada file is located</li>
         * </ul>
         */
        var ColladaLoader = function (position, config) {

            if (!position) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "ColladaLoader", "constructor", "missingPosition"));
            }

            this.position = position;

            this.dirPath = '/';

            this.init(config);
        };

        /**
         * Initialization of the ColladaLoader
         * @param {Object} config Configuration options for the loader.
         * <ul>
         *  <li>dirPath - the path to the directory where the collada file is located</li>
         * </ul>
         */
        ColladaLoader.prototype.init = function (config) {
            if (config) {
                this.dirPath = config.dirPath || '/';
            }

            this.scene = {
                type: "SceneTree",
                dirPath: this.dirPath,
                images: {},
                metadata: {},
                materials: {},
                meshes: {},
                root: {children: []}
            };

            this.xmlDoc = null;
        };

        /**
         * Fetches and parses a collada file
         * @param {String} url The url to the collada .dae file.
         * @param {Function} cb A callback function to call with the result when the parsing is done.
         * @returns {ColladaScene} A renderable shape.
         */
        ColladaLoader.prototype.load = function (url, cb) {

            if (url.indexOf("://") === -1) {
                url = this.dirPath + url;
            }

            ColladaUtils.fetchFile(url, function (data) {

                if (!data) {
                    var colladaScene = null;
                } else {

                    try {
                        colladaScene = this.parse(data);
                    } catch (e) {
                        colladaScene = null;
                        Logger.log(Logger.LEVEL_SEVERE, "error parsing collada file: " + e);
                    }
                }

                cb(colladaScene);

            }.bind(this));
        };

        /**
         * Parses a collada file
         * @param {XML} data The raw XML data of the collada file.
         * @returns {ColladaScene} A renderable shape.
         */
        ColladaLoader.prototype.parse = function (data) {

            this.init();

            var parser = new DOMParser();
            this.xmlDoc = parser.parseFromString(data, "text/xml");

            var iNodes = this.xmlDoc.querySelectorAll('library_nodes node');
            var eNodes = this.xmlDoc.querySelectorAll("library_effects effect");

            this.scene.metadata = (new ColladaAsset(this.xmlDoc)).parse();
            this.parseLib('visual_scene', iNodes);
            this.parseLib('library_geometries');
            this.parseLib('library_materials', eNodes);
            this.parseLib('library_images');

            this.xmlDoc = null;

            return new ColladaScene(this.position, this.scene);
        };

        /**
         * Parses a collada library tag.
         * @param {String} libName The library tag name.
         * @param {NodeList} extraNodes Nodes from library_nodes or effects form library_effects
         */
        ColladaLoader.prototype.parseLib = function (libName, extraNodes) {

            var libs = this.xmlDoc.getElementsByTagName(libName);
            var libNodes = [];

            if (libs && libs.length) {
                libNodes = libs[0].childNodes;
            }

            for (var i = 0; i < libNodes.length; i++) {

                var libNode = libNodes[i];

                if (libNode.nodeType !== 1) {
                    continue;
                }

                switch (libNode.nodeName) {

                    case 'node':
                        var nodes = (new ColladaNode()).parse(libNode, extraNodes);
                        if (nodes) {
                            for (var j = 0, len = nodes.length; j < len; j++) {
                                this.scene.root.children.push(nodes[j]);
                            }
                        }
                        break;

                    case 'geometry':
                        var geometryId = libNode.getAttribute("id");
                        var xmlMesh = libNode.querySelector("mesh");
                        var mesh = (new ColladaMesh(geometryId)).parse(xmlMesh);
                        if (mesh) {
                            this.scene.meshes[geometryId] = mesh;
                        }
                        break;

                    case 'material':
                        var materialId = libNode.getAttribute("id");
                        var iEffect = libNode.querySelector("instance_effect");
                        var effectId = iEffect.getAttribute("url").substr(1);
                        var effect = ColladaUtils.querySelectorById(extraNodes, effectId);
                        var material = (new ColladaMaterial(materialId)).parse(effect);
                        if (material) {
                            this.scene.materials[materialId] = material;
                        }
                        break;

                    case 'image':
                        var imageId = libNode.getAttribute("id");
                        var imageName = libNode.getAttribute("name");
                        var image = (new ColladaImage(imageId, imageName)).parse(libNode);
                        if (image) {
                            this.scene.images[imageId] = image;
                        }
                        break;

                    default:
                        break;
                }
            }

        };

        export default ColladaLoader;

    