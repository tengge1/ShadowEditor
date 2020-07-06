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
 * @exports PinchRecognizer
 */
import GestureRecognizer from '../gesture/GestureRecognizer';


/**
 * Constructs a pinch gesture recognizer.
 * @alias PinchRecognizer
 * @constructor
 * @augments GestureRecognizer
 * @classdesc A concrete gesture recognizer subclass that looks for two finger pinch gestures.
 * @param {EventTarget} target The document element this gesture recognizer observes for mouse and touch events.
 * @param {Function} callback An optional function to call when this gesture is recognized. If non-null, the
 * function is called when this gesture is recognized, and is passed a single argument: this gesture recognizer,
 * e.g., <code>gestureCallback(recognizer)</code>.
 * @throws {ArgumentError} If the specified target is null or undefined.
 */
function PinchRecognizer(target, callback) {
    GestureRecognizer.call(this, target, callback);

    // Intentionally not documented.
    this._scale = 1;

    // Intentionally not documented.
    this._offsetScale = 1;

    // Intentionally not documented.
    this.referenceDistance = 0;

    // Intentionally not documented.
    this.interpretThreshold = 20;

    // Intentionally not documented.
    this.weight = 0.4;

    // Intentionally not documented.
    this.pinchTouches = [];
}

PinchRecognizer.prototype = Object.create(GestureRecognizer.prototype);

Object.defineProperties(PinchRecognizer.prototype, {
    scale: {
        get: function () {
            return this._scale * this._offsetScale;
        }
    }
});

// Documented in superclass.
PinchRecognizer.prototype.reset = function () {
    GestureRecognizer.prototype.reset.call(this);

    this._scale = 1;
    this._offsetScale = 1;
    this.referenceDistance = 0;
    this.pinchTouches = [];
};

// Documented in superclass.
PinchRecognizer.prototype.mouseDown = function (event) {
    if (this.state == WorldWind.POSSIBLE) {
        this.state = WorldWind.FAILED; // touch gestures fail upon receiving a mouse event
    }
};

// Documented in superclass.
PinchRecognizer.prototype.touchStart = function (touch) {
    if (this.pinchTouches.length < 2) {
        if (this.pinchTouches.push(touch) == 2) {
            this.referenceDistance = this.currentPinchDistance();
            this._offsetScale *= this._scale;
            this._scale = 1;
        }
    }
};

// Documented in superclass.
PinchRecognizer.prototype.touchMove = function (touch) {
    if (this.pinchTouches.length == 2) {
        if (this.state == WorldWind.POSSIBLE) {
            if (this.shouldRecognize()) {
                this.state = WorldWind.BEGAN;
            }
        } else if (this.state == WorldWind.BEGAN || this.state == WorldWind.CHANGED) {
            var distance = this.currentPinchDistance(),
                newScale = Math.abs(distance / this.referenceDistance),
                w = this.weight;
            this._scale = this._scale * (1 - w) + newScale * w;
            this.state = WorldWind.CHANGED;
        }
    }
};

// Documented in superclass.
PinchRecognizer.prototype.touchEnd = function (touch) {
    var index = this.pinchTouches.indexOf(touch);
    if (index != -1) {
        this.pinchTouches.splice(index, 1);
    }

    // Transition to the ended state if this was the last touch.
    if (this.touchCount == 0) { // last touch ended
        if (this.state == WorldWind.POSSIBLE) {
            this.state = WorldWind.FAILED;
        } else if (this.state == WorldWind.BEGAN || this.state == WorldWind.CHANGED) {
            this.state = WorldWind.ENDED;
        }
    }
};

// Documented in superclass.
PinchRecognizer.prototype.touchCancel = function (touch) {
    var index = this.pinchTouches.indexOf(touch);
    if (index != -1) {
        this.pinchTouches.splice(index, 1);
    }

    // Transition to the cancelled state if this was the last touch.
    if (this.touchCount == 0) {
        if (this.state == WorldWind.POSSIBLE) {
            this.state = WorldWind.FAILED;
        } else if (this.state == WorldWind.BEGAN || this.state == WorldWind.CHANGED) {
            this.state = WorldWind.CANCELLED;
        }
    }
};

// Documented in superclass.
PinchRecognizer.prototype.prepareToRecognize = function () {
    this.referenceDistance = this.currentPinchDistance();
    this._scale = 1;
};

// Intentionally not documented.
PinchRecognizer.prototype.shouldRecognize = function () {
    var distance = this.currentPinchDistance();

    return Math.abs(distance - this.referenceDistance) > this.interpretThreshold;
};

// Intentionally not documented.
PinchRecognizer.prototype.currentPinchDistance = function () {
    var touch0 = this.pinchTouches[0],
        touch1 = this.pinchTouches[1],
        dx = touch0.clientX - touch1.clientX,
        dy = touch0.clientY - touch1.clientY;

    return Math.sqrt(dx * dx + dy * dy);
};

export default PinchRecognizer;
