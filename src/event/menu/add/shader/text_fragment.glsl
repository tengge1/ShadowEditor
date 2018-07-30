uniform sampler2D texture;
varying float progress;

void main() {

  vec3 color = vec3( 1. );
  gl_FragColor = texture2D( texture, gl_PointCoord ) * vec4( color, .3 * ( 1. - progress ) );

}