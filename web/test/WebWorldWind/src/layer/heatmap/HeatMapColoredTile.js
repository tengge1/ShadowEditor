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
import HeatMapTile from './HeatMapTile';
    /**
     * Constructs a HeatMapColoredTile.
     *
     * The default implementation using the shades of gray to draw the information produced by the HeatMapTile is a source
     * for coloring. This class colours the provided canvas based on the information contained in the intensityGradient.
     *
     *  @inheritDoc
     *
     * @alias HeatMapColoredTile
     * @constructor
     * @augments HeatMapTile
     * @classdesc Tile for the HeatMap layer visualising data on a canvas using colour scale.
     * @param options.intensityGradient {Object} Keys represent the opacity between 0 and 1 and the values represent
     *  color strings.
     * @param options.extendedWidth {Number} Optional. Minimal width that needs to be retrieved for colorization.
     * @param options.extendedHeight {Number} Optional. Minimal height that needs to be retrieved for colorization.
     */
    var HeatMapColoredTile = function(data, options) {
        HeatMapTile.call(this, data, options);

        this._extendedWidth = options.extendedWidth;
        this._extendedHeight = options.extendedHeight;
        this._gradient = this.gradient(options.intensityGradient);
    };

    HeatMapColoredTile.prototype = Object.create(HeatMapTile.prototype);

    /**
     * The coloured version colorizes only the cropped area relevant for the display. The rest is ignored.
     */
    HeatMapColoredTile.prototype.draw = function() {
        var canvas = HeatMapTile.prototype.draw.call(this);

        var ctx = canvas.getContext('2d');

        var top = 0;
        var left = 0;
        var width = this._width;
        var height = this._height;
        if(this._extendedHeight) {
            top = this._extendedHeight;
            height = this._height - (2 * this._extendedHeight);
        }
        if(this._extendedWidth) {
            left = this._extendedWidth;
            width = this._width - (2 * this._extendedWidth);
        }

        var colored = ctx.getImageData(top, left, width, height);
        this.colorize(colored.data, this._gradient);
        ctx.putImageData(colored, top, left);

        return canvas;
    };

    /**
     * Creates one pixel height gradient based on the provided intensity gradient. The gradient is drawn on the small
     * canvas, from which the resulting data are retrieved.
     * @private
     * @param intensityGradient {Object}  Gradient of colours used to draw the points. The keys represents percentage
     *  for start of given color, which is value of the object.
     * @returns {Uint8ClampedArray} Array of the gradient colours representing the full range relevant for this tile.
     */
    HeatMapColoredTile.prototype.gradient = function (intensityGradient) {
        // create a 256x1 gradient that we'll use to turn a grayscale heatmap into a colored one
        var canvas = this.createCanvas(1, 256),
            ctx = canvas.getContext('2d'),
            gradient = ctx.createLinearGradient(0, 0, 0, 256);

        for (var i in intensityGradient) {
            gradient.addColorStop(+i, intensityGradient[i]);
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1, 256);

        return ctx.getImageData(0, 0, 1, 256).data;
    };

    /**
     * Colorizes all the relevant pixels based on the values from the linear gradient. The colour is applied directly
     * to the pixels by changing them.
     * @private
     * @param pixels {Uint8ClampedArray} The pixels to colorize in the format retrieved from canvas.
     * @param gradient {Uint8ClampedArray} The pixels used as the source of the colors for the data pixels. The colors
     *  are applied based on the opacity (blackness) of given pixel.
     */
    HeatMapColoredTile.prototype.colorize = function (pixels, gradient) {
        for (var i = 0, len = pixels.length, j; i < len; i += 4) {
            j = pixels[i + 3] * 4;

            if (j) {
                pixels[i] = gradient[j];
                pixels[i + 1] = gradient[j + 1];
                pixels[i + 2] = gradient[j + 2];
                pixels[i + 3] = 255;
            }
        }

    };

    export default HeatMapColoredTile;
