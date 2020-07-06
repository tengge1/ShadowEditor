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
 * @exports TapRecognizer
 */
import GestureRecognizer from '../gesture/GestureRecognizer';


/**
 * Constructs a tap gesture recognizer.
 * @alias TapRecognizer
 * @constructor
 * @augments GestureRecognizer
 * @classdesc A concrete gesture recognizer subclass that looks for single or multiple taps.
 * @param {EventTarget} target The document element this gesture recognizer observes for mouse and touch events.
 * @param {Function} callback An optional function to call when this gesture is recognized. If non-null, the
 * function is called when this gesture is recognized, and is passed a single argument: this gesture recognizer,
 * e.g., <code>gestureCallback(recognizer)</code>.
 * @throws {ArgumentError} If the specified target is null or undefined.
 */
function TapRecognizer(target, callback) {
    GestureRecognizer.call(this, target, callback);

    /**
     *
     * @type {Number}
     */
    this.numberOfTaps = 1;

    /**
     *
     * @type {Number}
     */
    this.numberOfTouches = 1;

    // Intentionally not documented.
    this.maxTouchMovement = 20;

    // Intentionally not documented.
    this.maxTapDuration = 500;

    // Intentionally not documented.
    this.maxTapInterval = 400;

    // Intentionally not documented.
    this.taps = [];

    // Intentionally not documented.
    this.timeout = null;
}

TapRecognizer.prototype = Object.create(GestureRecognizer.prototype);

// Documented in superclass.
TapRecognizer.prototype.reset = function () {
    GestureRecognizer.prototype.reset.call(this);

    this.taps = [];
    this.cancelFailAfterDelay();
};

// Documented in superclass.
TapRecognizer.prototype.mouseDown = function (event) {
    if (this.state != WorldWind.POSSIBLE) {
        return;
    }

    this.state = WorldWind.FAILED; // touch gestures fail upon receiving a mouse event
};

// Documented in superclass.
TapRecognizer.prototype.touchStart = function (touch) {
    if (this.state != WorldWind.POSSIBLE) {
        return;
    }

    var tap;

    if (this.touchCount > this.numberOfTouches) {
        this.state = WorldWind.FAILED;
    } else if (this.touchCount == 1) { // first touch started
        tap = {
            touchCount: this.touchCount,
            clientX: this.clientX,
            clientY: this.clientY
        };
        this.taps.push(tap);
        this.failAfterDelay(this.maxTapDuration); // fail if the tap is down too long
    } else {
        tap = this.taps[this.taps.length - 1];
        tap.touchCount = this.touchCount; // max number of simultaneous touches
        tap.clientX = this.clientX; // touch centroid
        tap.clientY = this.clientY;
    }
};

// Documented in superclass.
TapRecognizer.prototype.touchMove = function (touch) {
    if (this.state != WorldWind.POSSIBLE) {
        return;
    }

    var dx = this.translationX,
        dy = this.translationY,
        distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > this.maxTouchMovement) {
        this.state = WorldWind.FAILED;
    }
};

// Documented in superclass.
TapRecognizer.prototype.touchEnd = function (touch) {
    if (this.state != WorldWind.POSSIBLE) {
        return;
    }

    if (this.touchCount != 0) {
        return; // wait until the last touch ends
    }

    var tapCount = this.taps.length,
        tap = this.taps[tapCount - 1];
    if (tap.touchCount != this.numberOfTouches) {
        this.state = WorldWind.FAILED; // wrong number of touches
    } else if (tapCount == this.numberOfTaps) {
        this.clientX = this.taps[0].clientX;
        this.clientY = this.taps[0].clientY;
        this.state = WorldWind.RECOGNIZED;
    } else {
        this.failAfterDelay(this.maxTapInterval); // fail if the interval between taps is too long
    }
};

// Documented in superclass.
TapRecognizer.prototype.touchCancel = function (touch) {
    if (this.state != WorldWind.POSSIBLE) {
        return;
    }

    this.state = WorldWind.FAILED;
};

// Intentionally not documented.
TapRecognizer.prototype.failAfterDelay = function (delay) {
    var self = this;
    if (self.timeout) {
        window.clearTimeout(self.timeout);
    }

    self.timeout = window.setTimeout(function () {
        self.timeout = null;
        if (self.state == WorldWind.POSSIBLE) {
            self.state = WorldWind.FAILED; // fail if we haven't already reached a terminal state
        }
    }, delay);
};

// Intentionally not documented.
TapRecognizer.prototype.cancelFailAfterDelay = function () {
    var self = this;
    if (self.timeout) {
        window.clearTimeout(self.timeout);
        self.timeout = null;
    }
};

export default TapRecognizer;

