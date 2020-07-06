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
 * @exports WorldWindow
 */
import ArgumentError from './error/ArgumentError';
import BasicWorldWindowController from './BasicWorldWindowController';
import DrawContext from './render/DrawContext';
import EarthElevationModel from './globe/EarthElevationModel';
import FrameStatistics from './util/FrameStatistics';
import Frustum from './geom/Frustum';
import Globe from './globe/Globe';
import GoToAnimator from './util/GoToAnimator';
import Line from './geom/Line';
import Logger from './util/Logger';
import LookAtNavigator from './navigate/LookAtNavigator';
import Matrix from './geom/Matrix';
import PickedObjectList from './pick/PickedObjectList';
import Position from './geom/Position';
import Rectangle from './geom/Rectangle';
import SurfaceShape from './shapes/SurfaceShape';
import Vec2 from './geom/Vec2';
import Vec3 from './geom/Vec3';
import WWMath from './util/WWMath';


/**
 * Constructs a WorldWind window for an HTML canvas.
 * @alias WorldWindow
 * @constructor
 * @classdesc Represents a WorldWind window for an HTML canvas.
 * @param {WebGLRenderingContext} gl The ID assigned to the HTML canvas in the document or the canvas
 * element itself.
 */
function WorldWindow(gl) {
    var canvas = gl.canvas;

    // Internal. Intentionally not documented.
    this.drawContext = new DrawContext(gl);

    // Internal. Intentionally not documented. Must be initialized before the navigator is created.
    this.eventListeners = {};

    // Internal. Intentionally not documented. Initially true in order to redraw at least once.
    this.redrawRequested = true;

    // Internal. Intentionally not documented.
    this.redrawRequestId = null;

    // Internal. Intentionally not documented.
    this.scratchModelview = Matrix.fromIdentity();

    // Internal. Intentionally not documented.
    this.scratchProjection = Matrix.fromIdentity();

    // Internal. Intentionally not documented.
    this.hasStencilBuffer = gl.getContextAttributes().stencil;

    /**
     * The HTML canvas associated with this WorldWindow.
     * @type {HTMLElement}
     * @readonly
     */
    this.canvas = canvas;

    /**
     * The number of bits in the depth buffer associated with this WorldWindow.
     * @type {number}
     * @readonly
     */
    this.depthBits = gl.getParameter(gl.DEPTH_BITS);

    /**
     * The current viewport of this WorldWindow.
     * @type {Rectangle}
     * @readonly
     */
    this.viewport = new Rectangle(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

    /**
     * The globe displayed.
     * @type {Globe}
     */
    this.globe = new Globe(new EarthElevationModel());

    /**
     * The layers to display in this WorldWindow.
     * This property is read-only. Use [addLayer]{@link WorldWindow#addLayer} or
     * [insertLayer]{@link WorldWindow#insertLayer} to add layers to this WorldWindow.
     * Use [removeLayer]{@link WorldWindow#removeLayer} to remove layers from this WorldWindow.
     * @type {Layer[]}
     * @readonly
     */
    this.layers = [];

    /**
     * The navigator used to manipulate the globe.
     * @type {LookAtNavigator}
     * @default [LookAtNavigator]{@link LookAtNavigator}
     */
    this.navigator = new LookAtNavigator();

    /**
     * The controller used to manipulate the globe.
     * @type {WorldWindowController}
     * @default [BasicWorldWindowController]{@link BasicWorldWindowController}
     */
    this.worldWindowController = new BasicWorldWindowController(this);

    /**
     * The vertical exaggeration to apply to the terrain.
     * @type {Number}
     */
    this.verticalExaggeration = 1;

    /**
     * Indicates that picking will return all objects at the pick point, if any. The top-most object will have
     * its isOnTop flag set to true.
     * If deep picking is false, the default, only the top-most object is returned, plus
     * the picked-terrain object if the pick point is over the terrain.
     * @type {boolean}
     * @default false
     */
    this.deepPicking = false;

    /**
     * Indicates whether this WorldWindow should be configured for sub-surface rendering. If true, shapes
     * below the terrain can be seen when the terrain is made transparent. If false, sub-surface shapes are
     * not visible, however, performance is slightly increased.
     * @type {boolean}
     * @default false
     */
    this.subsurfaceMode = false;

    /**
     * The opacity to apply to terrain and surface shapes. This property is typically used when viewing
     * the sub-surface. It modifies the opacity of the terrain and surface shapes as a whole. It should be
     * a number between 0 and 1. It is compounded with the individual opacities of the image layers and
     * surface shapes on the terrain.
     * @type {Number}
     * @default 1
     */
    this.surfaceOpacity = 1;

    /**
     * Performance statistics for this WorldWindow.
     * @type {FrameStatistics}
     */
    this.frameStatistics = new FrameStatistics();

    /**
     * The {@link GoToAnimator} used by this WorldWindow to respond to its goTo method.
     * @type {GoToAnimator}
     */
    this.goToAnimator = new GoToAnimator(this);

    // Documented with its property accessor below.
    this._redrawCallbacks = [];

    // Documented with its property accessor below.
    this._orderedRenderingFilters = [
        function (dc) {
            thisWindow.declutter(dc, 1);
        },
        function (dc) {
            thisWindow.declutter(dc, 2);
        }
    ];

    // Intentionally not documented.
    this.pixelScale = 1;

    // Prevent the browser's default actions in response to mouse and touch events, which interfere with
    // navigation. Register these event listeners  before any others to ensure that they're called last.
    function preventDefaultListener(event) {
        event.preventDefault();
    }

    this.addEventListener("mousedown", preventDefaultListener);
    this.addEventListener("touchstart", preventDefaultListener);
    this.addEventListener("contextmenu", preventDefaultListener);
    this.addEventListener("wheel", preventDefaultListener);

    var thisWindow = this;

    // Redirect various UI interactions to the appropriate handler.
    function onGestureEvent(event) {
        thisWindow.onGestureEvent(event);
    }

    if (window.PointerEvent) {
        // Prevent the browser's default actions in response to pointer events which interfere with navigation.
        // This CSS style property is configured here to ensure that it's set for all applications.
        this.canvas.style.setProperty("touch-action", "none");

        this.addEventListener("pointerdown", onGestureEvent, false);
        window.addEventListener("pointermove", onGestureEvent, false); // get pointermove events outside event target
        window.addEventListener("pointercancel", onGestureEvent, false); // get pointercancel events outside event target
        window.addEventListener("pointerup", onGestureEvent, false); // get pointerup events outside event target
    } else {
        this.addEventListener("mousedown", onGestureEvent, false);
        window.addEventListener("mousemove", onGestureEvent, false); // get mousemove events outside event target
        window.addEventListener("mouseup", onGestureEvent, false); // get mouseup events outside event target
        this.addEventListener("touchstart", onGestureEvent, false);
        this.addEventListener("touchmove", onGestureEvent, false);
        this.addEventListener("touchend", onGestureEvent, false);
        this.addEventListener("touchcancel", onGestureEvent, false);
    }

    // Register wheel event listeners on the WorldWindow's canvas.
    this.addEventListener("wheel", function (event) {
        onGestureEvent(event);
    });

    // Set up to handle WebGL context lost events.
    function handleContextLost(event) {
        thisWindow.handleContextLost(event);
    }

    this.canvas.addEventListener("webglcontextlost", handleContextLost, false);

    // Set up to handle WebGL context restored events.
    function handleContextRestored(event) {
        thisWindow.handleContextRestored(event);
    }

    this.canvas.addEventListener("webglcontextrestored", handleContextRestored, false);

    // Set up to handle WebGL context events and WorldWind redraw request events. Imagery uses the canvas
    // redraw events because images are generally specific to the WebGL context associated with the canvas.
    // Elevation models use the global window redraw events because they can be shared among WorldWindows.
    function handleRedrawEvent(event) {
        thisWindow.handleRedrawEvent(event);
    }

    this.canvas.addEventListener(WorldWind.REDRAW_EVENT_TYPE, handleRedrawEvent, false);
    window.addEventListener(WorldWind.REDRAW_EVENT_TYPE, handleRedrawEvent, false);

    // Render to the WebGL context in an animation frame loop until the WebGL context is lost.
    this.animationFrameLoop();
}

Object.defineProperties(WorldWindow.prototype, {
    /**
     * An array of functions to call during ordered rendering prior to rendering the ordered renderables.
     * Each function is passed one argument, the current draw context. The function may modify the
     * ordered renderables in the draw context's ordered renderable list, which has been sorted from front
     * to back when the filter function is called. Ordered rendering filters are typically used to apply
     * decluttering. The default set of filter functions contains one function that declutters shapes with
     * declutter group ID of 1 ({@link GeographicText} by default) and one function that declutters shapes
     * with declutter group ID 2 ({@link Placemark} by default). Applications can add functions to this
     * array or remove them.
     * @type {Function[]}
     * @default [WorldWindow.declutter]{@link WorldWindow#declutter} with a group ID of 1
     * @readonly
     * @memberof WorldWindow.prototype
     */
    orderedRenderingFilters: {
        get: function () {
            return this._orderedRenderingFilters;
        }
    },
    /**
     * The list of callbacks to call immediately before and immediately after performing a redraw. The callbacks
     * have two arguments: this WorldWindow and the redraw stage, e.g., <code style='white-space:nowrap'>redrawCallback(worldWindow, stage);</code>.
     * The stage will be either WorldWind.BEFORE_REDRAW or WorldWind.AFTER_REDRAW indicating whether the
     * callback has been called either immediately before or immediately after a redraw, respectively.
     * Applications may add functions to this array or remove them.
     * @type {Function[]}
     * @readonly
     * @memberof WorldWindow.prototype
     */
    redrawCallbacks: {
        get: function () {
            return this._redrawCallbacks;
        }
    }
});

/**
 * Converts window coordinates to coordinates relative to this WorldWindow's canvas.
 * @param {Number} x The X coordinate to convert.
 * @param {Number} y The Y coordinate to convert.
 * @returns {Vec2} The converted coordinates.
 */
WorldWindow.prototype.canvasCoordinates = function (x, y) {
    var bbox = this.canvas.getBoundingClientRect(),
        xc = x - (bbox.left + this.canvas.clientLeft),// * (this.canvas.width / bbox.width),
        yc = y - (bbox.top + this.canvas.clientTop);// * (this.canvas.height / bbox.height);

    return new Vec2(xc, yc);
};

WorldWindow.prototype.onGestureEvent = function (event) {
    this.worldWindowController.onGestureEvent(event);
};

/**
 * Registers an event listener for the specified event type on this WorldWindow's canvas. This function
 * delegates the processing of events to the WorldWindow's canvas. For details on this function and its
 * arguments, see the W3C [EventTarget]{@link https://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventTarget}
 * documentation.
 *
 * Registering event listeners using this function enables applications to prevent the WorldWindow's default
 * navigation behavior. To prevent default navigation behavior, call the [Event]{@link https://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-Event}'s
 * preventDefault method from within an event listener for any events the navigator should not respond to.
 *
 * When an event occurs, this calls the registered event listeners in order of reverse registration. Since the
 * WorldWindow registers its navigator event listeners first, application event listeners are called before
 * navigator event listeners.
 *
 * @param type The event type to listen for.
 * @param listener The function to call when the event occurs.
 * @throws {ArgumentError} If any argument is null or undefined.
 */
WorldWindow.prototype.addEventListener = function (type, listener) {
    if (!type) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindow", "addEventListener", "missingType"));
    }

    if (!listener) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindow", "addEventListener", "missingListener"));
    }

    var thisWorldWindow = this;
    var entry = this.eventListeners[type];
    if (!entry) {
        entry = {
            listeners: [],
            callback: function (event) { // calls listeners in reverse registration order
                event.worldWindow = thisWorldWindow;
                for (var i = 0, len = entry.listeners.length; i < len; i++) {
                    entry.listeners[i](event);
                }
            }
        };
        this.eventListeners[type] = entry;
    }

    var index = entry.listeners.indexOf(listener);
    if (index == -1) { // suppress duplicate listeners
        entry.listeners.splice(0, 0, listener); // insert the listener at the beginning of the list

        if (entry.listeners.length == 1) { // first listener added, add the event listener callback
            this.canvas.addEventListener(type, entry.callback, false);
        }
    }
};

/**
 * Removes an event listener for the specified event type from this WorldWindow's canvas. The listener must be
 * the same object passed to addEventListener. Calling removeEventListener with arguments that do not identify a
 * currently registered listener has no effect.
 *
 * @param type Indicates the event type the listener registered for.
 * @param listener The listener to remove. Must be the same function object passed to addEventListener.
 * @throws {ArgumentError} If any argument is null or undefined.
 */
WorldWindow.prototype.removeEventListener = function (type, listener) {
    if (!type) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindow", "removeEventListener", "missingType"));
    }

    if (!listener) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindow", "removeEventListener", "missingListener"));
    }

    var entry = this.eventListeners[type];
    if (!entry) {
        return; // no entry for the specified type
    }

    var index = entry.listeners.indexOf(listener);
    if (index != -1) {
        entry.listeners.splice(index, 1); // remove the listener from the list

        if (entry.listeners.length == 0) { // last listener removed, remove the event listener callback
            this.canvas.removeEventListener(type, entry.callback, false);
        }
    }
};

/**
 * Causes this WorldWindow to redraw itself at the next available opportunity. The redraw occurs on the main
 * thread at a time of the browser's discretion. Applications should call redraw after changing the World
 * Window's state, but should not expect that change to be reflected on screen immediately after this function
 * returns. This is the preferred method for requesting a redraw of the WorldWindow.
 */
WorldWindow.prototype.redraw = function () {
    this.redrawRequested = true; // redraw during the next animation frame
};

/**
 * Requests the WorldWind objects displayed at a specified screen-coordinate point.
 *
 * If the point intersects the terrain, the returned list contains an object identifying the associated geographic
 * position. This returns an empty list when nothing in the WorldWind scene intersects the specified point.
 *
 * @param pickPoint The point to examine in this WorldWindow's screen coordinates.
 * @returns {PickedObjectList} A list of picked WorldWind objects at the specified pick point.
 * @throws {ArgumentError} If the specified pick point is null or undefined.
 */
WorldWindow.prototype.pick = function (pickPoint) {
    if (!pickPoint) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindow", "pick", "missingPoint"));
    }

    // Suppress the picking operation and return an empty list when the WebGL context has been lost.
    if (this.drawContext.currentGlContext.isContextLost()) {
        return new PickedObjectList();
    }

    this.resize();
    this.resetDrawContext();
    this.drawContext.pickingMode = true;
    this.drawContext.pickPoint = pickPoint;
    this.drawContext.pickRay = this.rayThroughScreenPoint(pickPoint);
    this.drawFrame();

    return this.drawContext.objectsAtPickPoint;
};

/**
 * Requests the position of the WorldWind terrain at a specified screen-coordinate point. If the point
 * intersects the terrain, the returned list contains a single object identifying the associated geographic
 * position. Otherwise this returns an empty list.
 * @param pickPoint The point to examine in this WorldWindow's screen coordinates.
 * @returns {PickedObjectList} A list containing the picked WorldWind terrain position at the specified point,
 * or an empty list if the point does not intersect the terrain.
 * @throws {ArgumentError} If the specified pick point is null or undefined.
 */
WorldWindow.prototype.pickTerrain = function (pickPoint) {
    if (!pickPoint) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindow", "pickTerrain", "missingPoint"));
    }

    // Suppress the picking operation and return an empty list when the WebGL context has been lost.
    if (this.drawContext.currentGlContext.isContextLost()) {
        return new PickedObjectList();
    }

    this.resize();
    this.resetDrawContext();
    this.drawContext.pickingMode = true;
    this.drawContext.pickTerrainOnly = true;
    this.drawContext.pickPoint = pickPoint;
    this.drawContext.pickRay = this.rayThroughScreenPoint(pickPoint);
    this.drawFrame();

    return this.drawContext.objectsAtPickPoint;
};

/**
 * Requests the WorldWind objects displayed within a specified screen-coordinate region. This returns all
 * objects that intersect the specified region, regardless of whether or not an object is actually visible, and
 * marks objects that are visible as on top.
 * @param {Rectangle} rectangle The screen coordinate rectangle identifying the region to search.
 * @returns {PickedObjectList} A list of visible WorldWind objects within the specified region.
 * @throws {ArgumentError} If the specified rectangle is null or undefined.
 */
WorldWindow.prototype.pickShapesInRegion = function (rectangle) {
    if (!rectangle) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindow", "pickShapesInRegion", "missingRectangle"));
    }

    // Suppress the picking operation and return an empty list when the WebGL context has been lost.
    if (this.drawContext.currentGlContext.isContextLost()) {
        return new PickedObjectList();
    }

    this.resize();
    this.resetDrawContext();
    this.drawContext.pickingMode = true;
    this.drawContext.regionPicking = true;
    this.drawContext.pickRectangle =
        new Rectangle(rectangle.x, this.canvas.height - rectangle.y, rectangle.width, rectangle.height);
    this.drawFrame();

    return this.drawContext.objectsAtPickPoint;
};

// Internal function. Intentionally not documented.
WorldWindow.prototype.createContext = function (canvas) {
    // Request a WebGL context with antialiasing is disabled. Antialiasing causes gaps to appear at the edges of
    // terrain tiles.
    var glAttrs = { antialias: false, stencil: true },
        gl = canvas.getContext("webgl", glAttrs);
    if (!gl) {
        gl = canvas.getContext("experimental-webgl", glAttrs);
    }

    // uncomment to debug WebGL
    //var gl = WebGLDebugUtils.makeDebugContext(this.canvas.getContext("webgl"),
    //        this.throwOnGLError,
    //        this.logAndValidate
    //);

    return gl;
};

// Internal function. Intentionally not documented.
WorldWindow.prototype.handleContextLost = function (event) {
    Logger.log(Logger.LEVEL_INFO, "WebGL context event: " + event.statusMessage);
    // Inform WebGL that we handle context restoration, enabling the context restored event to be delivered.
    event.preventDefault();
    // Notify the draw context that the WebGL rendering context has been lost.
    this.drawContext.contextLost();
    // Stop the rendering animation frame loop, resuming only if the WebGL context is restored.
    window.cancelAnimationFrame(this.redrawRequestId);
};

// Internal function. Intentionally not documented.
WorldWindow.prototype.handleContextRestored = function (event) {
    Logger.log(Logger.LEVEL_INFO, "WebGL context event: " + event.statusMessage);
    // Notify the draw context that the WebGL rendering context has been restored.
    this.drawContext.contextRestored();
    // Resume the rendering animation frame loop until the WebGL context is lost.
    this.redraw();
    this.animationFrameLoop();
};

// Internal function. Intentionally not documented.
WorldWindow.prototype.handleRedrawEvent = function (event) {
    this.redraw(); // redraw in the next animation frame
};

// Internal function. Intentionally not documented.
WorldWindow.prototype.animationFrameLoop = function () {
    // Render to the WebGL context as needed.
    this.redrawIfNeeded();

    // Continue the animation frame loop until the WebGL context is lost.
    var thisWindow = this;

    function animationFrameCallback() {
        thisWindow.animationFrameLoop();
    }

    this.redrawRequestId = window.requestAnimationFrame(animationFrameCallback);
};

// Internal function. Intentionally not documented.
WorldWindow.prototype.redrawIfNeeded = function () {
    // Check if the drawing buffer needs to resize to match its screen size, which requires a redraw.
    this.resize();

    // Redraw the WebGL drawing buffer only when necessary.
    if (!this.redrawRequested) {
        return;
    }

    try {
        // Prepare to redraw and notify the redraw callbacks that a redraw is about to occur.
        this.redrawRequested = false;
        this.drawContext.previousRedrawTimestamp = this.drawContext.timestamp;
        this.callRedrawCallbacks(WorldWind.BEFORE_REDRAW);
        // Redraw the WebGL drawing buffer.
        this.resetDrawContext();
        this.drawFrame();
    } catch (e) {
        Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindow", "redrawIfNeeded",
            "Exception occurred during redrawing.\n" + e.toString());
    } finally {
        // Notify the redraw callbacks that a redraw has completed.
        this.callRedrawCallbacks(WorldWind.AFTER_REDRAW);
        // Handle rendering code redraw requests.
        if (this.drawContext.redrawRequested) {
            this.redrawRequested = true;
        }
    }
};

// Internal function. Intentionally not documented.
WorldWindow.prototype.resize = function () {
    var gl = this.drawContext.currentGlContext,
        width = gl.canvas.clientWidth * this.pixelScale,
        height = gl.canvas.clientHeight * this.pixelScale;

    if (gl.canvas.width != width ||
        gl.canvas.height != height) {

        // Make the canvas drawing buffer size match its screen size.
        gl.canvas.width = width;
        gl.canvas.height = height;

        // Set the WebGL viewport to match the canvas drawing buffer size.
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        this.viewport = new Rectangle(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

        // Cause this WorldWindow to redraw with the new size.
        this.redrawRequested = true;
    }
};

// Internal. Intentionally not documented.
WorldWindow.prototype.computeViewingTransform = function (projection, modelview) {
    if (!modelview) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindow", "computeViewingTransform", "missingModelview"));
    }

    modelview.setToIdentity();
    this.worldWindowController.applyLimits();
    var globe = this.globe;
    var navigator = this.navigator;
    var lookAtPosition = new Position(navigator.lookAtLocation.latitude, navigator.lookAtLocation.longitude, 0);
    modelview.multiplyByLookAtModelview(lookAtPosition, navigator.range, navigator.heading, navigator.tilt, navigator.roll, globe);

    if (projection) {
        projection.setToIdentity();
        var globeRadius = WWMath.max(globe.equatorialRadius, globe.polarRadius),
            eyePoint = modelview.extractEyePoint(new Vec3(0, 0, 0)),
            eyePos = globe.computePositionFromPoint(eyePoint[0], eyePoint[1], eyePoint[2], new Position(0, 0, 0)),
            eyeHorizon = WWMath.horizonDistanceForGlobeRadius(globeRadius, eyePos.altitude),
            atmosphereHorizon = WWMath.horizonDistanceForGlobeRadius(globeRadius, 160000),
            viewport = this.viewport;

        // Set the far clip distance to the smallest value that does not clip the atmosphere.
        // TODO adjust the clip plane distances based on the navigator's orientation - shorter distances when the
        // TODO horizon is not in view
        // TODO parameterize the object altitude for horizon distance
        var farDistance = eyeHorizon + atmosphereHorizon;
        if (farDistance < 1e3)
            farDistance = 1e3;

        // Compute the near clip distance in order to achieve a desired depth resolution at the far clip distance.
        // This computed distance is limited such that it does not intersect the terrain when possible and is never
        // less than a predetermined minimum (usually one). The computed near distance automatically scales with the
        // resolution of the WebGL depth buffer.
        var nearDistance = WWMath.perspectiveNearDistanceForFarDistance(farDistance, 10, this.depthBits);

        // Prevent the near clip plane from intersecting the terrain.
        var distanceToSurface = eyePos.altitude - globe.elevationAtLocation(eyePos.latitude, eyePos.longitude);
        if (distanceToSurface > 0) {
            var maxNearDistance = WWMath.perspectiveNearDistance(viewport.width, viewport.height, distanceToSurface);
            if (nearDistance > maxNearDistance) {
                nearDistance = maxNearDistance;
            }
        }

        if (nearDistance < 1) {
            nearDistance = 1;
        }

        // Compute the current projection matrix based on this navigator's perspective properties and the current
        // WebGL viewport.
        projection.setToPerspectiveProjection(viewport.width, viewport.height, nearDistance, farDistance);
    }
};

// Internal. Intentionally not documented.
WorldWindow.prototype.computePixelMetrics = function (projection) {
    var projectionInv = Matrix.fromIdentity();
    projectionInv.invertMatrix(projection);

    // Compute the eye coordinate rectangles carved out of the frustum by the near and far clipping planes, and
    // the distance between those planes and the eye point along the -Z axis. The rectangles are determined by
    // transforming the bottom-left and top-right points of the frustum from clip coordinates to eye
    // coordinates.
    var nbl = new Vec3(-1, -1, -1),
        ntr = new Vec3(+1, +1, -1),
        fbl = new Vec3(-1, -1, +1),
        ftr = new Vec3(+1, +1, +1);
    // Convert each frustum corner from clip coordinates to eye coordinates by multiplying by the inverse
    // projection matrix.
    nbl.multiplyByMatrix(projectionInv);
    ntr.multiplyByMatrix(projectionInv);
    fbl.multiplyByMatrix(projectionInv);
    ftr.multiplyByMatrix(projectionInv);

    var nrRectWidth = WWMath.fabs(ntr[0] - nbl[0]),
        frRectWidth = WWMath.fabs(ftr[0] - fbl[0]),
        nrDistance = -nbl[2],
        frDistance = -fbl[2];

    // Compute the scale and offset used to determine the width of a pixel on a rectangle carved out of the
    // frustum at a distance along the -Z axis in eye coordinates. These values are found by computing the scale
    // and offset of a frustum rectangle at a given distance, then dividing each by the viewport width.
    var frustumWidthScale = (frRectWidth - nrRectWidth) / (frDistance - nrDistance),
        frustumWidthOffset = nrRectWidth - frustumWidthScale * nrDistance;

    return {
        pixelSizeFactor: frustumWidthScale / this.viewport.width,
        pixelSizeOffset: frustumWidthOffset / this.viewport.height
    };
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
WorldWindow.prototype.pixelSizeAtDistance = function (distance) {
    this.computeViewingTransform(this.scratchProjection, this.scratchModelview);
    var pixelMetrics = this.computePixelMetrics(this.scratchProjection);
    return pixelMetrics.pixelSizeFactor * distance + pixelMetrics.pixelSizeOffset;
};

// Internal. Intentionally not documented.
WorldWindow.prototype.computeDrawContext = function () {
    var dc = this.drawContext;

    this.computeViewingTransform(dc.projection, dc.modelview);
    dc.viewport = this.viewport;
    dc.eyePoint = dc.modelview.extractEyePoint(new Vec3(0, 0, 0));

    dc.modelviewProjection.setToIdentity();
    dc.modelviewProjection.setToMultiply(dc.projection, dc.modelview);

    var pixelMetrics = this.computePixelMetrics(dc.projection);
    dc.pixelSizeFactor = pixelMetrics.pixelSizeFactor;
    dc.pixelSizeOffset = pixelMetrics.pixelSizeOffset;

    // Compute the inverse of the modelview, projection, and modelview-projection matrices. The inverse matrices
    // are used to support operations on navigator state.
    var modelviewInv = Matrix.fromIdentity();
    modelviewInv.invertOrthonormalMatrix(dc.modelview);

    dc.modelviewNormalTransform = Matrix.fromIdentity().setToTransposeOfMatrix(modelviewInv.upper3By3());

    // Compute the frustum in model coordinates. Start by computing the frustum in eye coordinates from the
    // projection matrix, then transform this frustum to model coordinates by multiplying its planes by the
    // transpose of the modelview matrix. We use the transpose of the modelview matrix because planes are
    // transformed by the inverse transpose of a matrix, and we want to transform from eye coordinates to model
    // coordinates.
    var modelviewTranspose = Matrix.fromIdentity();
    modelviewTranspose.setToTransposeOfMatrix(dc.modelview);
    dc.frustumInModelCoordinates = Frustum.fromProjectionMatrix(dc.projection);
    dc.frustumInModelCoordinates.transformByMatrix(modelviewTranspose);
    dc.frustumInModelCoordinates.normalize();
};

// Internal. Intentionally not documented.
WorldWindow.prototype.resetDrawContext = function () {
    this.globe.offset = 0;

    var dc = this.drawContext;
    dc.reset();
    dc.globe = this.globe;
    dc.navigator = this.navigator;
    dc.layers = this.layers.slice();
    dc.layers.push(dc.screenCreditController);
    this.computeDrawContext();
    dc.verticalExaggeration = this.verticalExaggeration;
    dc.surfaceOpacity = this.surfaceOpacity;
    dc.deepPicking = this.deepPicking;
    dc.frameStatistics = this.frameStatistics;
    dc.pixelScale = this.pixelScale;
    dc.update();
};

/* useful stuff to debug WebGL */
/*
 function logGLCall(functionName, args) {
 console.log("gl." + functionName + "(" +
 WebGLDebugUtils.glFunctionArgsToString(functionName, args) + ")");
 };

 function validateNoneOfTheArgsAreUndefined(functionName, args) {
 for (var ii = 0; ii < args.length; ++ii) {
 if (args[ii] === undefined) {
 console.error("undefined passed to gl." + functionName + "(" +
 WebGLDebugUtils.glFunctionArgsToString(functionName, args) + ")");
 }
 }
 };

 WorldWindow.prototype.logAndValidate = function logAndValidate(functionName, args) {
 logGLCall(functionName, args);
 validateNoneOfTheArgsAreUndefined (functionName, args);
 };

 WorldWindow.prototype.throwOnGLError = function throwOnGLError(err, funcName, args) {
 throw WebGLDebugUtils.glEnumToString(err) + " was caused by call to: " + funcName;
 };
 */

// Internal function. Intentionally not documented.
WorldWindow.prototype.drawFrame = function () {
    try {
        this.drawContext.frameStatistics.beginFrame();
        this.beginFrame();

        if (this.drawContext.globe.is2D() && this.drawContext.globe.continuous) {
            this.do2DContiguousRepaint();
        } else {
            this.doNormalRepaint();
        }

    } finally {
        this.endFrame();
        this.drawContext.frameStatistics.endFrame();
        //console.log(this.drawContext.frameStatistics.frameTime);
    }
};

WorldWindow.prototype.doNormalRepaint = function () {
    this.createTerrain();
    this.clearFrame();
    this.deferOrderedRendering = false;
    if (this.drawContext.pickingMode) {
        if (this.drawContext.makePickFrustum()) {
            this.doPick();
            this.resolvePick();
        }
    } else {
        this.doDraw();
        if (this.subsurfaceMode && this.hasStencilBuffer) {
            this.redrawSurface();
            this.drawScreenRenderables();
        }
    }
};

WorldWindow.prototype.do2DContiguousRepaint = function () {
    this.createTerrain2DContiguous();
    this.clearFrame();
    if (this.drawContext.pickingMode) {
        if (this.drawContext.makePickFrustum()) {
            this.pick2DContiguous();
            this.resolvePick();
        }
    } else {
        this.draw2DContiguous();
    }
};

WorldWindow.prototype.resolvePick = function () {
    if (this.drawContext.pickTerrainOnly) {
        this.resolveTerrainPick();
    } else if (this.drawContext.regionPicking) {
        this.resolveRegionPick();
    } else {
        this.resolveTopPick();
    }
};

// Internal function. Intentionally not documented.
WorldWindow.prototype.beginFrame = function () {
    var gl = this.drawContext.currentGlContext;
    gl.enable(gl.BLEND);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.depthFunc(gl.LEQUAL);

    if (this.drawContext.pickingMode) {
        this.drawContext.makePickFramebuffer();
        this.drawContext.bindFramebuffer(this.drawContext.pickFramebuffer);
    }
};

// Internal function. Intentionally not documented.
WorldWindow.prototype.endFrame = function () {
    var gl = this.drawContext.currentGlContext;
    gl.disable(gl.BLEND);
    gl.disable(gl.CULL_FACE);
    gl.disable(gl.DEPTH_TEST);
    gl.blendFunc(gl.ONE, gl.ZERO);
    gl.depthFunc(gl.LESS);
    gl.clearColor(0, 0, 0, 1);

    this.drawContext.bindFramebuffer(null);
    this.drawContext.bindProgram(null);
};

// Internal function. Intentionally not documented.
WorldWindow.prototype.clearFrame = function () {
    var dc = this.drawContext,
        gl = dc.currentGlContext;

    gl.clearColor(dc.clearColor.red, dc.clearColor.green, dc.clearColor.blue, dc.clearColor.alpha);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};

// Internal function. Intentionally not documented.
WorldWindow.prototype.doDraw = function () {
    this.drawContext.renderShapes = true;

    if (this.subsurfaceMode && this.hasStencilBuffer) {
        // Draw the surface and collect the ordered renderables.
        this.drawContext.currentGlContext.disable(this.drawContext.currentGlContext.STENCIL_TEST);
        this.drawContext.surfaceShapeTileBuilder.clear();
        this.drawLayers(true);
        this.drawSurfaceRenderables();
        this.drawContext.surfaceShapeTileBuilder.doRender(this.drawContext);

        if (!this.deferOrderedRendering) {
            // Clear the depth and stencil buffers prior to rendering the ordered renderables. This allows
            // sub-surface renderables to be drawn beneath the terrain. Turn on stenciling to capture the
            // fragments that ordered renderables draw. The terrain and surface shapes will be subsequently
            // drawn again, and the stencil buffer will ensure that they are drawn only where they overlap
            // the fragments drawn by the ordered renderables.
            this.drawContext.currentGlContext.clear(
                this.drawContext.currentGlContext.DEPTH_BUFFER_BIT | this.drawContext.currentGlContext.STENCIL_BUFFER_BIT);
            this.drawContext.currentGlContext.enable(this.drawContext.currentGlContext.STENCIL_TEST);
            this.drawContext.currentGlContext.stencilFunc(this.drawContext.currentGlContext.ALWAYS, 1, 1);
            this.drawContext.currentGlContext.stencilOp(
                this.drawContext.currentGlContext.REPLACE, this.drawContext.currentGlContext.REPLACE, this.drawContext.currentGlContext.REPLACE);
            this.drawOrderedRenderables();
        }
    } else {
        this.drawContext.surfaceShapeTileBuilder.clear();
        this.drawLayers(true);
        this.drawSurfaceRenderables();
        this.drawContext.surfaceShapeTileBuilder.doRender(this.drawContext);

        if (!this.deferOrderedRendering) {
            this.drawOrderedRenderables();
            this.drawScreenRenderables();
        }
    }
};

WorldWindow.prototype.redrawSurface = function () {
    // Draw the terrain and surface shapes but only where the current stencil buffer is non-zero.
    // The non-zero fragments are from drawing the ordered renderables previously.
    this.drawContext.currentGlContext.enable(this.drawContext.currentGlContext.STENCIL_TEST);
    this.drawContext.currentGlContext.stencilFunc(this.drawContext.currentGlContext.EQUAL, 1, 1);
    this.drawContext.currentGlContext.stencilOp(
        this.drawContext.currentGlContext.KEEP, this.drawContext.currentGlContext.KEEP, this.drawContext.currentGlContext.KEEP);
    this.drawContext.surfaceShapeTileBuilder.clear();
    this.drawLayers(false);
    this.drawSurfaceRenderables();
    this.drawContext.surfaceShapeTileBuilder.doRender(this.drawContext);
    this.drawContext.currentGlContext.disable(this.drawContext.currentGlContext.STENCIL_TEST);
};

// Internal function. Intentionally not documented.
WorldWindow.prototype.doPick = function () {
    if (this.drawContext.terrain) {
        this.drawContext.terrain.pick(this.drawContext);
    }

    if (!this.drawContext.pickTerrainOnly) {
        if (this.subsurfaceMode && this.hasStencilBuffer) {
            // Draw the surface and collect the ordered renderables.
            this.drawContext.currentGlContext.disable(this.drawContext.currentGlContext.STENCIL_TEST);
            this.drawContext.surfaceShapeTileBuilder.clear();
            this.drawLayers(true);
            this.drawSurfaceRenderables();
            this.drawContext.surfaceShapeTileBuilder.doRender(this.drawContext);

            if (!this.deferOrderedRendering) {
                // Clear the depth and stencil buffers prior to rendering the ordered renderables. This allows
                // sub-surface renderables to be drawn beneath the terrain. Turn on stenciling to capture the
                // fragments that ordered renderables draw. The terrain and surface shapes will be subsequently
                // drawn again, and the stencil buffer will ensure that they are drawn only where they overlap
                // the fragments drawn by the ordered renderables.
                this.drawContext.currentGlContext.clear(
                    this.drawContext.currentGlContext.DEPTH_BUFFER_BIT | this.drawContext.currentGlContext.STENCIL_BUFFER_BIT);
                this.drawContext.currentGlContext.enable(this.drawContext.currentGlContext.STENCIL_TEST);
                this.drawContext.currentGlContext.stencilFunc(this.drawContext.currentGlContext.ALWAYS, 1, 1);
                this.drawContext.currentGlContext.stencilOp(
                    this.drawContext.currentGlContext.REPLACE, this.drawContext.currentGlContext.REPLACE, this.drawContext.currentGlContext.REPLACE);
                this.drawOrderedRenderables();
                this.drawContext.terrain.pick(this.drawContext);
                this.drawScreenRenderables();
            }
        } else {
            this.drawContext.surfaceShapeTileBuilder.clear();

            this.drawLayers(true);
            this.drawSurfaceRenderables();

            this.drawContext.surfaceShapeTileBuilder.doRender(this.drawContext);

            if (!this.deferOrderedRendering) {
                this.drawOrderedRenderables();
                this.drawScreenRenderables();
            }
        }
    }
};

// Internal function. Intentionally not documented.
WorldWindow.prototype.createTerrain = function () {
    var dc = this.drawContext;
    dc.terrain = this.globe.tessellator.tessellate(dc);
    dc.frameStatistics.setTerrainTileCount(dc.terrain ? dc.terrain.surfaceGeometry.length : 0);
};

WorldWindow.prototype.makeCurrent = function (offset) {
    var dc = this.drawContext;
    dc.globe.offset = offset;
    dc.globeStateKey = dc.globe.stateKey;

    switch (offset) {
        case -1:
            dc.terrain = this.terrainLeft;
            break;

        case 0:
            dc.terrain = this.terrainCenter;
            break;

        case 1:
            dc.terrain = this.terrainRight;
            break;
    }
};

WorldWindow.prototype.createTerrain2DContiguous = function () {
    var dc = this.drawContext;

    this.terrainCenter = null;
    dc.globe.offset = 0;
    dc.globeStateKey = dc.globe.stateKey;
    if (dc.globe.intersectsFrustum(dc.frustumInModelCoordinates)) {
        this.terrainCenter = dc.globe.tessellator.tessellate(dc);
    }

    this.terrainRight = null;
    dc.globe.offset = 1;
    dc.globeStateKey = dc.globe.stateKey;
    if (dc.globe.intersectsFrustum(dc.frustumInModelCoordinates)) {
        this.terrainRight = dc.globe.tessellator.tessellate(dc);
    }

    this.terrainLeft = null;
    dc.globe.offset = -1;
    dc.globeStateKey = dc.globe.stateKey;
    if (dc.globe.intersectsFrustum(dc.frustumInModelCoordinates)) {
        this.terrainLeft = dc.globe.tessellator.tessellate(dc);
    }
};

WorldWindow.prototype.draw2DContiguous = function () {
    var drawing = "";

    if (this.terrainCenter) {
        drawing += " 0 ";
        this.makeCurrent(0);
        this.deferOrderedRendering = this.terrainLeft || this.terrainRight;
        this.doDraw();
    }

    if (this.terrainRight) {
        drawing += " 1 ";
        this.makeCurrent(1);
        this.deferOrderedRendering = this.terrainLeft || this.terrainLeft;
        this.doDraw();
    }

    this.deferOrderedRendering = false;

    if (this.terrainLeft) {
        drawing += " -1 ";
        this.makeCurrent(-1);
        this.doDraw();
    }
    //
    //console.log(drawing);

    if (this.subsurfaceMode && this.hasStencilBuffer) {
        this.deferOrderedRendering = true;

        if (this.terrainCenter) {
            drawing += " 0 ";
            this.makeCurrent(0);
            this.redrawSurface();
        }

        if (this.terrainRight) {
            drawing += " 1 ";
            this.makeCurrent(1);
            this.redrawSurface();
        }

        if (this.terrainLeft) {
            drawing += " -1 ";
            this.makeCurrent(-1);
            this.redrawSurface();
        }
    }

    this.drawScreenRenderables();
};

WorldWindow.prototype.pick2DContiguous = function () {
    if (this.terrainCenter) {
        this.makeCurrent(0);
        this.deferOrderedRendering = this.terrainLeft || this.terrainRight;
        this.doPick();
    }

    if (this.terrainRight) {
        this.makeCurrent(1);
        this.deferOrderedRendering = this.terrainLeft || this.terrainLeft;
        this.doPick();
    }

    this.deferOrderedRendering = false;

    if (this.terrainLeft) {
        this.makeCurrent(-1);
        this.doPick();
    }
};

// Internal function. Intentionally not documented.
WorldWindow.prototype.drawLayers = function (accumulateOrderedRenderables) {
    // Draw all the layers attached to this WorldWindow.

    var beginTime = Date.now(),
        dc = this.drawContext,
        layers = dc.layers,
        layer;

    dc.accumulateOrderedRenderables = accumulateOrderedRenderables;

    for (var i = 0, len = layers.length; i < len; i++) {
        layer = layers[i];
        if (layer) {
            dc.currentLayer = layer;
            try {
                layer.render(dc);
            } catch (e) {
                Logger.log(Logger.LEVEL_SEVERE, "Error while rendering layer " + layer.displayName + ".\n"
                    + e.toString());
                // Keep going. Render the rest of the layers.
            }
        }
    }
    dc.currentLayer = null;
    var now = Date.now();
    dc.frameStatistics.layerRenderingTime = now - beginTime;
};

/**
 * Adds a specified layer to the end of this WorldWindow.
 * @param {Layer} layer The layer to add. May be null or undefined, in which case this WorldWindow is not
 * modified.
 */
WorldWindow.prototype.addLayer = function (layer) {
    if (layer) {
        this.layers.push(layer);
    }
};

/**
 * Removes the first instance of a specified layer from this WorldWindow.
 * @param {Layer} layer The layer to remove. May be null or undefined, in which case this WorldWindow is not
 * modified. This WorldWindow is also not modified if the specified layer does not exist in this WorldWindow's
 * layer list.
 */
WorldWindow.prototype.removeLayer = function (layer) {
    var index = this.indexOfLayer(layer);
    if (index >= 0) {
        this.layers.splice(index, 1);
    }
};

/**
 * Inserts a specified layer at a specified position in this WorldWindow.
 * @param {Number} index The index at which to insert the layer. May be negative to specify the position
 * from the end of the array.
 * @param {Layer} layer The layer to insert. May be null or undefined, in which case this WorldWindow is not
 * modified.
 */
WorldWindow.prototype.insertLayer = function (index, layer) {
    if (layer) {
        this.layers.splice(index, 0, layer);
    }
};

/**
 * Returns the index of a specified layer in this WorldWindow.
 * @param {Layer} layer The layer to search for.
 * @returns {Number} The index of the specified layer or -1 if it doesn't exist in this WorldWindow.
 */
WorldWindow.prototype.indexOfLayer = function (layer) {
    return this.layers.indexOf(layer);
};

// Internal function. Intentionally not documented.
WorldWindow.prototype.drawSurfaceRenderables = function () {
    var dc = this.drawContext,
        sr;

    dc.reverseSurfaceRenderables();

    while (sr = dc.popSurfaceRenderable()) {
        try {
            sr.renderSurface(dc);
        } catch (e) {
            Logger.logMessage(Logger.LEVEL_WARNING, "WorldWindow", "drawSurfaceRenderables",
                "Error while rendering a surface renderable.\n" + e.message);
            // Keep going. Render the rest of the surface renderables.
        }
    }
};

// Internal function. Intentionally not documented.
WorldWindow.prototype.drawOrderedRenderables = function () {
    var beginTime = Date.now(),
        dc = this.drawContext,
        or;

    dc.sortOrderedRenderables();

    if (this._orderedRenderingFilters) {
        for (var f = 0; f < this._orderedRenderingFilters.length; f++) {
            this._orderedRenderingFilters[f](this.drawContext);
        }
    }

    dc.orderedRenderingMode = true;

    while (or = dc.popOrderedRenderable()) {
        try {
            or.renderOrdered(dc);
        } catch (e) {
            Logger.logMessage(Logger.LEVEL_WARNING, "WorldWindow", "drawOrderedRenderables",
                "Error while rendering an ordered renderable.\n" + e.message);
            // Keep going. Render the rest of the ordered renderables.
        }
    }

    dc.orderedRenderingMode = false;
    dc.frameStatistics.orderedRenderingTime = Date.now() - beginTime;
};

WorldWindow.prototype.drawScreenRenderables = function () {
    var dc = this.drawContext,
        or;

    while (or = dc.nextScreenRenderable()) {
        try {
            or.renderOrdered(dc);
        } catch (e) {
            Logger.logMessage(Logger.LEVEL_WARNING, "WorldWindow", "drawOrderedRenderables",
                "Error while rendering a screen renderable.\n" + e.message);
            // Keep going. Render the rest of the screen renderables.
        }
    }
};

// Internal function. Intentionally not documented.
WorldWindow.prototype.resolveTopPick = function () {
    if (this.drawContext.objectsAtPickPoint.objects.length == 0) {
        return; // nothing picked; avoid calling readPickColor unnecessarily
    }

    // Make a last reading to determine what's on top.

    var pickedObjects = this.drawContext.objectsAtPickPoint,
        pickColor = this.drawContext.readPickColor(this.drawContext.pickPoint),
        topObject = null,
        terrainObject = null;

    if (pickColor) {
        // Find the picked object with the top color code and set its isOnTop flag.
        for (var i = 0, len = pickedObjects.objects.length; i < len; i++) {
            var po = pickedObjects.objects[i];

            if (po.isTerrain) {
                terrainObject = po;
            }

            if (po.color.equals(pickColor)) {
                po.isOnTop = true;
                topObject = po;

                if (terrainObject) {
                    break; // no need to search for more than the top object and the terrain object
                }
            }
        }

        // In single-pick mode provide only the top-most object and the terrain object, if any.
        if (!this.drawContext.deepPicking) {
            pickedObjects.clear();
            if (topObject) {
                pickedObjects.add(topObject);
            }
            if (terrainObject && terrainObject != topObject) {
                pickedObjects.add(terrainObject);
            }
        }
    } else {
        pickedObjects.clear(); // nothing drawn at the pick point
    }
};

// Internal. Intentionally not documented.
WorldWindow.prototype.resolveTerrainPick = function () {
    var pickedObjects = this.drawContext.objectsAtPickPoint,
        po;

    // Mark the first picked terrain object as "on top". The picked object list should contain only one entry
    // indicating the picked terrain object, but we iterate over the list contents anyway.
    for (var i = 0, len = pickedObjects.objects.length; i < len; i++) {
        po = pickedObjects.objects[i];
        if (po.isTerrain) {
            po.isOnTop = true;
            break;
        }
    }
};

// Internal. Intentionally not documented.
WorldWindow.prototype.resolveRegionPick = function () {
    if (this.drawContext.objectsAtPickPoint.objects.length == 0) {
        return; // nothing picked; avoid calling readPickColors unnecessarily
    }

    // Mark every picked object with a color in the pick buffer as "on top".

    var pickedObjects = this.drawContext.objectsAtPickPoint,
        uniquePickColors = this.drawContext.readPickColors(this.drawContext.pickRectangle),
        po,
        color;

    for (var i = 0, len = pickedObjects.objects.length; i < len; i++) {
        po = pickedObjects.objects[i];
        if (!po) continue;
        var poColor = po.color.toByteString();
        color = uniquePickColors[poColor];
        if (color) {
            po.isOnTop = true;
        } else if (po.userObject instanceof SurfaceShape) {
            // SurfaceShapes ALWAYS get added to the pick list, since their rendering is deferred
            // until the tile they are cached by is rendered. So a SurfaceShape may be in the pick list
            // but is not seen in the pick rectangle.
            //
            // Remove the SurfaceShape that was not visible to the pick rectangle.
            pickedObjects.objects.splice(i, 1);
            i -= 1;
        }
    }
};

// Internal. Intentionally not documented.
WorldWindow.prototype.callRedrawCallbacks = function (stage) {
    for (var i = 0, len = this._redrawCallbacks.length; i < len; i++) {
        try {
            this._redrawCallbacks[i](this, stage);
        } catch (e) {
            Logger.log(Logger.LEVEL_SEVERE, "Exception calling redraw callback.\n" + e.toString());
            // Keep going. Execute the rest of the callbacks.
        }
    }
};

/**
 * Moves this WorldWindow's navigator to a specified location or position.
 * @param {Location | Position} position The location or position to move the navigator to. If this
 * argument contains an "altitude" property, as {@link Position} does, the end point of the navigation is
 * at the specified altitude. Otherwise the end point is at the current altitude of the navigator.
 *
 * This function uses this WorldWindow's {@link GoToAnimator} property to perform the move. That object's
 * properties can be specified by the application to modify its behavior during calls to this function.
 * It's cancel method can also be used to cancel the move initiated by this function.
 * @param {Function} completionCallback If not null or undefined, specifies a function to call when the
 * animation completes. The completion callback is called with a single argument, this animator.
 * @throws {ArgumentError} If the specified location or position is null or undefined.
 */
WorldWindow.prototype.goTo = function (position, completionCallback) {
    this.goToAnimator.goTo(position, completionCallback);
};

/**
 * Declutters the current ordered renderables with a specified group ID. This function is not called by
 * applications directly. It's meant to be invoked as an ordered rendering filter in this WorldWindow's
 * [orderedRenderingFilters]{@link WorldWindow#orderedRenderingFilters} property.
 * <p>
 * The function operates by setting the target visibility of occluded shapes to 0 and unoccluded shapes to 1.
 * @param {DrawContext} dc The current draw context.
 * @param {Number} groupId The ID of the group to declutter. Must not be null, undefined or 0.
 * @throws {ArgumentError} If the specified group ID is null, undefined or 0.
 */
WorldWindow.prototype.declutter = function (dc, groupId) {
    if (!groupId) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindow", "declutter",
                "Group ID is null, undefined or 0."));
    }

    // Collect all the declutterables in the specified group.
    var declutterables = [];
    for (var i = 0; i < dc.orderedRenderables.length; i++) {
        var orderedRenderable = dc.orderedRenderables[i].orderedRenderable;
        if (orderedRenderable.declutterGroup === groupId) {
            declutterables.push(orderedRenderable);
        }
    }

    // Filter the declutterables by determining which are partially occluded. Since the ordered renderable
    // list was already sorted from front to back, the front-most will represent an entire occluded group.
    var rects = [];
    for (var j = 0; j < declutterables.length; j++) {
        var declutterable = declutterables[j],
            screenBounds = declutterable.screenBounds;

        if (screenBounds && screenBounds.intersectsRectangles(rects)) {
            declutterable.targetVisibility = 0;
        } else {
            declutterable.targetVisibility = 1;
            if (screenBounds) {
                rects.push(screenBounds);
            }
        }
    }
};

/**
 * Computes a ray originating at the eyePoint and extending through the specified point in window
 * coordinates.
 * <p>
 * The specified point is understood to be in the window coordinate system of the WorldWindow, with the origin
 * in the top-left corner and axes that extend down and to the right from the origin point.
 * <p>
 * The results of this method are undefined if the specified point is outside of the WorldWindow's
 * bounds.
 *
 * @param {Vec2} point The window coordinates point to compute a ray for.
 * @returns {Line} A new Line initialized to the origin and direction of the computed ray, or null if the
 * ray could not be computed.
 */
WorldWindow.prototype.rayThroughScreenPoint = function (point) {
    if (!point) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindow", "rayThroughScreenPoint",
            "missingPoint"));
    }

    // Convert the point's xy coordinates from window coordinates to WebGL screen coordinates.
    var screenPoint = new Vec3(point[0], this.viewport.height - point[1], 0),
        nearPoint = new Vec3(0, 0, 0),
        farPoint = new Vec3(0, 0, 0);

    this.computeViewingTransform(this.scratchProjection, this.scratchModelview);
    var modelviewProjection = Matrix.fromIdentity();
    modelviewProjection.setToMultiply(this.scratchProjection, this.scratchModelview);
    var modelviewProjectionInv = Matrix.fromIdentity();
    modelviewProjectionInv.invertMatrix(modelviewProjection);

    // Compute the model coordinate point on the near clip plane with the xy coordinates and depth 0.
    if (!modelviewProjectionInv.unProject(screenPoint, this.viewport, nearPoint)) {
        return null;
    }

    // Compute the model coordinate point on the far clip plane with the xy coordinates and depth 1.
    screenPoint[2] = 1;
    if (!modelviewProjectionInv.unProject(screenPoint, this.viewport, farPoint)) {
        return null;
    }

    var eyePoint = this.scratchModelview.extractEyePoint(new Vec3(0, 0, 0));

    // Compute a ray originating at the eye point and with direction pointing from the xy coordinate on the near
    // plane to the same xy coordinate on the far plane.
    var origin = new Vec3(eyePoint[0], eyePoint[1], eyePoint[2]),
        direction = new Vec3(farPoint[0], farPoint[1], farPoint[2]);

    direction.subtract(nearPoint);
    direction.normalize();

    return new Line(origin, direction);
};

export default WorldWindow;
