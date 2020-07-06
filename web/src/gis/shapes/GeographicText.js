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
 * @exports GeographicText
 */
import ArgumentError from '../error/ArgumentError';
import Logger from '../util/Logger';
import Text from '../shapes/Text';
import Vec3 from '../geom/Vec3';


/**
 * Constructs a geographic text shape at a specified position.
 * @alias GeographicText
 * @constructor
 * @augments Text
 * @classdesc Represents a string of text displayed at a geographic position.
 * <p>
 * See also {@link ScreenText}.
 *
 * @param {Position} position The text's geographic position.
 * @param {String} text The text to display.
 * @throws {ArgumentError} If either the specified position or text is null or undefined.
 */
function GeographicText(position, text) {
    if (!position) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Text", "constructor", "missingPosition"));
    }

    Text.call(this, text);

    /**
     * This text's geographic position.
     * The [TextAttributes.offset]{@link TextAttributes#offset} property indicates the relationship of the
     * text string to this position.
     * @type {Position}
     */
    this.position = position;

    /**
     * Indicates the group ID of the declutter group to include this Text shape. This shape
     * is decluttered relative to all other shapes within its group by the default
     * [declutter filter]{@link WorldWindow#declutter}. To prevent decluttering of this shape, set its
     * declutter group to 0.
     * @type {Number}
     * @default 1
     */
    this.declutterGroup = 1;
}

// Internal use only. Intentionally not documented.
GeographicText.placePoint = new Vec3(0, 0, 0); // Cartesian point corresponding to this placemark's geographic position

GeographicText.prototype = Object.create(Text.prototype);

/**
 * Creates a new geographic text object that is a copy of this one.
 * @returns {GeographicText} The new geographic text object.
 */
GeographicText.prototype.clone = function () {
    var clone = new GeographicText(this.position, this.text);

    clone.copy(this);
    clone.pickDelegate = this.pickDelegate ? this.pickDelegate : this;

    return clone;
};

// Documented in superclass.
GeographicText.prototype.render = function (dc) {
    // Filter out instances outside any projection limits.
    if (dc.globe.projectionLimits
        && !dc.globe.projectionLimits.containsLocation(this.position.latitude, this.position.longitude)) {
        return;
    }

    Text.prototype.render.call(this, dc);
};

// Documented in superclass.
GeographicText.prototype.computeScreenPointAndEyeDistance = function (dc) {
    // Compute the text's model point and corresponding distance to the eye point.
    dc.surfacePointForMode(this.position.latitude, this.position.longitude, this.position.altitude,
        this.altitudeMode, GeographicText.placePoint);

    if (!dc.frustumInModelCoordinates.containsPoint(GeographicText.placePoint)) {
        return false;
    }

    this.eyeDistance = this.alwaysOnTop ? 0 : dc.eyePoint.distanceTo(GeographicText.placePoint);

    // Compute the text's screen point in the OpenGL coordinate system of the WorldWindow by projecting its model
    // coordinate point onto the viewport. Apply a depth offset in order to cause the text to appear above nearby
    // terrain. When text is displayed near the terrain portions of its geometry are often behind the terrain,
    // yet as a screen element the text is expected to be visible. We adjust its depth values rather than moving
    // the text itself to avoid obscuring its actual position.
    if (!dc.projectWithDepth(GeographicText.placePoint, this.depthOffset, this.screenPoint)) {
        return false;
    }

    return true;
};

export default GeographicText;
