/**
 * 墨卡托投影反算
 */
vec2 mercatorInvert(vec2 mercatorXY) 
{
    return vec2(
        mercatorXY.x,
        2.0 * atan(exp(mercatorXY.y)) - PI / 2.0
    );
}