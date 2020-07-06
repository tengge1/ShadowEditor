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
 * @exports Font
 */
import ArgumentError from '../error/ArgumentError';
import Color from '../util/Color';
import Logger from '../util/Logger';


/**
 * Construct a font descriptor. See the individual attribute descriptions below for possible parameter values.
 * @param {Number} size The size of font.
 * @param {String} style The style of the font.
 * @param {String} variant The variant of the font.
 * @param {String} weight The weight of the font.
 * @param {String} family The family of the font.
 * @param {String} horizontalAlignment The vertical alignment of the font.
 * @alias Font
 * @constructor
 * @classdesc Holds attributes controlling the style, size and other attributes of {@link Text} shapes and
 * the textual features of {@link Placemark} and other shapes. The values used for these attributes are those
 * defined by the [CSS Font property]{@link http://www.w3schools.com/cssref/pr_font_font.asp}.
 */
function Font(size, style, variant, weight, family, horizontalAlignment) {
    /*
     * All properties of Font are intended to be private and must be accessed via public getters and setters.
     */

    if (!size) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Font", "constructor",
            "missingSize"));
    }
    else if (size <= 0) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Font", "constructor",
            "invalidSize"));
    }
    else {
        this._size = size;
    }

    this.style = style || "normal";
    this.variant = variant || "normal";
    this.weight = weight || "normal";
    this.family = family || "sans-serif";
    this.horizontalAlignment = horizontalAlignment || "center";
}

Object.defineProperties(Font.prototype, {
    /**
     * The font size.
     * @memberof Font.prototype
     * @type Number
     */
    size: {
        get: function () {
            return this._size;
        },
        set: function (value) {
            this._fontString = null;
            this._size = value;
        }
    },
    /**
     * The font style.
     * See [CSS font-style]{@link http://www.w3schools.com/cssref/pr_font_font-style.asp} for defined values.
     * @memberof Font.prototype
     * @type {String}
     * @default "normal"
     */
    style: {
        get: function () {
            return this._style;
        },
        set: function (value) {
            this._fontString = null;
            this._style = value;
        }
    },
    /**
     * The font variant.
     * See [CSS font-variant]{@link http://www.w3schools.com/cssref/pr_font_font-variant.asp} for defined values.
     * @memberof Font.prototype
     * @type {String}
     * @default "normal"
     */
    variant: {
        get: function () {
            return this._variant;
        },
        set: function (value) {
            this._fontString = null;
            this._variant = value;
        }
    },
    /**
     * The font weight.
     * See [CSS font-weight]{@link http://www.w3schools.com/cssref/pr_font_weight.asp} for defined values.
     * @memberof Font.prototype
     * @type {String}
     * @default "normal"
     */
    weight: {
        get: function () {
            return this._weight;
        },
        set: function (value) {
            this._fontString = null;
            this._weight = value;
        }
    },
    /**
     * The font family.
     * See [CSS font-family]{@link http://www.w3schools.com/cssref/pr_font_font-family.asp} for defined values.
     * @memberof Font.prototype
     * @type {String}
     * @default "sans-serif"
     */
    family: {
        get: function () {
            return this._family;
        },
        set: function (value) {
            this._fontString = null;
            this._family = value;
        }
    },
    /**
     * The horizontal alignment of the font.
     * Recognized values are "left", "center" and "right".
     * @memberof Font.prototype
     * @type {String}
     * @default "center"
     */
    horizontalAlignment: {
        get: function () {
            return this._horizontalAlignment;
        },
        set: function (value) {
            this._toString = null;
            this._horizontalAlignment = value;
        }
    },

    /**
     * A string representing this font's style, weight, size and family properties, suitable for
     * passing directly to a 2D canvas context.
     * @memberof Font.prototype
     */
    fontString: {
        get: function () {
            if (!this._fontString) {
                this._fontString =
                    this._style + " " +
                    this.variant + " " +
                    this._weight + " " +
                    this._size.toString() + "px " +
                    this._family;
            }
            return this._fontString;
        }
    }
});

/**
 * Returns a string representation of this object.
 * @returns {String} A string representation of this object.
 */
Font.prototype.toString = function () {
    if (!this._toString || !this._fontString) {
        this._toString = this.fontString + " " + this.horizontalAlignment;
    }
    return this._toString;
};

export default Font;
