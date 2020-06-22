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
 * @exports WKTObject
 */
import Location from '../../../geom/Location';
import Position from '../../../geom/Position';
import WktElements from '../WktElements';
import WktType from '../WktType';
    /**
     * THis shouldn't be initiated from outside. It is only for internal use. Every other WKT Objects are themselves
     * WktObject
     * @alias WktObject
     * @param type {String} Textual representation of the type of current object.
     * @constructor
     */
    var WktObject = function (type) {
        /**
         * Type of this object.
         * @type {WKTType}
         */
        this.type = type;

        /**
         * It is possible for the WKT object to be displayed not in 2D but in 3D.
         * @type {Boolean}
         * @private
         */
        this._is3d = false;

        /**
         * It is possible for the WKT object to be referenced using Linear referencing system. This is flag for it.
         * @type {boolean}
         * @private
         */
        this._isLrs = false;

        /**
         *
         * @type {Position[]|Location[]}
         */
        this.coordinates = [];

        /**
         * Options contains information relevant for parsing of this specific Object. Basically processed tokens, parsed
         * coordinates and amounts of parntheses used to find out whether the object was already finished.
         * @type {{coordinates: Array, leftParenthesis: number, rightParenthesis: number, tokens: Array}}
         */
        this.options = {
            coordinates: [],
            leftParenthesis: 0,
            rightParenthesis: 0,
            tokens: []
        };
    };

    /**
     * It sets the information that this object is actually represented in 3D
     */
    WktObject.prototype.set3d = function () {
        this._is3d = true;
    };

    /**
     * It sets the information that the object contain information about LRS offset.
     */
    WktObject.prototype.setLrs = function () {
        this._isLrs = true;
    };

    /**
     * Array containing latitude, longitude and potentially either altitude or LRS.
     * @coordinates {Number[]} Array containing longitude, latitude and potentially altitude of another point in the
     *  object.
     */
    WktObject.prototype.addCoordinates = function (coordinates) {
        if (this._is3d) {
            this.coordinates.push(new Position(coordinates[1], coordinates[0], coordinates[2] || 0));
        } else {
            this.coordinates.push(new Location(coordinates[1], coordinates[0]));
        }
    };

    /**
     * It is used to retrieve and create the shape or shapes associated.
     * @returns {Renderable[]} Array of renderables associated with given shape.
     */
    WktObject.prototype.shapes = function() {
        return [];
    };

    /**
     * Token handling is delegated to the objects.
     * @param token {Object} It contains type and value.
     */
    WktObject.prototype.handleToken = function(token) {
        var value = token.value;
        var options = this.options;
        if (token.type === WktType.TokenType.TEXT) {
            // In this part retain only the information about new Object?
            this.text(options, value);
        } else if (token.type === WktType.TokenType.LEFT_PARENTHESIS) {
            this.leftParenthesis(options);
        } else if (token.type === WktType.TokenType.RIGHT_PARENTHESIS) {
            this.rightParenthesis(options);
        } else if (token.type === WktType.TokenType.NUMBER) {
            this.number(options, value);
        } else if (token.type === WktType.TokenType.COMMA) {
            this.comma(options);
        }
        options.tokens.push(token);
    };

    /**
     * There are basically three types of tokens in the Text line. The name of the type for the next shape, Empty
     * representing the empty shape and M or Z or MZ expressing whether it is in 3D or whether Linear Referencing System
     * should be used.
     * @private
     * @param options {Object} Options specifying current status of the implementation
     * @param options.coordinates {Number[]} Passed in coordinates
     * @param options.leftParenthesis {Number} Amount of the left parenthesis
     * @param options.rightParenthesis {Number} Amount of the right parenthesis
     * @param options.tokens {Object[]} Processed tokens.
     * @param value {String} Value to use for distinguishing among options.
     */
    WktObject.prototype.text = function(options, value) {
        value = value.toUpperCase();
        var started = null;
        if (value.length <= 2) {
            this.setOptions(value, this);
        } else if (value.indexOf('EMPTY') === 0) {
            options.leftParenthesis = 1;
            options.rightParenthesis = 1;
        } else {
            var founded = value.match('[M]?[Z]?$');

            if(founded && founded.length > 0 && founded[0] != '') {
                this.setOptions(founded, started);
            }

            // Handle the GeometryCollection.
            var currentObject = WktElements[value] && new WktElements[value]();
            if(!currentObject) {
                currentObject = new WktObject();
            }

            if(founded && founded.length > 0 && founded[0] != '') {
                currentObject.setOptions(founded[0], currentObject);
            }
            this.add(currentObject);
        }
    };

    /**
     * Right parenthesis either end coordinates for an object or ends current shape.
     * @private
     * @param options {Object} Options specifying current status of the implementation
     * @param options.coordinates {Number[]} Passed in coordinates
     * @param options.leftParenthesis {Number} Amount of the left parenthesis
     * @param options.rightParenthesis {Number} Amount of the right parenthesis
     * @param options.tokens {Object[]} Processed tokens.
     */
    WktObject.prototype.rightParenthesis = function(options) {
        options.rightParenthesis++;

        if (options.coordinates) {
            this.addCoordinates(options.coordinates);
            options.coordinates = null;
        }
    };

    /**
     * Mainly to be used in specific subclasses.
     * @private
     * @param options {Object} Options specifying current status of the implementation
     * @param options.coordinates {Number[]} Passed in coordinates
     * @param options.leftParenthesis {Number} Amount of the left parenthesis
     * @param options.rightParenthesis {Number} Amount of the right parenthesis
     * @param options.tokens {Object[]} Processed tokens.
     */
    WktObject.prototype.leftParenthesis = function(options) {
        options.leftParenthesis++;
    };

    /**
     * Comma either means another set of coordinates, or for certain shapes for example another shape or just another
     * boundary
     * @private
     * @param options {Object} Options specifying current status of the implementation
     * @param options.coordinates {Number[]} Passed in coordinates
     * @param options.leftParenthesis {Number} Amount of the left parenthesis
     * @param options.rightParenthesis {Number} Amount of the right parenthesis
     * @param options.tokens {Object[]} Processed tokens.
     */
    WktObject.prototype.comma = function(options) {
        if (!options.coordinates) {
            this.commaWithoutCoordinates(options);
        } else {
            this.addCoordinates(options.coordinates);
            options.coordinates = null;
        }
    };

    /**
     * Used by Multi objects to delineate the internal objects. This is default implementation doing nothing.
     * @protected
     * @param options {Object} Options specifying current status of the implementation
     * @param options.coordinates {Number[]} Passed in coordinates
     * @param options.leftParenthesis {Number} Amount of the left parenthesis
     * @param options.rightParenthesis {Number} Amount of the right parenthesis
     * @param options.tokens {Object[]} Processed tokens.
     */
    WktObject.prototype.commaWithoutCoordinates = function(options){};

    /**
     * Handle Number by adding it among coordinates in the current object.
     * @private
     * @param options {Object} Options specifying current status of the implementation
     * @param options.coordinates {Number[]} Passed in coordinates
     * @param options.leftParenthesis {Number} Amount of the left parenthesis
     * @param options.rightParenthesis {Number} Amount of the right parenthesis
     * @param options.tokens {Object[]} Processed tokens.
     * @param value {Number}
     */
    WktObject.prototype.number = function(options, value) {
        options.coordinates = options.coordinates || [];
        options.coordinates.push(value);
    };

    /**
     * It sets the options of the current object. This means setting up the 3D and the linear space.
     * @param text {String} Specific text used as options.
     * @param currentObject {WktObject} Object to apply the options to.
     */
    WktObject.prototype.setOptions = function(text, currentObject) {
        if (text == 'Z') {
            currentObject.set3d();
        } else if (text == 'M') {
            currentObject.setLrs();
        } else if (text == 'MZ') {
            currentObject.set3d();
            currentObject.setLrs();
        }
    };

    /**
     * It returns true when the object is finished.
     * @return {Boolean} True if the parentheses are closed, false otherwise
     */
    WktObject.prototype.isFinished = function() {
        return this.options.leftParenthesis === this.options.rightParenthesis && this.options.leftParenthesis > 0;
    };

    export default WktObject;
