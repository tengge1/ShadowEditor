import WGS84 from '../core/WGS84';

const MAX_PROJECTED_COORD = 20037508.3427892; // 墨卡托最大投影坐标（地球周长一半）

/**
 * 经纬度、海拔转笛卡尔坐标
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
        r * Math.cos(lat) * Math.sin(lon),
        r * Math.sin(lat),
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
        lonlat.x * Math.PI / 180,
        lonlat.y * Math.PI / 180,
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
    var lon = Math.atan(xyz.y / Math.sqrt(xyz.x ** 2 + xyz.y ** 2));
    var lat = Math.atan(xyz.z / Math.sqrt(xyz.x ** 2 + xyz.y ** 2));
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
    lonlat.x *= 180 / Math.PI;
    lonlat.y *= 180 / Math.PI;

    return lonlat;
}

/**
 * 层级转海拔
 * @param {float} zoom 层级
 */
function zoomToAlt(zoom) {
    return 7820683 / 2 ** zoom;
}

/**
 * 海拔转层级
 * @param {float} alt 海拔
 */
function altToZoom(alt) {
    return Math.log2(7820683 / alt);
}

/**
 * 墨卡托投影（弧度）
 * @param {THREE.Vector2} lonlat 经纬度（弧度）
 * @param {THREE.Vector2} mercatorXY 墨卡托投影坐标
 * @see https://github.com/d3/d3-geo/blob/master/src/projection/mercator.js
 */
function _mercator(lonlat, mercatorXY) {
    if (mercatorXY === undefined) {
        mercatorXY = new THREE.Vector2();
    }
    return mercatorXY.set(
        lonlat.x,
        Math.log(Math.tan((Math.PI / 2 + lonlat.y) / 2))
    );
}

/**
 * 墨卡托投影（角度）
 * @param {THREE.Vector2} lonlat 经纬度（角度）
 * @param {THREE.Vector2} mercatorXY 墨卡托投影坐标
 * @see https://github.com/d3/d3-geo/blob/master/src/projection/mercator.js
 */
function mercator(lonlat, mercatorXY) {
    if (mercatorXY === undefined) {
        mercatorXY = new THREE.Vector2();
    }

    mercatorXY.x = lonlat.x * Math.PI / 180;
    mercatorXY.y = lonlat.y * Math.PI / 180;

    return _mercator(mercatorXY, mercatorXY);
}

/**
 * 墨卡托投影反算（弧度）
 * @param {THREE.Vector2} mercatorXY 墨卡托坐标
 * @param {THREE.Vector2} lonlat 经纬度（弧度）
 * @see https://github.com/d3/d3-geo/blob/master/src/projection/mercator.js
 */
function _mercatorInvert(mercatorXY, lonlat) {
    if (lonlat === undefined) {
        lonlat = new THREE.Vector2();
    }

    return lonlat.set(
        mercatorXY.x,
        2 * Math.atan(Math.exp(mercatorXY.y)) - Math.PI / 2
    );
}

/**
 * 墨卡托投影反算（角度）
 * @param {THREE.Vector3} mercatorXY 墨卡托坐标
 * @param {THREE.Vector3} lonlat 经纬度（角度）
 * @see https://github.com/d3/d3-geo/blob/master/src/projection/mercator.js
 */
function mercatorInvert(mercatorXY, lonlat) {
    if (lonlat === undefined) {
        lonlat = new THREE.Vector2();
    }

    _mercatorInvert(mercatorXY, lonlat);

    lonlat.x *= 180 / Math.PI;
    lonlat.y *= 180 / Math.PI;

    return lonlat;
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
    lon1 *= Math.PI / 180;
    lat1 *= Math.PI / 180;
    lon2 *= Math.PI / 180;
    lat2 *= Math.PI / 180;

    return _getDistance(lon1, lat1, lon2, lat2);
}

/**
 * 获取瓦片墨卡托投影范围(弧度)
 * @param {*} x 
 * @param {*} y 
 * @param {*} z 
 */
function _getTileMercatorBox(x, y, z) {
    var size = Math.PI * 2 / 2 ** z;
    var minX = -Math.PI + size * x;
    var maxX = minX + size;
    var maxY = Math.PI - size * y;
    var minY = maxY - size;

    return { minX, minY, maxX, maxY };
}

/**
 * 获取瓦片墨卡托投影范围(角度)
 * @param {*} x 
 * @param {*} y 
 * @param {*} z 
 */
function getTileMercatorBox(x, y, z) {
    var aabb = _getTileMercatorBox(x, y, z);

    aabb.minX *= 180 / Math.PI;
    aabb.minY *= 180 / Math.PI;
    aabb.maxX *= 180 / Math.PI;
    aabb.maxY *= 180 / Math.PI;

    return { minX, minY, maxX, maxY };
}

/**
 * 数学工具
 * @author tengge / https://github.com/tengge1
 */
var MathUtils = {
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
    _mercator,
    mercator,

    // 墨卡托投影反算
    _mercatorInvert,
    mercatorInvert,

    // 计算两个经纬度之间距离
    _getDistance,
    getDistance,

    // 获取瓦片墨卡托投影范围
    _getTileMercatorBox,
    getTileMercatorBox,
};

export default MathUtils;