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

uniform sampler2D textureSampler;
uniform int textureEnabled;

varying float magnitudeWeight;

const vec4 white = vec4(1.0, 1.0, 1.0, 1.0);
const vec4 grey = vec4(0.5, 0.5, 0.5, 1.0);

void main() {
    if (textureEnabled == 1) {
        gl_FragColor = texture2D(textureSampler, gl_PointCoord);
    } else {
        // paint the starts in shades of grey, where the brightest star is white and the dimmest star is grey
        gl_FragColor = mix(white, grey, magnitudeWeight);
    }
}