/**
 * 墨卡托投影
 */
vec2 mercator(vec2 lonlat) 
{
    return vec2(
        lonlat.x,
        log(tan((PI / 2.0 + lonlat.y) / 2.0))
    );
}