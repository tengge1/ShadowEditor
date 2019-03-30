import WGS84 from '../core/WGS84';

const MAX_PROJECTED_COORD = 20037508.3427892; // 墨卡托最大投影坐标（地球周长一半）

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

    return xyz.set(
        r * Math.cos(lat) * Math.cos(lon),
        r * Math.cos(lat) * Math.sin(lon),
        r * Math.sin(lat),
    );
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

    return lonlat.set(
        lon * 180 / Math.PI,
        lat * 180 / Math.PI,
        alt,
    );
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
 * 墨卡托投影
 * @param {THREE.Vector3} lonlat 
 * @param {THREE.Vector3} mercatorXY 
 * @see https://github.com/d3/d3-geo/blob/master/src/projection/mercator.js
 */
function mercator(lonlat, mercatorXY) {
    return mercatorXY.set(
        lonlat.lon,
        Math.log(Math.tan((Math.PI / 2 + lat) / 2))
    );
}

/**
 * 墨卡托投影反算
 * @param {THREE.Vector3} mercatorXY 
 * @param {THREE.Vector3} lonlat 
 * @see https://github.com/d3/d3-geo/blob/master/src/projection/mercator.js
 */
function mercatorInvert(mercatorXY, lonlat) {
    return {
        lon: x,
        lat: 2 * Math.atan(Math.exp(y)) - Math.PI / 2
    };
}

/**
 * 获取切片的墨卡托投影坐标范围
 * @param {*} x 切片坐标x
 * @param {*} y 切片坐标y
 * @param {*} z 层级level
 * @returns 切片的墨卡托投影坐标范围
 */
function getMercatorAabbByGrid(x, y, z) {
    const size = 2 * this.MAX_PROJECTED_COORD / Math.pow(2, z);
    const minX = -this.MAX_PROJECTED_COORD + x * size;
    const maxX = minX + size;
    const maxY = this.MAX_PROJECTED_COORD - y * size;
    const minY = maxY - size;
    return {
        minX: minX,
        minY: minY,
        maxX: maxX,
        maxY: maxY
    };
};

/**
 * 获取切片的经纬度坐标范围（弧度）
 * @param {*} x 切片坐标x
 * @param {*} y 切片坐标y
 * @param {*} z 层级level
 * @returns 经纬度坐标范围（弧度）
 */
function getAabbByGrid(x, y, z) {
    const aabb = this.getMercatorAabbByGrid(x, y, z);
    const min = this._mercatorInvert(aabb.minX / Wgs84.a, aabb.minY / Wgs84.a);
    const max = this._mercatorInvert(aabb.maxX / Wgs84.a, aabb.maxY / Wgs84.a);
    return {
        minLon: min.lon,
        minLat: min.lat,
        maxLon: max.lon,
        maxLat: max.lat
    };
};

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

    // 墨卡托投影
    mercator,

    // 墨卡托投影反算
    mercatorInvert,
};

export default MathUtils;