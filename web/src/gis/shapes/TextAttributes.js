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
 * @exports TextAttributes
 */
import Color from '../util/Color';
import Font from '../util/Font';
import Offset from '../util/Offset';


/**
 * Constructs a text attributes bundle.
 * @alias TextAttributes
 * @constructor
 * @classdesc Holds attributes applied to [Text]{@link Text} shapes and [Placemark]{@link Placemark} labels.
 *
 * @param {TextAttributes} attributes Attributes to initialize this attributes instance to. May be null,
 * in which case the new instance contains default attributes.
 */
function TextAttributes(attributes) {
    this._color = attributes ? attributes._color.clone() : Color.WHITE.clone();
    this._font = attributes ? attributes._font : new Font(14);
    this._offset = attributes ? attributes._offset
        : new Offset(WorldWind.OFFSET_FRACTION, 0.5, WorldWind.OFFSET_FRACTION, 0.0);
    this._scale = attributes ? attributes._scale : 1;
    this._depthTest = attributes ? attributes._depthTest : false;
    this._enableOutline = attributes ? attributes._enableOutline : true;
    this._outlineWidth = attributes ? attributes._outlineWidth : 4;
    this._outlineColor = attributes ? attributes._outlineColor : new Color(0, 0, 0, 0.5);

    /**
     * Indicates whether this object's state key is invalid. Subclasses must set this value to true when their
     * attributes change. The state key will be automatically computed the next time it's requested. This flag
     * will be set to false when that occurs.
     * @type {boolean}
     * @protected
     */
    this.stateKeyInvalid = true;
}

/**
 * Computes the state key for this attributes object. Subclasses that define additional attributes must
 * override this method, call it from that method, and append the state of their attributes to its
 * return value.
 * @returns {String} The state key for this object.
 * @protected
 */
TextAttributes.prototype.computeStateKey = function () {
    return "c " + this._color.toHexString(true) +
        " f " + this._font.toString() +
        " o " + this._offset.toString() +
        " s " + this._scale +
        " dt " + this._depthTest +
        " eo " + this._enableOutline +
        " ow " + this._outlineWidth +
        " oc " + this._outlineColor.toHexString(true);
};

Object.defineProperties(TextAttributes.prototype, {
    /**
     * A string identifying the state of this attributes object. The string encodes the current values of all
     * this object's properties. It's typically used to validate cached representations of shapes associated
     * with this attributes object.
     * @type {String}
     * @readonly
     * @memberof TextAttributes.prototype
     */
    stateKey: {
        get: function () {
            if (this.stateKeyInvalid) {
                this._stateKey = this.computeStateKey();
                this.stateKeyInvalid = false;
            }
            return this._stateKey;
        }
    },

    /**
     * The text color.
     * @type {Color}
     * @default White (1, 1, 1, 1)
     * @memberof TextAttributes.prototype
     */
    color: {
        get: function () {
            return this._color;
        },
        set: function (value) {
            this._color = value;
            this.stateKeyInvalid = true;
        }
    },

    /**
     * The text size, face and other characteristics, as described in [Font]{@link Font}.
     * @type {Font}
     * @default Those of [Font]{@link Font}, but with a font size of 14.
     * @memberof TextAttributes.prototype
     */
    font: {
        get: function () {
            return this._font;
        },
        set: function (value) {
            this._font = value;
            this.stateKeyInvalid = true;
        }
    },

    /**
     * Indicates the location of the text relative to its specified position.
     * May be null, in which case the text's bottom-left corner is placed at the specified position.
     * @type {Offset}
     * @default 0.5, 0.0, both fractional (Places the text's horizontal center and vertical bottom at the
     * specified position.)
     * @memberof TextAttributes.prototype
     */
    offset: {
        get: function () {
            return this._offset;
        },
        set: function (value) {
            this._offset = value;
            this.stateKeyInvalid = true;
        }
    },

    /**
     * Indicates the amount to scale the text. A value of 0 makes the text disappear.
     * @type {Number}
     * @default 1.0
     * @memberof TextAttributes.prototype
     */
    scale: {
        get: function () {
            return this._scale;
        },
        set: function (value) {
            this._scale = value;
            this.stateKeyInvalid = true;
        }
    },

    /**
     * Indicates whether the text should be depth-tested against other objects in the scene. If true,
     * the text may be occluded by terrain and other objects in certain viewing situations. If false,
     * the text will not be occluded by terrain and other objects.
     * @type {Boolean}
     * @default false
     * @memberof TextAttributes.prototype
     */
    depthTest: {
        get: function () {
            return this._depthTest;
        },
        set: function (value) {
            this._depthTest = value;
            this.stateKeyInvalid = true;
        }
    },

    /**
     * Indicates if the text will feature an outline around its characters.
     * @type {Boolean}
     * @default true
     * @memberof TextAttributes.prototype
     */
    enableOutline: {
        get: function () {
            return this._enableOutline;
        },
        set: function (value) {
            this._enableOutline = value;
            this.stateKeyInvalid = true;
        }
    },

    /**
     * Indicates the text outline width (or thickness) in pixels.
     * @type {Number}
     * @default 4
     * @memberof TextAttributes.prototype
     */
    outlineWidth: {
        get: function () {
            return this._outlineWidth;
        },
        set: function (value) {
            this._outlineWidth = value;
            this.stateKeyInvalid = true;
        }
    },

    /**
     * The color of the outline.
     * @type {Color}
     * @default Half-transparent black (0, 0, 0, 0.5)
     * @memberof TextAttributes.prototype
     */
    outlineColor: {
        get: function () {
            return this._outlineColor;
        },
        set: function (value) {
            this._outlineColor = value;
            this.stateKeyInvalid = true;
        }
    }
});

export default TextAttributes;
