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
import WktElements from './WktElements';
import WktObject from './geom/WktObject';
import WktType from './WktType';
    /**
     * Tokenizer, which parses the source texts into the meaningful tokens and then transforms them to the objects.
     * Intended for the internal use only.
     * @private
     * @constructor
     * @alias WktTokens
     */
    var WktTokens = function (sourceText) {
        this.sourceText = sourceText;
    };

    /**
     * It returns correctly initialized objects. It is possible to retrieve relevant shapes from all WKT Objects.
     * @return {WKTObject[]}
     */
    WktTokens.prototype.objects = function () {
        var currentObject;
        var objects = [];

        this.tokenize(this.sourceText).forEach(function (token) {
            if(currentObject && currentObject.isFinished() || !currentObject) {
                // It represents new object.
                var value = token.value;
                var founded = value.match('[M]?[Z]?$');
                if(founded && founded.length > 0 && founded[0] != '') {
                    value = value.substring(0, value.length - founded.length);
                }

                currentObject = WktElements[value] && new WktElements[value]();
                if(!currentObject) {
                    currentObject = new WktObject();
                }

                if(founded && founded.length > 0 && founded[0] != '') {
                    currentObject.setOptions(founded[0], currentObject);
                }
                objects.push(currentObject);
            } else {
                currentObject.handleToken(token);
            }
        });

        return objects;
    };

    /**
     * It continues character by character through the string. The empty spaces works always as delimiter.
     * It begins with the information about the type. It is one of the WKT types with potential ending with M or Z
     * I have the complete tokens containing the basic information we need.
     * @private
     * @return {String[]}
     */
    WktTokens.prototype.tokenize = function (textToParse) {
        this.currentPosition = 0;

        var tokens = [];
        for (; this.currentPosition < textToParse.length; this.currentPosition++) {
            var c = textToParse.charAt(this.currentPosition);

            if (c == '(') {
                tokens.push({
                    type: WktType.TokenType.LEFT_PARENTHESIS
                });
            } else if (c == ',') {
                tokens.push({
                    type: WktType.TokenType.COMMA
                });
            } else if (c == ')') {
                tokens.push({
                    type: WktType.TokenType.RIGHT_PARENTHESIS
                });
            } else if (this.isAlpha(c)) {
                var text = this.readText(textToParse);
                tokens.push({
                    type: WktType.TokenType.TEXT,
                    value: text
                });
            } else if (this.isNumeric(c)) {
                var numeric = this.readNumeric(textToParse);
                tokens.push({
                    type: WktType.TokenType.NUMBER,
                    value: numeric
                });
            } else if (this.isWhiteSpace(c)) {
                continue;
            } else {
                throw new Error('Invalid character: {{', c, '}}');
            }
        }

        return tokens;
    };


    /**
     * It returns true if the character is letter, regardless of whether uppercase or lowercase.
     * @private
     * @param c {String} character to test
     * @return {boolean} True if it is lowercase or uppercase
     */
    WktTokens.prototype.isAlpha = function (c) {
        return c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z';
    };

    /**
     * It returns true if the character is part of the number. It has certain limitations such as -1- is considered as
     * a number
     * @private
     * @param c {String} character to test
     * @return {boolean} True if it is either Number or - or .
     */
    WktTokens.prototype.isNumeric = function (c) {
        return c >= '0' && c <= '9' || c == '.' || c == '-';
    };

    /**
     * It returns true if the character represents whitespace. It is mainly relevant as whitespaces are one of the
     * delimiters
     * @private
     * @param c {String} character to test
     * @return {boolean} True if it is any type of white space.
     */
    WktTokens.prototype.isWhiteSpace = function (c) {
        return c == ' ' || c == '\t' || c == '\r' || c == '\n';
    };

    /**
     * It returns the next chunk of the String, which represents the text. Non alpha characters end the text.
     * @private
     * @param textToParse {String} The text to use in parsing.
     * @return {string} The full chunk of text
     */
    WktTokens.prototype.readText = function (textToParse) {
        var text = '';
        while (this.isAlpha(textToParse.charAt(this.currentPosition))) {
            text += textToParse.charAt(this.currentPosition);
            this.currentPosition++;
        }
        this.currentPosition--;
        return text;
    };

    /**
     * It returns the next chunk of the String, which represents the number. Non numeric characters end the text.
     * @private
     * @param textToParse {String} The text to use in parsing.
     * @return {Number} The full chunk of number
     */
    WktTokens.prototype.readNumeric = function (textToParse) {
        var numeric = '';
        while (this.isNumeric(textToParse.charAt(this.currentPosition))) {
            numeric += textToParse.charAt(this.currentPosition);
            this.currentPosition++;
        }
        this.currentPosition--;
        return Number(numeric);
    };

    export default WktTokens;
