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
 * @exports RenderableLayer
 */
import ArgumentError from '../error/ArgumentError';
import Layer from '../layer/Layer';
import Logger from '../util/Logger';
        

        /**
         * Constructs a layer that contains shapes and other renderables.
         * @alias RenderableLayer
         * @constructor
         * @augments Layer
         * @classdesc Provides a layer that contains shapes and other renderables.
         * @param {String} displayName This layer's display name.
         */
        var RenderableLayer = function (displayName) {
            Layer.call(this, displayName);

            /**
             * The array of renderables;
             * @type {Array}
             * @readonly
             */
            this.renderables = [];
        };

        RenderableLayer.prototype = Object.create(Layer.prototype);

        /**
         * Adds a renderable to this layer.
         * @param {Renderable} renderable The renderable to add.
         * @throws {ArgumentError} If the specified renderable is null or undefined.
         */
        RenderableLayer.prototype.addRenderable = function (renderable) {
            if (!renderable) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "RenderableLayer", "addRenderable",
                    "missingRenderable"));
            }

            this.renderables.push(renderable);
        };

        /**
         * Adds an array of renderables to this layer.
         * @param {Renderable[]} renderables The renderables to add.
         * @throws {ArgumentError} If the specified renderables array is null or undefined.
         */
        RenderableLayer.prototype.addRenderables = function (renderables) {
            if (!renderables) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "RenderableLayer", "addRenderables",
                    "The renderables array is null or undefined."));
            }

            for (var i = 0, len = renderables.length; i < len; i++) {
                this.addRenderable(renderables[i]);
            }
        };

        /**
         * Removes a renderable from this layer.
         * @param {Renderable} renderable The renderable to remove.
         */
        RenderableLayer.prototype.removeRenderable = function (renderable) {
            var index = this.renderables.indexOf(renderable);
            if (index >= 0) {
                this.renderables.splice(index, 1);
            }
        };

        /**
         * Removes all renderables from this layer. Does not call dispose on those renderables.
         */
        RenderableLayer.prototype.removeAllRenderables = function () {
            this.renderables = [];
        };

        // Documented in superclass.
        RenderableLayer.prototype.doRender = function (dc) {
            var numOrderedRenderablesAtStart = dc.orderedRenderables.length;

            for (var i = 0, len = this.renderables.length; i < len; i++) {
                try {
                    this.renderables[i].render(dc);
                } catch (e) {
                    Logger.logMessage(Logger.LEVEL_SEVERE, "RenderableLayer", "doRender",
                        "Error while rendering shape " + this.renderables[i].displayName + ".\n" + e.toString());
                    // Keep going. Render the rest of the shapes.
                }
            }

            if (dc.orderedRenderables.length > numOrderedRenderablesAtStart) {
                this.inCurrentFrame = true;
            }
        };

        export default RenderableLayer;
    