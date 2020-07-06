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
 * @exports Polygon
 */
import AbstractShape from '../shapes/AbstractShape';
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
import libtessDummy from '../util/libtess';


/**
 * Constructs a Polygon.
 * @alias Polygon
 * @constructor
 * @augments AbstractShape
 * @classdesc Represents a 3D polygon. The polygon may be extruded to the ground to form a prism. It may have
 * multiple boundaries defining empty portions. See also {@link SurfacePolygon}.
 * <p>
 *     Altitudes within the polygon's positions are interpreted according to the polygon's altitude mode, which
 *     can be one of the following:
 * <ul>
 *     <li>[WorldWind.ABSOLUTE]{@link WorldWind#ABSOLUTE}</li>
 *     <li>[WorldWind.RELATIVE_TO_GROUND]{@link WorldWind#RELATIVE_TO_GROUND}</li>
 *     <li>[WorldWind.CLAMP_TO_GROUND]{@link WorldWind#CLAMP_TO_GROUND}</li>
 * </ul>
 * If the latter, the polygon positions' altitudes are ignored. (If the polygon should be draped onto the
 * terrain, you might want to use {@link SurfacePolygon} instead.)
 * <p>
 *     Polygons have separate attributes for normal display and highlighted display. They use the interior and
 *     outline attributes of {@link ShapeAttributes}. If those attributes identify an image, that image is
 *     applied to the polygon.
 * <p>
 *     A polygon displays as a vertical prism if its [extrude]{@link Polygon#extrude} property is true. A
 *     curtain is formed around its boundaries and extends from the polygon's edges to the ground.
 * <p>
 *     A polygon can be textured, including its extruded boundaries. The textures are specified via the
 *     [imageSource]{@link ShapeAttributes#imageSource} property of the polygon's attributes. If that
 *     property is a single string or {@link ImageSource}, then it identifies the image source for the
 *     polygon's texture. If that property is an array of strings, {@link ImageSource}s or a combination of
 *     those, then the first entry in the array specifies the polygon's image source and subsequent entries
 *     specify the image sources of the polygon's extruded boundaries. If the array contains two entries, the
 *     first is the polygon's image source and the second is the common image source for all extruded
 *     boundaries. If the array contains more than two entries, then the first entry is the polygon's image
 *     source and each subsequent entry is the image source for consecutive extruded boundary segments. A null
 *     value for any entry indicates that no texture is applied for the corresponding polygon or extruded edge
 *     segment. If fewer image sources are specified then there are boundary segments, the last image source
 *     specified is applied to the remaining segments. Texture coordinates for the polygon's texture are
 *     specified via this polygon's [textureCoordinates]{@link Polygon#textureCoordinates} property. Texture
 *     coordinates for extruded boundary segments are implicitly defined to fit the full texture to each
 *     boundary segment.
 * <p>
 *     When displayed on a 2D globe, this polygon displays as a {@link SurfacePolygon} if its
 *     [useSurfaceShapeFor2D]{@link AbstractShape#useSurfaceShapeFor2D} property is true.
 *
 * @param {Position[][] | Position[]} boundaries A two-dimensional array containing the polygon boundaries.
 * Each entry of the array specifies the vertices of one boundary.
 * This argument may also be a simple array of positions,
 * in which case the polygon is assumed to have only one boundary.
 * Each boundary is considered implicitly closed, so the last position of the boundary need not and should not
 * duplicate the first position of the boundary.
 * @param {ShapeAttributes} attributes The attributes to associate with this polygon. May be null, in which case
 * default attributes are associated.
 *
 * @throws {ArgumentError} If the specified boundaries array is null or undefined.
 */
function Polygon(boundaries, attributes) {
    if (!boundaries) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Polygon", "constructor", "missingBoundaries"));
    }

    AbstractShape.call(this, attributes);

    if (boundaries.length > 0 && boundaries[0].latitude) {
        boundaries = [boundaries];
        this._boundariesSpecifiedSimply = true;
    }

    // Private. Documentation is with the defined property below and the constructor description above.
    this._boundaries = boundaries;

    this._textureCoordinates = null;

    this.referencePosition = this.determineReferencePosition(this._boundaries);

    this._extrude = false;

    this.scratchPoint = new Vec3(0, 0, 0); // scratch variable
}

Polygon.prototype = Object.create(AbstractShape.prototype);

Object.defineProperties(Polygon.prototype, {
    /**
     * This polygon's boundaries. A two-dimensional array containing the polygon boundaries. Each entry of the
     * array specifies the vertices of one boundary. This property may also be a simple
     * array of positions, in which case the polygon is assumed to have only one boundary.
     * @type {Position[][] | Position[]}
     * @memberof Polygon.prototype
     */
    boundaries: {
        get: function () {
            return this._boundariesSpecifiedSimply ? this._boundaries[0] : this._boundaries;
        },
        set: function (boundaries) {
            if (!boundaries) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "Polygon", "boundaries", "missingBoundaries"));
            }

            if (boundaries.length > 0 && boundaries[0].latitude) {
                boundaries = [boundaries];
                this._boundariesSpecifiedSimply = true;
            }

            this._boundaries = boundaries;
            this.referencePosition = this.determineReferencePosition(this._boundaries);
            this.reset();
        }
    },

    /**
     * This polygon's texture coordinates if this polygon is to be textured. A texture coordinate must be
     * provided for each boundary position. The texture coordinates are specified as a two-dimensional array,
     * each entry of which specifies the texture coordinates for one boundary. Each texture coordinate is a
     * {@link Vec2} containing the s and t coordinates.
     * @type {Vec2[][]}
     * @default null
     * @memberof Polygon.prototype
     */
    textureCoordinates: {
        get: function () {
            return this._textureCoordinates;
        },
        set: function (value) {
            this._textureCoordinates = value;
            this.reset();
        }
    },

    /**
     * Specifies whether to extrude this polygon to the ground by drawing a filled interior from the polygon
     * to the terrain. The filled interior uses this polygon's interior attributes.
     * @type {Boolean}
     * @default false
     * @memberof Polygon.prototype
     */
    extrude: {
        get: function () {
            return this._extrude;
        },
        set: function (extrude) {
            this._extrude = extrude;
            this.reset();
        }
    }
});

// Intentionally not documented.
Polygon.prototype.determineReferencePosition = function (boundaries) {
    // Assign the first position as the reference position.
    return boundaries.length > 0 && boundaries[0].length > 2 ? boundaries[0][0] : null;
};

// Internal. Determines whether this shape's geometry must be re-computed.
Polygon.prototype.mustGenerateGeometry = function (dc) {
    if (!this.currentData.boundaryPoints) {
        return true;
    }

    if (this.currentData.drawInterior !== this.activeAttributes.drawInterior) {
        return true;
    }

    if (this.altitudeMode === WorldWind.ABSOLUTE) {
        return false;
    }

    return this.currentData.isExpired;
};

// Internal. Indicates whether this polygon should be textured.
Polygon.prototype.hasCapTexture = function () {
    return this.textureCoordinates && this.capImageSource();
};

// Internal. Determines source of this polygon's cap texture. See the class description above for the policy.
Polygon.prototype.capImageSource = function () {
    if (!this.activeAttributes.imageSource) {
        return null;
    }

    if (typeof this.activeAttributes.imageSource === "string"
        || this.activeAttributes.imageSource instanceof ImageSource) {
        return this.activeAttributes.imageSource;
    }

    if (Array.isArray(this.activeAttributes.imageSource)
        && this.activeAttributes.imageSource[0]
        && (typeof this.activeAttributes.imageSource[0] === "string"
            || this.activeAttributes.imageSource instanceof ImageSource)) {
        return this.activeAttributes.imageSource[0];
    }

    return null;
};

// Internal. Indicates whether this polygon has side textures defined.
Polygon.prototype.hasSideTextures = function () {
    return this.activeAttributes.imageSource &&
        Array.isArray(this.activeAttributes.imageSource) &&
        this.activeAttributes.imageSource.length > 1;
};

// Internal. Determines the side texture for a specified side. See the class description above for the policy.
Polygon.prototype.sideImageSource = function (side) {
    if (side === 0 || this.activeAttributes.imageSource.length === 2) {
        return this.activeAttributes.imageSource[1];
    }

    var numSideTextures = this.activeAttributes.imageSource.length - 1;
    side = Math.min(side + 1, numSideTextures);
    return this.activeAttributes.imageSource[side];
};

Polygon.prototype.createSurfaceShape = function () {
    return new SurfacePolygon(this.boundaries, null);
};

// Overridden from AbstractShape base class.
Polygon.prototype.doMakeOrderedRenderable = function (dc) {
    // A null reference position is a signal that there are no boundaries to render.
    if (!this.referencePosition) {
        return null;
    }

    if (!this.activeAttributes.drawInterior && !this.activeAttributes.drawOutline) {
        return null;
    }

    // See if the current shape data can be re-used.
    if (!this.mustGenerateGeometry(dc)) {
        return this;
    }

    var currentData = this.currentData;

    // Set the transformation matrix to correspond to the reference position.
    var refPt = currentData.referencePoint;
    dc.surfacePointForMode(this.referencePosition.latitude, this.referencePosition.longitude,
        this.referencePosition.altitude, this._altitudeMode, refPt);
    currentData.transformationMatrix.setToTranslation(refPt[0], refPt[1], refPt[2]);

    // Close the boundaries.
    var fullBoundaries = [];
    for (var b = 0; b < this._boundaries.length; b++) {
        fullBoundaries[b] = this._boundaries[b].slice(0); // clones the array
        fullBoundaries[b].push(this._boundaries[b][0]); // appends the first position to the boundary
    }

    // Convert the geographic coordinates to the Cartesian coordinates that will be rendered.
    var boundaryPoints = this.computeBoundaryPoints(dc, fullBoundaries);

    // Tessellate the polygon if its interior is to be drawn.
    if (this.activeAttributes.drawInterior) {
        var capVertices = this.tessellatePolygon(dc, boundaryPoints);
        if (capVertices) {
            // Must copy the vertices to a typed array. (Can't use typed array to begin with because its size
            // is unknown prior to tessellation.)
            currentData.capTriangles = new Float32Array(capVertices.length);
            for (var i = 0, len = capVertices.length; i < len; i++) {
                currentData.capTriangles[i] = capVertices[i];
            }
        }
    }

    currentData.boundaryPoints = boundaryPoints;
    currentData.drawInterior = this.activeAttributes.drawInterior; // remember for validation
    this.resetExpiration(currentData);
    currentData.refreshBuffers = true; // causes VBOs to be reloaded

    // Create the extent from the Cartesian points. Those points are relative to this path's reference point,
    // so translate the computed extent to the reference point.
    if (!currentData.extent) {
        currentData.extent = new BoundingBox();
    }
    if (boundaryPoints.length === 1) {
        currentData.extent.setToPoints(boundaryPoints[0]);
    } else {
        var allPoints = [];
        for (b = 0; b < boundaryPoints.length; b++) {
            for (var p = 0; p < boundaryPoints[b].length; p++) {
                allPoints.push(boundaryPoints[b][p]);
            }
        }
        currentData.extent.setToPoints(allPoints);
    }
    currentData.extent.translate(currentData.referencePoint);

    return this;
};

// Private. Intentionally not documented.
Polygon.prototype.computeBoundaryPoints = function (dc, boundaries) {
    var eyeDistSquared = Number.MAX_VALUE,
        eyePoint = dc.eyePoint,
        boundaryPoints = [],
        stride = this._extrude ? 6 : 3,
        pt = new Vec3(0, 0, 0),
        numBoundaryPoints, pos, k, dSquared;

    for (var b = 0; b < boundaries.length; b++) {
        numBoundaryPoints = (this._extrude ? 2 : 1) * boundaries[b].length;
        boundaryPoints[b] = new Float32Array(numBoundaryPoints * 3);

        for (var i = 0, len = boundaries[b].length; i < len; i++) {
            pos = boundaries[b][i];

            dc.surfacePointForMode(pos.latitude, pos.longitude, pos.altitude, this.altitudeMode, pt);

            dSquared = pt.distanceToSquared(eyePoint);
            if (dSquared < eyeDistSquared) {
                eyeDistSquared = dSquared;
            }

            pt.subtract(this.currentData.referencePoint);

            k = stride * i;
            boundaryPoints[b][k] = pt[0];
            boundaryPoints[b][k + 1] = pt[1];
            boundaryPoints[b][k + 2] = pt[2];

            if (this._extrude) {
                dc.surfacePointForMode(pos.latitude, pos.longitude, 0, WorldWind.CLAMP_TO_GROUND, pt);

                dSquared = pt.distanceToSquared(eyePoint);
                if (dSquared < eyeDistSquared) {
                    eyeDistSquared = dSquared;
                }

                pt.subtract(this.currentData.referencePoint);

                boundaryPoints[b][k + 3] = pt[0];
                boundaryPoints[b][k + 4] = pt[1];
                boundaryPoints[b][k + 5] = pt[2];
            }
        }
    }

    this.currentData.eyeDistance = 0;
    /*DO NOT COMMITMath.sqrt(eyeDistSquared);*/

    return boundaryPoints;
};

Polygon.prototype.tessellatePolygon = function (dc, boundaryPoints) {
    var triangles = [], // the output list of triangles
        error = 0,
        stride = this._extrude ? 6 : 3,
        includeTextureCoordinates = this.hasCapTexture(),
        coords, normal;

    if (!this.polygonTessellator) {
        this.polygonTessellator = new libtess.GluTesselator();

        this.polygonTessellator.gluTessCallback(libtess.gluEnum.GLU_TESS_VERTEX_DATA,
            function (data, tris) {
                tris[tris.length] = data[0];
                tris[tris.length] = data[1];
                tris[tris.length] = data[2];

                if (includeTextureCoordinates) {
                    tris[tris.length] = data[3];
                    tris[tris.length] = data[4];
                }
            });

        this.polygonTessellator.gluTessCallback(libtess.gluEnum.GLU_TESS_COMBINE,
            function (coords, data, weight) {
                var newCoords = [coords[0], coords[1], coords[2]];

                if (includeTextureCoordinates) {
                    for (var i = 3; i <= 4; i++) {
                        var value = 0;
                        for (var w = 0; w < 4; w++) {
                            if (weight[w] > 0) {
                                value += weight[w] * data[w][i];
                            }
                        }

                        newCoords[i] = value;
                    }
                }

                return newCoords;
            });

        this.polygonTessellator.gluTessCallback(libtess.gluEnum.GLU_TESS_ERROR,
            function (errno) {
                error = errno;
                Logger.logMessage(Logger.LEVEL_WARNING, "Polygon", "tessellatePolygon",
                    "Tessellation error " + errno + ".");
            });
    }

    // Compute a normal vector for the polygon.
    normal = Vec3.computeBufferNormal(boundaryPoints[0], stride);
    if (!normal) {
        normal = new Vec3(0, 0, 0);
        // The first boundary is colinear. Fall back to the surface normal.
        dc.globe.surfaceNormalAtLocation(this.referencePosition.latitude, this.referencePosition.longitude,
            normal);
    }
    this.polygonTessellator.gluTessNormal(normal[0], normal[1], normal[2]);
    this.currentData.capNormal = normal;

    // Tessellate the polygon.
    this.polygonTessellator.gluTessBeginPolygon(triangles);
    for (var b = 0; b < boundaryPoints.length; b++) {
        var t = 0;
        this.polygonTessellator.gluTessBeginContour();
        var contour = boundaryPoints[b];
        for (var c = 0; c < contour.length; c += stride) {
            coords = [contour[c], contour[c + 1], contour[c + 2]];
            if (includeTextureCoordinates) {
                if (t < this.textureCoordinates[b].length) {
                    coords[3] = this.textureCoordinates[b][t][0];
                    coords[4] = this.textureCoordinates[b][t][1];
                } else {
                    coords[3] = this.textureCoordinates[b][0][0];
                    coords[4] = this.textureCoordinates[b][1][1];
                }
                ++t;
            }
            this.polygonTessellator.gluTessVertex(coords, coords);
        }
        this.polygonTessellator.gluTessEndContour();
    }
    this.polygonTessellator.gluTessEndPolygon();

    return error === 0 ? triangles : null;
};

// Private. Intentionally not documented.
Polygon.prototype.mustDrawVerticals = function (dc) {
    return this._extrude
        && this.activeAttributes.drawOutline
        && this.activeAttributes.drawVerticals
        && this.altitudeMode !== WorldWind.CLAMP_TO_GROUND;
};

// Overridden from AbstractShape base class.
Polygon.prototype.doRenderOrdered = function (dc) {
    var currentData = this.currentData,
        pickColor;

    if (dc.pickingMode) {
        pickColor = dc.uniquePickColor();
    }

    // Draw the cap if the interior requested and we were able to tessellate the polygon.
    if (this.activeAttributes.drawInterior && currentData.capTriangles && currentData.capTriangles.length > 0) {
        this.drawCap(dc, pickColor);
    }

    if (this._extrude && this.activeAttributes.drawInterior) {
        this.drawSides(dc, pickColor);
    }

    if (this.activeAttributes.drawOutline) {
        this.drawOutline(dc, pickColor);
    }

    currentData.refreshBuffers = false;

    if (dc.pickingMode) {
        var po = new PickedObject(pickColor, this.pickDelegate ? this.pickDelegate : this, null,
            this.layer, false);
        dc.resolvePick(po);
    }
};

Polygon.prototype.drawCap = function (dc, pickColor) {
    var gl = dc.currentGlContext,
        program = dc.currentProgram,
        currentData = this.currentData,
        refreshBuffers = currentData.refreshBuffers,
        hasCapTexture = !!this.hasCapTexture(),
        applyLighting = this.activeAttributes.applyLighting,
        numCapVertices = currentData.capTriangles.length / (hasCapTexture ? 5 : 3),
        vboId, color, stride, textureBound, capBuffer;

    // Assume no cap texture.
    program.loadTextureEnabled(gl, false);

    this.applyMvpMatrix(dc);

    if (!currentData.capVboCacheKey) {
        currentData.capVboCacheKey = dc.gpuResourceCache.generateCacheKey();
    }

    vboId = dc.gpuResourceCache.resourceForKey(currentData.capVboCacheKey);
    if (!vboId) {
        vboId = gl.createBuffer();
        dc.gpuResourceCache.putResource(currentData.capVboCacheKey, vboId, currentData.capTriangles.length * 4);
        refreshBuffers = true;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vboId);
    if (refreshBuffers) {
        capBuffer = applyLighting ? this.makeCapBufferWithNormals() : currentData.capTriangles;
        gl.bufferData(gl.ARRAY_BUFFER, capBuffer, gl.STATIC_DRAW);
        dc.frameStatistics.incrementVboLoadCount(1);
    }

    color = this.activeAttributes.interiorColor;
    // Disable writing the shape's fragments to the depth buffer when the interior is semi-transparent.
    gl.depthMask(color.alpha * this.layer.opacity >= 1 || dc.pickingMode);
    program.loadColor(gl, dc.pickingMode ? pickColor : color);
    program.loadOpacity(gl, dc.pickingMode ? 1 : this.layer.opacity);

    stride = 12 + (hasCapTexture ? 8 : 0) + (applyLighting ? 12 : 0);

    if (hasCapTexture && !dc.pickingMode) {
        this.activeTexture = dc.gpuResourceCache.resourceForKey(this.capImageSource());
        if (!this.activeTexture) {
            this.activeTexture =
                dc.gpuResourceCache.retrieveTexture(dc.currentGlContext, this.capImageSource());
        }

        textureBound = this.activeTexture && this.activeTexture.bind(dc);
        if (textureBound) {
            gl.enableVertexAttribArray(program.vertexTexCoordLocation);
            gl.vertexAttribPointer(program.vertexTexCoordLocation, 2, gl.FLOAT, false, stride, 12);

            this.scratchMatrix.setToIdentity();
            this.scratchMatrix.multiplyByTextureTransform(this.activeTexture);

            program.loadTextureEnabled(gl, true);
            program.loadTextureUnit(gl, gl.TEXTURE0);
            program.loadTextureMatrix(gl, this.scratchMatrix);
            program.loadModulateColor(gl, dc.pickingMode);
        }
    }

    if (applyLighting && !dc.pickingMode) {
        program.loadApplyLighting(gl, true);
        gl.enableVertexAttribArray(program.normalVectorLocation);
        gl.vertexAttribPointer(program.normalVectorLocation, 3, gl.FLOAT, false, stride, stride - 12);
    }

    gl.vertexAttribPointer(program.vertexPointLocation, 3, gl.FLOAT, false, stride, 0);
    gl.drawArrays(gl.TRIANGLES, 0, numCapVertices);
};

Polygon.prototype.makeCapBufferWithNormals = function () {
    var currentData = this.currentData,
        normal = currentData.capNormal,
        numFloatsIn = this.hasCapTexture() ? 5 : 3,
        numFloatsOut = numFloatsIn + 3,
        numVertices = currentData.capTriangles.length / numFloatsIn,
        bufferIn = currentData.capTriangles,
        bufferOut = new Float32Array(numVertices * numFloatsOut),
        k = 0;

    for (var i = 0; i < numVertices; i++) {
        for (var j = 0; j < numFloatsIn; j++) {
            bufferOut[k++] = bufferIn[i * numFloatsIn + j];
        }

        bufferOut[k++] = normal[0];
        bufferOut[k++] = normal[1];
        bufferOut[k++] = normal[2];
    }

    return bufferOut;
};

Polygon.prototype.drawSides = function (dc, pickColor) {
    var gl = dc.currentGlContext,
        program = dc.currentProgram,
        currentData = this.currentData,
        refreshBuffers = currentData.refreshBuffers,
        hasSideTextures = this.hasSideTextures(),
        applyLighting = this.activeAttributes.applyLighting,
        numFloatsPerVertex = 3 + (hasSideTextures ? 2 : 0) + (applyLighting ? 3 : 0),
        numBytesPerVertex = 4 * numFloatsPerVertex,
        vboId, opacity, color, textureBound, sidesBuffer, numSides;

    numSides = 0;
    for (var b = 0; b < currentData.boundaryPoints.length; b++) { // for each boundary}
        numSides += currentData.boundaryPoints[b].length / 6 - 1; // 6 floats per boundary point: top + bottom
    }

    if (!currentData.sidesVboCacheKey) {
        currentData.sidesVboCacheKey = dc.gpuResourceCache.generateCacheKey();
    }

    vboId = dc.gpuResourceCache.resourceForKey(currentData.sidesVboCacheKey);
    if (!vboId || refreshBuffers) {
        sidesBuffer = this.makeSidesBuffer(numSides);
        currentData.numSideVertices = sidesBuffer.length / numFloatsPerVertex;

        if (!vboId) {
            vboId = gl.createBuffer();
        }

        dc.gpuResourceCache.putResource(currentData.sidesVboCacheKey, vboId, sidesBuffer.length * 4);
        gl.bindBuffer(gl.ARRAY_BUFFER, vboId);
        gl.bufferData(gl.ARRAY_BUFFER, sidesBuffer, gl.STATIC_DRAW);
        dc.frameStatistics.incrementVboLoadCount(1);
    } else {
        gl.bindBuffer(gl.ARRAY_BUFFER, vboId);
    }

    color = this.activeAttributes.interiorColor;
    // Disable writing the shape's fragments to the depth buffer when the interior is semi-transparent.
    gl.depthMask(color.alpha * this.layer.opacity >= 1 || dc.pickingMode);
    program.loadColor(gl, dc.pickingMode ? pickColor : color);
    program.loadOpacity(gl, dc.pickingMode ? 1 : this.layer.opacity);

    if (hasSideTextures && !dc.pickingMode) {
        if (applyLighting) {
            program.loadApplyLighting(gl, true);
            gl.enableVertexAttribArray(program.normalVectorLocation);
        } else {
            program.loadApplyLighting(gl, false);
        }

        // Step through the sides buffer rendering each side independently but from the same buffer.
        for (var side = 0; side < numSides; side++) {
            var sideImageSource = this.sideImageSource(side),
                sideTexture = dc.gpuResourceCache.resourceForKey(sideImageSource),
                coordByteOffset = side * 6 * numBytesPerVertex; // 6 vertices (2 triangles) per side

            if (sideImageSource && !sideTexture) {
                sideTexture = dc.gpuResourceCache.retrieveTexture(dc.currentGlContext, sideImageSource);
            }

            textureBound = sideTexture && sideTexture.bind(dc);
            if (textureBound) {
                gl.enableVertexAttribArray(program.vertexTexCoordLocation);
                gl.vertexAttribPointer(program.vertexTexCoordLocation, 2, gl.FLOAT, false, numBytesPerVertex,
                    coordByteOffset + 12);

                this.scratchMatrix.setToIdentity();
                this.scratchMatrix.multiplyByTextureTransform(sideTexture);

                program.loadTextureEnabled(gl, true);
                program.loadTextureUnit(gl, gl.TEXTURE0);
                program.loadTextureMatrix(gl, this.scratchMatrix);
            } else {
                program.loadTextureEnabled(gl, false);
                gl.disableVertexAttribArray(program.vertexTexCoordLocation);
            }

            if (applyLighting) {
                gl.vertexAttribPointer(program.normalVectorLocation, 3, gl.FLOAT, false, numBytesPerVertex,
                    coordByteOffset + 20);
            }

            gl.vertexAttribPointer(program.vertexPointLocation, 3, gl.FLOAT, false, numBytesPerVertex,
                coordByteOffset);
            gl.drawArrays(gl.TRIANGLES, 0, 6); // 6 vertices per side
        }
    } else {
        program.loadTextureEnabled(gl, false);

        if (applyLighting && !dc.pickingMode) {
            program.loadApplyLighting(gl, true);
            gl.enableVertexAttribArray(program.normalVectorLocation);
            gl.vertexAttribPointer(program.normalVectorLocation, 3, gl.FLOAT, false, numBytesPerVertex,
                numBytesPerVertex - 12);
        } else {
            program.loadApplyLighting(gl, false);
        }

        gl.vertexAttribPointer(program.vertexPointLocation, 3, gl.FLOAT, false, numBytesPerVertex, 0);
        gl.drawArrays(gl.TRIANGLES, 0, currentData.numSideVertices);
    }
};

Polygon.prototype.makeSidesBuffer = function (numSides) {
    var currentData = this.currentData,
        hasSideTextures = this.hasSideTextures(),
        applyLighting = this.activeAttributes.applyLighting,
        numFloatsPerVertex = 3 + (hasSideTextures ? 2 : 0) + (applyLighting ? 3 : 0),
        sidesBuffer, sidesBufferIndex, numBufferFloats, v0, v1, v2, v3, t0, t1, t2, t3;

    numBufferFloats = numSides * 2 * 3 * numFloatsPerVertex; // 2 triangles per side, 3 vertices per triangle
    sidesBuffer = new Float32Array(numBufferFloats);
    sidesBufferIndex = 0;

    v0 = new Vec3(0, 0, 0);
    v1 = new Vec3(0, 0, 0);
    v2 = new Vec3(0, 0, 0);
    v3 = new Vec3(0, 0, 0);

    if (hasSideTextures) {
        t0 = new Vec2(0, 1);
        t1 = new Vec2(0, 0);
        t2 = new Vec2(1, 1);
        t3 = new Vec2(1, 0);
    } else {
        t0 = t1 = t2 = t3 = null;
    }

    for (var b = 0; b < currentData.boundaryPoints.length; b++) { // for each boundary}
        var boundaryPoints = currentData.boundaryPoints[b],
            sideNormal;

        for (var i = 0; i < boundaryPoints.length - 6; i += 6) {
            v0[0] = boundaryPoints[i];
            v0[1] = boundaryPoints[i + 1];
            v0[2] = boundaryPoints[i + 2];

            v1[0] = boundaryPoints[i + 3];
            v1[1] = boundaryPoints[i + 4];
            v1[2] = boundaryPoints[i + 5];

            v2[0] = boundaryPoints[i + 6];
            v2[1] = boundaryPoints[i + 7];
            v2[2] = boundaryPoints[i + 8];

            v3[0] = boundaryPoints[i + 9];
            v3[1] = boundaryPoints[i + 10];
            v3[2] = boundaryPoints[i + 11];

            sideNormal = applyLighting ? Vec3.computeTriangleNormal(v0, v1, v2) : null;

            // First triangle.
            this.addVertexToBuffer(v0, t0, sideNormal, sidesBuffer, sidesBufferIndex);
            sidesBufferIndex += numFloatsPerVertex;

            this.addVertexToBuffer(v1, t1, sideNormal, sidesBuffer, sidesBufferIndex);
            sidesBufferIndex += numFloatsPerVertex;

            this.addVertexToBuffer(v2, t2, sideNormal, sidesBuffer, sidesBufferIndex);
            sidesBufferIndex += numFloatsPerVertex;

            // Second triangle.
            this.addVertexToBuffer(v1, t1, sideNormal, sidesBuffer, sidesBufferIndex);
            sidesBufferIndex += numFloatsPerVertex;

            this.addVertexToBuffer(v3, t3, sideNormal, sidesBuffer, sidesBufferIndex);
            sidesBufferIndex += numFloatsPerVertex;

            this.addVertexToBuffer(v2, t2, sideNormal, sidesBuffer, sidesBufferIndex);
            sidesBufferIndex += numFloatsPerVertex;
        }
    }

    return sidesBuffer;
};

Polygon.prototype.addVertexToBuffer = function (v, texCoord, normal, buffer, bufferIndex) {
    buffer[bufferIndex++] = v[0];
    buffer[bufferIndex++] = v[1];
    buffer[bufferIndex++] = v[2];

    if (texCoord) {
        buffer[bufferIndex++] = texCoord[0];
        buffer[bufferIndex++] = texCoord[1];
    }

    if (normal) {
        buffer[bufferIndex++] = normal[0];
        buffer[bufferIndex++] = normal[1];
        buffer[bufferIndex] = normal[2];
    }
};

Polygon.prototype.drawOutline = function (dc, pickColor) {
    var gl = dc.currentGlContext,
        program = dc.currentProgram,
        currentData = this.currentData,
        refreshBuffers = currentData.refreshBuffers,
        numBoundaryPoints, vboId, opacity, color, stride, nPts, textureBound;

    program.loadTextureEnabled(gl, false);
    program.loadApplyLighting(gl, false);

    if (this.hasCapTexture()) {
        gl.disableVertexAttribArray(program.vertexTexCoordLocation); // we're not texturing the outline
    }

    if (this.activeAttributes.applyLighting) {
        gl.disableVertexAttribArray(program.normalVectorLocation); // we're not lighting the outline
    }

    if (!currentData.boundaryVboCacheKeys) {
        this.currentData.boundaryVboCacheKeys = [];
    }

    // Make the outline stand out from the interior.
    this.applyMvpMatrixForOutline(dc);

    program.loadTextureEnabled(gl, false);
    gl.disableVertexAttribArray(program.vertexTexCoordLocation);

    for (var b = 0; b < currentData.boundaryPoints.length; b++) { // for each boundary}
        numBoundaryPoints = currentData.boundaryPoints[b].length / 3;

        if (!currentData.boundaryVboCacheKeys[b]) {
            currentData.boundaryVboCacheKeys[b] = dc.gpuResourceCache.generateCacheKey();
        }

        vboId = dc.gpuResourceCache.resourceForKey(currentData.boundaryVboCacheKeys[b]);
        if (!vboId) {
            vboId = gl.createBuffer();
            dc.gpuResourceCache.putResource(currentData.boundaryVboCacheKeys[b], vboId, numBoundaryPoints * 12);
            refreshBuffers = true;
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, vboId);
        if (refreshBuffers) {
            gl.bufferData(gl.ARRAY_BUFFER, currentData.boundaryPoints[b], gl.STATIC_DRAW);
            dc.frameStatistics.incrementVboLoadCount(1);
        }

        color = this.activeAttributes.outlineColor;
        // Disable writing the shape's fragments to the depth buffer when the interior is semi-transparent.
        gl.depthMask(color.alpha * this.layer.opacity >= 1 || dc.pickingMode);
        program.loadColor(gl, dc.pickingMode ? pickColor : color);
        program.loadOpacity(gl, dc.pickingMode ? 1 : this.layer.opacity);

        gl.lineWidth(this.activeAttributes.outlineWidth);

        if (this._extrude) {
            stride = 24;
            nPts = numBoundaryPoints / 2;
        } else {
            stride = 12;
            nPts = numBoundaryPoints;
        }

        gl.vertexAttribPointer(program.vertexPointLocation, 3, gl.FLOAT, false, stride, 0);
        gl.drawArrays(gl.LINE_STRIP, 0, nPts);

        if (this.mustDrawVerticals(dc)) {
            gl.vertexAttribPointer(program.vertexPointLocation, 3, gl.FLOAT, false, 0, 0);
            gl.drawArrays(gl.LINES, 0, numBoundaryPoints - 2);
        }
    }
};

// Overridden from AbstractShape base class.
Polygon.prototype.beginDrawing = function (dc) {
    var gl = dc.currentGlContext;

    if (this.activeAttributes.drawInterior) {
        gl.disable(gl.CULL_FACE);
    }

    dc.findAndBindProgram(BasicTextureProgram);
    gl.enableVertexAttribArray(dc.currentProgram.vertexPointLocation);

    var applyLighting = !dc.pickMode && this.activeAttributes.applyLighting;
    if (applyLighting) {
        dc.currentProgram.loadModelviewInverse(gl, dc.modelviewNormalTransform);
    }
};

// Overridden from AbstractShape base class.
Polygon.prototype.endDrawing = function (dc) {
    var gl = dc.currentGlContext;

    gl.disableVertexAttribArray(dc.currentProgram.vertexPointLocation);
    gl.disableVertexAttribArray(dc.currentProgram.normalVectorLocation);
    gl.depthMask(true);
    gl.lineWidth(1);
    gl.enable(gl.CULL_FACE);
};

export default Polygon;
