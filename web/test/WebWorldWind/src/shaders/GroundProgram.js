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
        var GroundProgram = function (gl) {
            var vertexShaderSource =
                    'precision mediump int;\n' +

                    'const int FRAGMODE_GROUND_PRIMARY_TEX_BLEND = 4;\n' +
                    'const int SAMPLE_COUNT = 2;\n' +
                    'const float SAMPLES = 2.0;\n' +

                    'const float PI = 3.141592653589;\n' +
                    'const float Kr = 0.0025;\n' +
                    'const float Kr4PI = Kr * 4.0 * PI;\n' +
                    'const float Km = 0.0015;\n' +
                    'const float Km4PI = Km * 4.0 * PI;\n' +
                    'const float ESun = 15.0;\n' +
                    'const float KmESun = Km * ESun;\n' +
                    'const float KrESun = Kr * ESun;\n' +
                    'const vec3 invWavelength = vec3(5.60204474633241, 9.473284437923038, 19.643802610477206);\n' +
                    'const float rayleighScaleDepth = 0.25;\n' +

                    'uniform int fragMode;\n' +
                    'uniform mat4 mvpMatrix;\n' +
                    'uniform mat3 texCoordMatrix;\n' +
                    'uniform vec3 vertexOrigin;\n' +
                    'uniform vec3 eyePoint;\n' +
                    'uniform float eyeMagnitude;\n' + /* The eye point's magnitude */
                    'uniform float eyeMagnitude2;\n' + /* eyeMagnitude^2 */
                    'uniform vec3 lightDirection;\n' + /* The direction vector to the light source */
                    'uniform float atmosphereRadius;\n' + /* The outer (atmosphere) radius */
                    'uniform float atmosphereRadius2;\n' + /* atmosphereRadius^2 */
                    'uniform float globeRadius;\n' + /* The inner (planetary) radius */
                    'uniform float scale;\n' + /* 1 / (atmosphereRadius - globeRadius) */
                    'uniform float scaleDepth;\n' + /* The scale depth (i.e. the altitude at which
                     the atmosphere's average density is found) */
                    'uniform float scaleOverScaleDepth;\n' + /* fScale / fScaleDepth */

                    'attribute vec4 vertexPoint;\n' +
                    'attribute vec2 vertexTexCoord;\n' +

                    'varying vec3 primaryColor;\n' +
                    'varying vec3 secondaryColor;\n' +
                    'varying vec2 texCoord;\n' +

                    'float scaleFunc(float cos) {\n' +
                    '    float x = 1.0 - cos;\n' +
                    '    return scaleDepth * exp(-0.00287 + x*(0.459 + x*(3.83 + x*(-6.80 + x*5.25))));\n' +
                    '}\n' +

                    'void sampleGround() {\n' +
                    /* Get the ray from the camera to the vertex and its length (which is the far point of the ray passing through the
                     atmosphere) */
                    '    vec3 point = vertexPoint.xyz + vertexOrigin;\n' +
                    '    vec3 ray = point - eyePoint;\n' +
                    '    float far = length(ray);\n' +
                    '    ray /= far;\n' +

                    '    vec3 start;\n' +
                    '    if (eyeMagnitude < atmosphereRadius) {\n' +
                    '        start = eyePoint;\n' +
                    '    } else {\n' +
                    /* Calculate the closest intersection of the ray with the outer atmosphere (which is the near point of the ray
                     passing through the atmosphere) */
                    '        float B = 2.0 * dot(eyePoint, ray);\n' +
                    '        float C = eyeMagnitude2 - atmosphereRadius2;\n' +
                    '        float det = max(0.0, B*B - 4.0 * C);\n' +
                    '        float near = 0.5 * (-B - sqrt(det));\n' +

                    /* Calculate the ray's starting point, then calculate its scattering offset */
                    '        start = eyePoint + ray * near;\n' +
                    '        far -= near;\n' +
                    '}\n' +

                    '    float depth = exp((globeRadius - atmosphereRadius) / scaleDepth);\n' +
                    '    float eyeAngle = dot(-ray, point) / length(point);\n' +
                    '    float lightAngle = dot(lightDirection, point) / length(point);\n' +
                    '    float eyeScale = scaleFunc(eyeAngle);\n' +
                    '    float lightScale = scaleFunc(lightAngle);\n' +
                    '    float eyeOffset = depth*eyeScale;\n' +
                    '    float temp = (lightScale + eyeScale);\n' +

                    /* Initialize the scattering loop variables */
                    '    float sampleLength = far / SAMPLES;\n' +
                    '    float scaledLength = sampleLength * scale;\n' +
                    '    vec3 sampleRay = ray * sampleLength;\n' +
                    '    vec3 samplePoint = start + sampleRay * 0.5;\n' +

                    /* Now loop through the sample rays */
                    '    vec3 frontColor = vec3(0.0, 0.0, 0.0);\n' +
                    '    vec3 attenuate = vec3(0.0, 0.0, 0.0);\n' +
                    '    for(int i=0; i<SAMPLE_COUNT; i++)\n' +
                    '    {\n' +
                    '        float height = length(samplePoint);\n' +
                    '        float depth = exp(scaleOverScaleDepth * (globeRadius - height));\n' +
                    '        float scatter = depth*temp - eyeOffset;\n' +
                    '        attenuate = exp(-scatter * (invWavelength * Kr4PI + Km4PI));\n' +
                    '        frontColor += attenuate * (depth * scaledLength);\n' +
                    '        samplePoint += sampleRay;\n' +
                    '    }\n' +

                    '    primaryColor = frontColor * (invWavelength * KrESun + KmESun);\n' +
                    '    secondaryColor = attenuate;\n' + /* Calculate the attenuation factor for the ground */
                    '}\n' +

                    'void main()\n ' +
                    '{\n' +
                    '    sampleGround();\n' +
                    /* Transform the vertex point by the modelview-projection matrix */
                    '    gl_Position = mvpMatrix * vertexPoint;\n' +
                    '    if (fragMode == FRAGMODE_GROUND_PRIMARY_TEX_BLEND) {\n' +
                    /* Transform the vertex texture coordinate by the tex coord matrix */
                    '        texCoord = (texCoordMatrix * vec3(vertexTexCoord, 1.0)).st;\n' +
                    '    }\n' +
                    '}',
                fragmentShaderSource =
                    'precision mediump float;\n' +
                    'precision mediump int;\n' +

                    'const int FRAGMODE_GROUND_PRIMARY = 2;\n' +
                    'const int FRAGMODE_GROUND_SECONDARY = 3;\n' +
                    'const int FRAGMODE_GROUND_PRIMARY_TEX_BLEND = 4;\n' +

                    'uniform int fragMode;\n' +
                    'uniform sampler2D texSampler;\n' +

                    'varying vec3 primaryColor;\n' +
                    'varying vec3 secondaryColor;\n' +
                    'varying vec2 texCoord;\n' +

                    'void main (void)\n' +
                    '{\n' +
                    '    if (fragMode == FRAGMODE_GROUND_PRIMARY) {\n' +
                    '        gl_FragColor = vec4(primaryColor, 1.0);\n' +
                    '    } else if (fragMode == FRAGMODE_GROUND_SECONDARY) {\n' +
                    '        gl_FragColor = vec4(secondaryColor, 1.0);\n' +
                    '    } else if (fragMode == FRAGMODE_GROUND_PRIMARY_TEX_BLEND) {\n' +
                    '        vec4 texColor = texture2D(texSampler, texCoord);\n' +
                    '        gl_FragColor = vec4(primaryColor + texColor.rgb * (1.0 - secondaryColor), 1.0);\n' +
                    '    }\n' +
                    '}';

            // Call to the superclass, which performs shader program compiling and linking.
            AtmosphereProgram.call(this, gl, vertexShaderSource, fragmentShaderSource, ["vertexPoint", "vertexTexCoord"]);
        };

        /**
         * A string that uniquely identifies this program.
         * @type {string}
         * @readonly
         */
        GroundProgram.key = "WorldWindGroundProgram";

        // Inherit from AtmosphereProgram.
        GroundProgram.prototype = Object.create(AtmosphereProgram.prototype);

        export default GroundProgram;
    


