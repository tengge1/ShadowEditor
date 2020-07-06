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
 * @exports TextRenderer
 */
import ArgumentError from '../error/ArgumentError';
import BasicTextureProgram from '../shaders/BasicTextureProgram';
import Color from '../util/Color';
import Font from '../util/Font';
import Logger from '../util/Logger';
import Matrix from '../geom/Matrix';
import Texture from '../render/Texture';
import Vec2 from '../geom/Vec2';


/**
 * Constructs a TextRenderer instance.
 * @alias TextRenderer
 * @constructor
 * @classdesc Provides methods useful for displaying text. An instance of this class is attached to the
 * WorldWindow {@link DrawContext} and is not intended to be used independently of that. Applications typically do
 * not create instances of this class.
 * @param {drawContext} drawContext The current draw context. Typically the same draw context that TextRenderer
 * is attached to.
 * @throws {ArgumentError} If the specified draw context is null or undefined.
 */
function TextRenderer(drawContext) {
    if (!drawContext) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "TextRenderer", "constructor",
            "missingDc"));
    }

    // Internal use only. Intentionally not documented.
    this.canvas2D = document.createElement("canvas");

    // Internal use only. Intentionally not documented.
    this.ctx2D = this.canvas2D.getContext("2d");

    // Internal use only. Intentionally not documented.
    this.dc = drawContext;

    /**
     * Indicates if the text will feature an outline around its characters.
     * @type {boolean}
     */
    this.enableOutline = true;

    // Internal use only. Intentionally not documented.
    this.lineSpacing = 0.15; // fraction of font size

    /**
     * The color for the Text outline.
     * Its default has half transparency to avoid visual artifacts that appear while fully opaque.
     * @type {Color}
     */
    this.outlineColor = new Color(0, 0, 0, 0.5);

    /**
     * Indicates the text outline width (or thickness) in pixels.
     * @type {number}
     */
    this.outlineWidth = 4;

    /**
     * The text color.
     * @type {Color}
     */
    this.textColor = new Color(1, 1, 1, 1);

    /**
     * The text size, face and other characteristics, as described in [Font]{@link Font}.
     * @type {Font}
     */
    this.typeFace = new Font(14);
}

/**
 * Returns the width and height of a specified text string considering the current typeFace and outline usage.
 * @param {string} text The text string.
 * @returns {Vec2} A vector indicating the text's width and height, respectively, in pixels.
 */
TextRenderer.prototype.textSize = function (text) {
    if (text.length === 0) {
        return new Vec2(0, 0);
    }

    this.ctx2D.font = this.typeFace.fontString;

    var lines = text.split("\n"),
        height = lines.length * (this.typeFace.size * (1 + this.lineSpacing)),
        maxWidth = 0;

    for (var i = 0; i < lines.length; i++) {
        maxWidth = Math.max(maxWidth, this.ctx2D.measureText(lines[i]).width);
    }

    if (this.enableOutline) {
        maxWidth += this.outlineWidth;
        height += this.outlineWidth;
    }

    return new Vec2(maxWidth, height);
};

/**
 * Creates a texture for a specified text string and current TextRenderer state.
 * @param {String} text The text string.
 * @returns {Texture} A texture for the specified text string.
 */
TextRenderer.prototype.renderText = function (text) {
    if (text && text.length > 0) {
        var canvas2D = this.drawText(text);
        return new Texture(this.dc.currentGlContext, canvas2D);
    } else {
        return null;
    }
};

/**
 * Creates a 2D Canvas for a specified text string while considering current TextRenderer state in
 * regards to outline usage and color, text color, typeface, and outline width.
 * @param {String} text The text string.
 * @returns {canvas2D} A 2D Canvas for the specified text string.
 */
TextRenderer.prototype.drawText = function (text) {
    var ctx2D = this.ctx2D,
        canvas2D = this.canvas2D,
        textSize = this.textSize(text),
        lines = text.split("\n"),
        strokeOffset = this.enableOutline ? this.outlineWidth / 2 : 0,
        pixelScale = this.dc.pixelScale;

    canvas2D.width = Math.ceil(textSize[0]) * pixelScale;
    canvas2D.height = Math.ceil(textSize[1]) * pixelScale;

    ctx2D.scale(pixelScale, pixelScale);
    ctx2D.font = this.typeFace.fontString;
    ctx2D.textBaseline = "bottom";
    ctx2D.textAlign = this.typeFace.horizontalAlignment;
    ctx2D.fillStyle = this.textColor.toCssColorString();
    ctx2D.strokeStyle = this.outlineColor.toCssColorString();
    ctx2D.lineWidth = this.outlineWidth;
    ctx2D.lineCap = "round";
    ctx2D.lineJoin = "round";

    if (this.typeFace.horizontalAlignment === "left") {
        ctx2D.translate(strokeOffset, 0);
    } else if (this.typeFace.horizontalAlignment === "right") {
        ctx2D.translate(textSize[0] - strokeOffset, 0);
    } else {
        ctx2D.translate(textSize[0] / 2, 0);
    }

    for (var i = 0; i < lines.length; i++) {
        ctx2D.translate(0, this.typeFace.size * (1 + this.lineSpacing) + strokeOffset);
        if (this.enableOutline) {
            ctx2D.strokeText(lines[i], 0, 0);
        }
        ctx2D.fillText(lines[i], 0, 0);
    }

    return canvas2D;
};

/**
 * Calculates maximum line height based on the current typeFace and outline usage of TextRenderer.
 * @returns {Vec2} A vector indicating the text's width and height, respectively, in pixels.
 */
TextRenderer.prototype.getMaxLineHeight = function () {
    // Check underscore + capital E with acute accent
    return this.textSize("_\u00c9")[1];
};

/**
 * Wraps the text based on width and height using new line delimiter
 * @param {String} text The text to wrap.
 * @param {Number} width The width in pixels.
 * @param {Number} height The height in pixels.
 * @returns {String} The wrapped text.
 */
TextRenderer.prototype.wrap = function (text, width, height) {
    if (!text) {
        throw new ArgumentError(
            Logger.logMessage(Logger.WARNING, "TextRenderer", "wrap", "missing text"));
    }

    var i;

    var lines = text.split("\n");
    var wrappedText = "";

    // Wrap each line
    for (i = 0; i < lines.length; i++) {
        lines[i] = this.wrapLine(lines[i], width);
    }
    // Concatenate all lines in one string with new line separators
    // between lines - not at the end
    // Checks for height limit.
    var currentHeight = 0;
    var heightExceeded = false;
    var maxLineHeight = this.getMaxLineHeight();
    for (i = 0; i < lines.length && !heightExceeded; i++) {
        var subLines = lines[i].split("\n");
        for (var j = 0; j < subLines.length && !heightExceeded; j++) {
            if (height <= 0 || currentHeight + maxLineHeight <= height) {
                wrappedText += subLines[j];
                currentHeight += maxLineHeight + this.lineSpacing;
                if (j < subLines.length - 1) {
                    wrappedText += '\n';
                }
            }
            else {
                heightExceeded = true;
            }
        }

        if (i < lines.length - 1 && !heightExceeded) {
            wrappedText += '\n';
        }
    }
    // Add continuation string if text truncated
    if (heightExceeded) {
        if (wrappedText.length > 0) {
            wrappedText = wrappedText.substring(0, wrappedText.length - 1);
        }

        wrappedText += "...";
    }

    return wrappedText;
};

/**
 * Wraps a line of text based on width and height
 * @param {String} text The text to wrap.
 * @param {Number} width The width in pixels.
 * @returns {String} The wrapped text.
 */
TextRenderer.prototype.wrapLine = function (text, width) {
    var wrappedText = "";

    // Single line - trim leading and trailing spaces
    var source = text.trim();
    var lineBounds = this.textSize(source);
    if (lineBounds[0] > width) {
        // Split single line to fit preferred width
        var line = "";
        var start = 0;
        var end = source.indexOf(' ', start + 1);
        while (start < source.length) {
            if (end === -1) {
                end = source.length;   // last word
            }

            // Extract a 'word' which is in fact a space and a word
            var word = source.substring(start, end);
            var linePlusWord = line + word;
            if (this.textSize(linePlusWord)[0] <= width) {
                // Keep adding to the current line
                line += word;
            }
            else {
                // Width exceeded
                if (line.length !== 0) {
                    // Finish current line and start new one
                    wrappedText += line;
                    wrappedText += '\n';
                    line = "";
                    line += word.trim();  // get read of leading space(s)
                }
                else {
                    // Line is empty, force at least one word
                    line += word.trim();
                }
            }
            // Move forward in source string
            start = end;
            if (start < source.length - 1) {
                end = source.indexOf(' ', start + 1);
            }
        }
        // Gather last line
        wrappedText += line;
    }
    else {
        // Line doesn't need to be wrapped
        wrappedText += source;
    }

    return wrappedText;
};

export default TextRenderer;
