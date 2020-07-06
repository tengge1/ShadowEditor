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
 * @exports Placemark
 */
import ArgumentError from '../error/ArgumentError';
import BasicTextureProgram from '../shaders/BasicTextureProgram';
import Color from '../util/Color';
import Font from '../util/Font';
import Logger from '../util/Logger';
import Matrix from '../geom/Matrix';
import PickedObject from '../pick/PickedObject';
import PlacemarkAttributes from '../shapes/PlacemarkAttributes';
import Renderable from '../render/Renderable';
import Vec2 from '../geom/Vec2';
import Vec3 from '../geom/Vec3';
import WWMath from '../util/WWMath';


/**
 * Constructs a placemark.
 * @alias Placemark
 * @constructor
 * @augments Renderable
 * @classdesc Represents a Placemark shape. A placemark displays an image, a label and a leader line connecting
 * the placemark's geographic position to the ground. All three of these items are optional. By default, the
 * leader line is not pickable. See [enableLeaderLinePicking]{@link Placemark#enableLeaderLinePicking}.
 * <p>
 * Placemarks may be drawn with either an image or as single-color square with a specified size. When the
 * placemark attributes indicate a valid image, the placemark's image is drawn as a rectangle in the
 * image's original dimensions, scaled by the image scale attribute. Otherwise, the placemark is drawn as a
 * square with width and height equal to the value of the image scale attribute, in pixels, and color equal
 * to the image color attribute.
 * <p>
 * By default, placemarks participate in decluttering with a [declutterGroupID]{@link Placemark#declutterGroup}
 * of 2. Only placemark labels are decluttered relative to other placemark labels. The placemarks themselves
 * are optionally scaled with eye distance to achieve decluttering of the placemark as a whole.
 * See [eyeDistanceScaling]{@link Placemark#eyeDistanceScaling}.
 * @param {Position} position The placemark's geographic position.
 * @param {Boolean} eyeDistanceScaling Indicates whether the size of this placemark scales with eye distance.
 * See [eyeDistanceScalingThreshold]{@link Placemark#eyeDistanceScalingThreshold} and
 * [eyeDistanceScalingLabelThreshold]{@link Placemark#eyeDistanceScalingLabelThreshold}.
 * @param {PlacemarkAttributes} attributes The attributes to associate with this placemark. May be null,
 * in which case default attributes are associated.
 * @throws {ArgumentError} If the specified position is null or undefined.
 */
function Placemark(position, eyeDistanceScaling, attributes) {
    if (!position) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Placemark", "constructor", "missingPosition"));
    }

    Renderable.call(this);

    /**
     * The placemark's attributes. If null and this placemark is not highlighted, this placemark is not
     * drawn.
     * @type {PlacemarkAttributes}
     * @default see [PlacemarkAttributes]{@link PlacemarkAttributes}
     */
    this.attributes = attributes ? attributes : new PlacemarkAttributes(null);

    /**
     * The attributes used when this placemark's highlighted flag is true. If null and the
     * highlighted flag is true, this placemark's normal attributes are used. If they, too, are null, this
     * placemark is not drawn.
     * @type {PlacemarkAttributes}
     * @default null
     */
    this.highlightAttributes = null;

    /**
     * Indicates whether this placemark uses its highlight attributes rather than its normal attributes.
     * @type {Boolean}
     * @default false
     */
    this.highlighted = false;

    /**
     * This placemark's geographic position.
     * @type {Position}
     */
    this.position = position;

    /**
     * Indicates whether this placemark's size is reduced at higher eye distances. If true, this placemark's
     * size is scaled inversely proportional to the eye distance if the eye distance is greater than the
     * value of the [eyeDistanceScalingThreshold]{@link Placemark#eyeDistanceScalingThreshold} property.
     * When the eye distance is below the threshold, this placemark is scaled only according to the
     * [imageScale]{@link PlacemarkAttributes#imageScale}.
     * @type {Boolean}
     */
    this.eyeDistanceScaling = eyeDistanceScaling;

    /**
     * The eye distance above which to reduce the size of this placemark, in meters. If
     * [eyeDistanceScaling]{@link Placemark#eyeDistanceScaling} is true, this placemark's image, label and leader
     * line sizes are reduced as the eye distance increases beyond this threshold.
     * @type {Number}
     * @default 1e6 (meters)
     */
    this.eyeDistanceScalingThreshold = 1e6;

    /**
     * The eye altitude above which this placemark's label is not displayed.
     * @type {number}
     */
    this.eyeDistanceScalingLabelThreshold = 1.5 * this.eyeDistanceScalingThreshold;

    /**
     * This placemark's textual label. If null, no label is drawn.
     * @type {String}
     * @default null
     */
    this.label = null;

    /**
     * This placemark's altitude mode. May be one of
     * <ul>
     *  <li>[WorldWind.ABSOLUTE]{@link WorldWind#ABSOLUTE}</li>
     *  <li>[WorldWind.RELATIVE_TO_GROUND]{@link WorldWind#RELATIVE_TO_GROUND}</li>
     *  <li>[WorldWind.CLAMP_TO_GROUND]{@link WorldWind#CLAMP_TO_GROUND}</li>
     * </ul>
     * @default WorldWind.ABSOLUTE
     */
    this.altitudeMode = WorldWind.ABSOLUTE;

    /**
     * Indicates whether this placemark has visual priority over other shapes in the scene.
     * @type {Boolean}
     * @default false
     */
    this.alwaysOnTop = false;

    /**
     * Indicates whether this placemark's leader line, if any, is pickable.
     * @type {Boolean}
     * @default false
     */
    this.enableLeaderLinePicking = false;

    /**
     * Indicates whether this placemark's image should be re-retrieved even if it has already been retrieved.
     * Set this property to true when the image has changed but has the same image path.
     * The property is set to false when the image is re-retrieved.
     * @type {Boolean}
     */
    this.updateImage = true;

    /**
     * Indicates the group ID of the declutter group to include this placemark. If non-zero, this placemark
     * is decluttered relative to all other shapes within its group.
     * @type {Number}
     * @default 2
     */
    this.declutterGroup = 2;

    /**
     * This placemark's target label visibility, a value between 0 and 1. During ordered rendering this
     * placemark modifies its [current visibility]{@link Placemark#currentVisibility} towards its target
     * visibility at the rate specified by the draw context's [fade time]{@link DrawContext#fadeTime} property.
     * The target visibility and current visibility are used to control the fading in and out of this
     * placemark's label.
     * @type {Number}
     * @default 1
     */
    this.targetVisibility = 1;

    /**
     * This placemark's current label visibility, a value between 0 and 1. This property scales the placemark's
     * effective label opacity. It is incremented or decremented each frame according to the draw context's
     * [fade time]{@link DrawContext#fadeTime} property in order to achieve this placemark's
     * [target visibility]{@link Placemark#targetVisibility}. This current visibility and target visibility are
     * used to control the fading in and out of this placemark's label.
     * @type {Number}
     * @default 1
     * @readonly
     */
    this.currentVisibility = 1;

    /**
     * The amount of rotation to apply to the image, measured in degrees clockwise and relative to this
     * placemark's [imageRotationReference]{@link Placemark#imageRotationReference}.
     * @type {Number}
     * @default 0
     */
    this.imageRotation = 0;

    /**
     * The amount of tilt to apply to the image, measured in degrees away from the eye point and relative
     * to this placemark's [imageTiltReference]{@link Placemark#imageTiltReference}. While any positive or
     * negative number may be specified, values outside the range [0. 90] cause some or all of the image to
     * be clipped.
     * @type {Number}
     * @default 0
     */
    this.imageTilt = 0;

    /**
     * Indicates whether to apply this placemark's image rotation relative to the screen or the globe.
     * If WorldWind.RELATIVE_TO_SCREEN, this placemark's image is rotated in the plane of the screen and
     * its orientation relative to the globe changes as the view changes.
     * If WorldWind.RELATIVE_TO_GLOBE, this placemark's image is rotated in a plane tangent to the globe
     * at this placemark's position and retains its orientation relative to the globe.
     * @type {String}
     * @default WorldWind.RELATIVE_TO_SCREEN
     */
    this.imageRotationReference = WorldWind.RELATIVE_TO_SCREEN;

    /**
     * Indicates whether to apply this placemark's image tilt relative to the screen or the globe.
     * If WorldWind.RELATIVE_TO_SCREEN, this placemark's image is tilted inwards (for positive tilts)
     * relative to the plane of the screen, and its orientation relative to the globe changes as the view
     * changes. If WorldWind.RELATIVE_TO_GLOBE, this placemark's image is tilted towards the globe's surface,
     * and retains its orientation relative to the surface.
     * @type {string}
     * @default WorldWind.RELATIVE_TO_SCREEN
     */
    this.imageTiltReference = WorldWind.RELATIVE_TO_SCREEN;

    // Internal use only. Intentionally not documented.
    this.activeAttributes = null;

    // Internal use only. Intentionally not documented.
    this.activeTexture = null;

    // Internal use only. Intentionally not documented.
    this.labelTexture = null;

    // Internal use only. Intentionally not documented.
    this.placePoint = new Vec3(0, 0, 0); // Cartesian point corresponding to this placemark's geographic position

    // Internal use only. Intentionally not documented.
    this.groundPoint = new Vec3(0, 0, 0); // Cartesian point corresponding to ground position below this placemark

    // Internal use only. Intentionally not documented.
    this.imageTransform = Matrix.fromIdentity();

    // Internal use only. Intentionally not documented.
    this.labelTransform = Matrix.fromIdentity();

    // Internal use only. Intentionally not documented.
    this.texCoordMatrix = Matrix.fromIdentity();

    // Internal use only. Intentionally not documented.
    this.imageBounds = null;

    // Internal use only. Intentionally not documented.
    this.layer = null;

    // Internal use only. Intentionally not documented.
    this.depthOffset = -0.003;
}

// Internal use only. Intentionally not documented.
Placemark.screenPoint = new Vec3(0, 0, 0); // scratch variable
Placemark.matrix = Matrix.fromIdentity(); // scratch variable
Placemark.scratchPoint = new Vec3(0, 0, 0); // scratch variable

Placemark.prototype = Object.create(Renderable.prototype);

Object.defineProperties(Placemark.prototype, {
    /**
     * Indicates the screen coordinate bounds of this shape during ordered rendering.
     * @type {Rectangle}
     * @readonly
     * @memberof Placemark.prototype
     */
    screenBounds: {
        get: function () {
            return this.labelBounds;
        }
    }
});

/**
 * Copies the contents of a specified placemark to this placemark.
 * @param {Placemark} that The placemark to copy.
 */
Placemark.prototype.copy = function (that) {
    this.position = that.position;
    this.attributes = that.attributes;
    this.highlightAttributes = that.highlightAttributes;
    this.highlighted = that.highlighted;
    this.enabled = that.enabled;
    this.label = that.label;
    this.altitudeMode = that.altitudeMode;
    this.pickDelegate = that.pickDelegate;
    this.alwaysOnTop = that.alwaysOnTop;
    this.depthOffset = that.depthOffset;
    this.targetVisibility = that.targetVisibility;
    this.currentVisibility = that.currentVisibility;
    this.imageRotation = that.imageRotation;
    this.imageTilt = that.imageTilt;
    this.imageRotationReference = that.imageRotationReference;
    this.imageTiltReference = that.imageTiltReference;

    return this;
};

/**
 * Creates a new placemark that is a copy of this placemark.
 * @returns {Placemark} The new placemark.
 */
Placemark.prototype.clone = function () {
    var clone = new Placemark(this.position);

    clone.copy(this);
    clone.pickDelegate = this.pickDelegate ? this.pickDelegate : this;

    return clone;
};

/**
 * Renders this placemark. This method is typically not called by applications but is called by
 * {@link RenderableLayer} during rendering. For this shape this method creates and
 * enques an ordered renderable with the draw context and does not actually draw the placemark.
 * @param {DrawContext} dc The current draw context.
 */
Placemark.prototype.render = function (dc) {
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

    // Create an ordered renderable for this placemark. If one has already been created this frame then we're
    // in 2D-continuous mode and another needs to be created for one of the alternate globe offsets.
    var orderedPlacemark;
    if (this.lastFrameTime !== dc.timestamp) {
        orderedPlacemark = this.makeOrderedRenderable(dc);
    } else {
        var placemarkCopy = this.clone();
        orderedPlacemark = placemarkCopy.makeOrderedRenderable(dc);
    }

    if (!orderedPlacemark) {
        return;
    }

    if (!orderedPlacemark.isVisible(dc)) {
        return;
    }

    orderedPlacemark.layer = dc.currentLayer;

    this.lastFrameTime = dc.timestamp;
    dc.addOrderedRenderable(orderedPlacemark);
};

/**
 * Draws this shape as an ordered renderable. Applications do not call this function. It is called by
 * [WorldWindow]{@link WorldWindow} during rendering.
 * @param {DrawContext} dc The current draw context.
 */
Placemark.prototype.renderOrdered = function (dc) {
    this.drawOrderedPlacemark(dc);

    if (dc.pickingMode) {
        var po = new PickedObject(this.pickColor.clone(), this.pickDelegate ? this.pickDelegate : this,
            this.position, this.layer, false);

        if (dc.pickPoint && this.mustDrawLabel()) {
            if (this.labelBounds.containsPoint(
                dc.convertPointToViewport(dc.pickPoint, Placemark.scratchPoint))) {
                po.labelPicked = true;
            }
        }
        dc.resolvePick(po);
    }
};

/* INTENTIONALLY NOT DOCUMENTED
 * Creates an ordered renderable for this shape.
 * @protected
 * @param {DrawContext} dc The current draw context.
 * @returns {OrderedRenderable} The ordered renderable. May be null, in which case an ordered renderable
 * cannot be created or should not be created at the time this method is called.
 */
Placemark.prototype.makeOrderedRenderable = function (dc) {
    var w, h, s,
        offset;

    this.determineActiveAttributes(dc);
    if (!this.activeAttributes) {
        return null;
    }

    // Compute the placemark's model point and corresponding distance to the eye point. If the placemark's
    // position is terrain-dependent but off the terrain, then compute it ABSOLUTE so that we have a point for
    // the placemark and are thus able to draw it. Otherwise its image and label portion that are potentially
    // over the terrain won't get drawn, and would disappear as soon as there is no terrain at the placemark's
    // position. This can occur at the window edges.
    dc.surfacePointForMode(this.position.latitude, this.position.longitude, this.position.altitude,
        this.altitudeMode, this.placePoint);

    this.eyeDistance = this.alwaysOnTop ? 0 : dc.eyePoint.distanceTo(this.placePoint);

    if (this.mustDrawLeaderLine(dc)) {
        dc.surfacePointForMode(this.position.latitude, this.position.longitude, 0,
            this.altitudeMode, this.groundPoint);
    }

    // Compute the placemark's screen point in the OpenGL coordinate system of the WorldWindow by projecting its model
    // coordinate point onto the viewport. Apply a depth offset in order to cause the placemark to appear above nearby
    // terrain. When a placemark is displayed near the terrain portions of its geometry are often behind the terrain,
    // yet as a screen element the placemark is expected to be visible. We adjust its depth values rather than moving
    // the placemark itself to avoid obscuring its actual position.
    if (!dc.projectWithDepth(this.placePoint, this.depthOffset, Placemark.screenPoint)) {
        return null;
    }

    var visibilityScale = this.eyeDistanceScaling ?
        Math.max(0.0, Math.min(1, this.eyeDistanceScalingThreshold / this.eyeDistance)) : 1;

    // Compute the placemark's transform matrix and texture coordinate matrix according to its screen point, image size,
    // image offset and image scale. The image offset is defined with its origin at the image's bottom-left corner and
    // axes that extend up and to the right from the origin point. When the placemark has no active texture the image
    // scale defines the image size and no other scaling is applied.
    if (this.activeTexture) {
        w = this.activeTexture.originalImageWidth;
        h = this.activeTexture.originalImageHeight;
        s = this.activeAttributes.imageScale * visibilityScale;
        offset = this.activeAttributes.imageOffset.offsetForSize(w, h);

        this.imageTransform.setTranslation(
            Placemark.screenPoint[0] - offset[0] * s,
            Placemark.screenPoint[1] - offset[1] * s,
            Placemark.screenPoint[2]);

        this.imageTransform.setScale(w * s, h * s, 1);
    } else {
        s = this.activeAttributes.imageScale * visibilityScale;
        offset = this.activeAttributes.imageOffset.offsetForSize(s, s);

        this.imageTransform.setTranslation(
            Placemark.screenPoint[0] - offset[0],
            Placemark.screenPoint[1] - offset[1],
            Placemark.screenPoint[2]);

        this.imageTransform.setScale(s, s, 1);
    }

    this.imageBounds = WWMath.boundingRectForUnitQuad(this.imageTransform);

    // If there's a label, perform these same operations for the label texture.

    if (this.mustDrawLabel()) {

        this.labelTexture = dc.createTextTexture(this.label, this.activeAttributes.labelAttributes);

        w = this.labelTexture.imageWidth;
        h = this.labelTexture.imageHeight;
        s = this.activeAttributes.labelAttributes.scale * visibilityScale;
        offset = this.activeAttributes.labelAttributes.offset.offsetForSize(w, h);

        this.labelTransform.setTranslation(
            Placemark.screenPoint[0] - offset[0] * s,
            Placemark.screenPoint[1] - offset[1] * s,
            Placemark.screenPoint[2]);

        this.labelTransform.setScale(w * s, h * s, 1);

        this.labelBounds = WWMath.boundingRectForUnitQuad(this.labelTransform);
    }

    return this;
};

// Internal. Intentionally not documented.
Placemark.prototype.determineActiveAttributes = function (dc) {
    if (this.highlighted && this.highlightAttributes) {
        this.activeAttributes = this.highlightAttributes;
    } else {
        this.activeAttributes = this.attributes;
    }

    if (this.activeAttributes && this.activeAttributes.imageSource) {
        this.activeTexture = dc.gpuResourceCache.resourceForKey(this.activeAttributes.imageSource);

        if (!this.activeTexture || this.updateImage) {
            this.activeTexture = dc.gpuResourceCache.retrieveTexture(dc.currentGlContext,
                this.activeAttributes.imageSource);
            this.updateImage = false;
        }
    }
};

// Internal. Intentionally not documented.
Placemark.prototype.isVisible = function (dc) {
    if (dc.pickingMode) {
        return dc.pickRectangle && (this.imageBounds.intersects(dc.pickRectangle)
            || this.mustDrawLabel() && this.labelBounds.intersects(dc.pickRectangle)
            || this.mustDrawLeaderLine(dc)
                && dc.pickFrustum.intersectsSegment(this.groundPoint, this.placePoint));
    } else {
        return this.imageBounds.intersects(dc.viewport)
            || this.mustDrawLabel() && this.labelBounds.intersects(dc.viewport)
            || this.mustDrawLeaderLine(dc)
                && dc.frustumInModelCoordinates.intersectsSegment(this.groundPoint, this.placePoint);
    }
};

// Internal. Intentionally not documented.
Placemark.prototype.drawOrderedPlacemark = function (dc) {
    this.beginDrawing(dc);

    try {
        this.doDrawOrderedPlacemark(dc);
        if (!dc.pickingMode) {
            this.drawBatchOrderedPlacemarks(dc);
        }
    } finally {
        this.endDrawing(dc);
    }
};

// Internal. Intentionally not documented.
Placemark.prototype.drawBatchOrderedPlacemarks = function (dc) {
    // Draw any subsequent placemarks in the ordered renderable queue, removing each from the queue as it's
    // processed. This avoids the overhead of setting up and tearing down OpenGL state for each placemark.

    var or;

    while ((or = dc.peekOrderedRenderable()) && or.doDrawOrderedPlacemark) {
        dc.popOrderedRenderable(); // remove it from the queue

        try {
            or.doDrawOrderedPlacemark(dc);
        } catch (e) {
            Logger.logMessage(Logger.LEVEL_WARNING, 'Placemark', 'drawBatchOrderedPlacemarks',
                "Error occurred while rendering placemark using batching: " + e.message);
        }
        // Keep going. Render the rest of the ordered renderables.
    }
};

// Internal. Intentionally not documented.
Placemark.prototype.beginDrawing = function (dc) {
    var gl = dc.currentGlContext,
        program;

    dc.findAndBindProgram(BasicTextureProgram);

    // Configure GL to use the draw context's unit quad VBOs for both model coordinates and texture coordinates.
    // Most browsers can share the same buffer for vertex and texture coordinates, but Internet Explorer requires
    // that they be in separate buffers, so the code below uses the 3D buffer for vertex coords and the 2D
    // buffer for texture coords.
    program = dc.currentProgram;
    gl.bindBuffer(gl.ARRAY_BUFFER, dc.unitQuadBuffer());
    gl.vertexAttribPointer(program.vertexTexCoordLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(program.vertexPointLocation);
    gl.enableVertexAttribArray(program.vertexTexCoordLocation);

    // Tell the program which texture unit to use.
    program.loadTextureUnit(gl, gl.TEXTURE0);
    program.loadModulateColor(gl, dc.pickingMode);
};

// Internal. Intentionally not documented.
Placemark.prototype.endDrawing = function (dc) {
    var gl = dc.currentGlContext,
        program = dc.currentProgram;

    // Clear the vertex attribute state.
    gl.disableVertexAttribArray(program.vertexPointLocation);
    gl.disableVertexAttribArray(program.vertexTexCoordLocation);

    // Clear GL bindings.
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
};

// Internal. Intentionally not documented.
Placemark.prototype.doDrawOrderedPlacemark = function (dc) {
    var gl = dc.currentGlContext,
        program = dc.currentProgram,
        depthTest = true,
        textureBound;

    if (dc.pickingMode) {
        this.pickColor = dc.uniquePickColor();
    }

    if (this.eyeDistanceScaling && this.eyeDistance > this.eyeDistanceScalingLabelThreshold) {
        // Target visibility is set to 0 to cause the label to be faded in or out. Nothing else
        // here uses target visibility.
        this.targetVisibility = 0;
    }

    // Compute the effective visibility. Use the current value if picking.
    if (!dc.pickingMode && this.mustDrawLabel()) {
        if (this.currentVisibility != this.targetVisibility) {
            var visibilityDelta = (dc.timestamp - dc.previousRedrawTimestamp) / dc.fadeTime;
            if (this.currentVisibility < this.targetVisibility) {
                this.currentVisibility = Math.min(1, this.currentVisibility + visibilityDelta);
            } else {
                this.currentVisibility = Math.max(0, this.currentVisibility - visibilityDelta);
            }
            dc.redrawRequested = true;
        }
    }

    program.loadOpacity(gl, dc.pickingMode ? 1 : this.layer.opacity);

    // Draw the leader line first so that the image and label have visual priority.
    if (this.mustDrawLeaderLine(dc)) {
        if (!this.leaderLinePoints) {
            this.leaderLinePoints = new Float32Array(6);
        }

        this.leaderLinePoints[0] = this.groundPoint[0]; // computed during makeOrderedRenderable
        this.leaderLinePoints[1] = this.groundPoint[1];
        this.leaderLinePoints[2] = this.groundPoint[2];
        this.leaderLinePoints[3] = this.placePoint[0]; // computed during makeOrderedRenderable
        this.leaderLinePoints[4] = this.placePoint[1];
        this.leaderLinePoints[5] = this.placePoint[2];

        if (!this.leaderLineCacheKey) {
            this.leaderLineCacheKey = dc.gpuResourceCache.generateCacheKey();
        }

        var leaderLineVboId = dc.gpuResourceCache.resourceForKey(this.leaderLineCacheKey);
        if (!leaderLineVboId) {
            leaderLineVboId = gl.createBuffer();
            dc.gpuResourceCache.putResource(this.leaderLineCacheKey, leaderLineVboId,
                this.leaderLinePoints.length * 4);
        }

        program.loadTextureEnabled(gl, false);
        program.loadColor(gl, dc.pickingMode ? this.pickColor :
            this.activeAttributes.leaderLineAttributes.outlineColor);

        Placemark.matrix.copy(dc.modelviewProjection);
        program.loadModelviewProjection(gl, Placemark.matrix);

        if (!this.activeAttributes.leaderLineAttributes.depthTest) {
            gl.disable(gl.DEPTH_TEST);
        }

        gl.lineWidth(this.activeAttributes.leaderLineAttributes.outlineWidth);

        gl.bindBuffer(gl.ARRAY_BUFFER, leaderLineVboId);
        gl.bufferData(gl.ARRAY_BUFFER, this.leaderLinePoints, gl.STATIC_DRAW);
        dc.frameStatistics.incrementVboLoadCount(1);
        gl.vertexAttribPointer(program.vertexPointLocation, 3, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.LINES, 0, 2);
    }

    // Turn off depth testing for the placemark image if requested. The placemark label and leader line have
    // their own depth-test controls.
    if (!this.activeAttributes.depthTest) {
        depthTest = false;
        gl.disable(gl.DEPTH_TEST);
    }

    // Suppress frame buffer writes for the placemark image and its label.
    // tag, 6/17/15: It's not clear why this call was here. It was carried over from WWJ.
    //gl.depthMask(false);

    gl.bindBuffer(gl.ARRAY_BUFFER, dc.unitQuadBuffer3());
    gl.vertexAttribPointer(program.vertexPointLocation, 3, gl.FLOAT, false, 0, 0);

    // Compute and specify the MVP matrix.
    Placemark.matrix.copy(dc.screenProjection);
    Placemark.matrix.multiplyMatrix(this.imageTransform);

    var actualRotation = this.imageRotationReference === WorldWind.RELATIVE_TO_GLOBE ?
        dc.navigator.heading - this.imageRotation : -this.imageRotation;
    Placemark.matrix.multiplyByTranslation(0.5, 0.5, 0);
    Placemark.matrix.multiplyByRotation(0, 0, 1, actualRotation);
    Placemark.matrix.multiplyByTranslation(-0.5, -0.5, 0);

    // Perform the tilt before applying the rotation so that the image tilts back from its base into
    // the view volume.
    var actualTilt = this.imageTiltReference === WorldWind.RELATIVE_TO_GLOBE ?
        dc.navigator.tilt + this.imageTilt : this.imageTilt;
    Placemark.matrix.multiplyByRotation(-1, 0, 0, actualTilt);

    program.loadModelviewProjection(gl, Placemark.matrix);

    // Enable texture for both normal display and for picking. If picking is enabled in the shader (set in
    // beginDrawing() above) then the texture's alpha component is still needed in order to modulate the
    // pick color to mask off transparent pixels.
    program.loadTextureEnabled(gl, true);

    if (dc.pickingMode) {
        program.loadColor(gl, this.pickColor);
    } else {
        program.loadColor(gl, this.activeAttributes.imageColor);
    }

    this.texCoordMatrix.setToIdentity();
    if (this.activeTexture) {
        this.texCoordMatrix.multiplyByTextureTransform(this.activeTexture);
    }
    program.loadTextureMatrix(gl, this.texCoordMatrix);

    if (this.activeTexture) {
        textureBound = this.activeTexture.bind(dc); // returns false if active texture is null or cannot be bound
        program.loadTextureEnabled(gl, textureBound);
    } else {
        program.loadTextureEnabled(gl, false);
    }

    // Draw the placemark's image quad.
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    if (this.mustDrawLabel() && this.currentVisibility > 0) {
        program.loadOpacity(gl, dc.pickingMode ? 1 : this.layer.opacity * this.currentVisibility);

        Placemark.matrix.copy(dc.screenProjection);
        Placemark.matrix.multiplyMatrix(this.labelTransform);
        program.loadModelviewProjection(gl, Placemark.matrix);

        if (!dc.pickingMode && this.labelTexture) {
            this.texCoordMatrix.setToIdentity();
            this.texCoordMatrix.multiplyByTextureTransform(this.labelTexture);

            program.loadTextureMatrix(gl, this.texCoordMatrix);
            program.loadColor(gl, Color.WHITE);

            textureBound = this.labelTexture.bind(dc);
            program.loadTextureEnabled(gl, textureBound);
        } else {
            program.loadTextureEnabled(gl, false);
            program.loadColor(gl, this.pickColor);
        }

        if (this.activeAttributes.labelAttributes.depthTest) {
            if (!depthTest) {
                depthTest = true;
                gl.enable(gl.DEPTH_TEST);
            }
        } else {
            depthTest = false;
            gl.disable(gl.DEPTH_TEST);
        }

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    if (!depthTest) {
        gl.enable(gl.DEPTH_TEST);
    }

    // tag, 6/17/15: See note on depthMask above in this function.
    //gl.depthMask(true);
};

// Internal. Intentionally not documented.
Placemark.prototype.mustDrawLabel = function () {
    return this.label && this.label.length > 0 && this.activeAttributes.labelAttributes;
};

// Internal. Intentionally not documented.
Placemark.prototype.mustDrawLeaderLine = function (dc) {
    return this.activeAttributes.drawLeaderLine && this.activeAttributes.leaderLineAttributes
        && (!dc.pickingMode || this.enableLeaderLinePicking);
};

// Internal use only. Intentionally not documented.
Placemark.prototype.getReferencePosition = function () {
    return this.position;
};

// Internal use only. Intentionally not documented.
Placemark.prototype.moveTo = function (globe, position) {
    this.position = position;
};

export default Placemark;
