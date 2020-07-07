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