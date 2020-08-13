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
 * @exports Touch
 */



/**
 * Constructs a touch point.
 * @alias Touch
 * @constructor
 * @classdesc Represents a touch point.
 * @param {Color} identifier A number uniquely identifying the touch point
 * @param {Number} clientX The X coordinate of the touch point's location.
 * @param {Number} clientY The Y coordinate of the touch point's location.
 */
function Touch(identifier, clientX, clientY) {

    /**
     * A number uniquely identifying this touch point.
     * @type {Number}
     * @readonly
     */
    this.identifier = identifier;

    // Intentionally not documented.
    this._clientX = clientX;

    // Intentionally not documented.
    this._clientY = clientY;

    // Intentionally not documented.
    this._clientStartX = clientX;

    // Intentionally not documented.
    this._clientStartY = clientY;
}

Object.defineProperties(Touch.prototype, {
    /**
     * Indicates the X coordinate of this touch point's location.
     * @type {Number}
     * @memberof Touch.prototype
     */
    clientX: {
        get: function () {
            return this._clientX;
        },
        set: function (value) {
            this._clientX = value;
        }
    },

    /**
     * Indicates the Y coordinate of this touch point's location.
     * @type {Number}
     * @memberof Touch.prototype
     */
    clientY: {
        get: function () {
            return this._clientY;
        },
        set: function (value) {
            this._clientY = value;
        }
    },

    /**
     * Indicates this touch point's translation along the X axis since the touch started.
     * @type {Number}
     * @memberof Touch.prototype
     */
    translationX: {
        get: function () {
            return this._clientX - this._clientStartX;
        },
        set: function (value) {
            this._clientStartX = this._clientX - value;
        }
    },

    /**
     * Indicates this touch point's translation along the Y axis since the touch started.
     * @type {Number}
     * @memberof Touch.prototype
     */
    translationY: {
        get: function () {
            return this._clientY - this._clientStartY;
        },
        set: function (value) {
            this._clientStartY = this._clientY - value;
        }
    }
});

export default Touch;
