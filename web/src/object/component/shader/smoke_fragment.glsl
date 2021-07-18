uniform sampler2D texture2;
varying float progress;

void main() {

  vec3 color = vec3( 1. );
  gl_FragColor = texture2D( texture2, gl_PointCoord ) * vec4( color, .3 * ( 1. - progress ) );

}