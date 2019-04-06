import WGS84 from '../core/WGS84';

const RADIAN_PER_DEGREE = Math.PI / 180;
const DEGREE_PER_RADIAN = 180 / Math.PI;

const MAX_PROJECTED_COORD = 20037508.3427892; // 墨卡托最大投影坐标（地球周长一半）

/**
 * 经纬度、海拔转笛卡尔坐标
 * 坐标系：
 * 原点：地心
 * x轴：经度0，纬度0
 * y轴：指向北极
 * z轴：西经90，纬度0
 * @param {THREE.Vector3} lonlat 经纬度（弧度）、海拔
 * @param {THREE.Vector3} xyz 笛卡尔坐标
 */
function _lonlatToXYZ(lonlat, xyz) {
    var lon = lonlat.x;
    var lat = lonlat.y;
    var r = WGS84.a + (lonlat.z || 0);

    if (xyz === undefined) {
        xyz = new THREE.Vector3();
    }

    return xyz.set(
        r * Math.cos(lat) * Math.cos(lon),
        r * Math.sin(lat),
        -r * Math.cos(lat) * Math.sin(lon),
    );
}

/**
 * 经纬度、海拔转笛卡尔坐标
 * @param {THREE.Vector3} lonlat 经纬度（角度）、海拔
 * @param {THREE.Vector3} xyz 笛卡尔坐标
 */
function lonlatToXYZ(lonlat, xyz) {
    if (xyz === undefined) {
        xyz = new THREE.Vector3();
    }

    xyz.set(
        lonlat.x * RADIAN_PER_DEGREE,
        lonlat.y * RADIAN_PER_DEGREE,
        lonlat.z,
    );

    return _lonlatToXYZ(xyz, xyz);
}

/**
 * 笛卡尔坐标转经纬度（弧度）、海拔
 * @param {THREE.Vector3} xyz 笛卡尔坐标
 * @param {THREE.Vector3} lonlat 经纬度（弧度）、海拔
 */
function _xyzToLonlat(xyz, lonlat) {
    var lon = -Math.sign(xyz.z) * Math.acos(xyz.x / Math.sqrt(xyz.x ** 2 + xyz.z ** 2));
    var lat = Math.atan(xyz.y / Math.sqrt(xyz.x ** 2 + xyz.z ** 2));
    var alt = Math.sqrt(xyz.x ** 2 + xyz.y ** 2 + xyz.z ** 2) - WGS84.a;

    if (lonlat === undefined) {
        lonlat = new THREE.Vector3();
    }

    return lonlat.set(
        lon,
        lat,
        alt,
    );
}

/**
 * 笛卡尔坐标转经纬度（角度）、海拔
 * @param {THREE.Vector3} xyz 笛卡尔坐标
 * @param {THREE.Vector3} lonlat 经纬度（角度）、海拔
 */
function xyzToLonlat(xyz, lonlat) {
    if (lonlat === undefined) {
        lonlat = new THREE.Vector3();
    }

    _xyzToLonlat(xyz, lonlat);
    lonlat.x *= DEGREE_PER_RADIAN;
    lonlat.y *= DEGREE_PER_RADIAN;

    return lonlat;
}

/**
 * 层级转海拔
 * @param {Number} zoom 层级
 */
function zoomToAlt(zoom) {
    return 7820683 / 2 ** zoom;
}

/**
 * 海拔转层级
 * @param {Number} alt 海拔
 */
function altToZoom(alt) {
    return Math.log2(7820683 / alt);
}

/**
 * 墨卡托投影（弧度）
 * @param {Number} lat 纬度（弧度）
 * @see https://github.com/d3/d3-geo/blob/master/src/projection/mercator.js
 */
function _mercatorLat(lat) {
    return Math.log(Math.tan((Math.PI / 2 + lat) / 2));
}

/**
 * 墨卡托投影（角度）
 * @param {Number} lat 纬度（角度）
 * @see https://github.com/d3/d3-geo/blob/master/src/projection/mercator.js
 */
function mercatorLat(lat) {
    return _mercatorLat(lat * RADIAN_PER_DEGREE) * DEGREE_PER_RADIAN;
}

/**
 * 墨卡托投影反算（弧度）
 * @param {Number} y 墨卡托投影Y坐标
 * @see https://github.com/d3/d3-geo/blob/master/src/projection/mercator.js
 */
function _mercatorLatInvert(y) {
    return 2 * Math.atan(Math.exp(y)) - Math.PI / 2;
}

/**
 * 墨卡托投影反算（角度）
 * @param {Number} y 墨卡托投影Y坐标
 * @see https://github.com/d3/d3-geo/blob/master/src/projection/mercator.js
 */
function mercatorLatInvert(y) {
    return _mercatorLatInvert(y) * DEGREE_PER_RADIAN;
}

/**
 * 计算两个经纬度之间距离(弧度)
 * @param {*} lon1 经度1(弧度)
 * @param {*} lat1 纬度1(弧度)
 * @param {*} lon2 经度2(弧度)
 * @param {*} lat2 纬度2(弧度)
 * @see https://www.xuebuyuan.com/2173606.html
 */
function _getDistance(lon1, lat1, lon2, lat2) {
    return 2 * 6378137 * Math.asin(Math.sqrt(Math.pow(Math.sin((lat1 - lat2) / 2), 2) +
        Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin((lon1 - lon2) / 2), 2)));
}

/**
 * 计算两个经纬度之间距离(角度)
 * @param {*} lon1 经度1(角度)
 * @param {*} lat1 纬度1(角度)
 * @param {*} lon2 经度2(角度)
 * @param {*} lat2 纬度2(角度)
 * @see https://www.xuebuyuan.com/2173606.html
 */
function getDistance(lon1, lat1, lon2, lat2) {
    lon1 *= RADIAN_PER_DEGREE;
    lat1 *= RADIAN_PER_DEGREE;
    lon2 *= RADIAN_PER_DEGREE;
    lat2 *= RADIAN_PER_DEGREE;

    return _getDistance(lon1, lat1, lon2, lat2);
}

/**
 * 数学工具
 * @author tengge / https://github.com/tengge1
 */
var GeoUtils = {
    // 经纬度海拔转笛卡尔坐标
    _lonlatToXYZ,
    lonlatToXYZ,

    // 笛卡尔坐标转经纬度海拔
    _xyzToLonlat,
    xyzToLonlat,

    // 层级转海拔
    zoomToAlt,

    // 海拔转层级
    altToZoom,

    // 墨卡托投影
    _mercatorLat,
    mercatorLat,

    // 墨卡托投影反算
    _mercatorLatInvert,
    mercatorLatInvert,

    // 计算两个经纬度之间距离
    _getDistance,
    getDistance,
};

export default GeoUtils;