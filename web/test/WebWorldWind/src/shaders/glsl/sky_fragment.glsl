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
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

const float g = -0.95;
const float g2 = g * g;

uniform mediump vec3 lightDirection;

varying vec3 primaryColor;
varying vec3 secondaryColor;
varying vec3 direction;

void main (void) {
    float cos = dot(lightDirection, direction) / length(direction);
    float rayleighPhase = 0.75 * (1.0 + cos * cos);
    float miePhase = 1.5 * ((1.0 - g2) / (2.0 + g2)) * (1.0 + cos*cos) /
        pow(1.0 + g2 - 2.0*g*cos, 1.5);
    const float exposure = 2.0;
    vec3 color = primaryColor * rayleighPhase + secondaryColor * miePhase;
    color = vec3(1.0) - exp(-exposure * color);
    gl_FragColor = vec4(color, color.b);
}