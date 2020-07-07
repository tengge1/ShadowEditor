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
 * @exports GroundProgram
 */
import AtmosphereProgram from '../shaders/AtmosphereProgram';
import GroundVertex from './glsl/ground_vertex.glsl';
import GroundFragment from './glsl/ground_fragment.glsl';

/**
 * Constructs a new program.
 * Initializes, compiles and links this GLSL program with the source code for its vertex and fragment shaders.
 * <p>
 * This method creates WebGL shaders for the program's shader sources and attaches them to a new GLSL program.
 * This method then compiles the shaders and then links the program if compilation is successful. Use the bind
 * method to make the program current during rendering.
 *
 * @alias GroundProgram
 * @constructor
 * @augments AtmosphereProgram
 * @classdesc GroundProgram is a GLSL program that draws the ground component of the atmosphere.
 * @param {WebGLRenderingContext} gl The current WebGL context.
 * @throws {ArgumentError} If the shaders cannot be compiled, or linking of
 * the compiled shaders into a program fails.
 */
function GroundProgram(gl) {
    var vertexShaderSource = GroundVertex,
        fragmentShaderSource = GroundFragment;

    // Call to the superclass, which performs shader program compiling and linking.
    AtmosphereProgram.call(this, gl, vertexShaderSource, fragmentShaderSource, ["vertexPoint", "vertexTexCoord"]);
}

/**
 * A string that uniquely identifies this program.
 * @type {string}
 * @readonly
 */
GroundProgram.key = "WorldWindGroundProgram";

// Inherit from AtmosphereProgram.
GroundProgram.prototype = Object.create(AtmosphereProgram.prototype);

export default GroundProgram;



