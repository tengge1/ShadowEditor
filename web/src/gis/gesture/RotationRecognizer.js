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
 * @exports RotationRecognizer
 */
import Angle from '../geom/Angle';
import GestureRecognizer from '../gesture/GestureRecognizer';


/**
 * Constructs a rotation gesture recognizer.
 * @alias RotationRecognizer
 * @constructor
 * @augments GestureRecognizer
 * @classdesc A concrete gesture recognizer subclass that looks for two finger rotation gestures.
 * @param {EventTarget} target The document element this gesture recognizer observes for mouse and touch events.
 * @param {Function} callback An optional function to call when this gesture is recognized. If non-null, the
 * function is called when this gesture is recognized, and is passed a single argument: this gesture recognizer,
 * e.g., <code>gestureCallback(recognizer)</code>.
 * @throws {ArgumentError} If the specified target is null or undefined.
 */
function RotationRecognizer(target, callback) {
    GestureRecognizer.call(this, target, callback);

    // Intentionally not documented.
    this._rotation = 0;

    // Intentionally not documented.
    this._offsetRotation = 0;

    // Intentionally not documented.
    this.referenceAngle = 0;

    // Intentionally not documented.
    this.interpretThreshold = 20;

    // Intentionally not documented.
    this.weight = 0.4;

    // Intentionally not documented.
    this.rotationTouches = [];
}

RotationRecognizer.prototype = Object.create(GestureRecognizer.prototype);

Object.defineProperties(RotationRecognizer.prototype, {
    rotation: {
        get: function () {
            return this._rotation + this._offsetRotation;
        }
    }
});

// Documented in superclass.
RotationRecognizer.prototype.reset = function () {
    GestureRecognizer.prototype.reset.call(this);

    this._rotation = 0;
    this._offsetRotation = 0;
    this.referenceAngle = 0;
    this.rotationTouches = [];
};

// Documented in superclass.
RotationRecognizer.prototype.mouseDown = function (event) {
    if (this.state == WorldWind.POSSIBLE) {
        this.state = WorldWind.FAILED; // touch gestures fail upon receiving a mouse event
    }
};

// Documented in superclass.
RotationRecognizer.prototype.touchStart = function (touch) {
    if (this.rotationTouches.length < 2) {
        if (this.rotationTouches.push(touch) == 2) {
            this.referenceAngle = this.currentTouchAngle();
            this._offsetRotation += this._rotation;
            this._rotation = 0;
        }
    }
};

// Documented in superclass.
RotationRecognizer.prototype.touchMove = function (touch) {
    if (this.rotationTouches.length == 2) {
        if (this.state == WorldWind.POSSIBLE) {
            if (this.shouldRecognize()) {
                this.state = WorldWind.BEGAN;
            }
        } else if (this.state == WorldWind.BEGAN || this.state == WorldWind.CHANGED) {
            var angle = this.currentTouchAngle(),
                newRotation = Angle.normalizedDegrees(angle - this.referenceAngle),
                w = this.weight;
            this._rotation = this._rotation * (1 - w) + newRotation * w;
            this.state = WorldWind.CHANGED;
        }
    }
};

// Documented in superclass.
RotationRecognizer.prototype.touchEnd = function (touch) {
    var index = this.rotationTouches.indexOf(touch);
    if (index != -1) {
        this.rotationTouches.splice(index, 1);
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
RotationRecognizer.prototype.touchCancel = function (touch) {
    var index = this.rotationTouches.indexOf(touch);
    if (index != -1) {
        this.rotationTouches.splice(index, 1);

        // Transition to the cancelled state if this was the last touch.
        if (this.touchCount == 0) {
            if (this.state == WorldWind.POSSIBLE) {
                this.state = WorldWind.FAILED;
            } else if (this.state == WorldWind.BEGAN || this.state == WorldWind.CHANGED) {
                this.state = WorldWind.CANCELLED;
            }
        }
    }
};

// Documented in superclass.
RotationRecognizer.prototype.prepareToRecognize = function () {
    this.referenceAngle = this.currentTouchAngle();
    this._rotation = 0;
};

// Intentionally not documented.
RotationRecognizer.prototype.shouldRecognize = function () {
    var angle = this.currentTouchAngle(),
        rotation = Angle.normalizedDegrees(angle - this.referenceAngle);

    return Math.abs(rotation) > this.interpretThreshold;
};

// Intentionally not documented.
RotationRecognizer.prototype.currentTouchAngle = function () {
    var touch0 = this.rotationTouches[0],
        touch1 = this.rotationTouches[1],
        dx = touch0.clientX - touch1.clientX,
        dy = touch0.clientY - touch1.clientY;

    return Math.atan2(dy, dx) * Angle.RADIANS_TO_DEGREES;
};

export default RotationRecognizer;

