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
 * @exports Layer
 */

/**
 * Constructs a layer. This constructor is meant to be called by subclasses and not directly by an application.
 * @alias Layer
 * @constructor
 * @classdesc Provides an abstract base class for layer implementations. This class is not meant to be instantiated
 * directly.
 */
function Layer(displayName) {

    /**
     * This layer's display name.
     * @type {String}
     * @default "Layer"
     */
    this.displayName = displayName ? displayName : "Layer";

    /**
     * Indicates whether to display this layer.
     * @type {Boolean}
     * @default true
     */
    this.enabled = true;

    /**
     * Indicates whether this layer is pickable.
     * @type {Boolean}
     * @default true
     */
    this.pickEnabled = true;

    /**
     * This layer's opacity, which is combined with the opacity of shapes within layers.
     * Opacity is in the range [0, 1], with 1 indicating fully opaque.
     * @type {Number}
     * @default 1
     */
    this.opacity = 1;

    /**
     * The eye altitude above which this layer is displayed, in meters.
     * @type {Number}
     * @default -Number.MAX_VALUE (always displayed)
     */
    this.minActiveAltitude = -Number.MAX_VALUE;

    /**
     * The eye altitude below which this layer is displayed, in meters.
     * @type {Number}
     * @default Number.MAX_VALUE (always displayed)
     */
    this.maxActiveAltitude = Number.MAX_VALUE;

    /**
     * Indicates whether elements of this layer were drawn in the most recently generated frame.
     * @type {Boolean}
     * @readonly
     */
    this.inCurrentFrame = false;

    /**
     * The time to display. This property selects the layer contents that represents the specified time.
     * If null, layer-type dependent contents are displayed.
     * @type {Date}
     */
    this.time = null;
}

/**
 * Refreshes the data associated with this layer. The behavior of this function varies with the layer
 * type. For image layers, it causes the images to be re-retrieved from their origin.
 */
Layer.prototype.refresh = function () {
    // Default implementation does nothing.
};

/**
 * Displays this layer. Subclasses should generally not override this method but should instead override the
 * [doRender]{@link Layer#doRender} method. This method calls that method after verifying that the layer is
 * enabled, the eye point is within this layer's active altitudes and the layer is in view.
 * @param {DrawContext} dc The current draw context.
 */
Layer.prototype.render = function (dc) {
    this.inCurrentFrame = false;

    if (!this.enabled)
        return;

    if (dc.pickingMode && !this.pickEnabled)
        return;

    if (!this.withinActiveAltitudes(dc))
        return;

    if (!this.isLayerInView(dc))
        return;

    this.doRender(dc);
};

/**
 * Subclass method called to display this layer. Subclasses should implement this method rather than the
 * [render]{@link Layer#render} method, which determines enable, pick and active altitude status and does not
 * call this doRender method if the layer should not be displayed.
 * @param {DrawContext} dc The current draw context.
 * @protected
 */
Layer.prototype.doRender = function (dc) {
    // Default implementation does nothing.
};

/* INTENTIONALLY NOT DOCUMENTED
 * Indicates whether the current eye distance is within this layer's active-altitude range.
 * @param {DrawContext} dc The current draw context.
 * @returns {boolean} true If the eye distance is greater than or equal to this layer's minimum active
 * altitude and less than or equal to this layer's maximum active altitude, otherwise false.
 * @protected
 */
Layer.prototype.withinActiveAltitudes = function (dc) {
    var eyePosition = dc.eyePosition;
    if (!eyePosition)
        return false;

    return eyePosition.altitude >= this.minActiveAltitude && eyePosition.altitude <= this.maxActiveAltitude;
};

/**
 * Indicates whether this layer is within the current view. Subclasses may override this method and
 * when called determine whether the layer contents are visible in the current view frustum. The default
 * implementation always returns true.
 * @param {DrawContext} dc The current draw context.
 * @returns {boolean} true If this layer is within the current view, otherwise false.
 * @protected
 */
Layer.prototype.isLayerInView = function (dc) {
    return true; // default implementation always returns true
};

export default Layer;
