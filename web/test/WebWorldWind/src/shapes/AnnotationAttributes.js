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
import Color from '../util/Color';
import Font from '../util/Font';
import Insets from '../util/Insets';
import TextAttributes from '../shapes/TextAttributes';


/**
 * Constructs an annotation attributes bundle.
 * @alias AnnotationAttributes
 * @constructor
 * @classdesc Holds attributes applied to {@link Annotation} shapes.
 * @param {AnnotationAttributes} attributes Attributes to initialize this attributes instance to. May be null,
 * in which case the new instance contains default attributes.
 */
function AnnotationAttributes(attributes) {

    // These are all documented with their property accessors below.
    this._cornerRadius = attributes ? attributes._cornerRadius : 0;
    this._insets = attributes ? attributes._insets : new Insets(0, 0, 0, 0);
    this._backgroundColor = attributes ? attributes._backgroundColor.clone() : Color.WHITE.clone();
    this._leaderGapWidth = attributes ? attributes._leaderGapWidth : 40;
    this._leaderGapHeight = attributes ? attributes._leaderGapHeight : 30;
    this._opacity = attributes ? attributes._opacity : 1;
    this._scale = attributes ? attributes._scale : 1;
    this._drawLeader = attributes ? attributes._drawLeader : true;
    this._width = attributes ? attributes._width : 200;
    this._height = attributes ? attributes._height : 100;
    this._textAttributes = attributes ? attributes._textAttributes : this.createDefaultTextAttributes();

    /**
     * Indicates whether this object's state key is invalid. Subclasses must set this value to true when their
     * attributes change. The state key will be automatically computed the next time it's requested. This flag
     * will be set to false when that occurs.
     * @type {Boolean}
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
AnnotationAttributes.prototype.computeStateKey = function () {
    return "wi " + this._width
        + " he " + this._height
        + " cr " + this._cornerRadius
        + " in " + this._insets.toString()
        + " bg " + this.backgroundColor.toHexString(true)
        + " dl " + this.drawLeader
        + " lgw " + this.leaderGapWidth
        + " lgh " + this.leaderGapHeight
        + " op " + this.opacity
        + " ta " + this._textAttributes.stateKey
        + " sc " + this.scale;
};

// Internal use only. Intentionally not documented.
AnnotationAttributes.prototype.createDefaultTextAttributes = function () {
    var attributes = new TextAttributes(null);
    attributes.enableOutline = false; // Annotations display text without an outline by default
    return attributes;
};

Object.defineProperties(AnnotationAttributes.prototype, {

    /**
     * Indicates the width of the callout.
     * @type {Number}
     * @default 200
     * @memberof AnnotationAttributes.prototype
     */
    width: {
        get: function () {
            return this._width;
        },
        set: function (value) {
            this._width = value;
            this.stateKeyInvalid = true;
        }
    },

    /**
     * Indicates height of the callout.
     * @type {Number}
     * @default 100
     * @memberof AnnotationAttributes.prototype
     */
    height: {
        get: function () {
            return this._height;
        },
        set: function (value) {
            this._height = value;
            this.stateKeyInvalid = true;
        }
    },

    /**
     * Indicates the radius for the corners.
     * @type {Number}
     * @default 0
     * @memberof AnnotationAttributes.prototype
     */
    cornerRadius: {
        get: function () {
            return this._cornerRadius;
        },
        set: function (value) {
            this._cornerRadius = value;
            this.stateKeyInvalid = true;
        }
    },

    /**
     * Indicates the insets instance of this object.
     * Insets adjusts top, bottom, left, right padding for the text.
     * @type {Insets}
     * @default 0, 0, 0, 0
     * @memberof AnnotationAttributes.prototype
     */
    insets: {
        get: function () {
            return this._insets;
        },
        set: function (value) {
            this._insets = value;
            this.stateKeyInvalid = true;
        }
    },

    /**
     * Indicates the background color of the callout.
     * @type {Color}
     * @default White
     * @memberof AnnotationAttributes.prototype
     */
    backgroundColor: {
        get: function () {
            return this._backgroundColor;
        },
        set: function (value) {
            this._backgroundColor = value;
            this.stateKeyInvalid = true;
        }
    },


    /**
     * Indicates the attributes to apply to the annotation's text.
     * @type {TextAttributes}
     * @default The defaults of {@link TextAttributes}.
     * @memberof AnnotationAttributes.prototype
     */
    textAttributes: {
        get: function () {
            return this._textAttributes;
        },
        set: function (value) {
            this._textAttributes = value;
            this.stateKeyInvalid = true;
        }
    },

    /**
     * Indicates whether to draw a leader pointing to the annotation's geographic position.
     * @type {Boolean}
     * @default true
     * @memberof AnnotationAttributes.prototype
     */
    drawLeader: {
        get: function () {
            return this._drawLeader;
        },
        set: function (value) {
            this._drawLeader = value;
            this.stateKeyInvalid = true;
        }
    },

    /**
     * Indicates the gap width of the leader in pixels.
     * @type {Number}
     * @default 40
     * @memberof AnnotationAttributes.prototype
     */
    leaderGapWidth: {
        get: function () {
            return this._leaderGapWidth;
        },
        set: function (value) {
            this._leaderGapWidth = value;
            this.stateKeyInvalid = true;
        }
    },

    /**
     * Indicates the gap height of the leader in pixels.
     * @type {Number}
     * @default 30
     * @memberof AnnotationAttributes.prototype
     */
    leaderGapHeight: {
        get: function () {
            return this._leaderGapHeight;
        },
        set: function (value) {
            this._leaderGapHeight = value;
            this.stateKeyInvalid = true;
        }
    },

    /**
     * Indicates the opacity of the annotation.
     * The value ranges from 0 to 1.
     * Opacity affects both callout and text.
     * @type {Number}
     * @default 1
     * @memberof AnnotationAttributes.prototype
     */
    opacity: {
        get: function () {
            return this._opacity;
        },
        set: function (value) {
            this._opacity = value;
            this.stateKeyInvalid = true;
        }
    },

    /**
     * Indicates the scale multiplier.
     * @type {Number}
     * @default 1
     * @memberof AnnotationAttributes.prototype
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
     * A string identifying the state of this attributes object. The string encodes the current values of all
     * this object's properties. It's typically used to validate cached representations of shapes associated
     * with this attributes object.
     * @type {String}
     * @readonly
     * @memberof AnnotationAttributes.prototype
     */
    stateKey: {
        get: function () {
            if (this.stateKeyInvalid) {
                this._stateKey = this.computeStateKey();
                this.stateKeyInvalid = false;
            }
            return this._stateKey;
        }
    }
});

export default AnnotationAttributes;
