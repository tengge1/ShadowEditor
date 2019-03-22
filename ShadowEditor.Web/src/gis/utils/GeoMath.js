/**
 * 距离工具
 */
var GeoMath = {
    /**
     * 距离转层级
     */
    distanceToZoom: function (distance) {
        if (distance <= 100) {
            return 18;
        } else if (distance <= 200) {
            return 17;
        } else if (distance <= 400) {
            return 16;
        } else if (distance <= 800) {
            return 15;
        } else if (distance <= 1600) {
            return 14;
        } else if (distance <= 3200) {
            return 10;
        } else if (distance <= 6400) {
            return 4;
        } else {
            return 1;
        }
    }

};

export default GeoMath;