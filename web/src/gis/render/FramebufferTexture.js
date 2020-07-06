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
 * @exports FramebufferTexture
 */
import ArgumentError from '../error/ArgumentError';
import Logger from '../util/Logger';
import '../util/WWMath';


/**
 * Constructs a framebuffer texture with the specified dimensions and an optional depth buffer. Use the
 * [DrawContext.bindFramebuffer]{@link DrawContext#bindFramebuffer} function to make the program current during rendering.
 *
 * @alias FramebufferTexture
 * @constructor
 * @classdesc Represents an off-screen WebGL framebuffer. The framebuffer has color buffer stored in a 32
 * bit RGBA texture, and has an optional depth buffer of at least 16 bits. Applications typically do not
 * interact with this class. WebGL framebuffers are created by instances of this class and made current when the
 * DrawContext.bindFramebuffer function is invoked.
 * @param {WebGLRenderingContext} gl The current WebGL rendering context.
 * @param {Number} width The width of the framebuffer, in pixels.
 * @param {Number} height The height of the framebuffer, in pixels.
 * @param {Boolean} depth true to configure the framebuffer with a depth buffer of at least 16 bits, false to
 * disable depth buffering.
 * @throws {ArgumentError} If the specified draw context is null or undefined, or if the width or height is less
 * than zero.
 */
function FramebufferTexture(gl, width, height, depth) {
    if (!gl) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "FramebufferTexture", "constructor",
            "missingGlContext"));
    }

    if (width < 0 || height < 0) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "FramebufferTexture", "constructor",
            "The framebuffer width or height is less than zero."));
    }

    /**
     * The width of this framebuffer, in pixels.
     * @type {Number}
     * @readonly
     */
    this.width = width;

    /**
     * The height of this framebuffer, in pixels.
     * @type {Number}
     * @readonly
     */
    this.height = height;

    /**
     * Indicates whether or not this framebuffer has a depth buffer.
     * @type {Boolean}
     * @readonly
     */
    this.depth = depth;

    /**
     * Indicates the size of this framebuffer's WebGL resources, in bytes.
     * @type {Number}
     * @readonly
     */
    this.size = width * height * 4 + (depth ? width * height * 2 : 0);

    /**
     * Indicates the WebGL framebuffer object object associated with this framebuffer texture.
     * @type {WebGLFramebuffer}
     * @readonly
     */
    this.framebufferId = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebufferId);

    // Internal. Intentionally not documented. Configure this framebuffer's color buffer.
    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
        gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER,
        gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S,
        gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T,
        gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0,
        gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D, this.texture, 0);

    // Internal. Intentionally not documented. Configure this framebuffer's optional depth buffer.
    this.depthBuffer = null;
    if (depth) {
        this.depthBuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.depthBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16,
            width, height);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT,
            gl.RENDERBUFFER, this.depthBuffer);
    }

    var e = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (e != gl.FRAMEBUFFER_COMPLETE) {
        Logger.logMessage(Logger.LEVEL_WARNING, "FramebufferTexture", "constructor",
            "Error creating framebuffer: " + e);
        this.framebufferId = null;
        this.texture = null;
        this.depthBuffer = null;
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
}

/**
 * Binds this off-screen framebuffer's texture in the current WebGL graphics context. This texture contains
 * color fragments resulting from WebGL operations executed when this framebuffer is bound by a call to
 * [FramebufferTexture.bindFramebuffer]{@link FramebufferTexture#bindFramebuffer}.
 *
 * @param {DrawContext} dc The current draw context.
 * @returns {Boolean} true if this framebuffer's texture was bound successfully, otherwise false.
 */
FramebufferTexture.prototype.bind = function (dc) {
    if (this.texture) {
        dc.currentGlContext.bindTexture(gl.TEXTURE_2D, this.texture);
    }

    return !!this.texture;
};

export default FramebufferTexture;
