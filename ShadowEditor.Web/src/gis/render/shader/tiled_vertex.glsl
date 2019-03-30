precision highp float;

uniform int x;
uniform int y;
uniform int z;

varying vec2 vUV;

// 必应地图参数
#define EARTH_RADIUS 6378137.0
#define MIN_LATITUDE -85.05112878
#define MAX_LATITUDE 85.05112878
#define MIN_LONGITUDE -180.0
#define MAX_LONGITUDE 180.0
#define PI 3.141592653589793

void main() {
    // 每个瓦片位置
    float size = pow(2.0, float(z));
    float dlon = (MAX_LONGITUDE - MIN_LONGITUDE) / size;
    float dlat = (MAX_LATITUDE - MIN_LATITUDE) / size;

    float left = MIN_LONGITUDE + dlon * float(x);
    float top = MAX_LATITUDE - dlat * float(y);
    float right = left + dlon;
    float bottom = top - dlat;

    // 瓦片上每个小格位置
    // +0.5的原因是：position范围是-0.5到0.5
    float lon = left + (right - left) * (0.5 + position.x);
    float lat = top - (top - bottom) * (0.5 + position.y);

    lon = lon * PI / 180.0;
    lat = lat * PI / 180.0;

    vec3 transformed = vec3(
        EARTH_RADIUS * cos(lat) * cos(lon),
        EARTH_RADIUS * cos(lat) * sin(lon),
        EARTH_RADIUS * sin(lat)
    );

    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);

    vUV = uv;
}