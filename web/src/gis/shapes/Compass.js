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
 * @exports Compass
 */
import ArgumentError from '../error/ArgumentError';
import Logger from '../util/Logger';
import Offset from '../util/Offset';
import ScreenImage from '../shapes/ScreenImage';


/**
 * Constructs a compass.
 * @alias Compass
 * @constructor
 * @augments ScreenImage
 * @classdesc Displays a compass image at a specified location in the WorldWindow. The compass image rotates
 * and tilts to reflect the current navigator's heading and tilt.
 * @param {Offset} screenOffset The offset indicating the image's placement on the screen. If null or undefined
 * the compass is placed at the upper-right corner of the WorldWindow.
 * Use [the image offset property]{@link ScreenImage#imageOffset} to position the image relative to the
 * screen point.
 * @param {String} imagePath The URL of the image to display. If null or undefined, a default compass image is used.
 */
function Compass(screenOffset, imagePath) {

    var sOffset = screenOffset ? screenOffset
        : new Offset(WorldWind.OFFSET_FRACTION, 1, WorldWind.OFFSET_FRACTION, 1), // upper-right placement
        iPath = imagePath ? imagePath : WorldWind.configuration.baseUrl + "images/notched-compass.png";

    ScreenImage.call(this, sOffset, iPath);

    // Must set the default image offset after calling the constructor above.

    if (!screenOffset) {
        // Align the upper right corner of the image with the screen point, and give the image some padding.
        this.imageOffset = new Offset(WorldWind.OFFSET_FRACTION, 1.1, WorldWind.OFFSET_FRACTION, 1.1);
    }

    /**
     * Specifies the size of the compass as a fraction of the WorldWindow width.
     * @type {number}
     * @default 0.15
     */
    this.size = 0.15;
}

Compass.prototype = Object.create(ScreenImage.prototype);

/**
 * Capture the navigator's heading and tilt and apply it to the compass' screen image.
 * @param {DrawContext} dc The current draw context.
 */
Compass.prototype.render = function (dc) {
    // Capture the navigator's heading and tilt and apply it to the compass' screen image.
    this.imageRotation = dc.navigator.heading;
    this.imageTilt = dc.navigator.tilt;

    var t = this.getActiveTexture(dc);
    if (t) {
        this.imageScale = this.size * dc.currentGlContext.drawingBufferWidth / t.imageWidth;
    }

    ScreenImage.prototype.render.call(this, dc);
};

export default Compass;
