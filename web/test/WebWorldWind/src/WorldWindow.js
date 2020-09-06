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

    this.handleGestureEvent = this.handleGestureEvent.bind(this);
    if (window.PointerEvent) {
        this.canvas.style.setProperty("touch-action", "none");
        this.addEventListener("pointerdown", this.handleGestureEvent, false);
        window.addEventListener("pointermove", this.handleGestureEvent, false); // get pointermove events outside event target
        window.addEventListener("pointercancel", this.handleGestureEvent, false); // get pointercancel events outside event target
        window.addEventListener("pointerup", this.handleGestureEvent, false); // get pointerup events outside event target
    } else {
        this.addEventListener("mousedown", this.handleGestureEvent, false);
        window.addEventListener("mousemove", this.handleGestureEvent, false); // get mousemove events outside event target
        window.addEventListener("mouseup", this.handleGestureEvent, false); // get mouseup events outside event target
        this.addEventListener("touchstart", this.handleGestureEvent, false);
        this.addEventListener("touchmove", this.handleGestureEvent, false);
        this.addEventListener("touchend", this.handleGestureEvent, false);
        this.addEventListener("touchcancel", this.handleGestureEvent, false);
    }
    this.addEventListener("wheel", this.handleGestureEvent);

    this.animate = this.animate.bind(this);
    this.animate();
}

WorldWindow.prototype.handleGestureEvent = function (event) {
    this.worldWindowController.onGestureEvent(event);
};

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

WorldWindow.prototype.redraw = function () {
    this.redrawRequested = true; // redraw during the next animation frame
};

WorldWindow.prototype.animate = function () {
    requestAnimationFrame(this.animate);
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
    this.createTerrain();
    this.clearFrame();
    this.drawLayers();
    this.endFrame();
};

WorldWindow.prototype.beginFrame = function () {
    var gl = this.drawContext.currentGlContext;
    gl.enable(gl.BLEND);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.depthFunc(gl.LEQUAL);
};

WorldWindow.prototype.endFrame = function () {
    var gl = this.drawContext.currentGlContext;
    gl.disable(gl.BLEND);
    gl.disable(gl.CULL_FACE);
    gl.disable(gl.DEPTH_TEST);
    gl.blendFunc(gl.ONE, gl.ZERO);
    gl.depthFunc(gl.LESS);
    gl.clearColor(0, 0, 0, 1);
    this.drawContext.bindProgram(null);
};

WorldWindow.prototype.clearFrame = function () {
    var dc = this.drawContext,
        gl = dc.currentGlContext;

    gl.clearColor(dc.clearColor.red, dc.clearColor.green, dc.clearColor.blue, dc.clearColor.alpha);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};

WorldWindow.prototype.createTerrain = function () {
    var dc = this.drawContext;
    dc.terrain = this.globe.tessellator.tessellate(dc);
};

WorldWindow.prototype.drawLayers = function () {
    var dc = this.drawContext,
        layers = dc.layers,
        layer;

    for (var i = 0, len = layers.length; i < len; i++) {
        layer = layers[i];
        if (layer) {
            dc.currentLayer = layer;
            layer.render(dc);
        }
    }
    dc.currentLayer = null;
};

WorldWindow.prototype.addLayer = function (layer) {
    if (layer) {
        this.layers.push(layer);
    }
};

export default WorldWindow;
