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

    if (xyz === undefined) {
        xyz = new THREE.Vector3();
    }

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
    var lon = Math.atan(xyz.y / Math.sqrt(xyz.x ** 2 + xyz.y ** 2));
    var lat = Math.atan(xyz.z / Math.sqrt(xyz.x ** 2 + xyz.y ** 2));
    var alt = Math.sqrt(xyz.x ** 2 + xyz.y ** 2 + xyz.z ** 2) - WGS84.a;

    if (lonlat === undefined) {
        lonlat = new THREE.Vector3();
    }

    lonlat.set(
        lon * 180 / Math.PI,
        lat * 180 / Math.PI,
        alt,
    );
}

/**
 * 层级转海拔
 * @param {*} zoom 层级
 */
function zoomToAlt(zoom) {
    return 7820683 / 2 ** zoom;
}

/**
 * 海拔转层级
 * @param {*} alt 海拔
 */
function altToZoom(alt) {
    return Math.log2(7820683 / alt);
}

/**
 * 数学工具
 */
var MathUtils = {
    // 经纬度海拔转笛卡尔坐标
    lonlatToXYZ,

    // 笛卡尔坐标转经纬度海拔
    xyzToLonlat,

    // 层级转海拔
    zoomToAlt,

    // 海拔转层级
    altToZoom,
};

export default MathUtils;