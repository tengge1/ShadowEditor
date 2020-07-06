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
 * @exports AbstractMesh
 */
import AbstractShape from '../shapes/AbstractShape';
import ArgumentError from '../error/ArgumentError';
import BasicTextureProgram from '../shaders/BasicTextureProgram';
import BoundingBox from '../geom/BoundingBox';
import Color from '../util/Color';
import ImageSource from '../util/ImageSource';
import Line from '../geom/Line';
import Location from '../geom/Location';
import Logger from '../util/Logger';
import Matrix from '../geom/Matrix';
import PickedObject from '../pick/PickedObject';
import Position from '../geom/Position';
import ShapeAttributes from '../shapes/ShapeAttributes';
import Vec2 from '../geom/Vec2';
import Vec3 from '../geom/Vec3';
import WWMath from '../util/WWMath';


/**
 * Constructs an abstract mesh. Applications do not call this constructor. It is called only by subclasses of
 * this abstract class.
 * @alias AbstractMesh
 * @constructor
 * @augments AbstractShape
 * @classdesc Provides an abstract base class for mesh shapes.
 *
 * @param {ShapeAttributes} attributes The attributes to associate with this mesh. May be null, in which case
 * default attributes are associated.
 */
function AbstractMesh(attributes) {
    AbstractShape.call(this, attributes);

    /**
     * Indicates whether this mesh is pickable when the pick point intersects transparent pixels of the
     * image applied to this mesh. If no image is applied to this mesh, this property is ignored. If this
     * property is true and an image with fully transparent pixels is applied to the mesh, the mesh is
     * pickable at those transparent pixels, otherwise this mesh is not pickable at those transparent pixels.
     * @type {Boolean}
     * @default true
     */
    this.pickTransparentImagePixels = true;

    // Private. Documentation is with the defined property below.
    this._altitudeScale = 1;
}

AbstractMesh.prototype = Object.create(AbstractShape.prototype);

Object.defineProperties(AbstractMesh.prototype, {
    /**
     * Scales the altitudes of this mesh.
     * @type {Number}
     * @default 1
     * @memberof AbstractMesh.prototype
     */
    altitudeScale: {
        get: function () {
            return this._altitudeScale;
        },
        set: function (value) {
            this._altitudeScale = value;
            this.reset();
        }
    }
});

// Internal. Determines whether this shape's geometry must be re-computed.
AbstractMesh.prototype.mustGenerateGeometry = function (dc) {
    if (!this.currentData.meshPoints) {
        return true;
    }

    if (this.currentData.drawInterior !== this.activeAttributes.drawInterior) {
        return true;
    }

    if (this.activeAttributes.applyLighting && !this.currentData.normals) {
        return true;
    }

    if (this.altitudeMode === WorldWind.ABSOLUTE) {
        return false;
    }

    return this.currentData.isExpired;
};

// Overridden from AbstractShape base class.
AbstractMesh.prototype.doMakeOrderedRenderable = function (dc) {
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
        this.referencePosition.altitude * this._altitudeScale, this._altitudeMode, refPt);
    currentData.transformationMatrix.setToTranslation(refPt[0], refPt[1], refPt[2]);

    // Convert the geographic coordinates to the Cartesian coordinates that will be rendered.
    currentData.meshPoints = this.computeMeshPoints(dc, currentData);
    currentData.refreshVertexBuffer = true;

    // Capture texture coordinates in a parallel array to the mesh points. These are associated with this
    // shape, itself, because they're independent of elevation or globe state.
    if (this.activeAttributes.imageSource && !this.texCoords) {
        this.texCoords = this.computeTexCoords();
        if (this.texCoords) {
            currentData.refreshTexCoordBuffer = true;
        }
    }

    // Compute the mesh and outline indices. These are associated with this shape, itself, because they're
    // independent of elevation and globe state.
    if (!this.meshIndices) {
        this.meshIndices = this.computeMeshIndices();
        currentData.refreshMeshIndices = true;
    }

    if (!this.meshOutlineIndices) {
        this.meshOutlineIndices = this.computeOutlineIndices();
        if (this.meshOutlineIndices) {
            currentData.refreshOutlineIndices = true;
        }
    }

    if (this.activeAttributes.applyLighting) {
        this.computeNormals(currentData);
    }

    currentData.drawInterior = this.activeAttributes.drawInterior; // remember for validation
    this.resetExpiration(currentData);

    // Create the extent from the Cartesian points. Those points are relative to this path's reference point,
    // so translate the computed extent to the reference point.
    if (!currentData.extent) {
        currentData.extent = new BoundingBox();
    }

    currentData.extent.setToPoints(currentData.meshPoints);
    currentData.extent.translate(currentData.referencePoint);

    return this;
};

// Private. Intentionally not documented.
/**
 * Computes this mesh's Cartesian points. Called by this abstract class during rendering to compute
 * Cartesian points from geographic positions. This method must be overridden by subclasses. An
 * exception is thrown if it is not.
 *
 * This method must also assign currentData.eyeDistance to be the minimum distance from this mesh to the
 * current eye point.
 *
 * @param {DrawContext} dc The current draw context.
 * @param {{}} currentData The current data for this shape.
 * @returns {Float32Array} The Cartesian mesh points.
 * @protected
 */
AbstractMesh.prototype.computeMeshPoints = function (dc, currentData) {
    throw new UnsupportedOperationError(
        Logger.logMessage(Logger.LEVEL_SEVERE, "AbstractMesh", "computeMeshPoints", "abstractInvocation"));
};

// Intentionally not documented.
/**
 * Computes the texture coordinates for this shape. Called by this abstract class during rendering to copy or
 * compute texture coordinates into a typed array. Subclasses should implement this method if the shape they
 * define has texture coordinates. The default implementation returns null.
 *
 * @returns {Float32Array} The texture coordinates.
 * @protected
 */
AbstractMesh.prototype.computeTexCoords = function () {
    // Default implementation does nothing.
    return null;
};

/**
 * Computes or copies the indices of this mesh into a Uint16Array. Subclasses must implement this method.
 * An exception is thrown if it is not implemented.
 * @param {{}} currentData This shape's current data.
 * @protected
 */
AbstractMesh.prototype.computeMeshIndices = function (currentData) {
    throw new UnsupportedOperationError(
        Logger.logMessage(Logger.LEVEL_SEVERE, "AbstractMesh", "computeMeshIndices", "abstractInvocation"));
};

/**
 * Computes or copies the outline indices of this mesh into a Uint16Array. Subclasses must implement this
 * method if they have outlines. The default implementation returns null.
 * @param {{}} currentData This shape's current data.
 * @protected
 */
AbstractMesh.prototype.computeOutlineIndices = function (currentData) {
    // Default implementation does nothing.
};

// Internal. Intentionally not documented.
AbstractMesh.prototype.computeNormals = function (currentData) {
    var normalsBuffer = new Float32Array(currentData.meshPoints.length),
        indices = this.meshIndices,
        vertices = currentData.meshPoints,
        normals = [],
        triPoints = [new Vec3(0, 0, 0), new Vec3(0, 0, 0), new Vec3(0, 0, 0)],
        k;

    // For each triangle, compute its normal assign it to each participating index.
    for (var i = 0; i < indices.length; i += 3) {
        for (var j = 0; j < 3; j++) {
            k = indices[i + j];
            triPoints[j].set(vertices[3 * k], vertices[3 * k + 1], vertices[3 * k + 2]);
        }

        var n = Vec3.computeTriangleNormal(triPoints[0], triPoints[1], triPoints[2]);

        for (j = 0; j < 3; j++) {
            k = indices[i + j];
            if (!normals[k]) {
                normals[k] = [];
            }

            normals[k].push(n);
        }
    }

    // Average the normals associated with each index and add the result to the normals buffer.
    n = new Vec3(0, 0, 0);
    for (i = 0; i < normals.length; i++) {
        if (normals[i]) {
            Vec3.average(normals[i], n);
            n.normalize();
            normalsBuffer[i * 3] = n[0];
            normalsBuffer[i * 3 + 1] = n[1];
            normalsBuffer[i * 3 + 2] = n[2];
        } else {
            normalsBuffer[i * 3] = 0;
            normalsBuffer[i * 3 + 1] = 0;
            normalsBuffer[i * 3 + 2] = 0;
        }
    }

    currentData.normals = normalsBuffer;
    currentData.refreshNormalsBuffer = true;
};

// Overridden from AbstractShape base class.
AbstractMesh.prototype.doRenderOrdered = function (dc) {
    var gl = dc.currentGlContext,
        program = dc.currentProgram,
        currentData = this.currentData,
        hasTexture = this.texCoords && !!this.activeAttributes.imageSource,
        vboId, color, pickColor, textureBound;

    if (dc.pickingMode) {
        pickColor = dc.uniquePickColor();
    }

    // Load the vertex data since both the interior and outline use it.

    if (!currentData.pointsVboCacheKey) {
        currentData.pointsVboCacheKey = dc.gpuResourceCache.generateCacheKey();
    }

    vboId = dc.gpuResourceCache.resourceForKey(currentData.pointsVboCacheKey);
    if (!vboId) {
        vboId = gl.createBuffer();
        dc.gpuResourceCache.putResource(currentData.pointsVboCacheKey, vboId,
            currentData.meshPoints.length * 4);
        currentData.refreshVertexBuffer = true;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vboId);
    if (currentData.refreshVertexBuffer) {
        gl.bufferData(gl.ARRAY_BUFFER, currentData.meshPoints,
            gl.STATIC_DRAW);
        dc.frameStatistics.incrementVboLoadCount(1);
        currentData.refreshVertexBuffer = false;
    }

    gl.vertexAttribPointer(program.vertexPointLocation, 3, gl.FLOAT, false, 0, 0);

    program.loadTextureEnabled(gl, false);

    // Draw the mesh if the interior requested.
    if (this.activeAttributes.drawInterior) {
        var applyLighting = !dc.pickingMode && currentData.normals && this.activeAttributes.applyLighting;

        this.applyMvpMatrix(dc);

        if (!currentData.meshIndicesVboCacheKey) {
            currentData.meshIndicesVboCacheKey = dc.gpuResourceCache.generateCacheKey();
        }

        vboId = dc.gpuResourceCache.resourceForKey(currentData.meshIndicesVboCacheKey);
        if (!vboId) {
            vboId = gl.createBuffer();
            dc.gpuResourceCache.putResource(currentData.meshIndicesVboCacheKey, vboId,
                this.meshIndices.length * 2);
            currentData.refreshMeshIndices = true;
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vboId);
        if (currentData.refreshMeshIndices) {
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.meshIndices,
                gl.STATIC_DRAW);
            dc.frameStatistics.incrementVboLoadCount(1);
            currentData.refreshMeshIndices = false;
        }

        color = this.activeAttributes.interiorColor;
        // Disable writing the shape's fragments to the depth buffer when the interior is semi-transparent.
        gl.depthMask(color.alpha * this.layer.opacity >= 1 || dc.pickingMode);
        program.loadColor(gl, dc.pickingMode ? pickColor : color);
        program.loadOpacity(gl, dc.pickingMode ? 1 : this.layer.opacity);

        if (hasTexture && (!dc.pickingMode || !this.pickTransparentImagePixels)) {
            this.activeTexture = dc.gpuResourceCache.resourceForKey(this.activeAttributes.imageSource);
            if (!this.activeTexture) {
                this.activeTexture =
                    dc.gpuResourceCache.retrieveTexture(dc.currentGlContext, this.activeAttributes.imageSource);
            }

            textureBound = this.activeTexture && this.activeTexture.bind(dc);
            if (textureBound) {
                if (!currentData.texCoordsVboCacheKey) {
                    currentData.texCoordsVboCacheKey = dc.gpuResourceCache.generateCacheKey();
                }

                vboId = dc.gpuResourceCache.resourceForKey(currentData.texCoordsVboCacheKey);
                if (!vboId) {
                    vboId = gl.createBuffer();
                    dc.gpuResourceCache.putResource(currentData.texCoordsVboCacheKey, vboId,
                        this.texCoords.length * 4);
                    currentData.refreshTexCoordBuffer = true;
                }

                gl.bindBuffer(gl.ARRAY_BUFFER, vboId);
                if (currentData.refreshTexCoordBuffer) {
                    gl.bufferData(gl.ARRAY_BUFFER, this.texCoords,
                        gl.STATIC_DRAW);
                    dc.frameStatistics.incrementVboLoadCount(1);
                    currentData.refreshTexCoordBuffer = false;
                }

                gl.enableVertexAttribArray(program.vertexTexCoordLocation);
                gl.vertexAttribPointer(program.vertexTexCoordLocation, 2, gl.FLOAT,
                    false, 0, 0);

                this.scratchMatrix.setToIdentity();
                this.scratchMatrix.multiplyByTextureTransform(this.activeTexture);

                program.loadTextureEnabled(gl, true);
                program.loadTextureUnit(gl, gl.TEXTURE0);
                program.loadTextureMatrix(gl, this.scratchMatrix);
                program.loadModulateColor(gl, dc.pickingMode);
            }
        }

        // Apply lighting.
        if (applyLighting) {
            program.loadApplyLighting(gl, true);

            if (!currentData.normalsVboCacheKey) {
                currentData.normalsVboCacheKey = dc.gpuResourceCache.generateCacheKey();
            }

            vboId = dc.gpuResourceCache.resourceForKey(currentData.normalsVboCacheKey);
            if (!vboId) {
                vboId = gl.createBuffer();
                dc.gpuResourceCache.putResource(currentData.normalsVboCacheKey, vboId,
                    currentData.normals.length * 4);
                currentData.refreshNormalsBuffer = true;
            }

            gl.bindBuffer(gl.ARRAY_BUFFER, vboId);
            if (currentData.refreshNormalsBuffer) {
                gl.bufferData(gl.ARRAY_BUFFER, currentData.normals,
                    gl.STATIC_DRAW);
                dc.frameStatistics.incrementVboLoadCount(1);
                currentData.refreshNormalsBuffer = false;
            }

            gl.enableVertexAttribArray(program.normalVectorLocation);
            gl.vertexAttribPointer(program.normalVectorLocation, 3, gl.FLOAT, false, 0, 0);
        }

        gl.drawElements(gl.TRIANGLES, this.meshIndices.length,
            gl.UNSIGNED_SHORT, 0);

        if (hasTexture) {
            gl.disableVertexAttribArray(program.vertexTexCoordLocation);
        }

        if (applyLighting) {
            program.loadApplyLighting(gl, false);
            gl.disableVertexAttribArray(program.normalVectorLocation);
        }
    }

    // Draw the outline.
    if (this.activeAttributes.drawOutline && this.meshOutlineIndices) {
        program.loadTextureEnabled(gl, false);
        gl.disableVertexAttribArray(program.vertexTexCoordLocation); // we're not texturing in this clause

        // Make the outline stand out from the interior.
        this.applyMvpMatrixForOutline(dc);

        color = this.activeAttributes.outlineColor;
        // Disable writing the shape's fragments to the depth buffer when the interior is
        // semi-transparent.
        gl.depthMask(color.alpha * this.layer.opacity >= 1 || dc.pickingMode);
        program.loadColor(gl, dc.pickingMode ? pickColor : color);
        program.loadOpacity(gl, dc.pickingMode ? 1 : this.layer.opacity);

        gl.lineWidth(this.activeAttributes.outlineWidth);

        if (!currentData.outlineIndicesVboCacheKey) {
            currentData.outlineIndicesVboCacheKey = dc.gpuResourceCache.generateCacheKey();
        }

        vboId = dc.gpuResourceCache.resourceForKey(currentData.outlineIndicesVboCacheKey);
        if (!vboId) {
            vboId = gl.createBuffer();
            dc.gpuResourceCache.putResource(currentData.outlineIndicesVboCacheKey, vboId,
                this.meshOutlineIndices.length * 2);
            currentData.refreshOutlineIndices = true;
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vboId);
        if (currentData.refreshOutlineIndices) {
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.meshOutlineIndices,
                gl.STATIC_DRAW);
            dc.frameStatistics.incrementVboLoadCount(1);
            currentData.refreshOutlineIndices = false;
        }

        gl.drawElements(gl.LINE_STRIP, this.meshOutlineIndices.length,
            gl.UNSIGNED_SHORT, 0);
    }

    if (dc.pickingMode) {
        var pickPosition = this.computePickPosition(dc);
        var po = new PickedObject(pickColor, this.pickDelegate ? this.pickDelegate : this, pickPosition,
            this.layer, false);
        dc.resolvePick(po);
    }
};

AbstractMesh.prototype.computePickPosition = function (dc) {
    var currentData = this.currentData,
        line = dc.pickRay,
        localLineOrigin = new Vec3(line.origin[0], line.origin[1], line.origin[2]).subtract(
            currentData.referencePoint),
        localLine = new Line(localLineOrigin, line.direction),
        intersectionPoints = [];

    if (WWMath.computeIndexedTrianglesIntersection(localLine, currentData.meshPoints, this.meshIndices,
        intersectionPoints)) {
        var iPoint = intersectionPoints[0];

        if (intersectionPoints.length > 1) {
            // Find the intersection nearest the eye point.
            var distance2 = iPoint.distanceToSquared(dc.eyePoint);

            for (var i = 1; i < intersectionPoints.length; i++) {
                var d2 = intersectionPoints[i].distanceToSquared(dc.eyePoint);
                if (d2 < distance2) {
                    distance2 = d2;
                    iPoint = intersectionPoints[i];
                }
            }
        }

        var pos = new Position(0, 0, 0);
        dc.globe.computePositionFromPoint(
            iPoint[0] + currentData.referencePoint[0],
            iPoint[1] + currentData.referencePoint[1],
            iPoint[2] + currentData.referencePoint[2],
            pos);

        pos.altitude /= this._altitudeScale;

        return pos;
    }

    return null;
};

// Overridden from AbstractShape base class.
AbstractMesh.prototype.beginDrawing = function (dc) {
    var gl = dc.currentGlContext;

    if (this.activeAttributes.drawInterior) {
        gl.disable(gl.CULL_FACE);

        dc.findAndBindProgram(BasicTextureProgram);

        var applyLighting = !dc.pickMode && this.currentData.normals && this.activeAttributes.applyLighting;
        if (applyLighting) {
            dc.currentProgram.loadModelviewInverse(gl, dc.modelviewNormalTransform);
        }
    }

    gl.enableVertexAttribArray(dc.currentProgram.vertexPointLocation);
};

// Overridden from AbstractShape base class.
AbstractMesh.prototype.endDrawing = function (dc) {
    var gl = dc.currentGlContext;

    gl.disableVertexAttribArray(dc.currentProgram.vertexPointLocation);
    gl.depthMask(true);
    gl.lineWidth(1);
    gl.enable(gl.CULL_FACE);
};

export default AbstractMesh;
