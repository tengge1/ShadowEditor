import WGS84 from '../core/WGS84';

/**
 * 经纬度、海拔转笛卡尔坐标
 * @param {THREE.Vector3} lonlat 经纬度、海拔
 * @param {THREE.Vector3} xyz 笛卡尔坐标
 */
function lonlatToXYZ(lonlat, xyz) {
    var lon = lonlat.x * Math.PI / 180;
    var lat = lonlat.y * Math.PI / 180;
    var r = WGS84.a + lonlat.z;

    xyz.set(
        r * Math.cos(lat) * Math.cos(lon),
        r * Math.cos(lat) * Math.sin(lon),
        r * Math.sin(lat),
    );

    return xyz;
}

/**
 * 笛卡尔坐标转经纬度
 * @param {THREE.Vector3} xyz 
 * @param {THREE.Vector3} lonlat 
 */
function xyzToLonlat(xyz, lonlat) {

}

/**
 * 层级转海拔
 * @param {*} zoom 
 */
function zoomToAltitude(zoom) {

}

/**
 * 海拔转层级
 * @param {*} alt 
 */
function altitudeToZoom(alt) {

}

/**
 * 数学工具
 */
var MathUtils = {
    lonlatToXYZ,

    xyzToLonlat,

    zoomToAltitude,

    altitudeToZoom,
};

export default MathUtils;