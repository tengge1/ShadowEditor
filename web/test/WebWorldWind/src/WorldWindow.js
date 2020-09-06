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
import BasicWorldWindowController from './BasicWorldWindowController';
import DrawContext from './render/DrawContext';
import EarthElevationModel from './globe/EarthElevationModel';
import Globe from './globe/Globe';
import Line from './geom/Line';
import LookAtNavigator from './navigate/LookAtNavigator';
import Position from './geom/Position';
import Rectangle from './geom/Rectangle';
import WWMath from './util/WWMath';
import global from './global';
import './third_party';

/**
 * Constructs a WorldWind window for an HTML canvas.
 * @alias WorldWindow
 * @constructor
 * @param {HTMLCanvasElement} canvas a canvas element.
 */
function WorldWindow(canvas) {
    global.worldWindow = this;
    this.canvas = canvas;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    var gl = canvas.getContext('webgl', { antialias: true, stencil: true });

    this.drawContext = new DrawContext(gl);

    this.eventListeners = {};

    this.redrawRequested = true;

    this.scratchModelview = new THREE.Matrix4();
    this.scratchProjection = new THREE.Matrix4();
    this.hasStencilBuffer = gl.getContextAttributes().stencil;
    this.depthBits = gl.getParameter(gl.DEPTH_BITS);

    this.viewport = new Rectangle(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    this.globe = new Globe(new EarthElevationModel());

    this.layers = [];

    this.navigator = new LookAtNavigator();
    this.worldWindowController = new BasicWorldWindowController(this);
    this.surfaceOpacity = 1;
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

    this.animationFrameLoop = this.animationFrameLoop.bind(this);
    this.animationFrameLoop();
}

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
 */
WorldWindow.prototype.addEventListener = function (type, listener) {
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
    if (index === -1) { // suppress duplicate listeners
        entry.listeners.splice(0, 0, listener); // insert the listener at the beginning of the list

        if (entry.listeners.length === 1) { // first listener added, add the event listener callback
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
 */
WorldWindow.prototype.removeEventListener = function (type, listener) {
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

WorldWindow.prototype.animationFrameLoop = function () {
    this.redrawIfNeeded();
    requestAnimationFrame(this.animationFrameLoop);
};

WorldWindow.prototype.redrawIfNeeded = function () {
    if (!this.redrawRequested) {
        return;
    }
    this.redrawRequested = false;
    this.drawContext.previousRedrawTimestamp = this.drawContext.timestamp;
    this.resetDrawContext();
    this.drawFrame();
    if (this.drawContext.redrawRequested) {
        this.redrawRequested = true;
    }
};

WorldWindow.prototype.computeViewingTransform = function () {
    var mat4 = new THREE.Matrix4();
    var eyePoint = new THREE.Vector3();
    return function (projection, modelview) {
        this.worldWindowController.applyLimits();
        var globe = this.globe;
        var navigator = this.navigator;
        var lookAtPosition = new Position(navigator.lookAtLocation.latitude, navigator.lookAtLocation.longitude, 0);
        mat4.multiplyByLookAtModelview(lookAtPosition, navigator.range, navigator.heading, navigator.tilt, navigator.roll, globe);
        modelview.copy(mat4);

        if (projection) {
            var globeRadius = WWMath.max(globe.equatorialRadius, globe.polarRadius);
            eyePoint.setFromMatrixPosition(modelview);
            var eyePos = globe.computePositionFromPoint(eyePoint.x, eyePoint.y, eyePoint.z, new Position(0, 0, 0)),
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

            var width = nearDistance;
            var height = width * viewport.height / viewport.width;
            mat4.makePerspective(
                -width / 2,
                width / 2,
                height / 2,
                -height / 2,
                nearDistance,
                farDistance
            );
            projection.copy(mat4);
        }
    };
}();

WorldWindow.prototype.computePixelMetrics = function () {
    var projectionInv = new THREE.Matrix4();
    var nbl = new THREE.Vector3(-1, -1, -1);
    var ntr = new THREE.Vector3(+1, +1, -1);
    var fbl = new THREE.Vector3(-1, -1, +1);
    var ftr = new THREE.Vector3(+1, +1, +1);

    return function (projection) {
        projectionInv.getInverse(projection);

        nbl.set(-1, -1, -1);
        ntr.set(+1, +1, -1);
        fbl.set(-1, -1, +1);
        ftr.set(+1, +1, +1);

        nbl.applyMatrix4(projectionInv);
        ntr.applyMatrix4(projectionInv);
        fbl.applyMatrix4(projectionInv);
        ftr.applyMatrix4(projectionInv);

        var nrRectWidth = Math.abs(ntr.x - nbl.x),
            frRectWidth = Math.abs(ftr.x - fbl.x),
            nrDistance = -nbl.z,
            frDistance = -fbl.z;

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
}();

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
    var modelviewInv = new THREE.Matrix4();
    var mat3By3 = new THREE.Matrix4();
    var modelviewTranspose = new THREE.Matrix4();
    return function () {
        var dc = this.drawContext;

        this.computeViewingTransform(dc.projection, dc.modelview);
        dc.viewport = this.viewport;
        dc.eyePoint.copyEyePoint(dc.modelview);
        dc.modelviewProjection.multiplyMatrices(dc.projection, dc.modelview);

        var pixelMetrics = this.computePixelMetrics(dc.projection);
        dc.pixelSizeFactor = pixelMetrics.pixelSizeFactor;
        dc.pixelSizeOffset = pixelMetrics.pixelSizeOffset;

        modelviewInv.getInverse(dc.modelview);
        modelviewInv.upper3By3(mat3By3);
        dc.modelviewNormalTransform.copy(mat3By3).transpose();
        modelviewTranspose.copy(dc.modelview).transpose();

        dc.frustumInModelCoordinates.setFromProjectionMatrix(dc.projection);
        dc.frustumInModelCoordinates.applyMatrix4(modelviewTranspose);
        dc.frustumInModelCoordinates.normalize();
    };
}();

WorldWindow.prototype.resetDrawContext = function () {
    this.globe.offset = 0;

    var dc = this.drawContext;
    dc.reset();
    dc.globe = this.globe;
    dc.navigator = this.navigator;
    dc.layers = this.layers.slice();
    this.computeDrawContext();
    dc.surfaceOpacity = this.surfaceOpacity;
    dc.pixelScale = this.pixelScale;
    dc.update();
};

WorldWindow.prototype.drawFrame = function () {
    this.beginFrame();
    this.doNormalRepaint();
    this.endFrame();
};

WorldWindow.prototype.doNormalRepaint = function () {
    this.createTerrain();
    this.clearFrame();
    this.deferOrderedRendering = false;
    this.doDraw();
};

// Internal function. Intentionally not documented.
WorldWindow.prototype.beginFrame = function () {
    var gl = this.drawContext.currentGlContext;
    gl.enable(gl.BLEND);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.depthFunc(gl.LEQUAL);
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

    this.drawContext.surfaceShapeTileBuilder.clear();
    this.drawLayers(true);
    this.drawSurfaceRenderables();
    this.drawContext.surfaceShapeTileBuilder.doRender(this.drawContext);
};

WorldWindow.prototype.createTerrain = function () {
    var dc = this.drawContext;
    dc.terrain = this.globe.tessellator.tessellate(dc);
};

WorldWindow.prototype.drawLayers = function (accumulateOrderedRenderables) {
    var dc = this.drawContext,
        layers = dc.layers,
        layer;

    dc.accumulateOrderedRenderables = accumulateOrderedRenderables;
    for (var i = 0, len = layers.length; i < len; i++) {
        layer = layers[i];
        if (layer) {
            dc.currentLayer = layer;
            layer.render(dc);
        }
    }
    dc.currentLayer = null;
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
            console.warn("WorldWindow", "drawSurfaceRenderables",
                "Error while rendering a surface renderable.\n" + e.message);
            // Keep going. Render the rest of the surface renderables.
        }
    }
};

export default WorldWindow;
