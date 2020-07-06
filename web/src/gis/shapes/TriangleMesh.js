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
 * @exports TriangleMesh
 */
import AbstractMesh from '../shapes/AbstractMesh';
import ArgumentError from '../error/ArgumentError';
import BasicTextureProgram from '../shaders/BasicTextureProgram';
import BoundingBox from '../geom/BoundingBox';
import Color from '../util/Color';
import ImageSource from '../util/ImageSource';
import Location from '../geom/Location';
import Logger from '../util/Logger';
import Matrix from '../geom/Matrix';
import PickedObject from '../pick/PickedObject';
import Position from '../geom/Position';
import ShapeAttributes from '../shapes/ShapeAttributes';
import SurfacePolygon from '../shapes/SurfacePolygon';
import Vec2 from '../geom/Vec2';
import Vec3 from '../geom/Vec3';


/**
 * Constructs a triangle mesh.
 * @alias TriangleMesh
 * @constructor
 * @augments AbstractMesh
 * @classdesc Represents a 3D triangle mesh.
 * <p>
 *     Altitudes within the mesh's positions are interpreted according to the mesh's altitude mode, which
 *     can be one of the following:
 * <ul>
 *     <li>[WorldWind.ABSOLUTE]{@link WorldWind#ABSOLUTE}</li>
 *     <li>[WorldWind.RELATIVE_TO_GROUND]{@link WorldWind#RELATIVE_TO_GROUND}</li>
 *     <li>[WorldWind.CLAMP_TO_GROUND]{@link WorldWind#CLAMP_TO_GROUND}</li>
 * </ul>
 * If the latter, the mesh positions' altitudes are ignored. (If the mesh should be draped onto the
 * terrain, you might want to use {@link SurfacePolygon} instead.)
 * <p>
 *     Meshes have separate attributes for normal display and highlighted display. They use the interior and
 *     outline attributes of {@link ShapeAttributes}. If those attributes identify an image, that image is
 *     applied to the mesh. Texture coordinates for the image may be specified, but if not specified the full
 *     image is stretched over the full mesh. If texture coordinates are specified, there must be one texture
 *     coordinate for each vertex in the mesh.
 *
 * @param {Position[]} positions An array containing the mesh vertices.
 * There must be no more than 65536 positions. Use [split]{@link TriangleMesh#split} to subdivide large meshes
 * into smaller ones that fit this limit.
 * @param {Number[]} indices An array of integers identifying the positions of each mesh triangle.
 * Each sequence of three indices defines one triangle in the mesh. The indices identify the index of the
 * position in the associated positions array. The indices for each triangle should be in counter-clockwise
 * order to identify the triangles as front-facing.
 * @param {ShapeAttributes} attributes The attributes to associate with this mesh. May be null, in which case
 * default attributes are associated.
 *
 * @throws {ArgumentError} If the specified positions array is null, empty or undefined, the number of indices
 * is less than 3 or too many positions are specified (limit is 65536).
 */
function TriangleMesh(positions, indices, attributes) {
    if (!positions) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "TriangleMesh", "constructor", "missingPositions"));
    }

    if (positions.length < 1) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "TriangleMesh", "constructor", "missingPositions"));
    }

    // Check for size limit, which is the max number of available indices for a 16-bit unsigned int.
    if (positions.length > 65536) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "TriangleMesh", "constructor",
                "Too many positions. Must be fewer than 65537. Use TriangleMesh.split to split the shape."));
    }

    if (!indices) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "TriangleMesh", "constructor",
                "Indices array is null or undefined"));
    }

    if (indices.length < 3) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "TriangleMesh", "constructor", "Too few indices."));
    }

    AbstractMesh.call(this, attributes);

    // Private. Documentation is with the defined property below and the constructor description above.
    this._positions = positions;

    // Private. Documentation is with the defined property below and the constructor description above.
    this._indices = indices;

    this.referencePosition = this._positions[0];
}

TriangleMesh.prototype = Object.create(AbstractMesh.prototype);

Object.defineProperties(TriangleMesh.prototype, {
    /**
     * This mesh's positions.
     *
     * @type {Position[]}
     * @memberof TriangleMesh.prototype
     */
    positions: {
        get: function () {
            return this._positions;
        },
        set: function (positions) {
            if (!positions) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TriangleMesh", "positions", "missingPositions"));
            }

            this._positions = positions;
            this.referencePosition = this._positions[0];
            this.reset();
        }
    },

    /**
     * The mesh indices, an array of integers identifying the indexes of each triangle. Each index in this
     * array identifies the index of the corresponding position in the [positions]{@link TriangleMesh#positions}
     * array. Each group of three indices in this array identifies the positions of one triangle.
     *
     *
     * @type {Number[]}
     * @memberof TriangleMesh.prototype
     */
    indices: {
        get: function () {
            return this._indices;
        },
        set: function (indices) {
            if (!indices) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TriangleMesh", "indices",
                        "Indices array is null or undefined"));
            }

            this._indices = indices;
            this.meshIndices = null;
            this.reset();
        }
    },

    /**
     * The mesh outline indices, an array of integers identifying the positions in the outline. Each index in
     * this array identifies the index of the corresponding position in the
     * [positions]{@link TriangleMesh#positions} array. The collection of these positions forms the outline
     * of this mesh. May be null, in which case no outline is drawn.
     *
     * @type {Number[]}
     * @default null
     * @memberof TriangleMesh.prototype
     */
    outlineIndices: {
        get: function () {
            return this._outlineIndices;
        },
        set: function (indices) {
            this._outlineIndices = indices;
            this.meshOutlineIndices = null;
            this.reset();
        }
    },

    /**
     * This mesh's texture coordinates if this mesh is textured. A texture coordinate must be
     * provided for each mesh position. Each texture coordinate is a {@link Vec2} containing the s and t
     * coordinates, in that order. If no texture coordinates are specified then texture is not applied to
     * this mesh.
     * @type {Vec2[]}
     * @default null
     * @memberof TriangleMesh.prototype
     */
    textureCoordinates: {
        get: function () {
            return this._textureCoordinates;
        },
        set: function (coords) {

            if (coords && coords.length != this._positions.length) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TriangleMesh", "textureCoordinates",
                        "Number of texture coordinates is inconsistent with the currently specified positions."));
            }

            this._textureCoordinates = coords;
            this.reset();
            this.texCoords = null;
        }
    }
});

// Overridden from AbstractShape base class.
TriangleMesh.prototype.createSurfaceShape = function () {
    if (this._outlineIndices) {
        var boundaries = [];

        for (var i = 0; i < this._outlineIndices.length; i++) {
            boundaries.push(this._positions[this._outlineIndices[i]]);
        }

        return new SurfacePolygon(boundaries, null);
    } else {
        return null;
    }

};

// Overridden from AbstractShape base class.
TriangleMesh.prototype.computeMeshPoints = function (dc, currentData) {
    var eyeDistSquared = Number.MAX_VALUE,
        eyePoint = dc.eyePoint,
        meshPoints = new Float32Array(this._positions.length * 3),
        pt = new Vec3(0, 0, 0),
        k = 0,
        pos, dSquared;

    for (var i = 0; i < this._positions.length; i++) {
        pos = this._positions[i];

        dc.surfacePointForMode(pos.latitude, pos.longitude, pos.altitude * this._altitudeScale,
            this.altitudeMode, pt);

        dSquared = pt.distanceToSquared(eyePoint);
        if (dSquared < eyeDistSquared) {
            eyeDistSquared = dSquared;
        }

        pt.subtract(this.currentData.referencePoint);

        meshPoints[k++] = pt[0];
        meshPoints[k++] = pt[1];
        meshPoints[k++] = pt[2];
    }

    currentData.eyeDistance = Math.sqrt(eyeDistSquared);

    return meshPoints;
};

// Overridden from AbstractShape base class.
TriangleMesh.prototype.computeTexCoords = function () {

    if (!this._textureCoordinates) {
        return null;
    } else {
        // Capture the texture coordinates to a single array parallel to the mesh points array.
        var texCoords = new Float32Array(2 * this._textureCoordinates.length),
            k = 0;

        for (var i = 0, len = this._textureCoordinates.length; i < len; i++) {
            var texCoord = this._textureCoordinates[i];

            texCoords[k++] = texCoord[0];
            texCoords[k++] = texCoord[1];
        }

        return texCoords;
    }
};

// Overridden from AbstractShape base class.
TriangleMesh.prototype.computeMeshIndices = function () {
    var meshIndices = new Uint16Array(this._indices.length);

    for (var i = 0, len = this._indices.length; i < len; i++) {
        meshIndices[i] = this._indices[i];
    }

    return meshIndices;
};

// Overridden from AbstractShape base class.
TriangleMesh.prototype.computeOutlineIndices = function () {
    if (!this._outlineIndices) {
        return null;
    } else {
        var meshOutlineIndices = new Uint16Array(this._outlineIndices.length);

        for (var i = 0; i < this._outlineIndices.length; i++) {
            meshOutlineIndices[i] = this._outlineIndices[i];
        }

        return meshOutlineIndices;
    }
};

/**
 * Splits a triangle mesh into several meshes, each of which contains fewer than 65536 positions.
 * @param {Position[]} positions An array containing the mesh vertices.
 * @param {Number[]} indices An array of integers identifying the positions of each mesh triangle.
 * Each sequence of three indices defines one triangle in the mesh. The indices identify the index of the
 * position in the associated positions array.
 * @param {Vec2[]} textureCoords The mesh's texture coordinates.
 * @param {Number[]} outlineIndices The mesh's outline indices.
 * @returns {Object[]} An array of objects, each of which defines one subdivision of the full mesh. Each object
 * in the array has the properties of the same name as the input arguments.
 */
TriangleMesh.split = function (positions, indices, textureCoords, outlineIndices) {
    var splitPositions = [],
        splitTexCoords = [],
        splitIndices = [],
        indexMap = [],
        result = [],
        originalIndex, mappedIndex;

    for (var i = 0; i <= indices.length; i++) {
        if (i === indices.length || splitPositions.length > 65533 && splitIndices.length % 3 === 0) {
            if (splitPositions.length > 0) {
                var shape = {
                    positions: splitPositions,
                    indices: splitIndices
                };

                if (textureCoords) {
                    shape.textureCoords = splitTexCoords;
                }

                if (outlineIndices) {
                    var splitOutline = [];
                    for (var j = 0; j < outlineIndices.length; j++) {
                        originalIndex = outlineIndices[j];
                        mappedIndex = indexMap[originalIndex];
                        if (mappedIndex) {
                            splitOutline.push(indexMap[outlineIndices[j]]);
                        }
                    }

                    shape.outlineIndices = splitOutline;
                }

                result.push(shape);
            }

            if (i === indices.length) {
                break;
            }

            splitPositions = [];
            splitIndices = [];
            indexMap = [];
        }

        originalIndex = indices[i];
        mappedIndex = indexMap[originalIndex];

        if (!mappedIndex) {
            mappedIndex = splitPositions.length;
            indexMap[originalIndex] = mappedIndex;

            splitPositions.push(positions[originalIndex]);

            if (textureCoords) {
                splitTexCoords.push(textureCoords[originalIndex]);
            }
        }

        splitIndices.push(mappedIndex);
    }

    return result;
};

export default TriangleMesh;
