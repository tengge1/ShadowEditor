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
 * @exports GeographicMesh
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
 * Constructs a geographic mesh.
 * @alias GeographicMesh
 * @constructor
 * @augments AbstractMesh
 * @classdesc Represents a 3D geographic mesh.
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
 * @param {Position[][]} positions A two-dimensional array containing the mesh vertices.
 * Each entry of the array specifies the vertices of one row of the mesh. The arrays for all rows must
 * have the same length. There must be at least two rows, and each row must have at least two vertices.
 * There must be no more than 65536 positions.
 * @param {ShapeAttributes} attributes The attributes to associate with this mesh. May be null, in which case
 * default attributes are associated.
 *
 * @throws {ArgumentError} If the specified positions array is null or undefined, the number of rows or the
 * number of vertices per row is less than 2, the array lengths are inconsistent, or too many positions are
 * specified (limit is 65536).
 */
function GeographicMesh(positions, attributes) {
    if (!positions) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "GeographicMesh", "constructor", "missingPositions"));
    }

    if (positions.length < 2 || positions[0].length < 2) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "GeographicMesh", "constructor",
                "Number of positions is insufficient."));
    }

    // Check for size limit, which is the max number of available indices for a 16-bit unsigned int.
    if (positions.length * positions[0].length > 65536) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "GeographicMesh", "constructor",
                "Too many positions. Must be fewer than 65536. Try using multiple meshes."));
    }

    var length = positions[0].length;
    for (var i = 1; i < positions.length; i++) {
        if (positions[i].length !== length) {
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "GeographicMesh", "constructor",
                    "Array lengths are inconsistent."));
        }
    }

    var numRows = positions.length,
        numCols = positions[0].length;

    AbstractMesh.call(this, attributes);

    /**
     * Indicates whether this mesh is pickable when the pick point intersects transparent pixels of the
     * image applied to this mesh. If no image is applied to this mesh, this property is ignored. If this
     * property is true and an image with fully transparent pixels is applied to the mesh, the mesh is
     * pickable at those transparent pixels, otherwise this mesh is not pickable at those transparent pixels.
     * @type {Boolean}
     * @default true
     */
    this.pickTransparentImagePixels = true;

    // Private. Documentation is with the defined property below and the constructor description above.
    this._positions = positions;

    // Private. Documentation is with the defined property below.
    this._altitudeScale = 1;

    // Internal. Intentionally not documented.
    this.numRows = numRows;
    this.numColumns = numCols;

    // Internal. Intentionally not documented.
    this._textureCoordinates = null;

    // Internal. Intentionally not documented.
    this.referencePosition = this.determineReferencePosition(this._positions);
}

GeographicMesh.prototype = Object.create(AbstractMesh.prototype);

Object.defineProperties(GeographicMesh.prototype, {
    /**
     * This mesh's positions. Each array in the positions array specifies the geographic positions of one
     * row of the mesh.
     *
     * @type {Position[][]}
     * @memberof GeographicMesh.prototype
     */
    positions: {
        get: function () {
            return this._positions;
        },
        set: function (positions) {
            if (!positions) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeographicMesh", "positions", "missingPositions"));
            }

            if (positions.length < 2 || positions[0].length < 2) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeographicMesh", "positions",
                        "Number of positions is insufficient."));
            }

            var length = positions[0].length;
            for (var i = 1; i < positions.length; i++) {
                if (positions[i].length !== length) {
                    throw new ArgumentError(
                        Logger.logMessage(Logger.LEVEL_SEVERE, "GeographicMesh", "positions",
                            "Array lengths are inconsistent."));
                }
            }

            this.numRows = positions.length;
            this.numColumns = positions[0].length;

            this._positions = positions;
            this.referencePosition = this.determineReferencePosition(this._positions);
            this.reset();

            this.meshIndices = null;
            this.outlineIndices = null;
        }
    },

    /**
     * This mesh's texture coordinates if this mesh is textured. A texture coordinate must be
     * provided for each mesh position. The texture coordinates are specified as a two-dimensional array,
     * each entry of which specifies the texture coordinates for one row of the mesh. Each texture coordinate
     * is a {@link Vec2} containing the s and t coordinates. If no texture coordinates are specified and
     * the attributes associated with this mesh indicate an image source, then texture coordinates are
     * automatically generated for the mesh.
     * @type {Vec2[][]}
     * @default null
     * @memberof GeographicMesh.prototype
     */
    textureCoordinates: {
        get: function () {
            return this._textureCoordinates;
        },
        set: function (coords) {

            if (coords && coords.length != this.numRows) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeographicMesh", "textureCoordinates",
                        "Number of texture coordinate rows is inconsistent with the currently specified positions."));
            }

            for (var i = 0; i < this.numRows; i++) {
                if (coords[i].length !== this.numColumns) {
                    throw new ArgumentError(
                        Logger.logMessage(Logger.LEVEL_SEVERE, "GeographicMesh", "textureCoordinates",
                            "Texture coordinate row lengths are inconsistent with the currently specified positions."));
                }
            }

            this._textureCoordinates = coords;
            this.reset();
            this.texCoords = null;
        }
    }
});

GeographicMesh.makeGridIndices = function (nRows, nCols) {
    // Compute indices for individual triangles.

    var gridIndices = [],
        i = 0;

    for (var r = 0; r < nRows - 1; r++) {
        for (var c = 0; c < nCols - 1; c++) {
            var k = r * nCols + c;

            gridIndices[i++] = k;
            gridIndices[i++] = k + 1;
            gridIndices[i++] = k + nCols;
            gridIndices[i++] = k + 1;
            gridIndices[i++] = k + 1 + nCols;
            gridIndices[i++] = k + nCols;
        }
    }

    return gridIndices;
};

// Intentionally not documented.
GeographicMesh.prototype.determineReferencePosition = function (positions) {
    // Assign the first position as the reference position.
    return positions[0][0];
};

// Overridden from AbstractShape base class.
GeographicMesh.prototype.createSurfaceShape = function () {
    var boundaries = [];

    for (var c = 0; c < this.numColumns; c++) {
        boundaries.push(this._positions[0][c]);
    }

    for (var r = 1; r < this.numRows; r++) {
        boundaries.push(this._positions[r][this.numColumns - 1]);
    }

    for (c = this.numColumns - 2; c >= 0; c--) {
        boundaries.push(this._positions[this.numRows - 1][c]);
    }

    for (r = this.numRows - 2; r > 0; r--) {
        boundaries.push(this._positions[r][0]);
    }

    return new SurfacePolygon(boundaries, null);
};

GeographicMesh.prototype.computeMeshPoints = function (dc, currentData) {
    // Unwrap the mesh row arrays into one long array.

    var eyeDistSquared = Number.MAX_VALUE,
        eyePoint = dc.eyePoint,
        meshPoints = new Float32Array(this.numRows * this.numColumns * 3),
        pt = new Vec3(0, 0, 0),
        k = 0,
        pos, dSquared;

    for (var r = 0; r < this._positions.length; r++) {
        for (var c = 0, len = this._positions[r].length; c < len; c++) {
            pos = this._positions[r][c];

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
    }

    currentData.eyeDistance = Math.sqrt(eyeDistSquared);

    return meshPoints;
};

GeographicMesh.prototype.computeTexCoords = function () {
    if (this._textureCoordinates) {
        return this.computeExplicitTexCoords();
    } else {
        return this.computeImplicitTexCoords();
    }
};

// Intentionally not documented.
GeographicMesh.prototype.computeExplicitTexCoords = function () {
    // Capture the texture coordinates to a single array parallel to the mesh points array.

    var texCoords = new Float32Array(2 * this.numRows * this.numColumns),
        k = 0;

    for (var r = 0; r < this._textureCoordinates.length; r++) {
        for (var c = 0, len = this._textureCoordinates[r].length; c < len; c++) {
            var texCoord = this._textureCoordinates[r][c];

            texCoords[k++] = texCoord[0];
            texCoords[k++] = texCoord[1];
        }
    }

    return texCoords;
};

// Intentionally not documented.
GeographicMesh.prototype.computeImplicitTexCoords = function () {
    // Create texture coordinates that map the full image source into the full mesh.

    var texCoords = new Float32Array(2 * this.numRows * this.numColumns),
        rowDelta = 1.0 / (this.numRows - 1),
        columnDelta = 1.0 / (this.numColumns - 1),
        k = 0;

    for (var r = 0; r < this._positions.length; r++) {
        var t = r === this.numRows - 1 ? 1.0 : r * rowDelta;

        for (var c = 0, len = this._positions[r].length; c < len; c++) {
            texCoords[k++] = c === this.numColumns - 1 ? 1.0 : c * columnDelta;
            texCoords[k++] = t;
        }
    }

    return texCoords;
};

GeographicMesh.prototype.computeMeshIndices = function () {
    // Compute indices for individual triangles.

    var meshIndices = new Uint16Array((this.numRows - 1) * (this.numColumns - 1) * 6),
        i = 0;

    for (var r = 0; r < this.numRows - 1; r++) {
        for (var c = 0; c < this.numColumns - 1; c++) {
            var k = r * this.numColumns + c;

            meshIndices[i++] = k;
            meshIndices[i++] = k + 1;
            meshIndices[i++] = k + this.numColumns;
            meshIndices[i++] = k + 1;
            meshIndices[i++] = k + 1 + this.numColumns;
            meshIndices[i++] = k + this.numColumns;
        }
    }

    return meshIndices;
};

GeographicMesh.prototype.computeOutlineIndices = function () {
    // Walk the mesh boundary and capture those positions for the outline.

    var outlineIndices = new Uint16Array(2 * this.numRows + 2 * this.numColumns),
        k = 0;

    for (var c = 0; c < this.numColumns; c++) {
        outlineIndices[k++] = c;
    }

    for (var r = 1; r < this.numRows; r++) {
        outlineIndices[k++] = (r + 1) * this.numColumns - 1;
    }

    for (c = this.numRows * this.numColumns - 2; c >= (this.numRows - 1) * this.numColumns; c--) {
        outlineIndices[k++] = c;
    }

    for (r = this.numRows - 2; r >= 0; r--) {
        outlineIndices[k++] = r * this.numColumns;
    }

    return outlineIndices;
};

export default GeographicMesh;
