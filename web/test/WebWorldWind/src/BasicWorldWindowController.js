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
import Angle from './geom/Angle';
import DragRecognizer from './gesture/DragRecognizer';
import GestureRecognizer from './gesture/GestureRecognizer';
import PanRecognizer from './gesture/PanRecognizer';
import PinchRecognizer from './gesture/PinchRecognizer';
import RotationRecognizer from './gesture/RotationRecognizer';
import TiltRecognizer from './gesture/TiltRecognizer';
import WorldWindowController from './WorldWindowController';
import WWMath from './util/WWMath';

/**
 * Constructs a window controller with basic capabilities.
 * @alias BasicWorldWindowController
 * @constructor
 * @augments WorldWindowController
 * @classDesc This class provides the default window controller for WorldWind for controlling the globe via user interaction.
 * @param {WorldWindow} worldWindow The WorldWindow associated with this layer.
 */
function BasicWorldWindowController(worldWindow) {
    WorldWindowController.call(this, worldWindow);

    this.primaryDragRecognizer = new DragRecognizer(this.wwd, null);
    this.primaryDragRecognizer.addListener(this);

    this.secondaryDragRecognizer = new DragRecognizer(this.wwd, null);
    this.secondaryDragRecognizer.addListener(this);
    this.secondaryDragRecognizer.button = 2; // secondary mouse button

    this.panRecognizer = new PanRecognizer(this.wwd, null);
    this.panRecognizer.addListener(this);

    this.pinchRecognizer = new PinchRecognizer(this.wwd, null);
    this.pinchRecognizer.addListener(this);

    this.rotationRecognizer = new RotationRecognizer(this.wwd, null);
    this.rotationRecognizer.addListener(this);

    this.tiltRecognizer = new TiltRecognizer(this.wwd, null);
    this.tiltRecognizer.addListener(this);

    // Establish the dependencies between gesture recognizers. The pan, pinch and rotate gesture may recognize
    // simultaneously with each other.
    this.panRecognizer.recognizeSimultaneouslyWith(this.pinchRecognizer);
    this.panRecognizer.recognizeSimultaneouslyWith(this.rotationRecognizer);
    this.pinchRecognizer.recognizeSimultaneouslyWith(this.rotationRecognizer);

    // Since the tilt gesture is a subset of the pan gesture, pan will typically recognize before tilt,
    // effectively suppressing tilt. Establish a dependency between the other touch gestures and tilt to provide
    // tilt an opportunity to recognize.
    this.panRecognizer.requireRecognizerToFail(this.tiltRecognizer);
    this.pinchRecognizer.requireRecognizerToFail(this.tiltRecognizer);
    this.rotationRecognizer.requireRecognizerToFail(this.tiltRecognizer);

    this.beginPoint = new THREE.Vector2(0, 0);
    this.lastPoint = new THREE.Vector2(0, 0);
    this.beginHeading = 0;
    this.beginTilt = 0;
    this.beginRange = 0;
    this.lastRotation = 0;
}

BasicWorldWindowController.prototype = Object.create(WorldWindowController.prototype);

BasicWorldWindowController.prototype.onGestureEvent = function (e) {
    var handled = WorldWindowController.prototype.onGestureEvent.call(this, e);

    if (!handled) {
        if (e.type === "wheel") {
            handled = true;
            this.handleWheelEvent(e);
        } else {
            for (var i = 0, len = GestureRecognizer.allRecognizers.length; i < len; i++) {
                var recognizer = GestureRecognizer.allRecognizers[i];
                if (recognizer.target === this.wwd) {
                    handled |= recognizer.onGestureEvent(e); // use or-assignment to indicate if any recognizer handled the event
                }
            }
        }
    }

    return handled;
};

BasicWorldWindowController.prototype.gestureStateChanged = function (recognizer) {
    if (recognizer === this.primaryDragRecognizer || recognizer === this.panRecognizer) {
        this.handlePanOrDrag(recognizer);
    } else if (recognizer === this.secondaryDragRecognizer) {
        this.handleSecondaryDrag(recognizer);
    } else if (recognizer === this.pinchRecognizer) {
        this.handlePinch(recognizer);
    } else if (recognizer === this.rotationRecognizer) {
        this.handleRotation(recognizer);
    } else if (recognizer === this.tiltRecognizer) {
        this.handleTilt(recognizer);
    }
};

BasicWorldWindowController.prototype.handlePanOrDrag = function (recognizer) {
    this.handlePanOrDrag3D(recognizer);
};

BasicWorldWindowController.prototype.handlePanOrDrag3D = function (recognizer) {
    var state = recognizer.state,
        tx = recognizer.translationX,
        ty = recognizer.translationY;

    var navigator = this.wwd.navigator;
    if (state === WorldWind.BEGAN) {
        this.lastPoint.set(0, 0);
    } else if (state === WorldWind.CHANGED) {
        // Convert the translation from screen coordinates to arc degrees. Use this navigator's range as a
        // metric for converting screen pixels to meters, and use the globe's radius for converting from meters
        // to arc degrees.
        var canvas = this.wwd.canvas,
            globe = this.wwd.globe,
            globeRadius = WWMath.max(globe.equatorialRadius, globe.polarRadius),
            distance = WWMath.max(1, navigator.range),
            metersPerPixel = WWMath.perspectivePixelSize(canvas.clientWidth, canvas.clientHeight, distance),
            forwardMeters = (ty - this.lastPoint.y) * metersPerPixel,
            sideMeters = -(tx - this.lastPoint.x) * metersPerPixel,
            forwardDegrees = forwardMeters / globeRadius * Angle.RADIANS_TO_DEGREES,
            sideDegrees = sideMeters / globeRadius * Angle.RADIANS_TO_DEGREES;

        // Apply the change in latitude and longitude to this navigator, relative to the current heading.
        var sinHeading = Math.sin(navigator.heading * Angle.DEGREES_TO_RADIANS),
            cosHeading = Math.cos(navigator.heading * Angle.DEGREES_TO_RADIANS);

        navigator.lookAtLocation.latitude += forwardDegrees * cosHeading - sideDegrees * sinHeading;
        navigator.lookAtLocation.longitude += forwardDegrees * sinHeading + sideDegrees * cosHeading;
        this.lastPoint.set(tx, ty);
        this.applyLimits();
        this.wwd.redraw();
    }
};

BasicWorldWindowController.prototype.handleSecondaryDrag = function (recognizer) {
    var state = recognizer.state,
        tx = recognizer.translationX,
        ty = recognizer.translationY;

    var navigator = this.wwd.navigator;
    if (state === WorldWind.BEGAN) {
        this.beginHeading = navigator.heading;
        this.beginTilt = navigator.tilt;
    } else if (state === WorldWind.CHANGED) {
        // Compute the current translation from screen coordinates to degrees. Use the canvas dimensions as a
        // metric for converting the gesture translation to a fraction of an angle.
        var headingDegrees = 180 * tx / this.wwd.canvas.clientWidth,
            tiltDegrees = 90 * ty / this.wwd.canvas.clientHeight;

        // Apply the change in heading and tilt to this navigator's corresponding properties.
        navigator.heading = this.beginHeading + headingDegrees;
        navigator.tilt = this.beginTilt - tiltDegrees;
        this.applyLimits();
        this.wwd.redraw();
    }
};

BasicWorldWindowController.prototype.handlePinch = function (recognizer) {
    var navigator = this.wwd.navigator;
    var state = recognizer.state,
        scale = recognizer.scale;

    if (state === WorldWind.BEGAN) {
        this.beginRange = navigator.range;
    } else if (state === WorldWind.CHANGED) {
        if (scale !== 0) {
            // Apply the change in pinch scale to this navigator's range, relative to the range when the gesture
            // began.
            navigator.range = this.beginRange / scale;
            this.applyLimits();
            this.wwd.redraw();
        }
    }
};

BasicWorldWindowController.prototype.handleRotation = function (recognizer) {
    var navigator = this.wwd.navigator;
    var state = recognizer.state,
        rotation = recognizer.rotation;

    if (state === WorldWind.BEGAN) {
        this.lastRotation = 0;
    } else if (state === WorldWind.CHANGED) {
        // Apply the change in gesture rotation to this navigator's current heading. We apply relative to the
        // current heading rather than the heading when the gesture began in order to work simultaneously with
        // pan operations that also modify the current heading.
        navigator.heading -= rotation - this.lastRotation;
        this.lastRotation = rotation;
        this.applyLimits();
        this.wwd.redraw();
    }
};

BasicWorldWindowController.prototype.handleTilt = function (recognizer) {
    var navigator = this.wwd.navigator;
    var state = recognizer.state,
        ty = recognizer.translationY;

    if (state === WorldWind.BEGAN) {
        this.beginTilt = navigator.tilt;
    } else if (state === WorldWind.CHANGED) {
        // Compute the gesture translation from screen coordinates to degrees. Use the canvas dimensions as a
        // metric for converting the translation to a fraction of an angle.
        var tiltDegrees = -90 * ty / this.wwd.canvas.clientHeight;
        // Apply the change in heading and tilt to this navigator's corresponding properties.
        navigator.tilt = this.beginTilt + tiltDegrees;
        this.applyLimits();
        this.wwd.redraw();
    }
};

BasicWorldWindowController.prototype.handleWheelEvent = function (event) {
    var navigator = this.wwd.navigator;
    // Normalize the wheel delta based on the wheel delta mode. This produces a roughly consistent delta across
    // browsers and input devices.
    var normalizedDelta;
    if (event.deltaMode === WheelEvent.DOM_DELTA_PIXEL) {
        normalizedDelta = event.deltaY;
    } else if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
        normalizedDelta = event.deltaY * 40;
    } else if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
        normalizedDelta = event.deltaY * 400;
    }

    // Compute a zoom scale factor by adding a fraction of the normalized delta to 1. When multiplied by the
    // navigator's range, this has the effect of zooming out or zooming in depending on whether the delta is
    // positive or negative, respectfully.
    var scale = 1 + normalizedDelta / 1000;

    // Apply the scale to this navigator's properties.
    navigator.range *= scale;
    this.applyLimits();
    this.wwd.redraw();
};

BasicWorldWindowController.prototype.applyLimits = function () {
    var navigator = this.wwd.navigator;

    // Clamp latitude to between -90 and +90, and normalize longitude to between -180 and +180.
    navigator.lookAtLocation.latitude = WWMath.clamp(navigator.lookAtLocation.latitude, -90, 90);
    navigator.lookAtLocation.longitude = Angle.normalizedDegreesLongitude(navigator.lookAtLocation.longitude);

    // Clamp range to values greater than 1 in order to prevent degenerating to a first-person navigator when
    // range is zero.
    navigator.range = WWMath.clamp(navigator.range, 1, Number.MAX_VALUE);

    // Normalize heading to between -180 and +180.
    navigator.heading = Angle.normalizedDegrees(navigator.heading);

    // Clamp tilt to between 0 and +90 to prevent the viewer from going upside down.
    navigator.tilt = WWMath.clamp(navigator.tilt, 0, 90);

    // Normalize heading to between -180 and +180.
    navigator.roll = Angle.normalizedDegrees(navigator.roll);
};

export default BasicWorldWindowController;

