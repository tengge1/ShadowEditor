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
 * @exports ScreenText
 */
import ArgumentError from '../error/ArgumentError';
import Logger from '../util/Logger';
import Offset from '../util/Offset';
import Text from '../shapes/Text';


/**
 * Constructs a screen text shape at a specified screen location.
 * @alias ScreenText
 * @constructor
 * @augments Text
 * @classdesc Represents a string of text displayed at a screen location.
 * <p>
 * See also {@link GeographicText}.
 *
 * @param {Offset} screenOffset The offset indicating the text's placement on the screen.
 * Use [TextAttributes.offset]{@link TextAttributes#offset} to position the text relative to the specified
 * screen offset.
 * @param {String} text The text to display.
 * @throws {ArgumentError} If either the specified screen offset or text is null or undefined.
 */
function ScreenText(screenOffset, text) {
    if (!screenOffset) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Text", "constructor", "missingOffset"));
    }

    Text.call(this, text);

    /**
     * The offset indicating this text's placement on the screen.
     * The [TextAttributes.offset]{@link TextAttributes#offset} property indicates the relationship of the text
     * string to this location.
     * @type {Offset}
     */
    this.screenOffset = screenOffset;

    /**
     * Inherited from [Text]{@link Text#altitudeMode} but not utilized by screen text.
     */
    this.altitudeMode = null;
}

ScreenText.prototype = Object.create(Text.prototype);

// Documented in superclass.
ScreenText.prototype.render = function (dc) {
    // Ensure that this text is drawn only once per frame.
    if (this.lastFrameTime !== dc.timestamp) {
        Text.prototype.render.call(this, dc);
    }
};

// Documented in superclass.
ScreenText.prototype.computeScreenPointAndEyeDistance = function (dc) {
    var gl = dc.currentGlContext,
        offset = this.screenOffset.offsetForSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    this.screenPoint[0] = offset[0];
    this.screenPoint[1] = offset[1];
    this.screenPoint[2] = 0;

    this.eyeDistance = 0;

    return true;
};

export default ScreenText;
