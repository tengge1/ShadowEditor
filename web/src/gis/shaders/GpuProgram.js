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
 * @exports GpuProgram
 */
import ArgumentError from '../error/ArgumentError';
import Color from '../util/Color';
import GpuShader from '../shaders/GpuShader';
import Logger from '../util/Logger';


/**
 * Constructs a GPU program with specified source code for vertex and fragment shaders.
 * This constructor is intended to be called only by subclasses.
 * <p>
 * This constructor creates WebGL shaders for the specified shader sources and attaches them to a new GLSL
 * program. The method compiles the shaders and then links the program if compilation is successful. Use the
 * [DrawContext.bindProgram]{@link DrawContext#bindProgram} function to make the program current during rendering.
 *
 * @alias GpuProgram
 * @constructor
 * @classdesc
 * Represents an OpenGL shading language (GLSL) shader program and provides methods for identifying and
 * accessing shader variables. Shader programs are created by instances of this class and made current when the
 * DrawContext.bindProgram function is invoked.
 * <p>
 * This is an abstract class and not intended to be created directly.
 *
 * @param {WebGLRenderingContext} gl The current WebGL context.
 * @param {String} vertexShaderSource The source code for the vertex shader.
 * @param {String} fragmentShaderSource The source code for the fragment shader.
 * @param {String[]} attributeBindings An array of attribute variable names whose bindings are to be explicitly
 * specified. Each name is bound to its corresponding index in the array. May be null, in which case the
 * linker determines all the bindings.
 * @throws {ArgumentError} If either source is null or undefined, the shaders cannot be compiled, or linking of
 * the compiled shaders into a program fails.
 */
function GpuProgram(gl, vertexShaderSource, fragmentShaderSource, attributeBindings) {
    if (!vertexShaderSource || !fragmentShaderSource) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "GpuProgram", "constructor",
            "The specified shader source is null or undefined."));
    }

    var program, vShader, fShader;

    try {
        vShader = new GpuShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        fShader = new GpuShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    } catch (e) {
        if (vShader)
            vShader.dispose(gl);
        if (fShader)
            fShader.dispose(gl);

        throw e;
    }

    program = gl.createProgram();
    if (!program) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "GpuProgram", "constructor",
            "Unable to create shader program."));
    }

    gl.attachShader(program, vShader.shaderId);
    gl.attachShader(program, fShader.shaderId);

    if (attributeBindings) {
        for (var i = 0, len = attributeBindings.length; i < len; i++) {
            gl.bindAttribLocation(program, i, attributeBindings[i]);
        }
    }

    if (!this.link(gl, program)) {
        // Get the info log before deleting the program.
        var infoLog = gl.getProgramInfoLog(program);

        gl.detachShader(program, vShader.shaderId);
        gl.detachShader(program, fShader.shaderId);
        gl.deleteProgram(program);
        vShader.dispose(gl);
        fShader.dispose(gl);

        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "GpuProgram", "constructor",
            "Unable to link shader program: " + infoLog));
    }

    /**
     * Indicates the WebGL program object associated with this GPU program.
     * @type {WebGLProgram}
     * @readonly
     */
    this.programId = program;

    // Internal. Intentionally not documented. These will be filled in as attribute locations are requested.
    this.attributeLocations = {};
    this.uniformLocations = {};

    // Internal. Intentionally not documented.
    this.vertexShader = vShader;

    // Internal. Intentionally not documented.
    this.fragmentShader = fShader;

    // Internal. Intentionally not documented.
    this.size = vertexShaderSource.length + fragmentShaderSource.length;

    // Internal. Intentionally not documented.
    this.scratchArray = new Float32Array(16);
}

/**
 * Releases this GPU program's WebGL program and associated shaders. Upon return this GPU program's WebGL
 * program ID is 0 as is that of the associated shaders.
 *
 * @param {WebGLRenderingContext} gl The current WebGL context.
 */
GpuProgram.prototype.dispose = function (gl) {
    if (this.programId) {
        if (this.vertexShader) {
            gl.detachShader(this.programId, this.vertexShader.shaderId);
        }
        if (this.fragmentShader) {
            gl.detachShader(this.programId, this.fragmentShader.shaderId);
        }

        gl.deleteProgram(this.programId);
        delete this.programId;
    }

    if (this.vertexShader) {
        this.vertexShader.dispose(gl);
        delete this.vertexShader;
    }

    if (this.fragmentShader) {
        this.fragmentShader.dispose(gl);
        delete this.fragmentShader;
    }

    this.attributeLocations = {};
    this.uniformLocations = {};
};

/**
 * Returns the GLSL attribute location of a specified attribute name.
 *
 * @param {WebGLRenderingContext} gl The current WebGL context.
 * @param {String} attributeName The name of the attribute whose location is determined.
 * @returns {Number} The WebGL attribute location of the specified attribute, or -1 if the attribute is not
 * found.
 * @throws {ArgumentError} If the specified attribute name is null, empty or undefined.
 */
GpuProgram.prototype.attributeLocation = function (gl, attributeName) {
    if (!attributeName || attributeName.length == 0) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "GpuProgram", "attributeLocation",
            "The specified attribute name is null, undefined or empty."));
    }

    var location = this.attributeLocations[attributeName];
    if (!location) {
        location = gl.getAttribLocation(this.programId, attributeName);
        this.attributeLocations[attributeName] = location;
    }

    return location;
};

/**
 * Returns the GLSL uniform location of a specified uniform name.
 *
 * @param {WebGLRenderingContext} gl The current WebGL context.
 * @param {String} uniformName The name of the uniform variable whose location is determined.
 * @returns {WebGLUniformLocation} The WebGL uniform location of the specified uniform variable,
 * or -1 if the uniform is not found.
 * @throws {ArgumentError} If the specified uniform name is null, empty or undefined.
 */
GpuProgram.prototype.uniformLocation = function (gl, uniformName) {
    if (!uniformName || uniformName.length == 0) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "GpuProgram", "uniformLocation",
            "The specified uniform name is null, undefined or empty."));
    }

    var location = this.uniformLocations[uniformName];
    if (!location) {
        location = gl.getUniformLocation(this.programId, uniformName);
        this.uniformLocations[uniformName] = location;
    }

    return location;
};

/**
 * Links a specified GLSL program. This method is not meant to be called by applications. It is called
 * internally as needed.
 *
 * @param {WebGLRenderingContext} gl The current WebGL context.
 * @param {WebGLProgram} program The WebGL program.
 * @returns {Boolean} true if linking was successful, otherwise false.
 * @protected
 */
GpuProgram.prototype.link = function (gl, program) {
    gl.linkProgram(program);

    return gl.getProgramParameter(program, gl.LINK_STATUS);
};

/**
 * Loads a specified matrix as the value of a GLSL 4x4 matrix uniform variable with the specified location.
 * <p>
 * This functions converts the matrix into column-major order prior to loading its components into the GLSL
 * uniform variable, but does not modify the specified matrix.
 *
 * @param {WebGLRenderingContext} gl The current WebGL context.
 * @param {Matrix} matrix The matrix to load.
 * @param {WebGLUniformLocation} location The location of the uniform variable in the currently bound GLSL program.
 * @throws {ArgumentError} If the specified matrix is null or undefined.
 */
GpuProgram.prototype.loadUniformMatrix = function (gl, matrix, location) {
    if (!matrix) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "GpuProgram", "loadUniformMatrix",
            "missingMatrix"));
    }

    var columnMajorArray = matrix.columnMajorComponents(this.scratchArray);
    gl.uniformMatrix4fv(location, false, columnMajorArray);
};

/**
 * Loads a specified color as the value of a GLSL vec4 uniform variable with the specified location.
 * <p>
 * This function multiplies the red, green and blue components by the alpha component prior to loading the color
 * in the GLSL uniform variable, but does not modify the specified color.
 *
 * @param {WebGLRenderingContext} gl The current WebGL context.
 * @param {Color} color The color to load.
 * @param {WebGLUniformLocation} location The location of the uniform variable in the currently bound GLSL program.
 * @throws {ArgumentError} If the specified color is null or undefined.
 */
GpuProgram.prototype.loadUniformColor = function (gl, color, location) {
    if (!color) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "GpuProgram", "loadUniformColor",
            "missingColor"));
    }

    var premul = color.premultipliedComponents(this.scratchArray);
    gl.uniform4f(location, premul[0], premul[1], premul[2], premul[3]);
};

/**
 * Loads the specified RGBA color components as the value of a GLSL vec4 uniform variable with the specified
 * location.
 * <p>
 * This function multiplies the red, green and blue components by the alpha component prior to loading the color
 * in the GLSL uniform variable.
 *
 * @param {WebGLRenderingContext} gl The current WebGL context.
 * @param {Number} red The red component, a number between 0 and 1.
 * @param {Number} green The green component, a number between 0 and 1.
 * @param {Number} blue The blue component, a number between 0 and 1.
 * @param {Number} alpha The alpha component, a number between 0 and 1.
 * @param {WebGLUniformLocation} location The location of the uniform variable in the currently bound GLSL program.
 */
GpuProgram.prototype.loadUniformColorComponents = function (gl, red, green, blue, alpha, location) {
    gl.uniform4f(location, red * alpha, green * alpha, blue * alpha, alpha);
};

export default GpuProgram;
