precision highp float;

varying vec4 vTransformed;

#define EARTH_RADIUS 6378137.0

void main() 
{
    //float r = sqrt(vTransformed.x * vTransformed.x + vTransformed.y + vTransformed.y);

    //if(r < 4000000.0) {
    //    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
    //} else {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 0.5);
    //}
}