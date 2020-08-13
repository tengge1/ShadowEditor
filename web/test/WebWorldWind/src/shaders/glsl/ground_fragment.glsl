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
precision mediump int;

const int FRAGMODE_GROUND_PRIMARY = 2;
const int FRAGMODE_GROUND_SECONDARY = 3;
const int FRAGMODE_GROUND_PRIMARY_TEX_BLEND = 4;

uniform int fragMode;
uniform sampler2D texSampler;

varying vec3 primaryColor;
varying vec3 secondaryColor;
varying vec2 texCoord;

void main (void) {
    if (fragMode == FRAGMODE_GROUND_PRIMARY) {
        gl_FragColor = vec4(primaryColor, 1.0);
    } else if (fragMode == FRAGMODE_GROUND_SECONDARY) {
        gl_FragColor = vec4(secondaryColor, 1.0);
    } else if (fragMode == FRAGMODE_GROUND_PRIMARY_TEX_BLEND) {
        vec4 texColor = texture2D(texSampler, texCoord);
        gl_FragColor = vec4(primaryColor + texColor.rgb * (1.0 - secondaryColor), 1.0);
    }
}