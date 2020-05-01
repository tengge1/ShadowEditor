#include <lengthSq>

/**
 * 求两个向量之间的夹角
 */
float angleTo(vec3 v1, vec3 v2) {
    float theta = dot(v1, v2) / sqrt(lengthSq(v1) * lengthSq(v2) );
    
    // clamp, to handle numerical problems
    return acos(clamp(theta, -1.0, 1.0));
}