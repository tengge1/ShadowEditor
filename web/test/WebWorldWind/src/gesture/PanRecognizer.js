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
 * @exports PanRecognizer
 */
import GestureRecognizer from '../gesture/GestureRecognizer';


/**
 * Constructs a pan gesture recognizer.
 * @alias PanRecognizer
 * @constructor
 * @augments GestureRecognizer
 * @classdesc A concrete gesture recognizer subclass that looks for touch panning gestures.
 * @param {EventTarget} target The document element this gesture recognizer observes for mouse and touch events.
 * @param {Function} callback An optional function to call when this gesture is recognized. If non-null, the
 * function is called when this gesture is recognized, and is passed a single argument: this gesture recognizer,
 * e.g., <code>gestureCallback(recognizer)</code>.
 * @throws {ArgumentError} If the specified target is null or undefined.
 */
function PanRecognizer(target, callback) {
    GestureRecognizer.call(this, target, callback);

    /**
     *
     * @type {Number}
     */
    this.minNumberOfTouches = 1;

    /**
     *
     * @type {Number}
     */
    this.maxNumberOfTouches = Number.MAX_VALUE;

    // Intentionally not documented.
    this.interpretDistance = 20;
}

PanRecognizer.prototype = Object.create(GestureRecognizer.prototype);

// Documented in superclass.
PanRecognizer.prototype.mouseDown = function (event) {
    if (this.state == WorldWind.POSSIBLE) {
        this.state = WorldWind.FAILED; // touch gestures fail upon receiving a mouse event
    }
};

// Documented in superclass.
PanRecognizer.prototype.touchMove = function (touch) {
    if (this.state == WorldWind.POSSIBLE) {
        if (this.shouldInterpret()) {
            if (this.shouldRecognize()) {
                this.state = WorldWind.BEGAN;
            } else {
                this.state = WorldWind.FAILED;
            }
        }
    } else if (this.state == WorldWind.BEGAN || this.state == WorldWind.CHANGED) {
        this.state = WorldWind.CHANGED;
    }
};

// Documented in superclass.
PanRecognizer.prototype.touchEnd = function (touch) {
    if (this.touchCount == 0) { // last touch ended
        if (this.state == WorldWind.POSSIBLE) {
            this.state = WorldWind.FAILED;
        } else if (this.state == WorldWind.BEGAN || this.state == WorldWind.CHANGED) {
            this.state = WorldWind.ENDED;
        }
    }
};

// Documented in superclass.
PanRecognizer.prototype.touchCancel = function (touch) {
    if (this.touchCount == 0) { // last touch cancelled
        if (this.state == WorldWind.POSSIBLE) {
            this.state = WorldWind.FAILED;
        } else if (this.state == WorldWind.BEGAN || this.state == WorldWind.CHANGED) {
            this.state = WorldWind.CANCELLED;
        }
    }
};

// Documented in superclass.
PanRecognizer.prototype.prepareToRecognize = function () {
    // set translation to zero when the pan begins
    this.translationX = 0;
    this.translationY = 0;
};

/**
 *
 * @returns {boolean}
 * @protected
 */
PanRecognizer.prototype.shouldInterpret = function () {
    var dx = this.translationX,
        dy = this.translationY,
        distance = Math.sqrt(dx * dx + dy * dy);
    return distance > this.interpretDistance; // interpret touches when the touch centroid moves far enough
};

/**
 *
 * @returns {boolean}
 * @protected
 */
PanRecognizer.prototype.shouldRecognize = function () {
    var touchCount = this.touchCount;
    return touchCount != 0
        && touchCount >= this.minNumberOfTouches
        && touchCount <= this.maxNumberOfTouches;
};

export default PanRecognizer;

