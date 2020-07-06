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
 * @exports PlacemarkAttributes
 */
import Color from '../util/Color';
import Font from '../util/Font';
import Offset from '../util/Offset';
import ShapeAttributes from '../shapes/ShapeAttributes';
import TextAttributes from '../shapes/TextAttributes';


/**
 * Constructs a placemark attributes bundle.
 * The defaults indicate a placemark displayed as a white 1x1 pixel square centered on the placemark's
 * geographic position.
 * @alias PlacemarkAttributes
 * @constructor
 * @classdesc Holds attributes applied to {@link Placemark} shapes.
 *
 * @param {PlacemarkAttributes} attributes Attributes to initialize this attributes instance to. May be null,
 * in which case the new instance contains default attributes.
 */
function PlacemarkAttributes(attributes) {
    // These are all documented with their property accessors below.
    this._imageColor = attributes ? attributes._imageColor.clone() : Color.WHITE.clone();
    this._imageOffset = attributes ? attributes._imageOffset
        : new Offset(WorldWind.OFFSET_FRACTION, 0.5, WorldWind.OFFSET_FRACTION, 0.5);
    this._imageScale = attributes ? attributes._imageScale : 1;
    this._imageSource = attributes ? attributes._imageSource : null;
    this._depthTest = attributes ? attributes._depthTest : true;
    this._labelAttributes = attributes ? attributes._labelAttributes : new TextAttributes(null);
    this._drawLeaderLine = attributes ? attributes._drawLeaderLine : false;
    this._leaderLineAttributes = attributes ? attributes._leaderLineAttributes : new ShapeAttributes(null);

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
PlacemarkAttributes.prototype.computeStateKey = function () {
    return "ic " + this._imageColor.toHexString(true)
        + " io " + this._imageOffset.toString()
        + " is " + this._imageScale
        + " ip " + this._imageSource
        + " dt " + this._depthTest
        + " la " + this._labelAttributes.stateKey
        + " dll " + this._drawLeaderLine
        + " lla " + this._leaderLineAttributes.stateKey;
};

Object.defineProperties(PlacemarkAttributes.prototype, {
    /**
     * A string identifying the state of this attributes object. The string encodes the current values of all
     * this object's properties. It's typically used to validate cached representations of shapes associated
     * with this attributes object.
     * @type {String}
     * @readonly
     * @memberof PlacemarkAttributes.prototype
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
     * The image color.
     * When this attribute bundle has a valid image path the placemark's image is composed with this image
     * color to achieve the final placemark color. Otherwise the placemark is drawn in this color. The color
     * white, the default, causes the image to be drawn in its native colors.
     * @type {Color}
     * @default White (1, 1, 1, 1)
     * @memberof PlacemarkAttributes.prototype
     */
    imageColor: {
        get: function () {
            return this._imageColor;
        },
        set: function (value) {
            this._imageColor = value;
            this.stateKeyInvalid = true;
        }
    },

    /**
     * Indicates the location within the placemark's image to align with the placemark's geographic position.
     * May be null, in which case the image's bottom-left corner is placed at the geographic position.
     * @type {Offset}
     * @default 0.5, 0.5, both fractional (Centers the image on the geographic position.)
     * @memberof PlacemarkAttributes.prototype
     */
    imageOffset: {
        get: function () {
            return this._imageOffset;
        },
        set: function (value) {
            this._imageOffset = value;
            this.stateKeyInvalid = true;
        }
    },

    /**
     * Indicates the amount to scale the placemark's image.
     * When this attribute bundle has a valid image path the scale is applied to the image's dimensions. Otherwise the
     * scale indicates the dimensions in pixels of a square drawn at the placemark's geographic position.
     * A scale of 0 causes the placemark to disappear; however, the placemark's label, if any, is still drawn.
     * @type {Number}
     * @default 1
     * @memberof PlacemarkAttributes.prototype
     */
    imageScale: {
        get: function () {
            return this._imageScale;
        },
        set: function (value) {
            this._imageScale = value;
            this.stateKeyInvalid = true;
        }
    },

    /**
     * The image source of the placemark's image. May be either a string giving the URL of the image, or an
     * {@link ImageSource} object identifying an Image created dynamically.
     * If null, the placemark is drawn as a square whose width and height are
     * the value of this attribute object's [imageScale]{@link PlacemarkAttributes#imageScale} property.
     * @type {String|ImageSource}
     * @default null
     * @memberof PlacemarkAttributes.prototype
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
     * Indicates whether the placemark should be depth-tested against other objects in the scene. If true,
     * the placemark may be occluded by terrain and other objects in certain viewing situations. If false,
     * the placemark will not be occluded by terrain and other objects. If this value is true, the placemark's
     * label, if any, has an independent depth-test control.
     * See [PlacemarkAttributes.labelAttributes]{@link PlacemarkAttributes#labelAttributes}
     * and [TextAttributes.depthTest]{@link TextAttributes#depthTest}.
     * @type {Boolean}
     * @default true
     * @memberof PlacemarkAttributes.prototype
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
     * Indicates the attributes to apply to the placemark's label, if any. If null, the placemark's label is
     * not drawn.
     * @type {TextAttributes}
     * @default The defaults of {@link TextAttributes}.
     * @memberof PlacemarkAttributes.prototype
     */
    labelAttributes: {
        get: function () {
            return this._labelAttributes;
        },
        set: function (value) {
            this._labelAttributes = value;
            this.stateKeyInvalid = true;
        }
    },

    /**
     * Indicates whether to draw a line from the placemark's geographic position to the ground.
     * @type {Boolean}
     * @default false
     * @memberof PlacemarkAttributes.prototype
     */
    drawLeaderLine: {
        get: function () {
            return this._drawLeaderLine;
        },
        set: function (value) {
            this._drawLeaderLine = value;
            this.stateKeyInvalid = true;
        }
    },

    /**
     * The attributes to apply to the leader line if it's drawn. If null, the placemark's leader line is
     * not drawn.
     * @type {ShapeAttributes}
     * @default The defaults of {@link ShapeAttributes}
     * @memberof PlacemarkAttributes.prototype
     */
    leaderLineAttributes: {
        get: function () {
            return this._leaderLineAttributes;
        },
        set: function (value) {
            this._leaderLineAttributes = value;
            this.stateKeyInvalid = true;
        }
    }
});

export default PlacemarkAttributes;
