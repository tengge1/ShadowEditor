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
 * @exports AtmosphereProgram
 */
import ArgumentError from '../error/ArgumentError';
import GpuProgram from '../shaders/GpuProgram';
import Logger from '../util/Logger';


/**
 * Constructs a new program.
 * Initializes, compiles and links this GLSL program with the source code for its vertex and fragment shaders.
 * <p>
 * This method creates WebGL shaders for the program's shader sources and attaches them to a new GLSL program.
 * This method then compiles the shaders and then links the program if compilation is successful.
 *
 * @alias AtmosphereProgram
 * @constructor
 * @augments GpuProgram
 * @classdesc AtmosphereProgram is a GLSL program that draws the atmosphere.
 * @param {WebGLRenderingContext} gl The current WebGL context.
 * @throws {ArgumentError} If the shaders cannot be compiled, or linking of
 * the compiled shaders into a program fails.
 */
function AtmosphereProgram(gl, vertexShaderSource, fragmentShaderSource, attribute) {

    // Call to the superclass, which performs shader program compiling and linking.
    GpuProgram.call(this, gl, vertexShaderSource, fragmentShaderSource, attribute);


    // Frag color mode indicates the atmospheric scattering color components written to the fragment color.
    this.FRAGMODE_SKY = 1;
    this.FRAGMODE_GROUND_PRIMARY = 2;
    this.FRAGMODE_GROUND_SECONDARY = 3;
    this.FRAGMODE_GROUND_PRIMARY_TEX_BLEND = 4;

    /**
     * The globe's atmosphere altitude.
     * @type {Number}
     * @default 160000.0 meters
     */
    this.altitude = 160000;

    /**
     * This atmosphere's Rayleigh scale depth.
     * @type {Number}
     * @default 0.25
     */
    this.rayleighScaleDepth = 0.25;

    /**
     * The WebGL location for this program's 'fragMode' uniform.
     * @type {WebGLUniformLocation}
     * @readonly
     */
    this.fragModeLocation = this.uniformLocation(gl, "fragMode");

    /**
     * The WebGL location for this program's 'mvpMatrix' uniform.
     * @type {WebGLUniformLocation}
     * @readonly
     */
    this.mvpMatrixLocation = this.uniformLocation(gl, "mvpMatrix");

    /**
     * The WebGL location for this program's 'texCoordMatrix' uniform.
     * @type {WebGLUniformLocation}
     * @readonly
     */
    this.texCoordMatrixLocation = this.uniformLocation(gl, "texCoordMatrix");

    /**
     * The WebGL location for this program's 'vertexOrigin' uniform.
     * @type {WebGLUniformLocation}
     * @readonly
     */
    this.vertexOriginLocation = this.uniformLocation(gl, "vertexOrigin");

    /**
     * The WebGL location for this program's 'eyePoint' uniform.
     * @type {WebGLUniformLocation}
     * @readonly
     */
    this.eyePointLocation = this.uniformLocation(gl, "eyePoint");

    /**
     * The WebGL location for this program's 'eyeMagnitude' uniform.
     * @type {WebGLUniformLocation}
     * @readonly
     */
    this.eyeMagnitudeLocation = this.uniformLocation(gl, "eyeMagnitude");

    /**
     * The WebGL location for this program's 'eyeMagnitude2' uniform.
     * @type {WebGLUniformLocation}
     * @readonly
     */
    this.eyeMagnitude2Location = this.uniformLocation(gl, "eyeMagnitude2");

    /**
     * The WebGL location for this program's 'lightDirection' uniform.
     * @type {WebGLUniformLocation}
     * @readonly
     */
    this.lightDirectionLocation = this.uniformLocation(gl, "lightDirection");

    /**
     * The WebGL location for this program's 'atmosphereRadius' uniform.
     * @type {WebGLUniformLocation}
     * @readonly
     */
    this.atmosphereRadiusLocation = this.uniformLocation(gl, "atmosphereRadius");

    /**
     * The WebGL location for this program's 'atmosphereRadius2' uniform.
     * @type {WebGLUniformLocation}
     * @readonly
     */
    this.atmosphereRadius2Location = this.uniformLocation(gl, "atmosphereRadius2");

    /**
     * The WebGL location for this program's 'globeRadius' uniform.
     * @type {WebGLUniformLocation}
     * @readonly
     */
    this.globeRadiusLocation = this.uniformLocation(gl, "globeRadius");

    /**
     * The WebGL location for this program's 'scale' uniform.
     * @type {WebGLUniformLocation}
     * @readonly
     */
    this.scaleLocation = this.uniformLocation(gl, "scale");

    /**
     * The WebGL location for this program's 'scaleDepth' uniform.
     * @type {WebGLUniformLocation}
     * @readonly
     */
    this.scaleDepthLocation = this.uniformLocation(gl, "scaleDepth");

    /**
     * The WebGL location for this program's 'scaleOverScaleDepth' uniform.
     * @type {WebGLUniformLocation}
     * @readonly
     */
    this.scaleOverScaleDepthLocation = this.uniformLocation(gl, "scaleOverScaleDepth");

    this.scratchArray9 = new Float32Array(9);
}

/**
 * A string that uniquely identifies this program.
 * @type {string}
 * @readonly
 */
AtmosphereProgram.key = "WorldWindGpuAtmosphereProgram";

// Inherit from GpuProgram.
AtmosphereProgram.prototype = Object.create(GpuProgram.prototype);

/**
 * Returns the atmosphere's altitude.
 * @returns {Number} The atmosphere's altitude in meters.
 */
AtmosphereProgram.prototype.getAltitude = function () {
    return this.altitude;
};

/**
 * Loads the specified number as the value of this program's 'fragMode' uniform variable.
 *
 * @param {WebGLRenderingContext} gl The current WebGL context.
 * @param {Number} fragMode The frag mode value.
 * @throws {ArgumentError} If the specified number is null or undefined.
 */
AtmosphereProgram.prototype.loadFragMode = function (gl, fragMode) {
    if (!fragMode) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "AtmosphereProgram", "loadFragMode", "missingFragMode"));
    }

    gl.uniform1i(this.fragModeLocation, fragMode);
};

/**
 * Loads the specified matrix as the value of this program's 'mvpMatrix' uniform variable.
 *
 * @param {WebGLRenderingContext} gl The current WebGL context.
 * @param {Matrix} matrix The matrix to load.
 * @throws {ArgumentError} If the specified matrix is null or undefined.
 */
AtmosphereProgram.prototype.loadModelviewProjection = function (gl, matrix) {
    if (!matrix) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "AtmosphereProgram", "loadModelviewProjection",
                "missingMatrix"));
    }

    this.loadUniformMatrix(gl, matrix, this.mvpMatrixLocation);
};

/**
 * Loads the specified vector as the value of this program's 'vertexOrigin' uniform variable.
 *
 * @param {WebGLRenderingContext} gl The current WebGL context.
 * @param {Vec3} vector The vector to load.
 * @throws {ArgumentError} If the specified vector is null or undefined.
 */
AtmosphereProgram.prototype.loadVertexOrigin = function (gl, vector) {
    if (!vector) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "AtmosphereProgram", "loadVertexOrigin", "missingVector"));
    }

    gl.uniform3f(this.vertexOriginLocation, vector[0], vector[1], vector[2]);
};

/**
 * Loads the specified vector as the value of this program's 'lightDirection' uniform variable.
 *
 * @param {WebGLRenderingContext} gl The current WebGL context.
 * @param {Vec3} vector The vector to load.
 * @throws {ArgumentError} If the specified vector is null or undefined.
 */
AtmosphereProgram.prototype.loadLightDirection = function (gl, vector) {
    if (!vector) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "AtmosphereProgram", "loadLightDirection", "missingVector"));
    }

    gl.uniform3f(this.lightDirectionLocation, vector[0], vector[1], vector[2]);
};

/**
 * Loads the specified vector as the value of this program's 'lightDirection' uniform variable,
 * the magnitude's specified vector as the value of this program's 'eyeMagnitude' uniform variable and
 * the squared magnitude's specified vector as the value of this program's 'eyeMagnitude2' uniform variable.
 *
 * @param {WebGLRenderingContext} gl The current WebGL context.
 * @param {Vec3} vector The vector to load.
 * @throws {ArgumentError} If the specified vector is null or undefined.
 */
AtmosphereProgram.prototype.loadEyePoint = function (gl, vector) {
    if (!vector) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "AtmosphereProgram", "loadEyePoint", "missingVector"));
    }

    gl.uniform3f(this.eyePointLocation, vector[0], vector[1], vector[2]);
    gl.uniform1f(this.eyeMagnitudeLocation, vector.magnitude());
    gl.uniform1f(this.eyeMagnitude2Location, vector.magnitudeSquared());
};

/**
 * Loads the specified number as the value of this program's 'globeRadius' uniform variable and the specified
 * number which add the altitude value as the value of this program's 'atmosphereRadius' uniform variable.
 *
 * @param {WebGLRenderingContext} gl The current WebGL context.
 * @param {Number} globeRadius The globe radius value.
 * @throws {ArgumentError} If the specified number is null or undefined.
 */
AtmosphereProgram.prototype.loadGlobeRadius = function (gl, globeRadius) {
    if (!globeRadius) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "AtmosphereProgram", "loadGlobeRadius",
                "missingGlobeRadius"));
    }

    var gr = globeRadius;
    var ar = gr + this.altitude;

    gl.uniform1f(this.globeRadiusLocation, gr);
    gl.uniform1f(this.atmosphereRadiusLocation, ar);
    gl.uniform1f(this.atmosphereRadius2Location, ar * ar);
};

/**
 * Sets the program's 'scale', 'scaleDepth' and 'scaleOverScaleDepth' uniform variables.
 *
 * @param {WebGLRenderingContext} gl The current WebGL context.
 */
AtmosphereProgram.prototype.setScale = function (gl) {
    gl.uniform1f(this.scaleLocation, 1 / this.getAltitude());
    gl.uniform1f(this.scaleDepthLocation, this.rayleighScaleDepth);
    gl.uniform1f(this.scaleOverScaleDepthLocation, 1 / this.getAltitude() / this.rayleighScaleDepth);
};

/**
 * Loads the specified matrix as the value of this program's 'texCoordMatrix' uniform variable.
 * @param {WebGLRenderingContext} gl The current WebGL context.
 * @param {Matrix3} matrix The texture coordinate matrix.
 */
AtmosphereProgram.prototype.loadTexMatrix = function (gl, matrix) {
    if (!matrix) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "AtmosphereProgram", "loadTexMatrix",
                "missingMatrix"));
    }

    matrix.columnMajorComponents(this.scratchArray9);
    gl.uniformMatrix3fv(this.texCoordMatrixLocation, false, this.scratchArray9);
};

export default AtmosphereProgram;
