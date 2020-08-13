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
 * @exports ScreenCreditController
 */
import ArgumentError from '../error/ArgumentError';
import Color from '../util/Color';
import Font from '../util/Font';
import Layer from '../layer/Layer';
import Logger from '../util/Logger';
import Offset from '../util/Offset';
import ScreenText from '../shapes/ScreenText';


/**
 * Constructs a screen credit controller.
 * @alias ScreenCreditController
 * @constructor
 * @augments Layer
 * @classdesc Collects and displays screen credits.
 */
function ScreenCreditController() {
    Layer.call(this, "ScreenCreditController");

    /**
     * An {@link Offset} indicating where to place the attributions on the screen.
     * @type {Offset}
     * @default The lower left corner of the window with an 11px left margin and a 2px bottom margin.
     */
    this.creditPlacement = new Offset(WorldWind.OFFSET_PIXELS, 11, WorldWind.OFFSET_PIXELS, 2);

    /**
     * The amount of horizontal spacing between adjacent attributions.
     * @type {number}
     * @default An 11px margin between attributions.
     */
    this.creditMargin = 11;

    // Apply 50% opacity to all shapes rendered by this layer.
    this.opacity = 0.5;

    // Internal. Intentionally not documented.
    this.credits = [];
}

ScreenCreditController.prototype = Object.create(Layer.prototype);

/**
 * Clears all credits from this controller.
 */
ScreenCreditController.prototype.clear = function () {
    this.credits = [];
};

/**
 * Adds a credit to this controller.
 * @param {String} creditString The text to display in the credits area.
 * @param {Color} color The color with which to draw the string.
 * @param {String} hyperlinkUrl Optional argument if screen credit is intended to work as a hyperlink.
 * @throws {ArgumentError} If either the specified string or color is null or undefined.
 */
ScreenCreditController.prototype.addCredit = function (creditString, color, hyperlinkUrl) {
    if (!creditString) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "ScreenCreditController", "addCredit", "missingText"));
    }

    if (!color) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "ScreenCreditController", "addCredit", "missingColor"));
    }

    // Verify if text credit is not already in controller, if it is, don't add it.
    for (var i = 0, len = this.credits.length; i < len; i++) {
        if (this.credits[i].text === creditString) {
            return;
        }
    }

    var credit = new ScreenText(new Offset(WorldWind.OFFSET_PIXELS, 0, WorldWind.OFFSET_PIXELS, 0), creditString);
    credit.attributes.font = new Font(10);
    credit.attributes.color = color;
    credit.attributes.enableOutline = false;
    credit.attributes.offset = new Offset(WorldWind.OFFSET_FRACTION, 0, WorldWind.OFFSET_FRACTION, 0);

    // Append new user property to store URL for hyperlinking.
    // (See BasicWorldWindowController.handleClickOrTap).
    if (hyperlinkUrl) {
        credit.userProperties.url = hyperlinkUrl;
    }

    this.credits.push(credit);
};

// Internal use only. Intentionally not documented.
ScreenCreditController.prototype.doRender = function (dc) {
    var point = this.creditPlacement.offsetForSize(dc.viewport.width, dc.viewport.height);

    for (var i = 0, len = this.credits.length; i < len; i++) {
        // Place the credit text on screen and render it.
        this.credits[i].screenOffset.x = point[0];
        this.credits[i].screenOffset.y = point[1];
        this.credits[i].render(dc);

        // Advance the screen position for the next credit.
        dc.textRenderer.typeFace = this.credits[i].attributes.font;
        dc.textRenderer.outlineWidth = this.credits[i].attributes.outlineWidth;
        dc.textRenderer.enableOutline = this.credits[i].attributes.enableOutline;
        point[0] += dc.textRenderer.textSize(this.credits[i].text)[0];
        point[0] += this.creditMargin;
    }
};

export default ScreenCreditController;
