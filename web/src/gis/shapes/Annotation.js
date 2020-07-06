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
import AnnotationAttributes from '../shapes/AnnotationAttributes';
import ArgumentError from '../error/ArgumentError';
import BasicTextureProgram from '../shaders/BasicTextureProgram';
import Color from '../util/Color';
import Font from '../util/Font';
import Insets from '../util/Insets';
import Logger from '../util/Logger';
import Matrix from '../geom/Matrix';
import Offset from '../util/Offset';
import PickedObject from '../pick/PickedObject';
import Renderable from '../render/Renderable';
import TextAttributes from '../shapes/TextAttributes';
import Vec2 from '../geom/Vec2';
import Vec3 from '../geom/Vec3';
import WWMath from '../util/WWMath';


/**
 * Constructs an annotation.
 * @alias Annotation
 * @constructor
 * @augments Renderable
 * @classdesc Represents an Annotation shape. An annotation displays a callout, a text and a leader pointing
 * the annotation's geographic position to the ground.
 * @param {Position} position The annotations's geographic position.
 * @param {AnnotationAttributes} attributes The attributes to associate with this annotation.
 * @throws {ArgumentError} If the specified position is null or undefined.
 */
function Annotation(position, attributes) {

    if (!position) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Annotation", "constructor", "missingPosition"));
    }

    Renderable.call(this);

    /**
     * This annotation's geographic position.
     * @type {Position}
     */
    this.position = position;

    /**
     * The annotation's attributes.
     * @type {AnnotationAttributes}
     * @default see [AnnotationAttributes]{@link AnnotationAttributes}
     */
    this.attributes = attributes ? attributes : new AnnotationAttributes(null);

    /**
     * This annotation's altitude mode. May be one of
     * <ul>
     *  <li>[WorldWind.ABSOLUTE]{@link WorldWind#ABSOLUTE}</li>
     *  <li>[WorldWind.RELATIVE_TO_GROUND]{@link WorldWind#RELATIVE_TO_GROUND}</li>
     *  <li>[WorldWind.CLAMP_TO_GROUND]{@link WorldWind#CLAMP_TO_GROUND}</li>
     * </ul>
     * @default WorldWind.ABSOLUTE
     */
    this.altitudeMode = WorldWind.ABSOLUTE;

    // Internal use only. Intentionally not documented.
    this.layer = null;

    // Internal use only. Intentionally not documented.
    this.lastStateKey = null;

    // Internal use only. Intentionally not documented.
    this.calloutTransform = Matrix.fromIdentity();

    // Internal use only. Intentionally not documented.
    this.calloutOffset = new WorldWind.Offset(
        WorldWind.OFFSET_FRACTION, 0.5,
        WorldWind.OFFSET_FRACTION, 0);

    // Internal use only. Intentionally not documented.
    this.label = "";

    // Internal use only. Intentionally not documented.
    this.labelTexture = null;

    // Internal use only. Intentionally not documented.
    this.labelTransform = Matrix.fromIdentity();

    // Internal use only. Intentionally not documented.
    this.placePoint = new Vec3(0, 0, 0);

    // Internal use only. Intentionally not documented.
    this.depthOffset = -2.05;

    // Internal use only. Intentionally not documented.
    this.calloutPoints = null;
}

Annotation.matrix = Matrix.fromIdentity();
Annotation.screenPoint = new Vec3(0, 0, 0);
Annotation.scratchPoint = new Vec3(0, 0, 0);

Annotation.prototype = Object.create(Renderable.prototype);

Object.defineProperties(Annotation.prototype, {

    /**
     * The text for this annotation.
     * @type {String}
     * @memberof Annotation.prototype
     */
    text: {
        get: function () {
            return this.label;
        },
        set: function (value) {
            this.label = value;
            this.lastStateKey = null;
        }
    }
});

/**
 * Draws this shape as an ordered renderable. Applications do not call this function. It is called by
 * [WorldWindow]{@link WorldWindow} during rendering.
 * @param {DrawContext} dc The current draw context.
 */
Annotation.prototype.renderOrdered = function (dc) {

    this.drawOrderedAnnotation(dc);

    if (dc.pickingMode) {

        var po = new PickedObject(this.pickColor.clone(), this,
            this.position, this.layer, false);

        if (dc.pickPoint) {
            if (this.labelBounds.containsPoint(
                dc.convertPointToViewport(dc.pickPoint, Annotation.scratchPoint))) {
                po.labelPicked = true;
            }
        }

        dc.resolvePick(po);
    }
};

/**
 * Creates a new annotation that is a copy of this annotation.
 * @returns {Annotation} The new annotation.
 */
Annotation.prototype.clone = function () {
    var clone = new Annotation(this.position);

    clone.copy(this);
    clone.pickDelegate = this.pickDelegate ? this.pickDelegate : this;

    return clone;
};

/**
 * Copies the contents of a specified annotation to this annotation.
 * @param {Annotation} that The Annotation to copy.
 */
Annotation.prototype.copy = function (that) {
    this.position = that.position;
    this.enabled = that.enabled;
    this.attributes = that.attributes;
    this.label = that.label;
    this.altitudeMode = that.altitudeMode;
    this.pickDelegate = that.pickDelegate;
    this.depthOffset = that.depthOffset;

    return this;
};

/**
 * Renders this annotation. This method is typically not called by applications but is called by
 * {@link RenderableLayer} during rendering. For this shape this method creates and
 * enques an ordered renderable with the draw context and does not actually draw the annotation.
 * @param {DrawContext} dc The current draw context.
 */
Annotation.prototype.render = function (dc) {

    if (!this.enabled) {
        return;
    }

    if (!dc.accumulateOrderedRenderables) {
        return;
    }

    if (dc.globe.projectionLimits
        && !dc.globe.projectionLimits.containsLocation(this.position.latitude, this.position.longitude)) {
        return;
    }

    var orderedAnnotation;
    if (this.lastFrameTime !== dc.timestamp) {
        orderedAnnotation = this.makeOrderedRenderable(dc);
    } else {
        var annotationCopy = this.clone();
        orderedAnnotation = annotationCopy.makeOrderedRenderable(dc);
    }

    if (!orderedAnnotation) {
        return;
    }

    orderedAnnotation.layer = dc.currentLayer;

    this.lastFrameTime = dc.timestamp;
    dc.addOrderedRenderable(orderedAnnotation);
};

// Internal. Intentionally not documented.
Annotation.prototype.drawOrderedAnnotation = function (dc) {
    this.beginDrawing(dc);

    try {
        this.doDrawOrderedAnnotation(dc);
    } finally {
        this.endDrawing(dc);
    }
};

/* Intentionally not documented
 * Creates an ordered renderable for this shape.
 * @protected
 * @param {DrawContext} dc The current draw context.
 * @returns {OrderedRenderable} The ordered renderable. May be null, in which case an ordered renderable
 * cannot be created or should not be created at the time this method is called.
 */
Annotation.prototype.makeOrderedRenderable = function (dc) {

    var w, h, s, iLeft, iRight, iTop, iBottom,
        offset, leaderGapHeight;

    // Wraps the text based and the width and height that were set for the
    // annotation
    this.label = dc.textRenderer.wrap(
        this.label,
        this.attributes.width, this.attributes.height);

    // Compute the annotation's model point.
    dc.surfacePointForMode(this.position.latitude, this.position.longitude, this.position.altitude,
        this.altitudeMode, this.placePoint);

    this.eyeDistance = dc.eyePoint.distanceTo(this.placePoint);

    // Compute the annotation's screen point in the OpenGL coordinate system of the WorldWindow
    // by projecting its model coordinate point onto the viewport. Apply a depth offset in order
    // to cause the annotation to appear above nearby terrain.
    if (!dc.projectWithDepth(this.placePoint, this.depthOffset, Annotation.screenPoint)) {
        return null;
    }

    this.labelTexture = dc.createTextTexture(this.label, this.attributes.textAttributes);

    w = this.labelTexture.imageWidth;
    h = this.labelTexture.imageHeight;
    s = this.attributes.scale;
    iLeft = this.attributes.insets.left;
    iRight = this.attributes.insets.right;
    iTop = this.attributes.insets.top;
    iBottom = this.attributes.insets.bottom;
    leaderGapHeight = this.attributes.leaderGapHeight;

    offset = this.calloutOffset.offsetForSize((w + iLeft + iRight) * s, (h + iTop + iBottom) * s);

    this.calloutTransform.setTranslation(
        Annotation.screenPoint[0] - offset[0],
        Annotation.screenPoint[1] + leaderGapHeight,
        Annotation.screenPoint[2]);

    this.labelTransform.setTranslation(
        Annotation.screenPoint[0] - offset[0] + iLeft * s,
        Annotation.screenPoint[1] + leaderGapHeight + iBottom * s,
        Annotation.screenPoint[2]);

    this.labelTransform.setScale(w * s, h * s, 1);

    this.labelBounds = WWMath.boundingRectForUnitQuad(this.labelTransform);

    // Compute dimensions of the callout taking in consideration the insets
    var width = (w + iLeft + iRight) * s;
    var height = (h + iTop + iBottom) * s;

    var leaderOffsetX = width / 2;

    var leaderOffsetY = -leaderGapHeight;

    if (!this.attributes.drawLeader) {
        leaderOffsetY = 0;
    }

    if (this.attributes.stateKey !== this.lastStateKey) {
        this.calloutPoints = this.createCallout(
            width, height,
            leaderOffsetX, leaderOffsetY,
            this.attributes.leaderGapWidth, this.attributes.cornerRadius);
    }

    return this;
};

// Internal. Intentionally not documented.
Annotation.prototype.beginDrawing = function (dc) {
    var gl = dc.currentGlContext,
        program;

    dc.findAndBindProgram(BasicTextureProgram);

    program = dc.currentProgram;

    gl.enableVertexAttribArray(program.vertexPointLocation);
    gl.enableVertexAttribArray(program.vertexTexCoordLocation);

    program.loadModulateColor(gl, dc.pickingMode);
};

// Internal. Intentionally not documented.
Annotation.prototype.endDrawing = function (dc) {
    var gl = dc.currentGlContext,
        program = dc.currentProgram;

    // Clear the vertex attribute state.
    gl.disableVertexAttribArray(program.vertexPointLocation);
    gl.disableVertexAttribArray(program.vertexTexCoordLocation);

    // Clear GL bindings.
    dc.bindProgram(null);
};

// Internal. Intentionally not documented.
Annotation.prototype.drawCorner = function (x0, y0, cornerRadius, start, end, steps, buffer, startIdx) {
    if (cornerRadius < 1) {
        return startIdx;
    }

    var step = (end - start) / (steps - 1);
    for (var i = 1; i < steps - 1; i++) {
        var a = start + step * i;
        var x = x0 + Math.cos(a) * cornerRadius;
        var y = y0 + Math.sin(a) * cornerRadius;
        buffer[startIdx++] = x;
        buffer[startIdx++] = y;
    }

    return startIdx;
};

// Internal. Intentionally not documented.
Annotation.prototype.createCallout = function (width, height, leaderOffsetX, leaderOffsetY, leaderGapWidth,
    cornerRadius) {

    var cornerSteps = 16;

    var numVertices = 2 * (12 + (cornerRadius < 1 ? 0 : 4 * (cornerSteps - 2)));

    var buffer = new Float32Array(numVertices);

    var idx = 0;

    //Bottom right
    buffer[idx++] = width / 2 + leaderGapWidth / 2;
    buffer[idx++] = 0;
    buffer[idx++] = width - cornerRadius;
    buffer[idx++] = 0;
    idx = this.drawCorner(width - cornerRadius, cornerRadius, cornerRadius, -Math.PI / 2, 0,
        cornerSteps, buffer, idx);

    //Right
    buffer[idx++] = width;
    buffer[idx++] = cornerRadius;
    buffer[idx++] = width;
    buffer[idx++] = height - cornerRadius;
    idx = this.drawCorner(width - cornerRadius, height - cornerRadius, cornerRadius, 0, Math.PI / 2,
        cornerSteps, buffer, idx);

    //Top
    buffer[idx++] = width - cornerRadius;
    buffer[idx++] = height;
    buffer[idx++] = cornerRadius;
    buffer[idx++] = height;
    idx = this.drawCorner(cornerRadius, height - cornerRadius, cornerRadius, Math.PI / 2, Math.PI,
        cornerSteps, buffer, idx);

    //Left
    buffer[idx++] = 0;
    buffer[idx++] = height - cornerRadius;
    buffer[idx++] = 0;
    buffer[idx++] = cornerRadius;
    idx = this.drawCorner(cornerRadius, cornerRadius, cornerRadius, Math.PI, Math.PI * 1.5,
        cornerSteps, buffer, idx);

    //Bottom left
    buffer[idx++] = cornerRadius;
    buffer[idx++] = 0;
    buffer[idx++] = width / 2 - leaderGapWidth / 2;
    buffer[idx++] = 0;

    //Draw leader
    buffer[idx++] = leaderOffsetX;
    buffer[idx++] = leaderOffsetY;

    buffer[idx++] = width / 2 + leaderGapWidth / 2;
    buffer[idx] = 0;

    return buffer;
};

// Internal. Intentionally not documented.
Annotation.prototype.doDrawOrderedAnnotation = function (dc) {

    var gl = dc.currentGlContext,
        program = dc.currentProgram,
        textureBound;

    var refreshBuffers = false;

    if (dc.pickingMode) {
        this.pickColor = dc.uniquePickColor();
    }

    program.loadOpacity(gl, dc.pickingMode ? 1 : this.attributes.opacity * this.layer.opacity);

    // Attributes have changed. We need to track this because the callout vbo data may
    // have changed if scaled or text wrapping changes callout dimensions
    var calloutAttributesChanged = this.attributes.stateKey !== this.lastStateKey;

    // Create new cache key if callout drawing points have changed
    if (!this.calloutCacheKey || calloutAttributesChanged) {
        this.calloutCacheKey = dc.gpuResourceCache.generateCacheKey();
    }

    var calloutVboId = dc.gpuResourceCache.resourceForKey(this.calloutCacheKey);

    if (!calloutVboId) {
        calloutVboId = gl.createBuffer();
        dc.gpuResourceCache.putResource(this.calloutCacheKey, calloutVboId,
            this.calloutPoints.length * 4);

        refreshBuffers = true;
    }

    // Remove the last generated vbo data if attributes changed
    if (calloutAttributesChanged && this.calloutCacheKey) {
        dc.gpuResourceCache.removeResource(this.calloutCacheKey);
    }

    // Store current statekey because we are no longer using it
    // in this iteration
    this.lastStateKey = this.attributes.stateKey;

    // Compute and specify the MVP matrix.
    Annotation.matrix.copy(dc.screenProjection);
    Annotation.matrix.multiplyMatrix(this.calloutTransform);
    program.loadModelviewProjection(gl, Annotation.matrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, calloutVboId);

    if (refreshBuffers) {
        gl.bufferData(gl.ARRAY_BUFFER,
            this.calloutPoints, gl.STATIC_DRAW);

        dc.frameStatistics.incrementVboLoadCount(1);
    }

    program.loadColor(gl, dc.pickingMode ? this.pickColor : this.attributes.backgroundColor);
    program.loadTextureEnabled(gl, false);

    gl.vertexAttribPointer(program.vertexPointLocation, 2, gl.FLOAT, false, 0, 0);
    gl.vertexAttribPointer(program.vertexTexCoordLocation, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, this.calloutPoints.length / 2);

    // Draw text
    Annotation.matrix.copy(dc.screenProjection);
    Annotation.matrix.multiplyMatrix(this.labelTransform);
    program.loadModelviewProjection(gl, Annotation.matrix);

    Annotation.matrix.setToIdentity();
    Annotation.matrix.multiplyByTextureTransform(this.labelTexture);
    program.loadTextureMatrix(gl, Annotation.matrix);

    program.loadColor(gl, dc.pickingMode ? this.pickColor : Color.WHITE);
    textureBound = this.labelTexture.bind(dc);
    program.loadTextureEnabled(gl, textureBound);

    // Configure GL to use the draw context's unit quad VBOs for both model coordinates and texture coordinates.
    // Most browsers can share the same buffer for vertex and texture coordinates, but Internet Explorer requires
    // that they be in separate buffers, so the code below uses the 3D buffer for vertex coords and the 2D
    // buffer for texture coords.
    gl.bindBuffer(gl.ARRAY_BUFFER, dc.unitQuadBuffer3());
    gl.vertexAttribPointer(program.vertexPointLocation, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, dc.unitQuadBuffer());
    gl.vertexAttribPointer(program.vertexTexCoordLocation, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};

export default Annotation;
