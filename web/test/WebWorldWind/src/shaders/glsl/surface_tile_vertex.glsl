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
attribute vec4 vertexPoint;
attribute vec4 vertexTexCoord;

uniform mat4 mvpMatrix;
uniform mat4 texSamplerMatrix;
uniform mat4 texMaskMatrix;

uniform int column;
uniform int row;
uniform int level;
uniform sampler2D heightmap;

varying vec2 texSamplerCoord;
varying vec2 texMaskCoord;

#define EARTH_RADIUS 6378137.0
#define MIN_LATITUDE -180.0
#define MAX_LATITUDE 180.0
#define MIN_LONGITUDE -180.0
#define MAX_LONGITUDE 180.0
#define PI 3.141592653589793

void main() {
// 每个瓦片位置
    float size = pow(2.0, float(level));
    float dlon = (MAX_LONGITUDE - MIN_LONGITUDE) / size;
    float dlat = (MAX_LATITUDE - MIN_LATITUDE) / size;

    float left = MIN_LONGITUDE + dlon * float(column);
    float top = MAX_LATITUDE - dlat * float(row);
    float right = left + dlon;
    float bottom = top - dlat;

    // 瓦片上每个小格位置
    // +0.5的原因是：position范围是-0.5到0.5
    float lon = left + (right - left) * (0.5 + vertexPoint.x);
    float lat = top - (top - bottom) * (0.5 + vertexPoint.y);

    lon = lon * PI / 180.0;
    lat = lat * PI / 180.0;

    // 墨卡托投影反算
    lat = 2.0 * atan(exp(lat)) - PI / 2.0;

    vec4 transformed = vec4(
        EARTH_RADIUS * cos(lat) * cos(lon),
        EARTH_RADIUS * sin(lat),
        -EARTH_RADIUS * cos(lat) * sin(lon),
        1.0
    );

    gl_Position = mvpMatrix * vertexPoint;
    /* Transform the vertex texture coordinate into sampler texture coordinates. */
    texSamplerCoord = (texSamplerMatrix * vertexTexCoord).st;
    /* Transform the vertex texture coordinate into mask texture coordinates. */
    texMaskCoord = (texMaskMatrix * vertexTexCoord).st;
}