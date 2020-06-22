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
 * @exports CoordinatesDisplayLayer
 */
import ArgumentError from '../error/ArgumentError';
import Color from '../util/Color';
import Font from '../util/Font';
import Layer from '../layer/Layer';
import Logger from '../util/Logger';
import Offset from '../util/Offset';
import Position from '../geom/Position';
import ScreenImage from '../shapes/ScreenImage';
import ScreenText from '../shapes/ScreenText';
import TextAttributes from '../shapes/TextAttributes';
import Vec2 from '../geom/Vec2';
        

        /**
         * Constructs a layer that displays the current map coordinates.
         * @alias CoordinatesDisplayLayer
         * @constructor
         * @augments Layer
         * @classDesc Displays the current map coordinates. A coordinates display layer cannot be shared among World
         * Windows. Each WorldWindow if it is to have a coordinates display layer must have its own. See the
         * MultiWindow example for guidance.
         * @param {WorldWindow} worldWindow The WorldWindow associated with this layer.
         * This layer may not be associated with more than one WorldWindow. Each WorldWindow must have it's own
         * instance of this layer if each window is to have a coordinates display.
         * @throws {ArgumentError} If the specified WorldWindow is null or undefined.
         */
        var CoordinatesDisplayLayer = function (worldWindow) {
            if (!worldWindow) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "CoordinatesDisplayLayer", "constructor", "missingWorldWindow"));
            }

            Layer.call(this, "Coordinates");

            /**
             * The WorldWindow associated with this layer.
             * @type {WorldWindow}
             * @readonly
             */
            this.wwd = worldWindow;

            // No picking of this layer's screen elements.
            this.pickEnabled = false;

            // Intentionally not documented.
            this.eventType = null;

            // Intentionally not documented.
            this.clientX = null;

            // Intentionally not documented.
            this.clientY = null;

            // Intentionally not documented.
            this.terrainPosition = null;

            // Intentionally not documented.
            this.latText = new ScreenText(new Offset(WorldWind.OFFSET_PIXELS, 0, WorldWind.OFFSET_PIXELS, 0), " ");
            this.latText.attributes = new TextAttributes(null);
            this.latText.attributes.color = Color.YELLOW;

            // Intentionally not documented.
            this.lonText = new ScreenText(new Offset(WorldWind.OFFSET_PIXELS, 0, WorldWind.OFFSET_PIXELS, 0), " ");
            this.lonText.attributes = new TextAttributes(null);
            this.lonText.attributes.color = Color.YELLOW;

            // Intentionally not documented.
            this.elevText = new ScreenText(new Offset(WorldWind.OFFSET_PIXELS, 0, WorldWind.OFFSET_PIXELS, 0), " ");
            this.elevText.attributes = new TextAttributes(null);
            this.elevText.attributes.color = Color.YELLOW;

            // Intentionally not documented.
            this.eyeText = new ScreenText(new Offset(WorldWind.OFFSET_PIXELS, 0, WorldWind.OFFSET_PIXELS, 0), " ");
            this.eyeText.attributes = new TextAttributes(null);
            this.eyeText.attributes.color = Color.YELLOW;

            // Intentionally not documented.
            var imageOffset = new Offset(WorldWind.OFFSET_FRACTION, 0.5, WorldWind.OFFSET_FRACTION, 0.5),
                imagePath = WorldWind.configuration.baseUrl + "images/crosshair.png";
            this.crosshairImage = new ScreenImage(imageOffset, imagePath);

            // Register user input event listeners on the WorldWindow.
            var thisLayer = this;

            function eventListener(event) {
                thisLayer.handleUIEvent(event);
            }

            if (window.PointerEvent) {
                worldWindow.addEventListener("pointerdown", eventListener);
                worldWindow.addEventListener("pointermove", eventListener);
                worldWindow.addEventListener("pointerleave", eventListener);
            } else {
                worldWindow.addEventListener("mousedown", eventListener);
                worldWindow.addEventListener("mousemove", eventListener);
                worldWindow.addEventListener("mouseleave", eventListener);
                worldWindow.addEventListener("touchstart", eventListener);
                worldWindow.addEventListener("touchmove", eventListener);
            }

            // Register a redraw callback on the WorldWindow.
            function redrawCallback(worldWindow, stage) {
                thisLayer.handleRedraw(stage);
            }

            this.wwd.redrawCallbacks.push(redrawCallback);
        };

        CoordinatesDisplayLayer.prototype = Object.create(Layer.prototype);

        // Documented in superclass.
        CoordinatesDisplayLayer.prototype.doRender = function (dc) {
            var terrainPos = this.terrainPosition,
                eyePos = dc.eyePosition,
                canvasWidth = dc.currentGlContext.canvas.clientWidth,
                x, y, yUnitsScreen, yUnitsText, hideEyeAlt;

            if (canvasWidth > 650) { // large canvas, align the text with bottom center
                x = (canvasWidth / 2) - 50;
                y = 11;
                yUnitsScreen = WorldWind.OFFSET_PIXELS;
                yUnitsText = 0;
            } else if (canvasWidth > 400) { // medium canvas, align the text in the top left
                x = 60;
                y = 5;
                yUnitsScreen = WorldWind.OFFSET_INSET_PIXELS;
                yUnitsText = 1;
            } else { // small canvas, suppress the eye altitude, align the text in the top left and suppress eye alt
                x = 60;
                y = 5;
                yUnitsScreen = WorldWind.OFFSET_INSET_PIXELS;
                yUnitsText = 1;
                hideEyeAlt = true;
            }

            // TODO can we control terrain position visibility with Text's targetVisibility?
            this.latText.text = terrainPos ? this.formatLatitude(terrainPos.latitude) : null;
            this.latText.screenOffset = new Offset(WorldWind.OFFSET_PIXELS, x, yUnitsScreen, y);
            this.latText.attributes.offset = new Offset(WorldWind.OFFSET_FRACTION, 1, WorldWind.OFFSET_FRACTION, yUnitsText);
            this.latText.render(dc);

            x += 70;
            this.lonText.text = terrainPos ? this.formatLongitude(terrainPos.longitude) : null;
            this.lonText.screenOffset = new Offset(WorldWind.OFFSET_PIXELS, x, yUnitsScreen, y);
            this.lonText.attributes.offset = new Offset(WorldWind.OFFSET_FRACTION, 1, WorldWind.OFFSET_FRACTION, yUnitsText);
            this.lonText.render(dc);

            if (!dc.globe.is2D()) {
                x += 70;
                this.elevText.text = terrainPos ? this.formatAltitude(terrainPos.altitude, "m") : null;
                this.elevText.screenOffset = new Offset(WorldWind.OFFSET_PIXELS, x, yUnitsScreen, y);
                this.elevText.attributes.offset = new Offset(WorldWind.OFFSET_FRACTION, 1, WorldWind.OFFSET_FRACTION, yUnitsText);
                this.elevText.render(dc);
            }

            // TODO can we control eye altitude visibility with Text's targetVisibility?
            if (!hideEyeAlt) {
                x += 40;
                this.eyeText.text = "Eye  " + this.formatAltitude(eyePos.altitude, eyePos.altitude < 1000 ? "m" : "km");
                this.eyeText.screenOffset = new Offset(WorldWind.OFFSET_PIXELS, x, yUnitsScreen, y);
                this.eyeText.attributes.offset = new Offset(WorldWind.OFFSET_FRACTION, 0, WorldWind.OFFSET_FRACTION, yUnitsText);
                this.eyeText.render(dc);
            }

            // TODO can we control crosshair visibility by adding targetVisibility to ScreenImage?
            if (this.eventType === "touch") {
                this.crosshairImage.render(dc);
            }

            this.inCurrentFrame = true;
        };

        // Intentionally not documented.
        CoordinatesDisplayLayer.prototype.handleUIEvent = function (event) {
            if (event.type.indexOf("pointer") !== -1) {
                this.eventType = event.pointerType; // possible values are "mouse", "pen" and "touch"
            } else if (event.type.indexOf("mouse") !== -1) {
                this.eventType = "mouse";
            } else if (event.type.indexOf("touch") !== -1) {
                this.eventType = "touch";
            }

            if (event.type.indexOf("leave") !== -1) {
                this.clientX = null; // clear the event coordinates when a pointer leaves the canvas
                this.clientY = null;
            } else {
                this.clientX = event.clientX;
                this.clientY = event.clientY;
            }

            this.wwd.redraw();
        };

        // Intentionally not documented.
        CoordinatesDisplayLayer.prototype.handleRedraw = function (stage) {
            if (stage !== WorldWind.BEFORE_REDRAW) {
                return; // ignore after redraw events
            }

            var pickPoint,
                terrainObject;

            if ((this.eventType === "mouse" || this.eventType === "pen") && this.clientX && this.clientY) {
                pickPoint = this.wwd.canvasCoordinates(this.clientX, this.clientY);
                if (pickPoint[0] >= 0 && pickPoint[0] < this.wwd.canvas.width &&
                    pickPoint[1] >= 0 && pickPoint[1] < this.wwd.canvas.height) {
                    terrainObject = this.wwd.pickTerrain(pickPoint).terrainObject();
                }
            } else if (this.eventType === "touch") {
                pickPoint = new Vec2(this.wwd.canvas.width / 2, this.wwd.canvas.height / 2);
                terrainObject = this.wwd.pickTerrain(pickPoint).terrainObject();
            }

            this.terrainPosition = terrainObject ? terrainObject.position : null;
        };

        // Intentionally not documented.
        CoordinatesDisplayLayer.prototype.formatLatitude = function (number) {
            var suffix = number < 0 ? "\u00b0S" : "\u00b0N";
            return Math.abs(number).toFixed(2) + suffix;
        };

        // Intentionally not documented.
        CoordinatesDisplayLayer.prototype.formatLongitude = function (number) {
            var suffix = number < 0 ? "\u00b0W" : "\u00b0E";
            return Math.abs(number).toFixed(2) + suffix;
        };

        // Intentionally not documented.
        CoordinatesDisplayLayer.prototype.formatAltitude = function (number, units) {
            // Convert from meters to the desired units format.
            if (units === "km") {
                number /= 1e3;
            }

            // Round to the nearest integer and place a comma every three digits. See the following Stack Overflow
            // thread for more information:
            // https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
            return number.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " " + units;
        };

        export default CoordinatesDisplayLayer;
    