/**
 * 画布工具类
 */
const CanvasUtils = {
    /**
     * 扩大到2的整数倍
     * @param {Number} num 数字
     * @returns {Number} 数字
     */
    makePowerOfTwo: function (num) {
        let result = 1;
        while (result < num) {
            result *= 2;
        }
        return result;
    }
};

export default CanvasUtils;