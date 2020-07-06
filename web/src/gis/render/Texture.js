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
 * @exports Texture
 */
import ArgumentError from '../error/ArgumentError';
import Logger from '../util/Logger';
import WWMath from '../util/WWMath';


/**
 * Constructs a texture for a specified image.
 * @alias Texture
 * @constructor
 * @classdesc Represents a WebGL texture. Applications typically do not interact with this class.
 * @param {WebGLRenderingContext} gl The current WebGL rendering context.
 * @param {Image} image The texture's image.
 * @param {GLenum} wrapMode Optional. Specifies the wrap mode of the texture. Defaults to gl.CLAMP_TO_EDGE
 * @throws {ArgumentError} If the specified WebGL context or image is null or undefined.
 */
function Texture(gl, image, wrapMode) {

    if (!gl) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Texture", "constructor",
            "missingGlContext"));
    }

    if (!image) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Texture", "constructor",
            "missingImage"));
    }

    if (!wrapMode) {
        wrapMode = gl.CLAMP_TO_EDGE;
    }

    var textureId = gl.createTexture(),
        isPowerOfTwo = WWMath.isPowerOfTwo(image.width) && WWMath.isPowerOfTwo(image.height);

    this.originalImageWidth = image.width;
    this.originalImageHeight = image.height;

    if (wrapMode === gl.REPEAT && !isPowerOfTwo) {
        image = this.resizeImage(image);
        isPowerOfTwo = true;
    }

    this.imageWidth = image.width;
    this.imageHeight = image.height;
    this.size = image.width * image.height * 4;

    gl.bindTexture(gl.TEXTURE_2D, textureId);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
        isPowerOfTwo ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapMode);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapMode);

    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0,
        gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 0);

    if (isPowerOfTwo) {
        gl.generateMipmap(gl.TEXTURE_2D);
    }

    this.textureId = textureId;

    /**
     * The time at which this texture was created.
     * @type {Date}
     */
    this.creationTime = new Date();

    // Internal use only. Intentionally not documented.
    this.texParameters = {};

    // Internal use only. Intentionally not documented.
    // https://www.khronos.org/registry/webgl/extensions/EXT_texture_filter_anisotrop
    this.anisotropicFilterExt = gl.getExtension("EXT_texture_filter_anisotropic") ||
        gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic");
}

/**
 * Sets a texture parameter to apply when binding this texture.
 *
 * Currently only gl.TEXTURE_MAG_FILTER has an effect.
 *
 * @param {Glenum} name The name of the parameter
 * @param {GLint} value The value for this parameter
 */
Texture.prototype.setTexParameter = function (name, value) {
    this.texParameters[name] = value;
};

/**
 * Returns the value of a texture parameter to be assigned to this texture.
 * @param {Glenum} name The name of the parameter
 * @returns {GLint} The value for this parameter
 */
Texture.prototype.getTexParameter = function (name) {
    return this.texParameters[name];
};

/**
 * Clears the list of texture parameters to apply when binding this texture.
 */
Texture.prototype.clearTexParameters = function () {
    this.texParameters = {};
};

/**
 * Disposes of the WebGL texture object associated with this texture.
 * @param gl
 */
Texture.prototype.dispose = function (gl) {
    gl.deleteTexture(this.textureId);
    delete this.textureId;
};

/**
 * Binds this texture in the current WebGL graphics context.
 * @param {DrawContext} dc The current draw context.
 */
Texture.prototype.bind = function (dc) {
    var gl = dc.currentGlContext;

    gl.bindTexture(gl.TEXTURE_2D, this.textureId);

    this.applyTexParameters(dc);

    dc.frameStatistics.incrementTextureLoadCount(1);
    return true;
};

/**
 * Applies the configured texture parameters to the OpenGL context.
 * @param {DrawContext} dc The current draw context.
 */
Texture.prototype.applyTexParameters = function (dc) {
    var gl = dc.currentGlContext;

    // Configure the OpenGL texture magnification function. Use linear by default.
    var textureMagFilter = this.texParameters[gl.TEXTURE_MAG_FILTER] || gl.LINEAR;
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, textureMagFilter);

    // Try to enable the anisotropic texture filtering only if we have a linear magnification filter.
    // This can't be enabled all the time because Windows seems to ignore the TEXTURE_MAG_FILTER parameter when
    // this extension is enabled.
    if (textureMagFilter === gl.LINEAR) {
        // Setup 4x anisotropic texture filtering when this feature is available.
        if (this.anisotropicFilterExt) {
            gl.texParameteri(gl.TEXTURE_2D, this.anisotropicFilterExt.TEXTURE_MAX_ANISOTROPY_EXT, 4);
        }
    }
};

/**
 * Resizes an image to a power of two.
 * @param {Image} image The image to resize.
 */
Texture.prototype.resizeImage = function (image) {
    var canvas = document.createElement("canvas");
    canvas.width = WWMath.powerOfTwoFloor(image.width);
    canvas.height = WWMath.powerOfTwoFloor(image.height);
    var ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas;
};


export default Texture;
