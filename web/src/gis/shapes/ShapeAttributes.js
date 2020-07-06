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
 * @exports ShapeAttributes
 */
import Color from '../util/Color';
import ImageSource from '../util/ImageSource';


/**
 * Constructs a shape attributes bundle, optionally specifying a prototype set of attributes. Not all shapes
 * use all the properties in the bundle. See the documentation of a specific shape to determine the properties
 * it does use.
 * @alias ShapeAttributes
 * @constructor
 * @classdesc Holds attributes applied to WorldWind shapes.
 * @param {ShapeAttributes} attributes An attribute bundle whose properties are used to initially populate
 * the constructed attributes bundle. May be null, in which case the constructed attributes bundle is populated
 * with default attributes.
 */
function ShapeAttributes(attributes) {

    // All these are documented with their property accessors below.
    this._drawInterior = attributes ? attributes._drawInterior : true;
    this._drawOutline = attributes ? attributes._drawOutline : true;
    this._enableLighting = attributes ? attributes._enableLighting : false;
    this._interiorColor = attributes ? attributes._interiorColor.clone() : Color.WHITE.clone();
    this._outlineColor = attributes ? attributes._outlineColor.clone() : Color.RED.clone();
    this._outlineWidth = attributes ? attributes._outlineWidth : 1.0;
    this._outlineStippleFactor = attributes ? attributes._outlineStippleFactor : 0;
    this._outlineStipplePattern = attributes ? attributes._outlineStipplePattern : 0xF0F0;
    this._imageSource = attributes ? attributes._imageSource : null;
    this._depthTest = attributes ? attributes._depthTest : true;
    this._drawVerticals = attributes ? attributes._drawVerticals : false;
    this._applyLighting = attributes ? attributes._applyLighting : false;

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
ShapeAttributes.prototype.computeStateKey = function () {
    return "di " + this._drawInterior +
        " do " + this._drawOutline +
        " el " + this._enableLighting +
        " ic " + this._interiorColor.toHexString(true) +
        " oc " + this._outlineColor.toHexString(true) +
        " ow " + this._outlineWidth +
        " osf " + this._outlineStippleFactor +
        " osp " + this._outlineStipplePattern +
        " is " + (this._imageSource ?
            this.imageSource instanceof ImageSource ? this.imageSource.key : this.imageSource : "null") +
        " dt " + this._depthTest +
        " dv " + this._drawVerticals +
        " li " + this._applyLighting;
};

Object.defineProperties(ShapeAttributes.prototype, {
    /**
     * A string identifying the state of this attributes object. The string encodes the current values of all
     * this object's properties. It's typically used to validate cached representations of shapes associated
     * with this attributes object.
     * @type {String}
     * @readonly
     * @memberof ShapeAttributes.prototype
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
     * Indicates whether the interior of the associated shape is drawn.
     * @type {Boolean}
     * @default true
     * @memberof ShapeAttributes.prototype
     */
    drawInterior: {
        get: function () {
            return this._drawInterior;
        },
        set: function (value) {
            this._drawInterior = value;
            this.stateKeyInvalid = true;
        }
    },

    /**
     * Indicates whether the outline of the associated shape is drawn
     * @type {Boolean}
     * @default true
     * @memberof ShapeAttributes.prototype
     */
    drawOutline: {
        get: function () {
            return this._drawOutline;
        },
        set: function (value) {
            this._drawOutline = value;
            this.stateKeyInvalid = true;
        }
    },

    /**
     * Indicates whether lighting is applied to the associated shape.
     * @type {Boolean}
     * @default false
     * @memberof ShapeAttributes.prototype
     */
    enableLighting: {
        get: function () {
            return this._enableLighting;
        },
        set: function (value) {
            this._enableLighting = value;
            this.stateKeyInvalid = true;
        }
    },

    /**
     * Indicates the associated shape's interior color and opacity.
     * @type {Color}
     * @default Opaque white (red = 1, green = 1, blue = 1, alpha = 1)
     * @memberof ShapeAttributes.prototype
     */
    interiorColor: {
        get: function () {
            return this._interiorColor;
        },
        set: function (value) {
            this._interiorColor = value;
            this.stateKeyInvalid = true;
        }
    },

    /**
     * Indicates the associated shape's outline color and opacity.
     * @type {Color}
     * @default Opaque red (red = 1, green = 0, blue = 0, alpha = 1)
     * @memberof ShapeAttributes.prototype
     */
    outlineColor: {
        get: function () {
            return this._outlineColor;
        },
        set: function (value) {
            this._outlineColor = value;
            this.stateKeyInvalid = true;
        }
    },

    /**
     * Indicates the associated shape's outline width.
     * @type {Number}
     * @default 1.0
     * @memberof ShapeAttributes.prototype
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
     * Indicates the associated shape's outline stipple pattern. Specifies a number whose lower 16 bits
     * define a pattern of which pixels in the outline are rendered and which are suppressed. Each bit
     * corresponds to a pixel in the shape's outline, and the pattern repeats after every n*16 pixels, where
     * n is the [stipple factor]{@link ShapeAttributes#outlineStippleFactor}. For example, if the outline
     * stipple factor is 3, each bit in the stipple pattern is repeated three times before using the next bit.
     * <p>
     * To disable outline stippling, either specify a stipple factor of 0 or specify a stipple pattern of
     * all 1 bits, i.e., 0xFFFF.
     * @type {Number}
     * @default 0xF0F0
     * @memberof ShapeAttributes.prototype
     */
    outlineStipplePattern: {
        get: function () {
            return this._outlineStipplePattern;
        },
        set: function (value) {
            this._outlineStipplePattern = value;
            this.stateKeyInvalid = true;
        }
    },

    /**
     * Indicates the associated shape's outline stipple factor. Specifies the number of times each bit in the
     * outline stipple pattern is repeated before the next bit is used. For example, if the outline stipple
     * factor is 3, each bit is repeated three times before using the next bit. The specified factor must be
     * either 0 or an integer greater than 0. A stipple factor of 0 indicates no stippling.
     * @type {Number}
     * @default 0
     * @memberof ShapeAttributes.prototype
     */
    outlineStippleFactor: {
        get: function () {
            return this._outlineStippleFactor;
        },
        set: function (value) {
            this._outlineStippleFactor = value;
            this.stateKeyInvalid = true;
        }
    },

    /**
     * Indicates the associated shape's image source. May be null, in which case no image is
     * applied to the shape.
     * @type {String|ImageSource}
     * @memberof ShapeAttributes.prototype
     * @default null
     */
    imageSource: {
        get: function () {
            return this._imageSource;
        },
        set: function (value) {
            this._imageSource = value;
            this.stateKeyInvalid = true;
        }
    },

    /**
     * Indicates whether the shape should be depth-tested against other objects in the scene. If true,
     * the shape may be occluded by terrain and other objects in certain viewing situations. If false,
     * the shape will not be occluded by terrain and other objects.
     * @type {Boolean}
     * @default true
     * @memberof ShapeAttributes.prototype
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
     * Indicates whether this shape should draw vertical lines extending from its specified positions to the
     * ground.
     * @type {Boolean}
     * @default false
     * @memberof ShapeAttributes.prototype
     */
    drawVerticals: {
        get: function () {
            return this._drawVerticals;
        },
        set: function (value) {
            this._drawVerticals = value;
            this.stateKeyInvalid = true;
        }
    },

    /**
     * Indicates whether lighting is applied to the shape.
     * @type {Boolean}
     * @default false
     * @memberof ShapeAttributes.prototype
     */
    applyLighting: {
        get: function () {
            return this._applyLighting;
        },
        set: function (value) {
            this._applyLighting = value;
            this.stateKeyInvalid = true;
        }
    }
});

export default ShapeAttributes;
