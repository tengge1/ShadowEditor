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

uniform float opacity;
uniform vec4 color;
uniform bool enableTexture;
uniform bool modulateColor;
uniform sampler2D textureSampler;
uniform bool applyLighting;

varying vec2 texCoord;
varying vec4 normal;

void main() {
    vec4 textureColor = texture2D(textureSampler, texCoord);
    float ambient = 0.15;
    vec4 lightDirection = vec4(0, 0, 1, 0);
    
    if (enableTexture && !modulateColor)
        gl_FragColor = textureColor * color * opacity;
    else if (enableTexture && modulateColor)
        gl_FragColor = color * floor(textureColor.a + 0.5);
    else
        gl_FragColor = color * opacity;
    if (gl_FragColor.a == 0.0) {
        discard;
    }
    if (applyLighting) {
        vec4 n = normal * (gl_FrontFacing ? 1.0 : -1.0);
        gl_FragColor.rgb *= clamp(ambient + dot(lightDirection, n), 0.0, 1.0);
    }
}