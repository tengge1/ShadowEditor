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
 * @exports FrameStatisticsLayer
 */
import ArgumentError from '../error/ArgumentError';
import Color from '../util/Color';
import Font from '../util/Font';
import Layer from '../layer/Layer';
import Logger from '../util/Logger';
import Offset from '../util/Offset';
import ScreenText from '../shapes/ScreenText';
import TextAttributes from '../shapes/TextAttributes';
        

        /**
         * Constructs a layer that displays the current performance statistics.
         * @alias FrameStatisticsLayer
         * @constructor
         * @augments Layer
         * @classDesc Displays the current performance statistics, which are collected each frame in the WorldWindow's
         * {@link FrameStatistics}. A frame statics layer cannot be shared among WorldWindows. Each WorldWindow if it
         * is to have a frame statistics layer must have its own.
         * @param {WorldWindow} worldWindow The WorldWindow associated with this layer.
         * This layer may not be associated with more than one WorldWindow. Each WorldWindow must have it's own
         * instance of this layer if each window is to have a frame statistics display.
         * @throws {ArgumentError} If the specified WorldWindow is null or undefined.
         */
        var FrameStatisticsLayer = function (worldWindow) {
            if (!worldWindow) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "FrameStatisticsLayer", "constructor", "missingWorldWindow"));
            }

            Layer.call(this, "Frame Statistics");

            // No picking of this layer's screen elements.
            this.pickEnabled = false;

            var textAttributes = new TextAttributes(null);
            textAttributes.color = Color.GREEN;
            textAttributes.font = new Font(12);
            textAttributes.offset = new Offset(WorldWind.OFFSET_FRACTION, 0, WorldWind.OFFSET_FRACTION, 1);

            // Intentionally not documented.
            this.frameTime = new ScreenText(new Offset(WorldWind.OFFSET_PIXELS, 5, WorldWind.OFFSET_INSET_PIXELS, 5), " ");
            this.frameTime.attributes = textAttributes;

            // Intentionally not documented.
            this.frameRate = new ScreenText(new Offset(WorldWind.OFFSET_PIXELS, 5, WorldWind.OFFSET_INSET_PIXELS, 25), " ");
            this.frameRate.attributes = textAttributes;

            // Register a redraw callback on the WorldWindow.
            var thisLayer = this;

            function redrawCallback(worldWindow, stage) {
                thisLayer.handleRedraw(worldWindow, stage);
            }

            worldWindow.redrawCallbacks.push(redrawCallback);
        };

        FrameStatisticsLayer.prototype = Object.create(Layer.prototype);

        // Documented in superclass.
        FrameStatisticsLayer.prototype.doRender = function (dc) {
            this.frameRate.render(dc);
            this.frameTime.render(dc);
            this.inCurrentFrame = true;
        };

        // Intentionally not documented.
        FrameStatisticsLayer.prototype.handleRedraw = function (worldWindow, stage) {
            if (stage !== WorldWind.BEFORE_REDRAW) {
                return; // ignore after redraw events
            }

            var frameStats = worldWindow.frameStatistics;
            this.frameTime.text = "Frame time  " + frameStats.frameTimeAverage.toFixed(0) + " ms  (" + frameStats.frameTimeMin.toFixed(0) + " - " + frameStats.frameTimeMax.toFixed(0) + ")";
            this.frameRate.text = "Frame rate  " + frameStats.frameRateAverage.toFixed(0) + " fps";
        };

        export default FrameStatisticsLayer;
    