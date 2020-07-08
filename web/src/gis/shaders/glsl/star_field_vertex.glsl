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
//.x = declination
//.y = right ascension
//.z = point size
//.w = magnitude
attribute vec4 vertexPoint;

uniform mat4 mvpMatrix;
// number of days (positive or negative) since Greenwich noon, Terrestrial Time,
// on 1 January 2000 (J2000.0)
uniform float numDays;
uniform vec2 magnitudeRange;

varying float magnitudeWeight;

// normalizes an angle between 0.0 and 359.0
float normalizeAngle(float angle) {
    float angleDivisions = angle / 360.0;
    return 360.0 * (angleDivisions - floor(angleDivisions));
}

// transforms declination and right ascension in cartesian coordinates
vec3 computePosition(float dec, float ra) {
    float GMST = normalizeAngle(280.46061837 + 360.98564736629 * numDays);
    float GHA = normalizeAngle(GMST - ra);
    float lon = -GHA + 360.0 * step(180.0, GHA);
    float latRad = radians(dec);
    float lonRad = radians(lon);
    float radCosLat = cos(latRad);
    return vec3(radCosLat * sin(lonRad), sin(latRad), radCosLat * cos(lonRad));
}

// normalizes a value between 0.0 and 1.0
float normalizeScalar(float value, float minValue, float maxValue){
    return (value - minValue) / (maxValue - minValue);
}

void main() {
    vec3 vertexPosition = computePosition(vertexPoint.x, vertexPoint.y);
    gl_Position = mvpMatrix * vec4(vertexPosition.xyz, 1.0);
    gl_Position.z = gl_Position.w - 0.00001;
    gl_PointSize = vertexPoint.z;
    magnitudeWeight = normalizeScalar(vertexPoint.w, magnitudeRange.x, magnitudeRange.y);
}