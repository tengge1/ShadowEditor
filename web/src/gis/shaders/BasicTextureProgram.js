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
 * @exports BasicTextureProgram
 */
import ArgumentError from '../error/ArgumentError';
import Color from '../util/Color';
import GpuProgram from '../shaders/GpuProgram';
import Logger from '../util/Logger';
import BasicTextureVertex from './glsl/basic_texture_vertex.glsl';
import BasicTextureFragment from './glsl/basic_texture_fragment.glsl';

/**
 * Constructs a new program.
 * Initializes, compiles and links this GLSL program with the source code for its vertex and fragment shaders.
 * <p>
 * This method creates WebGL shaders for the program's shader sources and attaches them to a new GLSL program. This
 * method then compiles the shaders and then links the program if compilation is successful. Use the bind method to make the
 * program current during rendering.
 *
 * @alias BasicTextureProgram
 * @constructor
 * @augments GpuProgram
 * @classdesc BasicTextureProgram is a GLSL program that draws textured or untextured geometry.
 * @param {WebGLRenderingContext} gl The current WebGL context.
 * @throws {ArgumentError} If the shaders cannot be compiled, or if linking of
 * the compiled shaders into a program fails.
 */
function BasicTextureProgram(gl) {
    var vertexShaderSource = BasicTextureVertex,
        fragmentShaderSource = BasicTextureFragment;

    // Specify bindings to avoid the WebGL performance warning that's generated when normalVector gets
    // bound to location 0.
    var bindings = ["vertexPoint", "normalVector", "vertexTexCoord"];

    // Call to the superclass, which performs shader program compiling and linking.
    GpuProgram.call(this, gl, vertexShaderSource, fragmentShaderSource, bindings);

    /**
     * The WebGL location for this program's 'vertexPoint' attribute.
     * @type {Number}
     * @readonly
     */
    this.vertexPointLocation = this.attributeLocation(gl, "vertexPoint");

    /**
     * The WebGL location for this program's 'normalVector' attribute.
     * @type {Number}
     * @readonly
     */
    this.normalVectorLocation = this.attributeLocation(gl, "normalVector");

    /**
     * The WebGL location for this program's 'vertexTexCoord' attribute.
     * @type {Number}
     * @readonly
     */
    this.vertexTexCoordLocation = this.attributeLocation(gl, "vertexTexCoord");

    /**
     * The WebGL location for this program's 'mvpMatrix' uniform.
     * @type {WebGLUniformLocation}
     * @readonly
     */
    this.mvpMatrixLocation = this.uniformLocation(gl, "mvpMatrix");

    /**
     * The WebGL location for this program's 'mvInverseMatrix' uniform.
     * @type {WebGLUniformLocation}
     * @readonly
     */
    this.mvInverseMatrixLocation = this.uniformLocation(gl, "mvInverseMatrix");

    /**
     * The WebGL location for this program's 'color' uniform.
     * @type {WebGLUniformLocation}
     * @readonly
     */
    this.colorLocation = this.uniformLocation(gl, "color");

    /**
     * The WebGL location for this program's 'enableTexture' uniform.
     * @type {WebGLUniformLocation}
     * @readonly
     */
    this.textureEnabledLocation = this.uniformLocation(gl, "enableTexture");

    /**
     * The WebGL location for this program's 'modulateColor' uniform.
     * @type {WebGLUniformLocation}
     * @readonly
     */
    this.modulateColorLocation = this.uniformLocation(gl, "modulateColor");

    /**
     * The WebGL location for this program's 'textureSampler' uniform.
     * @type {WebGLUniformLocation}
     * @readonly
     */
    this.textureUnitLocation = this.uniformLocation(gl, "textureSampler");

    /**
     * The WebGL location for this program's 'texCoordMatrix' uniform.
     * @type {WebGLUniformLocation}
     * @readonly
     */
    this.textureMatrixLocation = this.uniformLocation(gl, "texCoordMatrix");

    /**
     * The WebGL location for this program's 'opacity' uniform.
     * @type {WebGLUniformLocation}
     * @readonly
     */
    this.opacityLocation = this.uniformLocation(gl, "opacity");

    /**
     * The WegGL location for this program's 'enableLighting' uniform.
     * @type {WebGLUniformLocation}
     * @readonly
     */
    this.applyLightingLocation = this.uniformLocation(gl, "applyLighting");
}

/**
 * A string that uniquely identifies this program.
 * @type {string}
 * @readonly
 */
BasicTextureProgram.key = "WorldWindGpuBasicTextureProgram";

// Inherit from GpuProgram.
BasicTextureProgram.prototype = Object.create(GpuProgram.prototype);

/**
 * Loads the specified matrix as the value of this program's 'mvInverseMatrix' uniform variable.
 *
 * @param {WebGLRenderingContext} gl The current WebGL context.
 * @param {Matrix} matrix The matrix to load.
 * @throws {ArgumentError} If the specified matrix is null or undefined.
 */
BasicTextureProgram.prototype.loadModelviewInverse = function (gl, matrix) {
    if (!matrix) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "BasicTextureProgram", "loadModelviewInverse", "missingMatrix"));
    }

    this.loadUniformMatrix(gl, matrix, this.mvInverseMatrixLocation);
};

/**
 * Loads the specified matrix as the value of this program's 'mvpMatrix' uniform variable.
 *
 * @param {WebGLRenderingContext} gl The current WebGL context.
 * @param {Matrix} matrix The matrix to load.
 * @throws {ArgumentError} If the specified matrix is null or undefined.
 */
BasicTextureProgram.prototype.loadModelviewProjection = function (gl, matrix) {
    if (!matrix) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "BasicTextureProgram", "loadModelviewProjection", "missingMatrix"));
    }

    this.loadUniformMatrix(gl, matrix, this.mvpMatrixLocation);
};

/**
 * Loads the specified color as the value of this program's 'color' uniform variable.
 *
 * @param {WebGLRenderingContext} gl The current WebGL context.
 * @param {Color} color The color to load.
 * @throws {ArgumentError} If the specified color is null or undefined.
 */
BasicTextureProgram.prototype.loadColor = function (gl, color) {
    if (!color) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "BasicTextureProgram", "loadColor", "missingColor"));
    }

    this.loadUniformColor(gl, color, this.colorLocation);
};

/**
 * Loads the specified boolean as the value of this program's 'enableTexture' uniform variable.
 * @param {WebGLRenderingContext} gl The current WebGL context.
 * @param {Boolean} enable true to enable texturing, false to disable texturing.
 */
BasicTextureProgram.prototype.loadTextureEnabled = function (gl, enable) {
    gl.uniform1i(this.textureEnabledLocation, enable ? 1 : 0);
};

/**
 * Loads the specified boolean as the value of this program's 'modulateColor' uniform variable. When this
 * value is true and the value of the textureEnabled variable is true, the color uniform of this shader is
 * multiplied by the rounded alpha component of the texture color at each fragment. This causes the color
 * to be either fully opaque or fully transparent depending on the value of the texture color's alpha value.
 * This is used during picking to replace opaque or mostly opaque texture colors with the pick color, and
 * to make all other texture colors transparent.
 * @param {WebGLRenderingContext} gl The current WebGL context.
 * @param {Boolean} enable true to enable modulation, false to disable modulation.
 */
BasicTextureProgram.prototype.loadModulateColor = function (gl, enable) {
    gl.uniform1i(this.modulateColorLocation, enable ? 1 : 0);
};

/**
 * Loads the specified number as the value of this program's 'textureSampler' uniform variable.
 * @param {WebGLRenderingContext} gl The current WebGL context.
 * @param {Number} unit The texture unit.
 */
BasicTextureProgram.prototype.loadTextureUnit = function (gl, unit) {
    gl.uniform1i(this.textureUnitLocation, unit - gl.TEXTURE0);
};

/**
 * Loads the specified matrix as the value of this program's 'texCoordMatrix' uniform variable.
 * @param {WebGLRenderingContext} gl The current WebGL context.
 * @param {Matrix} matrix The texture coordinate matrix.
 */
BasicTextureProgram.prototype.loadTextureMatrix = function (gl, matrix) {
    this.loadUniformMatrix(gl, matrix, this.textureMatrixLocation);
};

/**
 * Loads the specified number as the value of this program's 'opacity' uniform variable.
 * @param {WebGLRenderingContext} gl The current WebGL context.
 * @param {Number} opacity The opacity in the range [0, 1].
 */
BasicTextureProgram.prototype.loadOpacity = function (gl, opacity) {
    gl.uniform1f(this.opacityLocation, opacity);
};

/**
 * Loads the specified boolean as the value of this program's 'applyLighting' uniform variable.
 * @param {WebGLRenderingContext} gl The current WebGL context.
 * @param {Number} applyLighting true to apply lighting, otherwise false.
 */
BasicTextureProgram.prototype.loadApplyLighting = function (gl, applyLighting) {
    gl.uniform1i(this.applyLightingLocation, applyLighting);
};

export default BasicTextureProgram;
