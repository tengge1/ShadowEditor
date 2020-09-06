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
 * Constructs a layer.
 * @param {String} displayName the layer's displayName
 */
function Layer(displayName) {
    this.displayName = displayName ? displayName : "Layer";
    this.opacity = 1;
    this.time = new Date();
}

/**
 * Displays this layer.
 * @param {DrawContext} dc The current draw context.
 */
Layer.prototype.render = function (dc) {
    if (!this.isLayerInView(dc))
        return;

    this.doRender(dc);
};

/**
 * Subclass method called to display this layer.
 * @param {DrawContext} dc The current draw context.
 */
Layer.prototype.doRender = function (dc) {

};

/**
 * Indicates whether this layer is within the current view.
 * @param {DrawContext} dc The current draw context.
 * @returns {boolean} true If this layer is within the current view, otherwise false.
 */
Layer.prototype.isLayerInView = function (dc) {
    return true;
};

export default Layer;
