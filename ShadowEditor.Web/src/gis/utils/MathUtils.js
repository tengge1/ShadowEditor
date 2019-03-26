import WGS84 from '../core/WGS84';

/**
 * 数学工具
 */
var MathUtils = {
    /**
     * 经纬度海拔转笛卡尔坐标
     */
    lonlatToXYZ: function (lon, lat, alt) {

    },

    /**
     * 笛卡尔坐标转经纬度
     */
    xyzToLonlat: function (x, y, z) {

    },

    /**
     * 层级转相机到地球表面距离
     */
    zoomToDistance: function (zoom) {
        return 7820683 / Math.pow(2, level);
    }
};

export default MathUtils;