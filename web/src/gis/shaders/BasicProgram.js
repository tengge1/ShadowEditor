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
 * @exports BasicProgram
 */
import ArgumentError from '../error/ArgumentError';
import Color from '../util/Color';
import GpuProgram from '../shaders/GpuProgram';
import Logger from '../util/Logger';
import BasicVertex from './glsl/basic_vertex.glsl';
import BasicFragment from './glsl/basic_fragment.glsl';

/**
 * Constructs a new program.
 * Initializes, compiles and links this GLSL program with the source code for its vertex and fragment shaders.
 * <p>
 * This method creates WebGL shaders for the program's shader sources and attaches them to a new GLSL program. This
 * method then compiles the shaders and then links the program if compilation is successful. Use the bind method to make the
 * program current during rendering.
 *
 * @alias BasicProgram
 * @constructor
 * @augments GpuProgram
 * @classdesc BasicProgram is a GLSL program that draws geometry in a solid color.
 * @param {WebGLRenderingContext} gl The current WebGL context.
 * @throws {ArgumentError} If the shaders cannot be compiled, or linking of
 * the compiled shaders into a program fails.
 */
function BasicProgram(gl) {
    var vertexShaderSource = BasicVertex,
        fragmentShaderSource = BasicFragment;

    // Call to the superclass, which performs shader program compiling and linking.
    GpuProgram.call(this, gl, vertexShaderSource, fragmentShaderSource);

    /**
     * The WebGL location for this program's 'vertexPoint' attribute.
     * @type {Number}
     * @readonly
     */
    this.vertexPointLocation = this.attributeLocation(gl, "vertexPoint");

    /**
     * The WebGL location for this program's 'mvpMatrix' uniform.
     * @type {WebGLUniformLocation}
     * @readonly
     */
    this.mvpMatrixLocation = this.uniformLocation(gl, "mvpMatrix");

    /**
     * The WebGL location for this program's 'color' uniform.
     * @type {WebGLUniformLocation}
     * @readonly
     */
    this.colorLocation = this.uniformLocation(gl, "color");
}

/**
 * A string that uniquely identifies this program.
 * @type {string}
 * @readonly
 */
BasicProgram.key = "WorldWindGpuBasicProgram";

// Inherit from GpuProgram.
BasicProgram.prototype = Object.create(GpuProgram.prototype);

/**
 * Loads the specified matrix as the value of this program's 'mvpMatrix' uniform variable.
 *
 * @param {WebGLRenderingContext} gl The current WebGL context.
 * @param {Matrix} matrix The matrix to load.
 * @throws {ArgumentError} If the specified matrix is null or undefined.
 */
BasicProgram.prototype.loadModelviewProjection = function (gl, matrix) {
    if (!matrix) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "BasicProgram", "loadModelviewProjection", "missingMatrix"));
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
BasicProgram.prototype.loadColor = function (gl, color) {
    if (!color) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "BasicProgram", "loadColor", "missingColor"));
    }

    this.loadUniformColor(gl, color, this.colorLocation);
};

/**
 * Loads the specified RGBA color components as the value of this program's 'color' uniform variable.
 *
 * @param {WebGLRenderingContext} gl The current WebGL context.
 * @param {Number} red The red component, a number between 0 and 1.
 * @param {Number} green The green component, a number between 0 and 1.
 * @param {Number} blue The blue component, a number between 0 and 1.
 * @param {Number} alpha The alpha component, a number between 0 and 1.
 */
BasicProgram.prototype.loadColorComponents = function (gl, red, green, blue, alpha) {
    this.loadUniformColorComponents(gl, red, green, blue, alpha, this.colorLocation);
};

export default BasicProgram;
