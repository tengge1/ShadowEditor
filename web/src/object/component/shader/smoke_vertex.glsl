attribute float shift;
uniform float time;
uniform float size;
uniform float lifetime;
uniform float projection;
varying float progress;

float cubicOut( float t ) {

  float f = t - 1.0;
  return f * f * f + 1.0;

}

void main () {

  progress = fract( time * 2. / lifetime + shift );
  float eased = cubicOut( progress );
  vec3 pos = vec3( position.x * eased, position.y * eased, position.z );
  gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1. );
  gl_PointSize = ( projection * size ) / gl_Position.w;

}