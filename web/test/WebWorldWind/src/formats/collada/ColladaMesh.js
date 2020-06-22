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
 * @exports ColladaMesh
 */

import ColladaUtils from './ColladaUtils';
    

    /**
     * Constructs a ColladaMesh
     * @alias ColladaMesh
     * @constructor
     * @classdesc Represents a collada mesh tag.
     * @param {String} geometryId The id of a geometry node
     */
    var ColladaMesh = function (geometryId) {
        this.filename = geometryId || "";
        this.name = geometryId || "";
        this.buffers = [];
    };

    /**
     * Parses and computes the geometry of a mesh.
     * Internal. Applications should not call this function.
     * @param {Node} element A mesh node.
     */
    ColladaMesh.prototype.parse = function (element) {

        var sources = {},
            meshData = {},
            verticesInputs = {
                id: '',
                inputs: []
            };

        for (var i = 0; i < element.childNodes.length; i++) {

            var child = element.childNodes[i];

            if (child.nodeType !== 1) {
                continue;
            }

            switch (child.nodeName) {

                case 'source':
                    if (!child.querySelector) {
                        continue;
                    }

                    var floatArray = child.querySelector("float_array");
                    if (!floatArray) {
                        continue;
                    }

                    var values = ColladaUtils.bufferDataFloat32(floatArray);
                    var accessor = child.querySelector("accessor");
                    var stride = parseInt(accessor.getAttribute("stride"));

                    sources[child.getAttribute("id")] = {stride: stride, data: values};
                    break;

                case 'vertices':
                    this.parseVertices(child, verticesInputs);
                    break;

                case 'triangles':
                    meshData = this.parsePolygons(child, sources, verticesInputs, 3);
                    this.buffers.push(meshData);
                    break;

                case 'polygons':
                    meshData = this.parsePolygons(child, sources, verticesInputs, 4);
                    this.buffers.push(meshData);
                    break;

                case 'polylist':
                    meshData = this.parsePolygons(child, sources, verticesInputs, null);
                    this.buffers.push(meshData);
                    break;

                default:
                    break;

            }

        }

        return this;

    };

    /**
     * Parses the vertices tag of a mesh.
     * Internal. Applications should not call this function.
     * @param {Node} element The node containing the primitives and inputs.
     * @param {Object} verticesInputs An object in which to save the inputs of the vertices tag.
     */
    ColladaMesh.prototype.parseVertices = function (element, verticesInputs) {

        verticesInputs.id = element.getAttribute("id");
        var inputs = element.querySelectorAll("input");

        for (var i = 0; i < inputs.length; i++) {

            var input = inputs[i];
            var source = input.getAttribute("source").substr(1);
            var semantic = input.getAttribute("semantic").toUpperCase();

            verticesInputs.inputs.push({
                semantic: semantic,
                source: source
            });

        }

    };

    /**
     * Parses the polygons primitive and computes the indices and vertices.
     * Internal. Applications should not call this function.
     * @param {Node} element The node containing the primitives and inputs.
     * @param {Object} sources An object containing the inputs for vertices, normals and uvs.
     * @param {Object} verticesInputs An object containing the inputs links.
     * @param {Number} vCount Optional parameter, specifies the the vertex count for a polygon
     */
    ColladaMesh.prototype.parsePolygons = function (element, sources, verticesInputs, vCount) {

        var arrVCount = [];
        if (vCount == null) {
            var xmlVCount = element.querySelector("vcount");
            arrVCount = xmlVCount.textContent.trim().split(" ");
        }

        var count = parseInt(element.getAttribute("count"));
        var material = element.getAttribute("material");

        var inputData = this.parseInputs(element, sources, verticesInputs);
        var inputs = inputData.inputs;
        var maxOffset = inputData.maxOffset;

        var primitives = element.querySelector("p");
        var primitiveData = [];
        if (primitives) {
            primitiveData = primitives.textContent.trim().split(" ");
        }

        var nrOfInputs = inputs.length;

        var lastIndex = 0;
        var indexMap = {};
        var indicesArray = [];
        var pos = 0;
        var indexedRendering = false;
        var is32BitIndices = false;

        for (var i = 0; i < count; i++) {

            if (arrVCount.length) {
                var numVertices = parseInt(arrVCount[i]);
            }
            else {
                numVertices = vCount;
            }

            var firstIndex = -1;
            var currentIndex = -1;
            var prevIndex = -1;

            for (var k = 0; k < numVertices; k++) {

                var vecId = primitiveData.slice(pos, pos + maxOffset).join(" ");

                prevIndex = currentIndex;
                if (indexMap.hasOwnProperty(vecId)) {
                    currentIndex = indexMap[vecId];
                    indexedRendering = true;
                }
                else {

                    for (var j = 0; j < nrOfInputs; j++) {

                        var input = inputs[j];
                        var offset = input[4];
                        var index = parseInt(primitiveData[pos + offset]);
                        var array = input[1];
                        var source = input[3];
                        index *= input[2];

                        for (var x = 0; x < input[2]; x++) {
                            array.push(source[index + x]);
                        }
                    }

                    currentIndex = lastIndex;
                    lastIndex += 1;
                    indexMap[vecId] = currentIndex;
                }

                if (numVertices > 3) {
                    if (k === 0) {
                        firstIndex = currentIndex;
                    }
                    if (k > 2 * maxOffset) {
                        if (firstIndex > 65535 || prevIndex > 65535) {
                            is32BitIndices = true;
                        }
                        indicesArray.push(firstIndex);
                        indicesArray.push(prevIndex);
                    }
                }

                if (currentIndex > 65535) {
                    is32BitIndices = true;
                }
                indicesArray.push(currentIndex);
                pos += maxOffset;

            }
        }

        var mesh = {
            vertices: new Float32Array(inputs[0][1]),
            indexedRendering: indexedRendering,
            material: material
        };

        if (mesh.indexedRendering) {
            mesh.indices = is32BitIndices ? new Uint32Array(indicesArray) : new Uint16Array(indicesArray);
        }

        this.transformMeshInfo(mesh, inputs);

        return mesh;

    };

    /**
     * Parses the inputs of a mesh.
     * Internal. Applications should not call this function.
     * @param {Node} element The node containing the primitives and inputs.
     * @param {Object} sources An object containing the vertices source and stride.
     * @param {Object} verticesInputs An object containing the inputs links.
     */
    ColladaMesh.prototype.parseInputs = function (element, sources, verticesInputs) {

        var inputs = [], maxOffset = 0;

        var xmlInputs = element.querySelectorAll("input");

        for (var i = 0; i < xmlInputs.length; i++) {
            var xmlInput = xmlInputs.item(i);
            if (!xmlInput.getAttribute) {
                continue;
            }

            var semantic = xmlInput.getAttribute("semantic").toUpperCase();
            var sourceUrl = xmlInput.getAttribute("source").substr(1);
            var offset = parseInt(xmlInput.getAttribute("offset"));

            maxOffset = ( maxOffset < offset + 1 ) ? offset + 1 : maxOffset;

            //indicates which inputs should be grouped together as a single set.
            //multiple inputs may share the same semantics.
            var dataSet = 0;
            if (xmlInput.getAttribute("set")) {
                dataSet = parseInt(xmlInput.getAttribute("set"));
            }

            if (verticesInputs.id === sourceUrl) {
                var vInputs = verticesInputs.inputs;
                for (var j = 0; j < vInputs.length; j++) {
                    var source = sources[vInputs[j].source];
                    if (source) {
                        inputs.push([vInputs[j].semantic, [], source.stride, source.data, offset, dataSet]);
                    }
                }
            }
            else {
                source = sources[sourceUrl];
                inputs.push([semantic, [], source.stride, source.data, offset, dataSet]);
            }

        }

        return {inputs: inputs, maxOffset: maxOffset};
    };

    /**
     * Packs the data in the mesh object.
     * Internal. Applications should not call this function.
     * @param {Object} mesh The mesh that will be returned.
     * @param {Array} inputs The array containing the inputs of the mesh.
     */
    ColladaMesh.prototype.transformMeshInfo = function (mesh, inputs) {
        var translator = {
            "normal": "normals",
            "texcoord": "uvs"
        };

        for (var i = 1; i < inputs.length; i++) {

            var name = inputs[i][0].toLowerCase(); //the semantic
            var data = inputs[i][1]; //the final data (normals, uvs)

            if (!data.length) {
                continue;
            }

            if (translator[name]) {
                name = translator[name];
            }

            if (mesh[name]) {
                name = name + inputs[i][5];
            }

            mesh[name] = new Float32Array(data);

            if (name === 'uvs') {
                mesh.isClamp = ColladaUtils.getTextureType(data);
            }
        }

        return mesh;
    };

    export default ColladaMesh;

