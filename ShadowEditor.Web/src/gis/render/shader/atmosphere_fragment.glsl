precision highp float;

varying vec4 vTransformed;

// three.js生成的球体半径是0.5，所以要除以2
#define HALF_EARTH_RADIUS 3189068.5

void main() 
{
    //float r = sqrt(vTransformed.x * vTransformed.x + vTransformed.y * vTransformed.y);
    
    //float rate = (r - HALF_EARTH_RADIUS) / (HALF_EARTH_RADIUS * 1.02);
    
    //float red = smoothstep(0.0, 1.0, rate);
    //float opacity = smoothstep(1.0, 0.0, rate);

    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}