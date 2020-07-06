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
 * @exports DrawContext
 */
import ArgumentError from '../error/ArgumentError';
import Color from '../util/Color';
import FrameStatistics from '../util/FrameStatistics';
import FramebufferTexture from '../render/FramebufferTexture';
import FramebufferTileController from '../render/FramebufferTileController';
import Frustum from '../geom/Frustum';
import Globe from '../globe/Globe';
import GpuProgram from '../shaders/GpuProgram';
import GpuResourceCache from '../cache/GpuResourceCache';
import Layer from '../layer/Layer';
import Line from '../geom/Line';
import Logger from '../util/Logger';
import Matrix from '../geom/Matrix';
import PickedObjectList from '../pick/PickedObjectList';
import Plane from '../geom/Plane';
import Position from '../geom/Position';
import Rectangle from '../geom/Rectangle';
import ScreenCreditController from '../render/ScreenCreditController';
import Sector from '../geom/Sector';
import SurfaceShape from '../shapes/SurfaceShape';
import SurfaceShapeTileBuilder from '../shapes/SurfaceShapeTileBuilder';
import SurfaceTileRenderer from '../render/SurfaceTileRenderer';
import TextRenderer from '../render/TextRenderer';
import Vec2 from '../geom/Vec2';
import Vec3 from '../geom/Vec3';
import WWMath from '../util/WWMath';


/**
 * Constructs a DrawContext. Applications do not call this constructor. A draw context is created by a
 * {@link WorldWindow} during its construction.
 * @alias DrawContext
 * @constructor
 * @classdesc Provides current state during rendering. The current draw context is passed to most rendering
 * methods in order to make those methods aware of current state.
 * @param {WebGLRenderingContext} gl The WebGL rendering context this draw context is associated with.
 * @throws {ArgumentError} If the specified WebGL rendering context is null or undefined.
 */
function DrawContext(gl) {
    if (!gl) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Texture", "constructor",
            "missingGlContext"));
    }

    /**
     * The current WebGL rendering context.
     * @type {WebGLRenderingContext}
     */
    this.currentGlContext = gl;

    /**
     * A 2D canvas for creating texture maps.
     * @type {HTMLElement}
     */
    this.canvas2D = document.createElement("canvas");

    /**
     * A 2D context for this draw context's [canvas property]{@link DrawContext#canvas}.
     */
    this.ctx2D = this.canvas2D.getContext("2d");

    /**
     * The current clear color.
     * @type {Color}
     * @default Color.TRANSPARENT (red = 0, green = 0, blue = 0, alpha = 0)
     */
    this.clearColor = Color.TRANSPARENT;

    /**
     * The GPU resource cache, which tracks WebGL resources.
     * @type {GpuResourceCache}
     */
    this.gpuResourceCache = new GpuResourceCache(WorldWind.configuration.gpuCacheSize,
        0.8 * WorldWind.configuration.gpuCacheSize);

    /**
     * The surface-tile-renderer to use for drawing surface tiles.
     * @type {SurfaceTileRenderer}
     */
    this.surfaceTileRenderer = new SurfaceTileRenderer();

    /**
     * The surface shape tile builder used to create and draw surface shapes.
     * @type {SurfaceShapeTileBuilder}
     */
    this.surfaceShapeTileBuilder = new SurfaceShapeTileBuilder();

    /**
     * Provides access to a multi-resolution WebGL framebuffer arranged as adjacent tiles in a pyramid. Surface
     * shapes use these tiles internally to draw on the terrain surface.
     * @type {FramebufferTileController}
     */
    this.surfaceShapeTileController = new FramebufferTileController();

    /**
     * The screen credit controller responsible for collecting and drawing screen credits.
     * @type {ScreenCreditController}
     */
    this.screenCreditController = new ScreenCreditController();

    /**
     * A shared TextRenderer instance.
     * @type {TextRenderer}
     */
    this.textRenderer = new TextRenderer(this);

    /**
     * The current WebGL framebuffer. Null indicates that the default WebGL framebuffer is active.
     * @type {FramebufferTexture}
     */
    this.currentFramebuffer = null;

    /**
     * The current WebGL program. Null indicates that no WebGL program is active.
     * @type {GpuProgram}
     */
    this.currentProgram = null;

    /**
     * The list of surface renderables.
     * @type {Array}
     */
    this.surfaceRenderables = [];

    /**
     * Indicates whether this draw context is in ordered rendering mode.
     * @type {Boolean}
     */
    this.orderedRenderingMode = false;

    /**
     * The list of ordered renderables.
     * @type {Array}
     */
    this.orderedRenderables = [];

    // Internal. Intentionally not documented. Provides ordinal IDs to ordered renderables.
    this.orderedRenderablesCounter = 0; // Number

    /**
     * The starting time of the current frame, in milliseconds. The frame timestamp is updated immediately
     * before the WorldWindow associated with this draw context is rendered, either as a result of redrawing or
     * as a result of a picking operation.
     * @type {Number}
     * @readonly
     */
    this.timestamp = Date.now();

    /**
     * The [time stamp]{@link DrawContext#timestamp} of the last visible frame, in milliseconds. This indicates
     * the time stamp that was current during the WorldWindow's last frame, ignoring frames associated with a
     * picking operation. The difference between the previous redraw time stamp and the current time stamp
     * indicates the duration between visible frames, e.g. <code style='white-space:nowrap'>timeStamp - previousRedrawTimestamp</code>.
     * @type {Number}
     * @readonly
     */
    this.previousRedrawTimestamp = this.timestamp;

    /**
     * Indicates whether a redraw has been requested during the current frame. When true, this causes the World
     * Window associated with this draw context to redraw after the current frame.
     * @type {Boolean}
     */
    this.redrawRequested = false;

    /**
     * The globe being rendered.
     * @type {Globe}
     */
    this.globe = null;

    /**
     * A copy of the current globe's state key. Provided here to avoid having to recompute it every time
     * it's needed.
     * @type {String}
     */
    this.globeStateKey = null;

    /**
     * The layers being rendered.
     * @type {Layer[]}
     */
    this.layers = null;

    /**
     * The layer being rendered.
     * @type {Layer}
     */
    this.currentLayer = null;

    /**
     * The current eye position.
     * @type {Position}
     */
    this.eyePosition = new Position(0, 0, 0);

    /**
     * The eye point in model coordinates, relative to the globe's center.
     * @type {Vec3}
     * @readonly
     */
    this.eyePoint = new Vec3(0, 0, 0);

    /**
     * The current screen projection matrix.
     * @type {Matrix}
     */
    this.screenProjection = Matrix.fromIdentity();

    /**
     * The terrain for the current frame.
     * @type {Terrain}
     */
    this.terrain = null;

    /**
     * The current vertical exaggeration.
     * @type {Number}
     */
    this.verticalExaggeration = 1;

    /**
     * The number of milliseconds over which to fade shapes that support fading. Fading is most typically
     * used during decluttering.
     * @type {Number}
     * @default 500
     */
    this.fadeTime = 500;

    /**
     * The opacity to apply to terrain and surface shapes. Should be a number between 0 and 1.
     * @type {Number}
     * @default 1
     */
    this.surfaceOpacity = 1;

    /**
     * Frame statistics.
     * @type {FrameStatistics}
     */
    this.frameStatistics = null;

    /**
     * Indicates whether the frame is being drawn for picking.
     * @type {Boolean}
     */
    this.pickingMode = false;

    /**
     * Indicates that picking will return only the terrain object, if the pick point is over the terrain.
     * @type {Boolean}
     * @default false
     */
    this.pickTerrainOnly = false;

    /**
     * Indicates that picking will return all objects at the pick point, if any. The top-most object will have
     * its isOnTop flag set to true. If [deep picking]{@link WorldWindow#deepPicking} is false, the default,
     * only the top-most object is returned, plus the picked-terrain object if the pick point is over the
     * terrain.
     * @type {Boolean}
     * @default false
     */
    this.deepPicking = false;

    /**
     * Indicates that picking will return all objects that intersect the pick region, if any. Visible objects
     * will have the isOnTop flag set to true.
     * @type {Boolean}
     * @default false
     */
    this.regionPicking = false;

    /**
     * The current pick point, in screen coordinates.
     * @type {Vec2}
     */
    this.pickPoint = null;

    /**
     * The current pick ray originating at the eyePoint and extending through the pick point.
     * @type {Line}
     */
    this.pickRay = null;

    /**
     * The current pick rectangle, in WebGL (lower-left origin) screen coordinates.
     * @type {Rectangle}
     */
    this.pickRectangle = null;

    /**
     * The off-screen WebGL framebuffer used during picking.
     * @type {FramebufferTexture}
     * @readonly
     */
    this.pickFramebuffer = null;

    /**
     * The current pick frustum, created anew each picking frame.
     * @type {Frustum}
     * @readonly
     */
    this.pickFrustum = null;

    // Internal. Keeps track of the current pick color.
    this.pickColor = new Color(0, 0, 0, 1);

    /**
     * The objects at the current pick point.
     * @type {PickedObjectList}
     * @readonly
     */
    this.objectsAtPickPoint = new PickedObjectList();

    // Intentionally not documented.
    this.pixelScale = 1;

    // TODO: replace with camera in the next phase of navigator refactoring
    this.navigator = null;

    /**
     * The model-view matrix. The model-view matrix transforms points from model coordinates to eye
     * coordinates.
     * @type {Matrix}
     * @readonly
     */
    this.modelview = Matrix.fromIdentity();

    /**
     * The projection matrix. The projection matrix transforms points from eye coordinates to clip
     * coordinates.
     * @type {Matrix}
     * @readonly
     */
    this.projection = Matrix.fromIdentity();

    /**
     * The concatenation of the DrawContext's model-view and projection matrices. This matrix transforms points
     * from model coordinates to clip coordinates.
     * @type {Matrix}
     * @readonly
     */
    this.modelviewProjection = Matrix.fromIdentity();

    /**
     * The viewing frustum in model coordinates. The frustum originates at the eyePoint and extends
     * outward along the forward vector. The near distance and far distance identify the minimum and
     * maximum distance, respectively, at which an object in the scene is visible.
     * @type {Frustum}
     * @readonly
     */
    this.frustumInModelCoordinates = null;

    /**
     * The matrix that transforms normal vectors in model coordinates to normal vectors in eye coordinates.
     * Typically used to transform a shape's normal vectors during lighting calculations.
     * @type {Matrix}
     * @readonly
     */
    this.modelviewNormalTransform = Matrix.fromIdentity();

    /**
     * The current viewport.
     * @type {Rectangle}
     * @readonly
     */
    this.viewport = new Rectangle(0, 0, 0, 0);

    // Intentionally not documented.
    this.pixelSizeFactor = 0;

    // Intentionally not documented.
    this.pixelSizeOffset = 0;

    // Intentionally not documented.
    this.glExtensionsCache = {};
}

// Internal use. Intentionally not documented.
DrawContext.unitCubeKey = "DrawContextUnitCubeKey";
DrawContext.unitCubeElementsKey = "DrawContextUnitCubeElementsKey";
DrawContext.unitQuadKey = "DrawContextUnitQuadKey";
DrawContext.unitQuadKey3 = "DrawContextUnitQuadKey3";

/**
 * Prepare this draw context for the drawing of a new frame.
 */
DrawContext.prototype.reset = function () {
    // Reset the draw context's internal properties.
    this.screenCreditController.clear();
    this.surfaceRenderables = []; // clears the surface renderables array
    this.orderedRenderingMode = false;
    this.orderedRenderables = []; // clears the ordered renderables array
    this.screenRenderables = [];
    this.orderedRenderablesCounter = 0;

    // Advance the per-frame timestamp.
    var previousTimestamp = this.timestamp;
    this.timestamp = Date.now();
    if (this.timestamp === previousTimestamp)
        ++this.timestamp;

    // Reset properties set by the WorldWindow every frame.
    this.redrawRequested = false;
    this.globe = null;
    this.globeStateKey = null;
    this.layers = null;
    this.currentLayer = null;
    this.terrain = null;
    this.verticalExaggeration = 1;
    this.frameStatistics = null;
    this.accumulateOrderedRenderables = true;

    // Reset picking properties that may be set by the WorldWindow.
    this.pickingMode = false;
    this.pickTerrainOnly = false;
    this.deepPicking = false;
    this.regionPicking = false;
    this.pickPoint = null;
    this.pickRay = null;
    this.pickRectangle = null;
    this.pickFrustum = null;
    this.pickColor = new Color(0, 0, 0, 1);
    this.objectsAtPickPoint.clear();

    this.eyePoint.set(0, 0, 0);
    this.modelview.setToIdentity();
    this.projection.setToIdentity();
    this.modelviewProjection.setToIdentity();
    this.frustumInModelCoordinates = null;
    this.modelviewNormalTransform.setToIdentity();
};

/**
 * Computes any values necessary to render the upcoming frame. Called after all draw context state for the
 * frame has been set.
 */
DrawContext.prototype.update = function () {
    var gl = this.currentGlContext,
        eyePoint = this.eyePoint;

    this.globeStateKey = this.globe.stateKey;
    this.globe.computePositionFromPoint(eyePoint[0], eyePoint[1], eyePoint[2], this.eyePosition);
    this.screenProjection.setToScreenProjection(gl.drawingBufferWidth, gl.drawingBufferHeight);
};

/**
 * Notifies this draw context that the current WebGL rendering context has been lost. This function removes all
 * cached WebGL resources and resets all properties tracking the current WebGL state.
 */
DrawContext.prototype.contextLost = function () {
    // Remove all cached WebGL resources, which are now invalid.
    this.gpuResourceCache.clear();
    this.pickFramebuffer = null;
    // Reset properties tracking the current WebGL state, which are now invalid.
    this.currentFramebuffer = null;
    this.currentProgram = null;
    this.glExtensionsCache = {};
};

/**
 * Notifies this draw context that the current WebGL rendering context has been restored. This function prepares
 * this draw context to resume rendering.
 */
DrawContext.prototype.contextRestored = function () {
    // Remove all cached WebGL resources. This cache is already cleared when the context is lost, but
    // asynchronous load operations that complete between context lost and context restored populate the cache
    // with invalid entries.
    this.gpuResourceCache.clear();
    this.glExtensionsCache = {};
};

/**
 * Binds a specified WebGL framebuffer. This function also makes the framebuffer the active framebuffer.
 * @param {FramebufferTexture} framebuffer The framebuffer to bind. May be null or undefined, in which case the
 * default WebGL framebuffer is made active.
 */
DrawContext.prototype.bindFramebuffer = function (framebuffer) {
    if (this.currentFramebuffer != framebuffer) {
        this.currentGlContext.bindFramebuffer(this.currentGlContext.FRAMEBUFFER,
            framebuffer ? framebuffer.framebufferId : null);
        this.currentFramebuffer = framebuffer;
    }
};

/**
 * Binds a specified WebGL program. This function also makes the program the current program.
 * @param {GpuProgram} program The program to bind. May be null or undefined, in which case the currently
 * bound program is unbound.
 */
DrawContext.prototype.bindProgram = function (program) {
    if (this.currentProgram != program) {
        this.currentGlContext.useProgram(program ? program.programId : null);
        this.currentProgram = program;
    }
};

/**
 * Binds a potentially cached WebGL program, creating and caching it if it isn't already cached.
 * This function also makes the program the current program.
 * @param {function} programConstructor The constructor to use to create the program.
 * @returns {GpuProgram} The bound program.
 * @throws {ArgumentError} If the specified constructor is null or undefined.
 */
DrawContext.prototype.findAndBindProgram = function (programConstructor) {
    if (!programConstructor) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "DrawContext", "findAndBindProgram",
                "The specified program constructor is null or undefined."));
    }

    var program = this.gpuResourceCache.resourceForKey(programConstructor.key);
    if (program) {
        this.bindProgram(program);
    } else {
        try {
            program = new programConstructor(this.currentGlContext);
            this.bindProgram(program);
            this.gpuResourceCache.putResource(programConstructor.key, program, program.size);
        } catch (e) {
            Logger.log(Logger.LEVEL_SEVERE, "Error attempting to create GPU program.");
        }
    }

    return program;
};

/**
 * Adds a surface renderable to this draw context's surface renderable list.
 * @param {SurfaceRenderable} surfaceRenderable The surface renderable to add. May be null, in which case the
 * current surface renderable list remains unchanged.
 */
DrawContext.prototype.addSurfaceRenderable = function (surfaceRenderable) {
    if (surfaceRenderable) {
        this.surfaceRenderables.push(surfaceRenderable);
    }
};

/**
 * Returns the surface renderable at the head of the surface renderable list without removing it from the list.
 * @returns {SurfaceRenderable} The first surface renderable in this draw context's surface renderable list, or
 * null if the surface renderable list is empty.
 */
DrawContext.prototype.peekSurfaceRenderable = function () {
    if (this.surfaceRenderables.length > 0) {
        return this.surfaceRenderables[this.surfaceRenderables.length - 1];
    } else {
        return null;
    }
};

/**
 * Returns the surface renderable at the head of the surface renderable list and removes it from the list.
 * @returns {SurfaceRenderable} The first surface renderable in this draw context's surface renderable list, or
 * null if the surface renderable list is empty.
 */
DrawContext.prototype.popSurfaceRenderable = function () {
    if (this.surfaceRenderables.length > 0) {
        return this.surfaceRenderables.pop();
    } else {
        return null;
    }
};

/**
 * Reverses the surface renderable list in place. After this function completes, the functions
 * peekSurfaceRenderable and popSurfaceRenderable return renderables in the order in which they were added to
 * the surface renderable list.
 */
DrawContext.prototype.reverseSurfaceRenderables = function () {
    this.surfaceRenderables.reverse();
};

/**
 * Adds an ordered renderable to this draw context's ordered renderable list.
 * @param {OrderedRenderable} orderedRenderable The ordered renderable to add. May be null, in which case the
 * current ordered renderable list remains unchanged.
 * @param {Number} eyeDistance An optional argument indicating the ordered renderable's eye distance.
 * If this parameter is not specified then the ordered renderable must have an eyeDistance property.
 */
DrawContext.prototype.addOrderedRenderable = function (orderedRenderable, eyeDistance) {
    if (orderedRenderable) {
        var ore = {
            orderedRenderable: orderedRenderable,
            insertionOrder: this.orderedRenderablesCounter++,
            eyeDistance: eyeDistance || orderedRenderable.eyeDistance,
            globeStateKey: this.globeStateKey
        };

        if (this.globe.continuous) {
            ore.globeOffset = this.globe.offset;
        }

        if (ore.eyeDistance === 0) {
            this.screenRenderables.push(ore);
        } else {
            this.orderedRenderables.push(ore);
        }
    }
};

/**
 * Adds an ordered renderable to the end of this draw context's ordered renderable list, denoting it as the
 * most distant from the eye point.
 * @param {OrderedRenderable} orderedRenderable The ordered renderable to add. May be null, in which case the
 * current ordered renderable list remains unchanged.
 */
DrawContext.prototype.addOrderedRenderableToBack = function (orderedRenderable) {
    if (orderedRenderable) {
        var ore = {
            orderedRenderable: orderedRenderable,
            insertionOrder: this.orderedRenderablesCounter++,
            eyeDistance: Number.MAX_VALUE,
            globeStateKey: this.globeStateKey
        };

        if (this.globe.continuous) {
            ore.globeOffset = this.globe.offset;
        }

        this.orderedRenderables.push(ore);
    }
};

/**
 * Returns the ordered renderable at the head of the ordered renderable list without removing it from the list.
 * @returns {OrderedRenderable} The first ordered renderable in this draw context's ordered renderable list, or
 * null if the ordered renderable list is empty.
 */
DrawContext.prototype.peekOrderedRenderable = function () {
    if (this.orderedRenderables.length > 0) {
        return this.orderedRenderables[this.orderedRenderables.length - 1].orderedRenderable;
    } else {
        return null;
    }
};

/**
 * Returns the ordered renderable at the head of the ordered renderable list and removes it from the list.
 * @returns {OrderedRenderable} The first ordered renderable in this draw context's ordered renderable list, or
 * null if the ordered renderable list is empty.
 */
DrawContext.prototype.popOrderedRenderable = function () {
    if (this.orderedRenderables.length > 0) {
        var ore = this.orderedRenderables.pop();
        this.globeStateKey = ore.globeStateKey;

        if (this.globe.continuous) {
            // Restore the globe state to that when the ordered renderable was created.
            this.globe.offset = ore.globeOffset;
        }

        return ore.orderedRenderable;
    } else {
        return null;
    }
};

/**
 * Returns the ordered renderable at the head of the ordered renderable list and removes it from the list.
 * @returns {OrderedRenderable} The first ordered renderable in this draw context's ordered renderable list, or
 * null if the ordered renderable list is empty.
 */
DrawContext.prototype.nextScreenRenderable = function () {
    if (this.screenRenderables.length > 0) {
        var ore = this.screenRenderables.shift();
        this.globeStateKey = ore.globeStateKey;

        if (this.globe.continuous) {
            // Restore the globe state to that when the ordered renderable was created.
            this.globe.offset = ore.globeOffset;
        }

        return ore.orderedRenderable;
    } else {
        return null;
    }
};

/**
 * Sorts the ordered renderable list from nearest to the eye point to farthest from the eye point.
 */
DrawContext.prototype.sortOrderedRenderables = function () {
    // Sort the ordered renderables by eye distance from front to back and then by insertion time. The ordered
    // renderable peek and pop access the back of the ordered renderable list, thereby causing ordered renderables to
    // be processed from back to front.

    this.orderedRenderables.sort(function (oreA, oreB) {
        var eA = oreA.eyeDistance,
            eB = oreB.eyeDistance;

        if (eA < eB) { // orA is closer to the eye than orB; sort orA before orB
            return -1;
        } else if (eA > eB) { // orA is farther from the eye than orB; sort orB before orA
            return 1;
        } else { // orA and orB are the same distance from the eye; sort them based on insertion time
            var tA = oreA.insertionOrder,
                tB = oreB.insertionOrder;

            if (tA > tB) {
                return -1;
            } else if (tA < tB) {
                return 1;
            } else {
                return 0;
            }
        }
    });
};

/**
 * Reads the color from the current render buffer at a specified point. Used during picking to identify the item most
 * recently affecting the pixel at the specified point.
 * @param {Vec2} pickPoint The current pick point.
 * @returns {Color} The color at the pick point.
 */
DrawContext.prototype.readPickColor = function (pickPoint) {
    var glPickPoint = this.convertPointToViewport(pickPoint, new Vec2(0, 0)),
        colorBytes = new Uint8Array(4);

    this.currentGlContext.readPixels(glPickPoint[0], glPickPoint[1], 1, 1, this.currentGlContext.RGBA,
        this.currentGlContext.UNSIGNED_BYTE, colorBytes);

    if (this.clearColor.equalsBytes(colorBytes)) {
        return null;
    }

    return Color.colorFromByteArray(colorBytes);
};

/**
 * Reads the current pick buffer colors in a specified rectangle. Used during region picking to identify
 * the items not occluded.
 * @param {Rectangle} pickRectangle The rectangle for which to read the colors.
 * @returns {{}} An object containing the unique colors in the specified rectangle, excluding the current
 * clear color. The colors are referenced by their byte string
 * (see [Color.toByteString]{@link Color#toByteString}.
 */
DrawContext.prototype.readPickColors = function (pickRectangle) {
    var gl = this.currentGlContext,
        colorBytes = new Uint8Array(pickRectangle.width * pickRectangle.height * 4),
        uniqueColors = {},
        color,
        blankColor = new Color(0, 0, 0, 0),
        packAlignment = gl.getParameter(gl.PACK_ALIGNMENT);

    gl.pixelStorei(gl.PACK_ALIGNMENT, 1); // read byte aligned
    this.currentGlContext.readPixels(pickRectangle.x, pickRectangle.y,
        pickRectangle.width, pickRectangle.height,
        gl.RGBA, gl.UNSIGNED_BYTE, colorBytes);
    gl.pixelStorei(gl.PACK_ALIGNMENT, packAlignment); // restore the pack alignment

    for (var i = 0, len = pickRectangle.width * pickRectangle.height; i < len; i++) {
        var k = i * 4;
        color = Color.colorFromBytes(colorBytes[k], colorBytes[k + 1], colorBytes[k + 2], colorBytes[k + 3]);
        if (color.equals(this.clearColor) || color.equals(blankColor))
            continue;
        uniqueColors[color.toByteString()] = color;
    }

    return uniqueColors;
};

/**
 * Determines whether a specified picked object is under the pick point, and if it is adds it to this draw
 * context's list of picked objects. This method should be called by shapes during ordered rendering
 * after the shape is drawn. If this draw context is in single-picking mode, the specified pickable object
 * is added to the list of picked objects whether or not it is under the pick point.
 * @param pickableObject
 * @returns {null}
 */
DrawContext.prototype.resolvePick = function (pickableObject) {
    if (!(pickableObject.userObject instanceof SurfaceShape) && this.deepPicking && !this.regionPicking) {
        var color = this.readPickColor(this.pickPoint);
        if (!color) { // getPickColor returns null if the pick point selects the clear color
            return null;
        }

        if (pickableObject.color.equals(color)) {
            this.addPickedObject(pickableObject);
        }
    } else {
        // Don't resolve. Just add the object to the pick list. It will be resolved later.
        this.addPickedObject(pickableObject);
    }
};

/**
 * Adds an object to the current picked-object list. The list identifies objects that are at the pick point
 * but not necessarily the top-most object.
 * @param  {PickedObject} pickedObject The object to add.
 */
DrawContext.prototype.addPickedObject = function (pickedObject) {
    if (pickedObject) {
        this.objectsAtPickPoint.add(pickedObject);
    }
};

/**
 * Computes a unique color to use as a pick color.
 * @returns {Color} A unique color.
 */
DrawContext.prototype.uniquePickColor = function () {
    var color = this.pickColor.nextColor().clone();

    return color.equals(this.clearColor) ? color.nextColor() : color;
};

/**
 * Creates an off-screen WebGL framebuffer for use during picking and stores it in this draw context. The
 * framebuffer width and height match the WebGL rendering context's drawingBufferWidth and drawingBufferHeight.
 */
DrawContext.prototype.makePickFramebuffer = function () {
    var gl = this.currentGlContext,
        width = gl.drawingBufferWidth,
        height = gl.drawingBufferHeight;

    if (!this.pickFramebuffer ||
        this.pickFramebuffer.width != width ||
        this.pickFramebuffer.height != height) {

        this.pickFramebuffer = new FramebufferTexture(gl, width, height, true); // enable depth buffering
    }

    return this.pickFramebuffer;
};

/**
 * Creates a pick frustum for the current pick point and stores it in this draw context. If this context's
 * pick rectangle is null or undefined then a pick rectangle is also computed and assigned to this context.
 * If the existing pick rectangle extends beyond the viewport then it is truncated by this method to fit
 * within the viewport.
 * This method assumes that this draw context's pick point or pick rectangle has been set. It returns
 * false if neither one of these exists.
 *
 * @returns {Boolean} <code>true</code> if the pick frustum could be created, otherwise <code>false</code>.
 */
DrawContext.prototype.makePickFrustum = function () {
    if (!this.pickPoint && !this.pickRectangle) {
        return false;
    }

    var lln, llf, lrn, lrf, uln, ulf, urn, urf, // corner points of frustum
        nl, nr, nt, nb, nn, nf, // normal vectors of frustum planes
        l, r, t, b, n, f, // frustum planes
        va, vb = new Vec3(0, 0, 0), // vectors formed by the corner points
        apertureRadius = 2, // radius of pick window in screen coordinates
        screenPoint = new Vec3(0, 0, 0),
        pickPoint,
        pickRectangle = this.pickRectangle,
        viewport = this.viewport;

    // Compute the pick rectangle if necessary.
    if (!pickRectangle) {
        pickPoint = this.convertPointToViewport(this.pickPoint, new Vec2(0, 0));
        pickRectangle = new Rectangle(
            pickPoint[0] - apertureRadius,
            pickPoint[1] - apertureRadius,
            2 * apertureRadius,
            2 * apertureRadius);
    }

    // Clamp the pick rectangle to the viewport.

    var xl = pickRectangle.x,
        xr = pickRectangle.x + pickRectangle.width,
        yb = pickRectangle.y,
        yt = pickRectangle.y + pickRectangle.height;

    if (xr < 0 || yt < 0 || xl > viewport.x + viewport.width || yb > viewport.y + viewport.height) {
        return false; // pick rectangle is outside the viewport.
    }

    pickRectangle.x = WWMath.clamp(xl, viewport.x, viewport.x + viewport.width);
    pickRectangle.y = WWMath.clamp(yb, viewport.y, viewport.y + viewport.height);
    pickRectangle.width = WWMath.clamp(xr, viewport.x, viewport.x + viewport.width) - pickRectangle.x;
    pickRectangle.height = WWMath.clamp(yt, viewport.y, viewport.y + viewport.height) - pickRectangle.y;
    this.pickRectangle = pickRectangle;

    // Compute the pick frustum.
    var modelviewProjectionInv = Matrix.fromIdentity();
    modelviewProjectionInv.invertMatrix(this.modelviewProjection);

    screenPoint[0] = pickRectangle.x;
    screenPoint[1] = pickRectangle.y;
    screenPoint[2] = 0;
    modelviewProjectionInv.unProject(screenPoint, viewport, lln = new Vec3(0, 0, 0));

    screenPoint[0] = pickRectangle.x;
    screenPoint[1] = pickRectangle.y;
    screenPoint[2] = 1;
    modelviewProjectionInv.unProject(screenPoint, viewport, llf = new Vec3(0, 0, 0));

    screenPoint[0] = pickRectangle.x + pickRectangle.width;
    screenPoint[1] = pickRectangle.y;
    screenPoint[2] = 0;
    modelviewProjectionInv.unProject(screenPoint, viewport, lrn = new Vec3(0, 0, 0));

    screenPoint[0] = pickRectangle.x + pickRectangle.width;
    screenPoint[1] = pickRectangle.y;
    screenPoint[2] = 1;
    modelviewProjectionInv.unProject(screenPoint, viewport, lrf = new Vec3(0, 0, 0));

    screenPoint[0] = pickRectangle.x;
    screenPoint[1] = pickRectangle.y + pickRectangle.height;
    screenPoint[2] = 0;
    modelviewProjectionInv.unProject(screenPoint, viewport, uln = new Vec3(0, 0, 0));

    screenPoint[0] = pickRectangle.x;
    screenPoint[1] = pickRectangle.y + pickRectangle.height;
    screenPoint[2] = 1;
    modelviewProjectionInv.unProject(screenPoint, viewport, ulf = new Vec3(0, 0, 0));

    screenPoint[0] = pickRectangle.x + pickRectangle.width;
    screenPoint[1] = pickRectangle.y + pickRectangle.height;
    screenPoint[2] = 0;
    modelviewProjectionInv.unProject(screenPoint, viewport, urn = new Vec3(0, 0, 0));

    screenPoint[0] = pickRectangle.x + pickRectangle.width;
    screenPoint[1] = pickRectangle.y + pickRectangle.height;
    screenPoint[2] = 1;
    modelviewProjectionInv.unProject(screenPoint, viewport, urf = new Vec3(0, 0, 0));

    va = new Vec3(ulf[0] - lln[0], ulf[1] - lln[1], ulf[2] - lln[2]);
    vb.set(uln[0] - llf[0], uln[1] - llf[1], uln[2] - llf[2]);
    nl = va.cross(vb);
    l = new Plane(nl[0], nl[1], nl[2], -nl.dot(lln));
    l.normalize();

    va = new Vec3(urn[0] - lrf[0], urn[1] - lrf[1], urn[2] - lrf[2]);
    vb.set(urf[0] - lrn[0], urf[1] - lrn[1], urf[2] - lrn[2]);
    nr = va.cross(vb);
    r = new Plane(nr[0], nr[1], nr[2], -nr.dot(lrn));
    r.normalize();

    va = new Vec3(ulf[0] - urn[0], ulf[1] - urn[1], ulf[2] - urn[2]);
    vb.set(urf[0] - uln[0], urf[1] - uln[1], urf[2] - uln[2]);
    nt = va.cross(vb);
    t = new Plane(nt[0], nt[1], nt[2], -nt.dot(uln));
    t.normalize();

    va = new Vec3(lrf[0] - lln[0], lrf[1] - lln[1], lrf[2] - lln[2]);
    vb.set(llf[0] - lrn[0], llf[1] - lrn[1], llf[2] - lrn[2]);
    nb = va.cross(vb);
    b = new Plane(nb[0], nb[1], nb[2], -nb.dot(lrn));
    b.normalize();

    va = new Vec3(uln[0] - lrn[0], uln[1] - lrn[1], uln[2] - lrn[2]);
    vb.set(urn[0] - lln[0], urn[1] - lln[1], urn[2] - lln[2]);
    nn = va.cross(vb);
    n = new Plane(nn[0], nn[1], nn[2], -nn.dot(lln));
    n.normalize();

    va = new Vec3(urf[0] - llf[0], urf[1] - llf[1], urf[2] - llf[2]);
    vb.set(ulf[0] - lrf[0], ulf[1] - lrf[1], ulf[2] - lrf[2]);
    nf = va.cross(vb);
    f = new Plane(nf[0], nf[1], nf[2], -nf.dot(llf));
    f.normalize();

    this.pickFrustum = new Frustum(l, r, b, t, n, f);

    return true;
};

/**
 * Indicates whether an extent is smaller than a specified number of pixels.
 * @param {BoundingBox} extent The extent to test.
 * @param {Number} numPixels The number of pixels below which the extent is considered small.
 * @returns {Boolean} True if the extent is smaller than the specified number of pixels, otherwise false.
 * Returns false if the extent is null or undefined.
 */
DrawContext.prototype.isSmall = function (extent, numPixels) {
    if (!extent) {
        return false;
    }

    var distance = this.eyePoint.distanceTo(extent.center),
        pixelSize = this.pixelSizeAtDistance(distance);

    return 2 * extent.radius < numPixels * pixelSize; // extent diameter less than size of num pixels
};

/**
 * Returns the VBO ID of an array buffer containing a unit cube expressed as eight 3D vertices at (0, 1, 0),
 * (0, 0, 0), (1, 1, 0), (1, 0, 0), (0, 1, 1), (0, 0, 1), (1, 1, 1) and (1, 0, 1). The buffer is created on
 * first use and cached. Subsequent calls to this method return the cached buffer.
 * @returns {Object} The VBO ID identifying the array buffer.
 */
DrawContext.prototype.unitCubeBuffer = function () {
    var vboId = this.gpuResourceCache.resourceForKey(DrawContext.unitCubeKey);

    if (!vboId) {
        var gl = this.currentGlContext,
            points = new Float32Array(24),
            i = 0;

        points[i++] = 0; // upper left corner, z = 0
        points[i++] = 1;
        points[i++] = 0;
        points[i++] = 0; // lower left corner, z = 0
        points[i++] = 0;
        points[i++] = 0;
        points[i++] = 1; // upper right corner, z = 0
        points[i++] = 1;
        points[i++] = 0;
        points[i++] = 1; // lower right corner, z = 0
        points[i++] = 0;
        points[i++] = 0;

        points[i++] = 0; // upper left corner, z = 1
        points[i++] = 1;
        points[i++] = 1;
        points[i++] = 0; // lower left corner, z = 1
        points[i++] = 0;
        points[i++] = 1;
        points[i++] = 1; // upper right corner, z = 1
        points[i++] = 1;
        points[i++] = 1;
        points[i++] = 1; // lower right corner, z = 1
        points[i++] = 0;
        points[i] = 1;

        vboId = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vboId);
        gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        this.frameStatistics.incrementVboLoadCount(1);

        this.gpuResourceCache.putResource(DrawContext.unitCubeKey, vboId, points.length * 4);
    }

    return vboId;
};

/**
 * Returns the VBO ID of a element array buffer containing the tessellation of a unit cube expressed as
 * a single buffer containing both triangle indices and line indices. This is intended for use in conjunction
 * with <code>unitCubeBuffer</code>. The unit cube's interior and outline may be rasterized as shown in the
 * following WebGL pseudocode:
 * <code><pre>
 * // Assumes that the VBO returned by unitCubeBuffer is used as the source of vertex positions.
 * bindBuffer(ELEMENT_ARRAY_BUFFER, drawContext.unitCubeElements());
 * drawElements(TRIANGLES, 36, UNSIGNED_SHORT, 0); // draw the unit cube interior
 * drawElements(LINES, 24, UNSIGNED_SHORT, 72); // draw the unit cube outline
 * </pre></code>
 * The buffer is created on first use
 * and cached. Subsequent calls to this method return the cached buffer.
 * @returns {Object} The VBO ID identifying the element array buffer.
 */
DrawContext.prototype.unitCubeElements = function () {
    var vboId = this.gpuResourceCache.resourceForKey(DrawContext.unitCubeElementsKey);

    if (!vboId) {
        var gl = this.currentGlContext,
            elems = new Int16Array(60),
            i = 0;

        // interior

        elems[i++] = 1; // -z face
        elems[i++] = 0;
        elems[i++] = 3;
        elems[i++] = 3;
        elems[i++] = 0;
        elems[i++] = 2;

        elems[i++] = 4; // +z face
        elems[i++] = 5;
        elems[i++] = 6;
        elems[i++] = 6;
        elems[i++] = 5;
        elems[i++] = 7;

        elems[i++] = 5; // -y face
        elems[i++] = 1;
        elems[i++] = 7;
        elems[i++] = 7;
        elems[i++] = 1;
        elems[i++] = 3;

        elems[i++] = 6; // +y face
        elems[i++] = 2;
        elems[i++] = 4;
        elems[i++] = 4;
        elems[i++] = 2;
        elems[i++] = 0;

        elems[i++] = 4; // -x face
        elems[i++] = 0;
        elems[i++] = 5;
        elems[i++] = 5;
        elems[i++] = 0;
        elems[i++] = 1;

        elems[i++] = 7; // +x face
        elems[i++] = 3;
        elems[i++] = 6;
        elems[i++] = 6;
        elems[i++] = 3;
        elems[i++] = 2;

        // outline

        elems[i++] = 0; // left, -z
        elems[i++] = 1;
        elems[i++] = 1; // bottom, -z
        elems[i++] = 3;
        elems[i++] = 3; // right, -z
        elems[i++] = 2;
        elems[i++] = 2; // top, -z
        elems[i++] = 0;

        elems[i++] = 4; // left, +z
        elems[i++] = 5;
        elems[i++] = 5; // bottom, +z
        elems[i++] = 7;
        elems[i++] = 7; // right, +z
        elems[i++] = 6;
        elems[i++] = 6; // top, +z
        elems[i++] = 4;

        elems[i++] = 0; // upper left
        elems[i++] = 4;
        elems[i++] = 5; // lower left
        elems[i++] = 1;
        elems[i++] = 2; // upper right
        elems[i++] = 6;
        elems[i++] = 7; // lower right
        elems[i] = 3;

        vboId = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vboId);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, elems, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        this.frameStatistics.incrementVboLoadCount(1);

        this.gpuResourceCache.putResource(DrawContext.unitCubeElementsKey, vboId, elems.length * 2);
    }

    return vboId;
};

/**
 * Returns the VBO ID of a buffer containing a unit quadrilateral expressed as four 2D vertices at (0, 1),
 * (0, 0), (1, 1) and (1, 0). The four vertices are in the order required by a triangle strip. The buffer is
 * created on first use and cached. Subsequent calls to this method return the cached buffer.
 * @returns {Object} The VBO ID identifying the vertex buffer.
 */
DrawContext.prototype.unitQuadBuffer = function () {
    var vboId = this.gpuResourceCache.resourceForKey(DrawContext.unitQuadKey);

    if (!vboId) {
        var gl = this.currentGlContext,
            points = new Float32Array(8);

        points[0] = 0; // upper left corner
        points[1] = 1;
        points[2] = 0; // lower left corner
        points[3] = 0;
        points[4] = 1; // upper right corner
        points[5] = 1;
        points[6] = 1; // lower right corner
        points[7] = 0;

        vboId = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vboId);
        gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        this.frameStatistics.incrementVboLoadCount(1);

        this.gpuResourceCache.putResource(DrawContext.unitQuadKey, vboId, points.length * 4);
    }

    return vboId;
};

/**
 * Returns the VBO ID of a buffer containing a unit quadrilateral expressed as four 3D vertices at (0, 1, 0),
 * (0, 0, 0), (1, 1, 0) and (1, 0, 0).
 * The four vertices are in the order required by a triangle strip. The buffer is created
 * on first use and cached. Subsequent calls to this method return the cached buffer.
 * @returns {Object} The VBO ID identifying the vertex buffer.
 */
DrawContext.prototype.unitQuadBuffer3 = function () {
    var vboId = this.gpuResourceCache.resourceForKey(DrawContext.unitQuadKey3);

    if (!vboId) {
        var gl = this.currentGlContext,
            points = new Float32Array(12);

        points[0] = 0; // upper left corner
        points[1] = 1;
        points[2] = 0;
        points[3] = 0; // lower left corner
        points[4] = 0;
        points[5] = 0;
        points[6] = 1; // upper right corner
        points[7] = 1;
        points[8] = 0;
        points[9] = 1; // lower right corner
        points[10] = 0;
        points[11] = 0;

        vboId = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vboId);
        gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        this.frameStatistics.incrementVboLoadCount(1);

        this.gpuResourceCache.putResource(DrawContext.unitQuadKey3, vboId, points.length * 4);
    }

    return vboId;
};

/**
 * Computes a Cartesian point at a location on the surface of this terrain according to a specified
 * altitude mode. If there is no current terrain, this function approximates the returned point by assuming
 * the terrain is the globe's ellipsoid.
 * @param {Number} latitude The location's latitude.
 * @param {Number} longitude The location's longitude.
 * @param {Number} offset Distance above the terrain, in meters relative to the specified altitude mode, at
 * which to compute the point.
 * @param {String} altitudeMode The altitude mode to use to compute the point. Recognized values are
 * WorldWind.ABSOLUTE, WorldWind.CLAMP_TO_GROUND and
 * WorldWind.RELATIVE_TO_GROUND. The mode WorldWind.ABSOLUTE is used if the
 * specified mode is null, undefined or unrecognized, or if the specified location is outside this terrain.
 * @param {Vec3} result A pre-allocated Vec3 in which to return the computed point.
 * @returns {Vec3} The specified result parameter, set to the coordinates of the computed point.
 * @throws {ArgumentError} If the specified result argument is null or undefined.
 */
DrawContext.prototype.surfacePointForMode = function (latitude, longitude, offset, altitudeMode, result) {
    if (!result) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "DrawContext", "surfacePointForMode", "missingResult"));
    }

    if (this.terrain) {
        this.terrain.surfacePointForMode(latitude, longitude, offset, altitudeMode, result);
    } else {
        var h = offset + this.globe.elevationAtLocation(latitude, longitude) * this.verticalExaggeration;
        this.globe.computePointFromPosition(latitude, longitude, h, result);
    }

    return result;
};

/**
 * Transforms the specified model point from model coordinates to WebGL screen coordinates.
 * <p>
 * The resultant screen point is in WebGL screen coordinates, with the origin in the bottom-left corner and
 * axes that extend up and to the right from the origin.
 * <p>
 * This function stores the transformed point in the result argument, and returns true or false to indicate
 * whether or not the transformation is successful. It returns false if the modelview or
 * projection matrices are malformed, or if the specified model point is clipped by the near clipping plane or
 * the far clipping plane.
 *
 * @param {Vec3} modelPoint The model coordinate point to project.
 * @param {Vec3} result A pre-allocated vector in which to return the projected point.
 * @returns {boolean} true if the transformation is successful, otherwise false.
 * @throws {ArgumentError} If either the specified point or result argument is null or undefined.
 */
DrawContext.prototype.project = function (modelPoint, result) {
    if (!modelPoint) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "DrawContext", "project",
            "missingPoint"));
    }

    if (!result) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "DrawContext", "project",
            "missingResult"));
    }

    // Transform the model point from model coordinates to eye coordinates then to clip coordinates. This
    // inverts the Z axis and stores the negative of the eye coordinate Z value in the W coordinate.
    var mx = modelPoint[0],
        my = modelPoint[1],
        mz = modelPoint[2],
        m = this.modelviewProjection,
        x = m[0] * mx + m[1] * my + m[2] * mz + m[3],
        y = m[4] * mx + m[5] * my + m[6] * mz + m[7],
        z = m[8] * mx + m[9] * my + m[10] * mz + m[11],
        w = m[12] * mx + m[13] * my + m[14] * mz + m[15];

    if (w === 0) {
        return false;
    }

    // Complete the conversion from model coordinates to clip coordinates by dividing by W. The resultant X, Y
    // and Z coordinates are in the range [-1,1].
    x /= w;
    y /= w;
    z /= w;

    // Clip the point against the near and far clip planes.
    if (z < -1 || z > 1) {
        return false;
    }

    // Convert the point from clip coordinate to the range [0,1]. This enables the X and Y coordinates to be
    // converted to screen coordinates, and the Z coordinate to represent a depth value in the range[0,1].
    x = x * 0.5 + 0.5;
    y = y * 0.5 + 0.5;
    z = z * 0.5 + 0.5;

    // Convert the X and Y coordinates from the range [0,1] to screen coordinates.
    x = x * this.viewport.width + this.viewport.x;
    y = y * this.viewport.height + this.viewport.y;

    result[0] = x;
    result[1] = y;
    result[2] = z;

    return true;
};

/**
 * Transforms the specified model point from model coordinates to WebGL screen coordinates, applying an offset
 * to the modelPoint's projected depth value.
 * <p>
 * The resultant screen point is in WebGL screen coordinates, with the origin in the bottom-left corner and axes
 * that extend up and to the right from the origin.
 * <p>
 * This function stores the transformed point in the result argument, and returns true or false to indicate whether or
 * not the transformation is successful. It returns false if the modelview or projection
 * matrices are malformed, or if the modelPoint is clipped by the near clipping plane or the far clipping plane,
 * ignoring the depth offset.
 * <p>
 * The depth offset may be any real number and is typically used to move the screenPoint slightly closer to the
 * user's eye in order to give it visual priority over nearby objects or terrain. An offset of zero has no effect.
 * An offset less than zero brings the screenPoint closer to the eye, while an offset greater than zero pushes the
 * projected screen point away from the eye.
 * <p>
 * Applying a non-zero depth offset has no effect on whether the model point is clipped by this method or by
 * WebGL. Clipping is performed on the original model point, ignoring the depth offset. The final depth value
 * after applying the offset is clamped to the range [0,1].
 *
 * @param {Vec3} modelPoint The model coordinate point to project.
 * @param {Number} depthOffset The amount of offset to apply.
 * @param {Vec3} result A pre-allocated vector in which to return the projected point.
 * @returns {boolean} true if the transformation is successful, otherwise false.
 * @throws {ArgumentError} If either the specified point or result argument is null or undefined.
 */
DrawContext.prototype.projectWithDepth = function (modelPoint, depthOffset, result) {
    if (!modelPoint) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "DrawContext", "projectWithDepth",
            "missingPoint"));
    }

    if (!result) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "DrawContext", "projectWithDepth",
            "missingResult"));
    }

    // Transform the model point from model coordinates to eye coordinates. The eye coordinate and the clip
    // coordinate are transformed separately in order to reuse the eye coordinate below.
    var mx = modelPoint[0],
        my = modelPoint[1],
        mz = modelPoint[2],
        m = this.modelview,
        ex = m[0] * mx + m[1] * my + m[2] * mz + m[3],
        ey = m[4] * mx + m[5] * my + m[6] * mz + m[7],
        ez = m[8] * mx + m[9] * my + m[10] * mz + m[11],
        ew = m[12] * mx + m[13] * my + m[14] * mz + m[15];

    // Transform the point from eye coordinates to clip coordinates.
    var p = this.projection,
        x = p[0] * ex + p[1] * ey + p[2] * ez + p[3] * ew,
        y = p[4] * ex + p[5] * ey + p[6] * ez + p[7] * ew,
        z = p[8] * ex + p[9] * ey + p[10] * ez + p[11] * ew,
        w = p[12] * ex + p[13] * ey + p[14] * ez + p[15] * ew;

    if (w === 0) {
        return false;
    }

    // Complete the conversion from model coordinates to clip coordinates by dividing by W. The resultant X, Y
    // and Z coordinates are in the range [-1,1].
    x /= w;
    y /= w;
    z /= w;

    // Clip the point against the near and far clip planes.
    if (z < -1 || z > 1) {
        return false;
    }

    // Transform the Z eye coordinate to clip coordinates again, this time applying a depth offset. The depth
    // offset is applied only to the matrix element affecting the projected Z coordinate, so we inline the
    // computation here instead of re-computing X, Y, Z and W in order to improve performance. See
    // Matrix.offsetProjectionDepth for more information on the effect of this offset.
    z = p[8] * ex + p[9] * ey + p[10] * ez * (1 + depthOffset) + p[11] * ew;
    z /= w;

    // Clamp the point to the near and far clip planes. We know the point's original Z value is contained within
    // the clip planes, so we limit its offset z value to the range [-1, 1] in order to ensure it is not clipped
    // by WebGL. In clip coordinates the near and far clip planes are perpendicular to the Z axis and are
    // located at -1 and 1, respectively.
    z = WWMath.clamp(z, -1, 1);

    // Convert the point from clip coordinates to the range [0, 1]. This enables the XY coordinates to be
    // converted to screen coordinates, and the Z coordinate to represent a depth value in the range [0, 1].
    x = x * 0.5 + 0.5;
    y = y * 0.5 + 0.5;
    z = z * 0.5 + 0.5;

    // Convert the X and Y coordinates from the range [0,1] to screen coordinates.
    x = x * this.viewport.width + this.viewport.x;
    y = y * this.viewport.height + this.viewport.y;

    result[0] = x;
    result[1] = y;
    result[2] = z;

    return true;
};

/**
 * Converts a window-coordinate point to WebGL screen coordinates.
 * <p>
 * The specified point is understood to be in the window coordinate system of the WorldWindow, with the origin
 * in the top-left corner and axes that extend down and to the right from the origin point.
 * <p>
 * The returned point is in WebGL screen coordinates, with the origin in the bottom-left corner and axes that
 * extend up and to the right from the origin point.
 *
 * @param {Vec2} point The window-coordinate point to convert.
 * @param {Vec2} result A pre-allocated {@link Vec2} in which to return the computed point.
 * @returns {Vec2} The specified result argument set to the computed point.
 * @throws {ArgumentError} If either argument is null or undefined.
 */
DrawContext.prototype.convertPointToViewport = function (point, result) {
    if (!point) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "DrawContext", "convertPointToViewport",
            "missingPoint"));
    }

    if (!result) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "DrawContext", "convertPointToViewport",
            "missingResult"));
    }

    result[0] = point[0];
    result[1] = this.viewport.height - point[1];

    return result;
};

/**
 * Computes the approximate size of a pixel at a specified distance from the eye point.
 * <p>
 * This method assumes rectangular pixels, where pixel coordinates denote
 * infinitely thin spaces between pixels. The units of the returned size are in model coordinates per pixel
 * (usually meters per pixel). This returns 0 if the specified distance is zero. The returned size is undefined
 * if the distance is less than zero.
 *
 * @param {Number} distance The distance from the eye point at which to determine pixel size, in model
 * coordinates.
 * @returns {Number} The approximate pixel size at the specified distance from the eye point, in model
 * coordinates per pixel.
 */
DrawContext.prototype.pixelSizeAtDistance = function (distance) {
    // Compute the pixel size from the width of a rectangle carved out of the frustum in model coordinates at
    // the specified distance along the -Z axis and the viewport width in screen coordinates. The pixel size is
    // expressed in model coordinates per screen coordinate (e.g. meters per pixel).
    //
    // The frustum width is determined by noticing that the frustum size is a linear function of distance from
    // the eye point. The linear equation constants are determined during initialization, then solved for
    // distance here.
    //
    // This considers only the frustum width by assuming that the frustum and viewport share the same aspect
    // ratio, so that using either the frustum width or height results in the same pixel size.

    return this.pixelSizeFactor * distance + this.pixelSizeOffset;
};

/**
 * Propagates the values contained in a TextAttributes object to the currently attached TextRenderer
 * {@link TextRenderer} as to provide format to a string of text. It first checks if the 2D texture is not
 * already cached according to the text string and its attached TextAttributes {@link TextAttributes} state key.
 * The TextRenderer then produces a 2D Texture with the aforementioned text and format to be used as a label
 * for a Text {@link Text} subclass (<i>e.g.</i> Annotation {@link Annotation} or Placemark {@link Placemark}).
 * @param {String} text The string of text that will be given color, font, and outline
 * from which the resulting texture will be based on.
 * @param {TextAttributes} textAttributes Attributes that will be applied to the string.
 * See TextAttributes {@link TextAttributes}.
 * @returns {Texture} A texture {@link Texture} with the specified text string, font, colors, and outline.
 */
DrawContext.prototype.createTextTexture = function (text, textAttributes) {
    if (!text || !textAttributes) {
        return null;
    }

    var textureKey = this.computeTextTextureStateKey(text, textAttributes);
    var texture = this.gpuResourceCache.resourceForKey(textureKey);

    if (!texture) {
        this.textRenderer.textColor = textAttributes.color;
        this.textRenderer.typeFace = textAttributes.font;
        this.textRenderer.enableOutline = textAttributes.enableOutline;
        this.textRenderer.outlineColor = textAttributes.outlineColor;
        this.textRenderer.outlineWidth = textAttributes.outlineWidth;
        texture = this.textRenderer.renderText(text);
        this.gpuResourceCache.putResource(textureKey, texture, texture.size);
        this.gpuResourceCache.setResourceAgingFactor(textureKey, 100);  // age this texture 100x faster than normal resources (e.g., tiles)
    }

    return texture;
};

/**
 * Computes a state key that relates to a text label, foregoing the TextAttributes {@link TextAttributes}
 * properties that are not related to texture rendering (offset, scale, and depthTest).
 * @param {String} text The label's string of text.
 * @param {TextAttributes} attributes The TextAttributes object associated with the text label to render.
 * @returns {String} A state key composed of the original string of text plus the TextAttributes associated
 * with texture rendering.
 */
DrawContext.prototype.computeTextTextureStateKey = function (text, attributes) {
    if (!text || !attributes) {
        return null;
    }

    return text +
        "c " + attributes.color.toHexString(true) +
        " f " + attributes.font.toString() +
        " eo " + attributes.enableOutline +
        " ow " + attributes.outlineWidth +
        " oc " + attributes.outlineColor.toHexString(true);
};

/**
 * Returns a WebGL extension and caches the result for subsequent calls.
 *
 * @param {String} extensionName The name of the WebGL extension.
 * @returns {Object|null} A WebGL extension object, or null if the extension is not available.
 * @throws {ArgumentError} If the argument is null or undefined.
 */
DrawContext.prototype.getExtension = function (extensionName) {
    if (!extensionName) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "DrawContext", "getExtension",
            "missingExtensionName"));
    }

    if (!(extensionName in this.glExtensionsCache)) {
        this.glExtensionsCache[extensionName] = this.currentGlContext.getExtension(extensionName) || null;
    }

    return this.glExtensionsCache[extensionName];
};

export default DrawContext;
