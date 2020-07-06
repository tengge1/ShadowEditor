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
 * @exports ScreenImage
 */
import ArgumentError from '../error/ArgumentError';
import BasicTextureProgram from '../shaders/BasicTextureProgram';
import Color from '../util/Color';
import ImageSource from '../util/ImageSource';
import Logger from '../util/Logger';
import Matrix from '../geom/Matrix';
import Offset from '../util/Offset';
import PickedObject from '../pick/PickedObject';
import Renderable from '../render/Renderable';
import Vec3 from '../geom/Vec3';
import WWMath from '../util/WWMath';


/**
 * Constructs a screen image.
 * @alias ScreenImage
 * @constructor
 * @augments Renderable
 * @classdesc Displays an image at a specified screen location in the WorldWindow.
 * The image location is specified by an offset, which causes the image to maintain its relative position
 * when the window size changes.
 * @param {Offset} screenOffset The offset indicating the image's placement on the screen.
 * Use [the image offset property]{@link ScreenImage#imageOffset} to position the image relative to the
 * specified screen offset.
 * @param {String|ImageSource} imageSource The source of the image to display.
 * May be either a string identifying the URL of the image, or an {@link ImageSource} object identifying a
 * dynamically created image.
 * @throws {ArgumentError} If the specified screen offset or image source is null or undefined.
 */
function ScreenImage(screenOffset, imageSource) {
    if (!screenOffset) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "ScreenImage", "constructor", "missingOffset"));
    }

    if (!imageSource) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "ScreenImage", "constructor", "missingImage"));
    }

    Renderable.call(this);

    /**
     * The offset indicating this screen image's placement on the screen.
     * @type {Offset}
     */
    this.screenOffset = screenOffset;

    // Documented with its property accessor below.
    this._imageSource = imageSource;

    /**
     * The image color. When displayed, this shape's image is multiplied by this image color to achieve the
     * final image color. The color white, the default, causes the image to be drawn in its native colors.
     * @type {Color}
     * @default White (1, 1, 1, 1)
     */
    this.imageColor = Color.WHITE;

    /**
     * Indicates the location within the image at which to align with the specified screen location.
     * May be null, in which case the image's bottom-left corner is placed at the screen location.
     * @type {Offset}
     * @default 0.5, 0.5, both fractional (Centers the image on the screen location.)
     */
    this.imageOffset = new Offset(WorldWind.OFFSET_FRACTION, 0.5, WorldWind.OFFSET_FRACTION, 0.5);

    /**
     * Indicates the amount to scale the image.
     * @type {Number}
     * @default 1
     */
    this.imageScale = 1;

    /**
     * The amount of rotation to apply to the image, measured in degrees clockwise from the top of the window.
     * @type {Number}
     * @default 0
     */
    this.imageRotation = 0;

    /**
     * The amount of tilt to apply to the image, measured in degrees.
     * @type {Number}
     * @default 0
     */
    this.imageTilt = 0;

    /**
     * Indicates whether to draw this screen image.
     * @type {Boolean}
     * @default true
     */
    this.enabled = true;

    /**
     * This image's opacity. When this screen image is drawn, the actual opacity is the product of
     * this opacity and the opacity of the layer containing this screen image.
     * @type {Number}
     */
    this.opacity = 1;

    /**
     * Indicates the object to return as the userObject of this shape when picked. If null,
     * then this shape is returned as the userObject.
     * @type {Object}
     * @default null
     * @see  [PickedObject.userObject]{@link PickedObject#userObject}
     */
    this.pickDelegate = null;

    // Internal use only. Intentionally not documented.
    this.activeTexture = null;

    // Internal use only. Intentionally not documented.
    this.imageTransform = Matrix.fromIdentity();

    // Internal use only. Intentionally not documented.
    this.texCoordMatrix = Matrix.fromIdentity();

    // Internal use only. Intentionally not documented.
    this.imageBounds = null;

    // Internal use only. Intentionally not documented.
    this.layer = null;
}

// Internal use only. Intentionally not documented.
ScreenImage.matrix = Matrix.fromIdentity(); // scratch variable

ScreenImage.prototype = Object.create(Renderable.prototype);

Object.defineProperties(ScreenImage.prototype, {
    /**
     * The source of the image to display.
     * May be either a string identifying the URL of the image, or an {@link ImageSource} object identifying a
     * dynamically created image.
     * @type {String|ImageSource}
     * @default null
     * @memberof ScreenImage.prototype
     */
    imageSource: {
        get: function () {
            return this._imageSource;
        },
        set: function (imageSource) {
            if (!imageSource) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ScreenImage", "imageSource",
                    "missingImage"));
            }

            this._imageSource = imageSource;
            this.imageSourceWasUpdated = true;
        }
    }
});

/**
 * Renders this screen image. This method is typically not called by applications but is called by
 * {@link RenderableLayer} during rendering. For this shape this method creates and
 * enques an ordered renderable with the draw context and does not actually draw the image.
 * @param {DrawContext} dc The current draw context.
 */
ScreenImage.prototype.render = function (dc) {
    if (!this.enabled) {
        return;
    }

    if (!dc.accumulateOrderedRenderables) {
        return;
    }

    // Create an ordered renderable, but don't create more than one per frame.
    var orderedScreenImage = null;
    if (this.lastFrameTime !== dc.timestamp) {
        orderedScreenImage = this.makeOrderedRenderable(dc);
    }

    if (!orderedScreenImage) {
        return;
    }

    if (!orderedScreenImage.isVisible(dc)) {
        return;
    }

    orderedScreenImage.layer = dc.currentLayer;

    this.lastFrameTime = dc.timestamp;
    dc.addOrderedRenderable(orderedScreenImage);
};

/**
 * Draws this shape as an ordered renderable. Applications do not call this function. It is called by
 * [WorldWindow]{@link WorldWindow} during rendering.
 * @param {DrawContext} dc The current draw context.
 */
ScreenImage.prototype.renderOrdered = function (dc) {
    this.drawOrderedScreenImage(dc);

    if (dc.pickingMode) {
        var po = new PickedObject(this.pickColor.clone(), this.pickDelegate ? this.pickDelegate : this,
            null, this.layer, false);
        dc.resolvePick(po);
    }
};

// Internal. Intentionally not documented.
ScreenImage.prototype.makeOrderedRenderable = function (dc) {
    var w, h, s, ws, hs,
        iOffset, sOffset;

    this.activeTexture = this.getActiveTexture(dc);
    if (!this.activeTexture || this.imageSourceWasUpdated) {
        this.activeTexture = dc.gpuResourceCache.retrieveTexture(dc.currentGlContext, this._imageSource);
        if (!this.activeTexture) {
            return null;
        }
    }

    this.eyeDistance = 0;

    // Compute the image's transform matrix and texture coordinate matrix according to its screen point, image size,
    // image offset and image scale. The image offset is defined with its origin at the image's bottom-left corner and
    // axes that extend up and to the right from the origin point.
    w = this.activeTexture.imageWidth;
    h = this.activeTexture.imageHeight;
    s = this.imageScale;
    iOffset = this.imageOffset.offsetForSize(w, h);
    ws = dc.viewport.width;
    hs = dc.viewport.height;
    sOffset = this.screenOffset.offsetForSize(ws, hs);

    this.imageTransform.setTranslation(
        sOffset[0] - iOffset[0] * s,
        sOffset[1] - iOffset[1] * s,
        0);

    this.imageTransform.setScale(w * s, h * s, 1);

    this.imageBounds = WWMath.boundingRectForUnitQuad(this.imageTransform);

    return this;
};

ScreenImage.prototype.getActiveTexture = function (dc) {
    return dc.gpuResourceCache.resourceForKey(this._imageSource);
};

// Internal. Intentionally not documented.
ScreenImage.prototype.isVisible = function (dc) {
    if (dc.pickingMode) {
        return dc.pickRectangle && this.imageBounds.intersects(dc.pickRectangle);
    } else {
        return this.imageBounds.intersects(dc.viewport);
    }
};

// Internal. Intentionally not documented.
ScreenImage.prototype.drawOrderedScreenImage = function (dc) {
    this.beginDrawing(dc);
    try {
        this.doDrawOrderedScreenImage(dc);
    } finally {
        this.endDrawing(dc);
    }
};

// Internal. Intentionally not documented.
ScreenImage.prototype.beginDrawing = function (dc) {
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

    // Turn off depth testing.
    gl.disable(gl.DEPTH_TEST);
};

// Internal. Intentionally not documented.
ScreenImage.prototype.endDrawing = function (dc) {
    var gl = dc.currentGlContext,
        program = dc.currentProgram;

    // Clear the vertex attribute state.
    gl.disableVertexAttribArray(program.vertexPointLocation);
    gl.disableVertexAttribArray(program.vertexTexCoordLocation);

    // Clear GL bindings.
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);

    // Re-enable depth testing.
    gl.enable(gl.DEPTH_TEST);
};

// Internal. Intentionally not documented.
ScreenImage.prototype.doDrawOrderedScreenImage = function (dc) {
    var gl = dc.currentGlContext,
        program = dc.currentProgram;

    gl.bindBuffer(gl.ARRAY_BUFFER, dc.unitQuadBuffer3());
    gl.vertexAttribPointer(program.vertexPointLocation, 3, gl.FLOAT, false, 0, 0);

    // Compute and specify the MVP matrix.
    ScreenImage.matrix.copy(dc.screenProjection);
    ScreenImage.matrix.multiplyMatrix(this.imageTransform);

    ScreenImage.matrix.multiplyByTranslation(0.5, 0.5, 0.5); // shift Z to prevent image clipping
    ScreenImage.matrix.multiplyByRotation(1, 0, 0, this.imageTilt);
    ScreenImage.matrix.multiplyByRotation(0, 0, 1, this.imageRotation);
    ScreenImage.matrix.multiplyByTranslation(-0.5, -0.5, 0);

    program.loadModelviewProjection(gl, ScreenImage.matrix);

    // Enable texture for both normal display and for picking. If picking is enabled in the shader (set in
    // beginDrawing() above) then the texture's alpha component is still needed in order to modulate the
    // pick color to mask off transparent pixels.
    program.loadTextureEnabled(gl, true);

    // Set the pick color for picking or the color and opacity if not picking.
    if (dc.pickingMode) {
        this.pickColor = dc.uniquePickColor();
        program.loadColor(gl, this.pickColor);
        program.loadOpacity(gl, 1);
    } else {
        program.loadColor(gl, this.imageColor);
        program.loadOpacity(gl, this.opacity * this.layer.opacity);
    }

    this.texCoordMatrix.setToIdentity();
    this.texCoordMatrix.multiplyByTextureTransform(this.activeTexture);
    program.loadTextureMatrix(gl, this.texCoordMatrix);

    if (this.activeTexture.bind(dc)) { // returns false if active texture cannot be bound
        // Draw the placemark's image quad.
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
};

export default ScreenImage;
