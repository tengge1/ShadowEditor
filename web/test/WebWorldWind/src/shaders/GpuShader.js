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
 * @exports GpuShader
 */
import ArgumentError from '../error/ArgumentError';
import Logger from '../util/Logger';


/**
 * Constructs a GPU shader of a specified type with specified GLSL source code.
 *
 * @alias GpuShader
 * @constructor
 * @classdesc
 * Represents an OpenGL shading language (GLSL) shader and provides methods for compiling and disposing
 * of them.
 *
 * @param {WebGLRenderingContext} gl The current WebGL context.
 * @param {Number} shaderType The type of shader, either WebGLRenderingContext.VERTEX_SHADER
 * or WebGLRenderingContext.FRAGMENT_SHADER.
 * @param {String} shaderSource The shader's source code.
 * @throws {ArgumentError} If the shader type is unrecognized, the shader source is null or undefined or shader
 * compilation fails. If the compilation fails the error thrown contains any compilation messages.
 */
function GpuShader(gl, shaderType, shaderSource) {
    if (!(shaderType === gl.VERTEX_SHADER
        || shaderType === gl.FRAGMENT_SHADER)) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "GpuShader", "constructor",
            "The specified shader type is unrecognized."));
    }

    if (!shaderSource) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "GpuShader", "constructor",
            "The specified shader source is null or undefined."));
    }

    var shader = gl.createShader(shaderType);
    if (!shader) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "GpuShader", "constructor",
            "Unable to create shader of type " +
            (shaderType == gl.VERTEX_SHADER ? "VERTEX_SHADER." : "FRAGMENT_SHADER.")));
    }

    if (!this.compile(gl, shader, shaderType, shaderSource)) {
        var infoLog = gl.getShaderInfoLog(shader);

        gl.deleteShader(shader);

        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "GpuShader", "constructor",
            "Unable to compile shader: " + infoLog));
    }

    this.shaderId = shader;
}

/**
 * Compiles the source code for this shader. This method is not meant to be invoked by applications. It is
 * invoked internally as needed.
 * @param {WebGLRenderingContext} gl The current WebGL rendering context.
 * @param {WebGLShader} shaderId The shader ID.
 * @param {Number} shaderType The type of shader, either WebGLRenderingContext.VERTEX_SHADER
 * or WebGLRenderingContext.FRAGMENT_SHADER.
 * @param {String} shaderSource The shader's source code.
 * @returns {boolean} <code>true</code> if the shader compiled successfully, otherwise <code>false</code>.
 */
GpuShader.prototype.compile = function (gl, shaderId, shaderType, shaderSource) {
    gl.shaderSource(shaderId, shaderSource);
    gl.compileShader(shaderId);

    return gl.getShaderParameter(shaderId, gl.COMPILE_STATUS);
};

/**
 * Releases this shader's WebGL shader.
 * @param {WebGLRenderingContext} gl The current WebGL rendering context.
 */
GpuShader.prototype.dispose = function (gl) {
    if (this.shaderId) {
        gl.deleteShader(this.shaderId);
        delete this.shaderId;
    }
};

export default GpuShader;
