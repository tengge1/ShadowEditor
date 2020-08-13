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
 * @exports Color
 */
import Logger from '../util/Logger';


/**
 * Constructs a color from red, green, blue and alpha values.
 * @alias Color
 * @constructor
 * @classdesc Represents a red, green, blue, alpha, color.
 * @param {Number} red The red component, a number between 0 and 1.
 * @param {Number} green The green component, a number between 0 and 1.
 * @param {Number} blue The blue component, a number between 0 and 1.
 * @param {Number} alpha The alpha component, a number between 0 and 1.
 */
function Color(red, green, blue, alpha) {

    /**
     * This color's red component, a number between 0 and 1.
     * @type {Number}
     */
    this.red = red;

    /**
     * This color's green component, a number between 0 and 1.
     * @type {Number}
     */
    this.green = green;

    /**
     * This color's blue component, a number between 0 and 1.
     * @type {Number}
     */
    this.blue = blue;

    /**
     * This color's alpha component, a number between 0 and 1.
     * @type {Number}
     */
    this.alpha = alpha;
}

/**
 * The color white.
 * @type {Color}
 * @constant
 */
Color.WHITE = new Color(1, 1, 1, 1);

/**
 * The color black.
 * @type {Color}
 * @constant
 */
Color.BLACK = new Color(0, 0, 0, 1);

/**
 * The color red.
 * @type {Color}
 * @constant
 */
Color.RED = new Color(1, 0, 0, 1);

/**
 * The color green.
 * @type {Color}
 * @constant
 */
Color.GREEN = new Color(0, 1, 0, 1);

/**
 * The color blue.
 * @type {Color}
 * @constant
 */
Color.BLUE = new Color(0, 0, 1, 1);

/**
 * The color cyan.
 * @type {Color}
 * @constant
 */
Color.CYAN = new Color(0, 1, 1, 1);

/**
 * The color yellow.
 * @type {Color}
 * @constant
 */
Color.YELLOW = new Color(1, 1, 0, 1);

/**
 * The color magenta.
 * @type {Color}
 * @constant
 */
Color.MAGENTA = new Color(1, 0, 1, 1);

/**
 * A light gray (75% white).
 * @type {Color}
 */
Color.LIGHT_GRAY = new Color(0.75, 0.75, 0.75, 1);

/**
 * A medium gray (50% white).
 * @type {Color}
 */
Color.MEDIUM_GRAY = new Color(0.5, 0.5, 0.5, 1);

/**
 * A dark gray (25% white).
 * @type {Color}
 */
Color.DARK_GRAY = new Color(0.25, 0.25, 0.25, 1);

/**
 * A transparent color.
 * @type {Color}
 */
Color.TRANSPARENT = new Color(0, 0, 0, 0);

/**
 * Assigns the components of this color.
 * @param {Number} red The red component, a number between 0 and 1.
 * @param {Number} green The green component, a number between 0 and 1.
 * @param {Number} blue The blue component, a number between 0 and 1.
 * @param {Number} alpha The alpha component, a number between 0 and 1.
 * @returns {Color} This color with the specified components assigned.
 */
Color.prototype.set = function (red, green, blue, alpha) {
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.alpha = alpha;

    return this;
};

/**
 * Copies the components of a specified color to this color.
 * @param {Color} color The color to copy.
 * @returns {Color} This color set to the red, green, blue and alpha values of the specified color.
 * @throws {ArgumentError} If the specified color is null or undefined.
 */
Color.prototype.copy = function (color) {
    if (!color) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Color", "copy", "missingColor"));
    }

    this.red = color.red;
    this.green = color.green;
    this.blue = color.blue;
    this.alpha = color.alpha;

    return this;
};

/**
 * Create a copy of this color.
 * @returns {Color} A new instance containing the color components of this color.
 */
Color.prototype.clone = function () {
    return new Color(this.red, this.green, this.blue, this.alpha);
};

/**
 * Returns this color's components premultiplied by this color's alpha component.
 * @param {Float32Array} array A pre-allocated array in which to return the color components.
 * @returns {Float32Array} This colors premultiplied components as an array, in the order RGBA.
 */
Color.prototype.premultipliedComponents = function (array) {
    var a = this.alpha;

    array[0] = this.red * a;
    array[1] = this.green * a;
    array[2] = this.blue * a;
    array[3] = a;

    return array;
};

/**
 * Construct a color from an array of color components expressed as byte values.
 * @param {Uint8Array} bytes A four-element array containing the red, green, blue and alpha color
 * components each in the range [0, 255];
 * @returns {Color} The constructed color.
 */
Color.colorFromByteArray = function (bytes) {
    return new Color(bytes[0] / 255, bytes[1] / 255, bytes[2] / 255, bytes[3] / 255);
};

/**
 * Construct a color from specified color components expressed as byte values.
 * @param {number} redByte The red component in the range [0, 255].
 * @param {number} greenByte The green component in the range [0, 255].
 * @param {number} blueByte The blue component in the range [0, 255].
 * @param {number} alphaByte The alpha component in the range [0, 255].
 * @returns {Color} The constructed color.
 */
Color.colorFromBytes = function (redByte, greenByte, blueByte, alphaByte) {
    return new Color(redByte / 255, greenByte / 255, blueByte / 255, alphaByte / 255);
};

Color.colorFromHex = function (color) {
    var red = parseInt(color.substring(0, 2), 16);
    var green = parseInt(color.substring(2, 4), 16);
    var blue = parseInt(color.substring(4, 6), 16);
    var alpha = parseInt(color.substring(6, 8), 16);
    return Color.colorFromBytes(red, green, blue, alpha);
};

Color.colorFromKmlHex = function (color) {
    var alpha = parseInt(color.substring(0, 2), 16);
    var blue = parseInt(color.substring(2, 4), 16);
    var green = parseInt(color.substring(4, 6), 16);
    var red = parseInt(color.substring(6, 8), 16);
    return Color.colorFromBytes(red, green, blue, alpha);
};

/**
 * Computes and sets this color to the next higher RBG color. If the color overflows, this color is set to
 * (1 / 255, 0, 0, *), where * indicates the current alpha value.
 * @returns {Color} This color, set to the next possible color.
 */
Color.prototype.nextColor = function () {
    var rb = Math.round(this.red * 255),
        gb = Math.round(this.green * 255),
        bb = Math.round(this.blue * 255);

    if (rb < 255) {
        this.red = (rb + 1) / 255;
    } else if (gb < 255) {
        this.red = 0;
        this.green = (gb + 1) / 255;
    } else if (bb < 255) {
        this.red = 0;
        this.green = 0;
        this.blue = (bb + 1) / 255;
    } else {
        this.red = 1 / 255;
        this.green = 0;
        this.blue = 0;
    }

    return this;
};

/**
 * Indicates whether this color is equal to a specified color after converting the floating-point component
 * values of each color to byte values.
 * @param {Color} color The color to test,
 * @returns {Boolean} true if the colors are equal, otherwise false.
 */
Color.prototype.equals = function (color) {
    var rbA = Math.round(this.red * 255),
        gbA = Math.round(this.green * 255),
        bbA = Math.round(this.blue * 255),
        abA = Math.round(this.alpha * 255),
        rbB = Math.round(color.red * 255),
        gbB = Math.round(color.green * 255),
        bbB = Math.round(color.blue * 255),
        abB = Math.round(color.alpha * 255);

    return rbA === rbB && gbA === gbB && bbA === bbB && abA === abB;
};

/**
 * Indicates whether this color is equal to another color expressed as an array of bytes.
 * @param {Uint8Array} bytes The red, green, blue and alpha color components.
 * @returns {Boolean} true if the colors are equal, otherwise false.
 */
Color.prototype.equalsBytes = function (bytes) {
    var rb = Math.round(this.red * 255),
        gb = Math.round(this.green * 255),
        bb = Math.round(this.blue * 255),
        ab = Math.round(this.alpha * 255);

    return rb === bytes[0] && gb === bytes[1] && bb === bytes[2] && ab === bytes[3];
};

/**
 * Returns a string representation of this color, indicating the byte values corresponding to this color's
 * floating-point component values.
 * @returns {String}
 */
Color.prototype.toByteString = function () {
    var rb = Math.round(this.red * 255),
        gb = Math.round(this.green * 255),
        bb = Math.round(this.blue * 255),
        ab = Math.round(this.alpha * 255);

    return "(" + rb + "," + gb + "," + bb + "," + ab + ")";
};

/**
 * Create a hex color string that CSS can use. Optionally, inhibit capturing alpha,
 * because some uses reject a four-component color specification.
 * @param {Boolean} isUsingAlpha Enable the use of an alpha component.
 * @returns {string} A color string suitable for CSS.
 * @deprecated since version 0.10.0, use toCssColorString for valid CSS color strings
 */
Color.prototype.toHexString = function (isUsingAlpha) {
    // Use Math.ceil() to get 0.75 to map to 0xc0. This is important if the display is dithering.
    var redHex = Math.ceil(this.red * 255).toString(16),
        greenHex = Math.ceil(this.green * 255).toString(16),
        blueHex = Math.ceil(this.blue * 255).toString(16),
        alphaHex = Math.ceil(this.alpha * 255).toString(16);

    var result = "#";
    result += redHex.length < 2 ? '0' + redHex : redHex;
    result += greenHex.length < 2 ? '0' + greenHex : greenHex;
    result += blueHex.length < 2 ? '0' + blueHex : blueHex;
    if (isUsingAlpha) {
        result += alphaHex.length < 2 ? '0' + alphaHex : alphaHex;
    }

    return result;
};

/**
 * Create a rgba color string that conforms to CSS Color Module Level 3 specification.
 * @returns {string} A color string suitable for CSS.
 */
Color.prototype.toCssColorString = function () {
    var red = Math.round(this.red * 255),
        green = Math.round(this.green * 255),
        blue = Math.round(this.blue * 255);

    // Per the CSS Color Module Level 3 specification, alpha is expressed as floating point value between 0 - 1
    return 'rgba(' + red + ', ' + green + ', ' + blue + ', ' + this.alpha + ')';
};

export default Color;

