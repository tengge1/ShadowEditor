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
precision mediump float;
/* Uniform sampler indicating the texture 2D unit (0, 1, 2, etc.) to use when sampling texture color. */
uniform sampler2D texSampler;
uniform float opacity;
uniform vec4 color;
uniform bool modulateColor;

varying vec2 texSamplerCoord;
varying vec2 texMaskCoord;

/*
 * Returns true when the texture coordinate samples texels outside the texture image.
 */
bool isInsideTextureImage(const vec2 coord) {
    return coord.x >= 0.0 && coord.x <= 1.0 && coord.y >= 0.0 && coord.y <= 1.0;
}

/*
 * OpenGL ES Shading Language v1.00 fragment shader for SurfaceTileRendererProgram. Writes the value of the texture 2D
 * object bound to texSampler at the current transformed texture coordinate, multiplied by the uniform opacity. Writes
 * transparent black (0, 0, 0, 0) if the transformed texture coordinate indicates a texel outside of the texture data's
 * standard range of [0,1].
 */
void main(void) {
    float mask = float(isInsideTextureImage(texMaskCoord));
    if (modulateColor) {
        gl_FragColor = color * mask * floor(texture2D(texSampler, texSamplerCoord).a + 0.5);
    } else {
        /* Return either the sampled texture2D color multiplied by opacity or transparent black. */
        gl_FragColor = texture2D(texSampler, texSamplerCoord) * mask * opacity;
    }
}