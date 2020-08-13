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
 * @exports TiltRecognizer
 */
import PanRecognizer from '../gesture/PanRecognizer';


/**
 * Constructs a tilt gesture recognizer.
 * @alias TiltRecognizer
 * @constructor
 * @augments PanRecognizer
 * @classdesc A concrete gesture recognizer subclass that looks for two finger tilt gestures.
 * @param {EventTarget} target The document element this gesture recognizer observes for mouse and touch events.
 * @param {Function} callback An optional function to call when this gesture is recognized. If non-null, the
 * function is called when this gesture is recognized, and is passed a single argument: this gesture recognizer,
 * e.g., <code>gestureCallback(recognizer)</code>.
 * @throws {ArgumentError} If the specified target is null or undefined.
 */
function TiltRecognizer(target, callback) {
    PanRecognizer.call(this, target, callback);

    // Intentionally not documented.
    this.maxTouchDistance = 250;

    // Intentionally not documented.
    this.maxTouchDivergence = 50;
}

// Intentionally not documented.
TiltRecognizer.LEFT = 1 << 0;

// Intentionally not documented.
TiltRecognizer.RIGHT = 1 << 1;

// Intentionally not documented.
TiltRecognizer.UP = 1 << 2;

// Intentionally not documented.
TiltRecognizer.DOWN = 1 << 3;

TiltRecognizer.prototype = Object.create(PanRecognizer.prototype);

// Documented in superclass.
TiltRecognizer.prototype.shouldInterpret = function () {
    for (var i = 0, count = this.touchCount; i < count; i++) {
        var touch = this.touch(i),
            dx = touch.translationX,
            dy = touch.translationY,
            distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > this.interpretDistance) {
            return true; // interpret touches when any touch moves far enough
        }
    }

    return false;
};

// Documented in superclass.
TiltRecognizer.prototype.shouldRecognize = function () {
    var touchCount = this.touchCount;
    if (touchCount < 2) {
        return false;
    }

    var touch0 = this.touch(0),
        touch1 = this.touch(1),
        dx = touch0.clientX - touch1.clientX,
        dy = touch0.clientY - touch1.clientY,
        distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > this.maxTouchDistance) {
        return false; // touches must be close together
    }

    var tx = touch0.translationX - touch1.translationX,
        ty = touch0.translationY - touch1.translationY,
        divergence = Math.sqrt(tx * tx + ty * ty);
    if (divergence > this.maxTouchDivergence) {
        return false; // touches must be moving in a mostly parallel direction
    }

    var verticalMask = TiltRecognizer.UP | TiltRecognizer.DOWN,
        dirMask0 = this.touchDirection(touch0) & verticalMask,
        dirMask1 = this.touchDirection(touch1) & verticalMask;
    return (dirMask0 & dirMask1) != 0; // touches must move in the same vertical direction
};

// Intentionally not documented.
TiltRecognizer.prototype.touchDirection = function (touch) {
    var dx = touch.translationX,
        dy = touch.translationY,
        dirMask = 0;

    if (Math.abs(dx) > Math.abs(dy)) {
        dirMask |= dx < 0 ? TiltRecognizer.LEFT : 0;
        dirMask |= dx > 0 ? TiltRecognizer.RIGHT : 0;
    } else {
        dirMask |= dy < 0 ? TiltRecognizer.UP : 0;
        dirMask |= dy > 0 ? TiltRecognizer.DOWN : 0;
    }

    return dirMask;
};

export default TiltRecognizer;
