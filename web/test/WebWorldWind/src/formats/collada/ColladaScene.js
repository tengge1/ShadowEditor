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
 * @exports ColladaScene
 */

import ArgumentError from '../../error/ArgumentError';
import BasicTextureProgram from '../../shaders/BasicTextureProgram';
import Color from '../../util/Color';
import Logger from '../../util/Logger';
import Matrix from '../../geom/Matrix';
import Position from '../../geom/Position';
import PickedObject from '../../pick/PickedObject';
import Renderable from '../../render/Renderable';
import Vec3 from '../../geom/Vec3';
        

        /**
         * Constructs a collada scene
         * @alias ColladaScene
         * @constructor
         * @augments Renderable
         * @classdesc Represents a scene. A scene is a collection of nodes with meshes, materials and textures.
         * @param {Position} position The scene's geographic position.
         * @param {Object} sceneData The scene's data containing the nodes, meshes, materials, textures and other
         * info needed to render the scene.
         */
        var ColladaScene = function (position, sceneData) {
            if (!position) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "ColladaScene", "constructor", "missingPosition"));
            }

            Renderable.call(this);

            // Documented in defineProperties below.
            this._position = position;

            // Documented in defineProperties below.
            this._nodes = [];
            this._meshes = {};
            this._materials = {};
            this._images = {};
            this._upAxis = '';
            this._dirPath = '';

            // Documented in defineProperties below.
            this._xRotation = 0;
            this._yRotation = 0;
            this._zRotation = 0;

            // Documented in defineProperties below.
            this._xTranslation = 0;
            this._yTranslation = 0;
            this._zTranslation = 0;

            // Documented in defineProperties below.
            this._scale = 1;

            // Documented in defineProperties below.
            this._altitudeMode = WorldWind.ABSOLUTE;

            // Documented in defineProperties below.
            this._localTransforms = true;

            // Documented in defineProperties below.
            this._useTexturePaths = true;

            // Documented in defineProperties below.
            this._nodesToHide = [];
            this._hideNodes = false;

            // Documented in defineProperties below.
            this._placePoint = new Vec3(0, 0, 0);

            // Documented in defineProperties below.
            this._transformationMatrix = Matrix.fromIdentity();
            this._mvpMatrix = Matrix.fromIdentity();

            // Documented in defineProperties below.
            this._normalTransformMatrix = Matrix.fromIdentity();
            this._normalMatrix = Matrix.fromIdentity();
            this._texCoordMatrix = Matrix.fromIdentity().setToUnitYFlip();

            //Internal. Intentionally not documented.
            this._entities = [];

            //Internal. Intentionally not documented.
            this._activeTexture = null;

            //Internal. Intentionally not documented.
            this._tmpVector = new Vec3(0, 0, 0);
            this._tmpColor = new Color(1, 1, 1, 1);

            //Internal. Intentionally not documented.
            this._vboCacheKey = '';
            this._iboCacheKey = '';
            // TODO: Process the double sided flag if set in sub-geometries.
            this._doubleSided = false;

            this.setSceneData(sceneData);
        };

        ColladaScene.prototype = Object.create(Renderable.prototype);
        ColladaScene.prototype.constructor = ColladaScene;

        Object.defineProperties(ColladaScene.prototype, {

            /**
             * The scene's geographic position.
             * @memberof ColladaScene.prototype
             * @type {Position}
             */
            position: {
                get: function () {
                    return this._position;
                },
                set: function (value) {
                    this._position = value;
                }
            },

            /**
             * An array of nodes extracted from the collada file.
             * @memberof ColladaScene.prototype
             * @type {ColladaNode[]}
             */
            nodes: {
                get: function () {
                    return this._nodes;
                },
                set: function (value) {
                    this._nodes = value;
                }
            },

            /**
             * An object with meshes extracted from the collada file.
             * @memberof ColladaScene.prototype
             * @type {{ColladaMesh}}
             */
            meshes: {
                get: function () {
                    return this._meshes;
                },
                set: function (value) {
                    this._meshes = value;
                }
            },

            /**
             * An object with materials and their effects extracted from the collada file.
             * @memberof ColladaScene.prototype
             * @type {ColladaMaterial}
             */
            materials: {
                get: function () {
                    return this._materials;
                },
                set: function (value) {
                    this._materials = value;
                }
            },

            /**
             * An object with images extracted from the collada file.
             * @memberof ColladaScene.prototype
             * @type {ColladaImage}
             */
            images: {
                get: function () {
                    return this._images;
                },
                set: function (value) {
                    this._images = value;
                }
            },

            /**
             * The up axis of the collada model extracted from the collada file.
             * @memberof ColladaScene.prototype
             * @type {String}
             */
            upAxis: {
                get: function () {
                    return this._upAxis;
                },
                set: function (value) {
                    this._upAxis = value;
                }
            },

            /**
             * The path to the directory of the collada file.
             * @memberof ColladaScene.prototype
             * @type {String}
             */
            dirPath: {
                get: function () {
                    return this._dirPath;
                },
                set: function (value) {
                    this._dirPath = value;
                }
            },

            /**
             * The scene's rotation angle in degrees for the x axis.
             * @memberof ColladaScene.prototype
             * @type {Number}
             */
            xRotation: {
                get: function () {
                    return this._xRotation;
                },
                set: function (value) {
                    this._xRotation = value;
                }
            },

            /**
             * The scene's rotation angle in degrees for the x axis.
             * @memberof ColladaScene.prototype
             * @type {Number}
             */
            yRotation: {
                get: function () {
                    return this._yRotation;
                },
                set: function (value) {
                    this._yRotation = value;
                }
            },

            /**
             * The scene's rotation angle in degrees for the x axis.
             * @memberof ColladaScene.prototype
             * @type {Number}
             */
            zRotation: {
                get: function () {
                    return this._zRotation;
                },
                set: function (value) {
                    this._zRotation = value;
                }
            },

            /**
             * The scene's translation for the x axis.
             * @memberof ColladaScene.prototype
             * @type {Number}
             */
            xTranslation: {
                get: function () {
                    return this._xTranslation;
                },
                set: function (value) {
                    this._xTranslation = value;
                }
            },

            /**
             * The scene's translation for the y axis.
             * @memberof ColladaScene.prototype
             * @type {Number}
             */
            yTranslation: {
                get: function () {
                    return this._yTranslation;
                },
                set: function (value) {
                    this._yTranslation = value;
                }
            },

            /**
             * The scene's translation for the z axis.
             * @memberof ColladaScene.prototype
             * @type {Number}
             */
            zTranslation: {
                get: function () {
                    return this._zTranslation;
                },
                set: function (value) {
                    this._zTranslation = value;
                }
            },

            /**
             * The scene's scale.
             * @memberof ColladaScene.prototype
             * @type {Number}
             */
            scale: {
                get: function () {
                    return this._scale;
                },
                set: function (value) {
                    this._scale = value;
                }
            },

            /**
             * The scene's Cartesian point on the globe for the specified position.
             * @memberof ColladaScene.prototype
             * @type {Vec3}
             */
            placePoint: {
                get: function () {
                    return this._placePoint;
                },
                set: function (value) {
                    this._placePoint = value;
                }
            },

            /**
             * The scene's altitude mode. May be one of
             * <ul>
             *  <li>[WorldWind.ABSOLUTE]{@link WorldWind#ABSOLUTE}</li>
             *  <li>[WorldWind.RELATIVE_TO_GROUND]{@link WorldWind#RELATIVE_TO_GROUND}</li>
             *  <li>[WorldWind.CLAMP_TO_GROUND]{@link WorldWind#CLAMP_TO_GROUND}</li>
             * </ul>
             * @default WorldWind.ABSOLUTE
             * @memberof ColladaScene.prototype
             * @type {String}
             */
            altitudeMode: {
                get: function () {
                    return this._altitudeMode;
                },
                set: function (value) {
                    this._altitudeMode = value;
                }
            },

            /**
             * The scene's transformation matrix containing the scale, rotations and translations
             * @memberof ColladaScene.prototype
             * @type {Matrix}
             */
            transformationMatrix: {
                get: function () {
                    return this._transformationMatrix;
                },
                set: function (value) {
                    this._transformationMatrix = value;
                }
            },

            /**
             * The scene's normal matrix
             * @memberof ColladaScene.prototype
             * @type {Matrix}
             */
            normalMatrix: {
                get: function () {
                    return this._normalMatrix;
                },
                set: function (value) {
                    this._normalMatrix = value;
                }
            },

            /**
             * Force the use of the nodes transformation info. Some 3d software may break the transformations when
             * importing/exporting models to collada format. Set to false to ignore the the nodes transformation.
             * Only use this option if the model does not render properly.
             * @memberof ColladaScene.prototype
             * @default true
             * @type {Boolean}
             */
            localTransforms: {
                get: function () {
                    return this._localTransforms;
                },
                set: function (value) {
                    this._localTransforms = value;
                }
            },

            /**
             * Force the use of the texture path specified in the collada file. Set to false to ignore the paths of the
             * textures in the collada file and instead get the textures from the same dir as the collada file.
             * @memberof ColladaScene.prototype
             * @default true
             * @type {Boolean}
             */
            useTexturePaths: {
                get: function () {
                    return this._useTexturePaths;
                },
                set: function (value) {
                    this._useTexturePaths = value;
                }
            },

            /**
             * An array of node id's to not render.
             * @memberof ColladaScene.prototype
             * @type {String[]}
             */
            nodesToHide: {
                get: function () {
                    return this._nodesToHide;
                },
                set: function (value) {
                    this._nodesToHide = value;
                }
            },

            /**
             * Set to true to force the renderer to not draw the nodes passed to the nodesToHide list.
             * @memberof ColladaScene.prototype
             * @default false
             * @type {Boolean}
             */
            hideNodes: {
                get: function () {
                    return this._hideNodes;
                },
                set: function (value) {
                    this._hideNodes = value;
                }
            },

            /**
             * Set to true to skip back face culling for this scene. Helpful when the model contains incorrect normal data.
             * @memberof ColladaScene.prototype
             * @default false
             * @type {Boolean}
             */
            doubleSided: {
                get: function () {
                    return this._doubleSided;
                },
                set: function (value) {
                    this._doubleSided = value;
                }
            }

        });

        // Internal. Intentionally not documented.
        ColladaScene.prototype.setSceneData = function (sceneData) {
            if (sceneData) {
                this._nodes = sceneData.root.children;
                this._meshes = sceneData.meshes;
                this._materials = sceneData.materials;
                this._images = sceneData.images;
                this._upAxis = sceneData.metadata.up_axis;
                this._dirPath = sceneData.dirPath;

                this.flattenModel();
            }
        };

        // Internal. Intentionally not documented.
        ColladaScene.prototype.flattenModel = function () {
            for (var i = 0, nodesLen = this._nodes.length; i < nodesLen; i++) {
                this.flattenNode(this._nodes[i]);
            }

            this._entities.sort(function (a, b) {
                var va = (a.imageKey === null) ? "" : "" + a,
                    vb = (b.imageKey === null) ? "" : "" + b;
                return va > vb ? 1 : (va === vb ? 0 : -1);
            });
        };

        // Internal. Intentionally not documented.
        ColladaScene.prototype.flattenNode = function (node) {
            if (node.mesh) {
                var meshKey = node.mesh;
                var buffers = this._meshes[meshKey].buffers;

                for (var i = 0, bufLen = buffers.length; i < bufLen; i++) {
                    var materialBuf = buffers[i].material;

                    for (var j = 0; j < node.materials.length; j++) {
                        if (materialBuf === node.materials[j].symbol) {
                            var materialKey = node.materials[j].id;
                            break;
                        }
                    }

                    var material = this._materials[materialKey];
                    var imageKey = null;
                    var hasTexture = material && material.textures && buffers[i].uvs && buffers[i].uvs.length > 0;
                    if (hasTexture) {
                        if (material.textures.diffuse) {
                            imageKey = material.textures.diffuse.mapId;
                        } else if (material.textures.reflective) {
                            imageKey = material.textures.reflective.mapId;
                        }
                    }

                    this._entities.push({
                        mesh: buffers[i],
                        material: material,
                        node: node,
                        imageKey: imageKey
                    });
                }
            }

            for (var k = 0; k < node.children.length; k++) {
                this.flattenNode(node.children[k]);
            }
        };

        // Internal. Intentionally not documented.
        ColladaScene.prototype.render = function (dc) {
            var orderedScene;
            var frustum = dc.frustumInModelCoordinates;

            if (!this.enabled) {
                return;
            }

            if (this.lastFrameTime !== dc.timestamp) {
                orderedScene = this.makeOrderedRenderable(dc);
            }

            if (!orderedScene) {
                return;
            }

            if (!frustum.containsPoint(this._placePoint)) {
                return;
            }

            orderedScene.layer = dc.currentLayer;

            this.lastFrameTime = dc.timestamp;

            dc.addOrderedRenderable(orderedScene);
        };

        // Internal. Intentionally not documented.
        ColladaScene.prototype.makeOrderedRenderable = function (dc) {
            dc.surfacePointForMode(this._position.latitude, this._position.longitude, this._position.altitude,
                this._altitudeMode, this._placePoint);

            this.eyeDistance = dc.eyePoint.distanceTo(this._placePoint);

            return this;
        };

        // Internal. Intentionally not documented.
        ColladaScene.prototype.renderOrdered = function (dc) {
            this.drawOrderedScene(dc);

            if (dc.pickingMode) {
                var po = new PickedObject(this.pickColor.clone(), this, this._position, this.layer, false);
                dc.resolvePick(po);
            }
        };

        // Internal. Intentionally not documented.
        ColladaScene.prototype.drawOrderedScene = function (dc) {
            try {
                this.beginDrawing(dc);
            } finally {
                this.endDrawing(dc);
            }
        };

        // Internal. Intentionally not documented.
        ColladaScene.prototype.beginDrawing = function (dc) {
            var gl = dc.currentGlContext;
            var gpuResourceCache = dc.gpuResourceCache;

            var vboId = gpuResourceCache.resourceForKey(this._vboCacheKey);
            var iboId = gpuResourceCache.resourceForKey(this._iboCacheKey);

            if (!vboId) {
                this.setupBuffers(dc);
                vboId = gpuResourceCache.resourceForKey(this._vboCacheKey);
                iboId = gpuResourceCache.resourceForKey(this._iboCacheKey);
            }

            gl.bindBuffer(gl.ARRAY_BUFFER, vboId);
            if (iboId) {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboId);
            }

            dc.findAndBindProgram(BasicTextureProgram);
            gl.enableVertexAttribArray(0);
            if (this._doubleSided) {
                gl.disable(gl.CULL_FACE);
            }

            if (dc.pickingMode) {
                this.pickColor = dc.uniquePickColor();
            }

            this.computeTransformationMatrix(dc.globe);

            for (var i = 0, len = this._entities.length; i < len; i++) {
                var mustRenderNode = this.mustRenderNode(this._entities[i].node.id);
                if (mustRenderNode) {
                    this.draw(dc, this._entities[i]);
                }
            }
        };

        // Internal. Intentionally not documented.
        ColladaScene.prototype.setupBuffers = function (dc) {
            var gl = dc.currentGlContext;
            var sizeOfFloat32 = Float32Array.BYTES_PER_ELEMENT || 4;
            var sizeOfUint16 = Uint16Array.BYTES_PER_ELEMENT || 2;
            var sizeOfUint32 = Uint32Array.BYTES_PER_ELEMENT || 4;
            var is32BitIndices = false;
            var numIndices = 0;
            var numVertices = 0;

            for (var i = 0, len = this._entities.length; i < len; i++) {
                var mesh = this._entities[i].mesh;
                if (mesh.indexedRendering) {
                    numIndices += mesh.indices.length;
                    if (mesh.indices instanceof Uint32Array) {
                        is32BitIndices = true;
                    }
                }
                numVertices += mesh.vertices.length;
                if (this._entities[i].imageKey) {
                    numVertices += mesh.uvs.length;
                }
                if (mesh.normals && mesh.normals.length) {
                    numVertices += mesh.normals.length;
                }
            }

            var vbo = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
            gl.bufferData(gl.ARRAY_BUFFER, numVertices * sizeOfFloat32, gl.STATIC_DRAW);

            var offset = 0;
            for (i = 0, len = this._entities.length; i < len; i++) {
                var data = this._entities[i].mesh.vertices;
                this._entities[i].vertexOffset = offset;
                gl.bufferSubData(gl.ARRAY_BUFFER, offset * sizeOfFloat32, data);
                offset += data.length;
            }

            for (i = 0, len = this._entities.length; i < len; i++) {
                if (this._entities[i].imageKey) {
                    data = this._entities[i].mesh.uvs;
                    this._entities[i].uvOffset = offset;
                    gl.bufferSubData(gl.ARRAY_BUFFER, offset * sizeOfFloat32, data);
                    offset += data.length;
                }
            }

            for (i = 0, len = this._entities.length; i < len; i++) {
                data = data = this._entities[i].mesh.normals;
                if (data && data.length) {
                    this._entities[i].normalOffset = offset;
                    gl.bufferSubData(gl.ARRAY_BUFFER, offset * sizeOfFloat32, data);
                    offset += data.length;
                }
            }

            var indexSize = sizeOfUint16;
            var indexBufferSize = numIndices * indexSize;
            var uIntExt;
            if (is32BitIndices) {
                uIntExt = dc.getExtension('OES_element_index_uint');

                if (!uIntExt) {
                    Logger.log(Logger.LEVEL_SEVERE,
                        'The 3D model is too big and might not render properly. \n' +
                        'Your browser does not support the "OES_element_index_uint" extension, ' +
                        'required to render large models.'
                    );
                } else {
                    indexSize = sizeOfUint32;
                    indexBufferSize = numIndices * indexSize;
                }
            }

            if (numIndices) {
                var ibo = gl.createBuffer();
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexBufferSize, gl.STATIC_DRAW);

                offset = 0;
                for (i = 0, len = this._entities.length; i < len; i++) {
                    mesh = this._entities[i].mesh;
                    if (mesh.indexedRendering) {
                        data = mesh.indices;
                        if (data instanceof Uint32Array && !uIntExt) {
                            data = new Uint16Array(data);
                        }
                        this._entities[i].indexOffset = offset;
                        this._entities[i].indexSize = indexSize;
                        gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, offset * indexSize, data);
                        offset += data.length;
                    }
                }
            }

            this._vboCacheKey = dc.gpuResourceCache.generateCacheKey();
            dc.gpuResourceCache.putResource(this._vboCacheKey, vbo, numVertices * sizeOfFloat32);

            if (numIndices) {
                this._iboCacheKey = dc.gpuResourceCache.generateCacheKey();
                dc.gpuResourceCache.putResource(this._iboCacheKey, ibo, indexBufferSize);
            }
        };

        // Internal. Intentionally not documented.
        ColladaScene.prototype.draw = function (dc, entity) {
            var gl = dc.currentGlContext;
            var program = dc.currentProgram;
            var gpuResourceCache = dc.gpuResourceCache;

            var buffers = entity.mesh;
            var material = entity.material;

            var nodeWorldMatrix = entity.node.worldMatrix;
            var nodeNormalMatrix = entity.node.normalMatrix;

            var hasLighting;
            if (this._doubleSided) {
                hasLighting=false;
            }
            else {
                hasLighting = buffers.normals && buffers.normals.length;
            }

            var imageKey = entity.imageKey;

            this.applyColor(dc, material);

            if (imageKey) {
                var imagePath = this._useTexturePaths ? this._images[imageKey].path : this._images[imageKey].filename;
                var textureCacheKey = this._dirPath + imagePath;
                this._activeTexture = gpuResourceCache.resourceForKey(textureCacheKey);
                if (!this._activeTexture) {
                    var wrapMode = buffers.isClamp ? gl.CLAMP_TO_EDGE : gl.REPEAT;
                    this._activeTexture = gpuResourceCache.retrieveTexture(gl, textureCacheKey, wrapMode);
                }
                var textureBound = this._activeTexture && this._activeTexture.bind(dc);
                if (textureBound) {
                    program.loadTextureEnabled(gl, true);
                    gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 8, entity.uvOffset * 4);
                    gl.enableVertexAttribArray(2);
                    program.loadModulateColor(gl, dc.pickingMode);
                } else {
                    program.loadTextureEnabled(gl, false);
                    gl.disableVertexAttribArray(2);
                }
            } else {
                program.loadTextureEnabled(gl, false);
                gl.disableVertexAttribArray(2);
            }

            if (hasLighting && !dc.pickingMode) {
                program.loadApplyLighting(gl, 1);
                gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 12, entity.normalOffset * 4);
                gl.enableVertexAttribArray(1);
            } else {
                program.loadApplyLighting(gl, 0);
                gl.disableVertexAttribArray(1);
            }

            this.applyMatrix(dc, hasLighting, textureCacheKey, nodeWorldMatrix, nodeNormalMatrix);

            gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 12, entity.vertexOffset * 4);

            if (buffers.indexedRendering) {
                var indexOffsetBytes = entity.indexOffset * entity.indexSize;
                if (buffers.indices instanceof Uint32Array && dc.getExtension('OES_element_index_uint')) {
                    gl.drawElements(gl.TRIANGLES, buffers.indices.length, gl.UNSIGNED_INT, indexOffsetBytes);
                } else {
                    gl.drawElements(gl.TRIANGLES, buffers.indices.length, gl.UNSIGNED_SHORT, indexOffsetBytes);
                }
            } else {
                gl.drawArrays(gl.TRIANGLES, 0, Math.floor(buffers.vertices.length / 3));
            }
        };

        // Internal. Intentionally not documented.
        ColladaScene.prototype.applyColor = function (dc, material) {
            var gl = dc.currentGlContext,
                program = dc.currentProgram;

            if (material) {
                if (material.techniqueType === 'constant') {
                    var diffuse = material.reflective;
                } else {
                    diffuse = material.diffuse;
                }
            }

            var opacity;
            var r = 1, g = 1, b = 1, a = 1;

            if (diffuse) {
                r = diffuse[0];
                g = diffuse[1];
                b = diffuse[2];
                a = diffuse[3] != null ? diffuse[3] : 1;
            }

            this._tmpColor.set(r, g, b, a);
            opacity = a * this.layer.opacity;
            gl.depthMask(opacity >= 1 || dc.pickingMode);
            program.loadColor(gl, dc.pickingMode ? this.pickColor : this._tmpColor);
            program.loadOpacity(gl, dc.pickingMode ? (opacity > 0 ? 1 : 0) : opacity);
        };

        // Internal. Intentionally not documented.
        ColladaScene.prototype.applyMatrix = function (dc, hasLighting, hasTexture, nodeWorldMatrix, nodeNormalMatrix) {
            this._mvpMatrix.copy(dc.modelviewProjection);
            this._mvpMatrix.multiplyMatrix(this._transformationMatrix);

            if (nodeWorldMatrix && this._localTransforms) {
                this._mvpMatrix.multiplyMatrix(nodeWorldMatrix);
            }

            if (hasLighting && !dc.pickingMode) {
                this._normalMatrix.copy(dc.modelviewNormalTransform);
                this._normalMatrix.multiplyMatrix(this._normalTransformMatrix);
                if (nodeNormalMatrix && this._localTransforms) {
                    this._normalMatrix.multiplyMatrix(nodeNormalMatrix);
                }

                dc.currentProgram.loadModelviewInverse(dc.currentGlContext, this._normalMatrix);
            }

            if (hasTexture && this._activeTexture) {
                dc.currentProgram.loadTextureMatrix(dc.currentGlContext, this._texCoordMatrix);
                this._activeTexture = null;
            }

            dc.currentProgram.loadModelviewProjection(dc.currentGlContext, this._mvpMatrix);
        };

        // Internal. Intentionally not documented.
        ColladaScene.prototype.endDrawing = function (dc) {
            var gl = dc.currentGlContext;
            var program = dc.currentProgram;

            if (this._doubleSided) {
                gl.enable(gl.CULL_FACE);
            }

            gl.disableVertexAttribArray(1);
            gl.disableVertexAttribArray(2);
            program.loadApplyLighting(gl, 0);
            program.loadTextureEnabled(gl, false);
        };

        // Internal. Intentionally not documented.
        ColladaScene.prototype.computeTransformationMatrix = function (globe) {
            this._transformationMatrix.setToIdentity();

            this._transformationMatrix.multiplyByLocalCoordinateTransform(this._placePoint, globe);

            this._transformationMatrix.multiplyByRotation(1, 0, 0, this._xRotation);
            this._transformationMatrix.multiplyByRotation(0, 1, 0, this._yRotation);
            this._transformationMatrix.multiplyByRotation(0, 0, 1, this._zRotation);

            this._transformationMatrix.multiplyByScale(this._scale, this._scale, this._scale);

            this._transformationMatrix.multiplyByTranslation(this._xTranslation, this._yTranslation, this._zTranslation);

            this.computeNormalMatrix();
        };

        // Internal. Intentionally not documented.
        ColladaScene.prototype.computeNormalMatrix = function () {
            this._transformationMatrix.extractRotationAngles(this._tmpVector);
            this._normalTransformMatrix.setToIdentity();
            this._normalTransformMatrix.multiplyByRotation(-1, 0, 0, this._tmpVector[0]);
            this._normalTransformMatrix.multiplyByRotation(0, -1, 0, this._tmpVector[1]);
            this._normalTransformMatrix.multiplyByRotation(0, 0, -1, this._tmpVector[2]);
        };

        // Internal. Intentionally not documented.
        ColladaScene.prototype.mustRenderNode = function (nodeId) {
            var draw = true;
            if (this._hideNodes) {
                var pos = this._nodesToHide.indexOf(nodeId);
                draw = (pos === -1);
            }
            return draw;
        };

        export default ColladaScene;

    