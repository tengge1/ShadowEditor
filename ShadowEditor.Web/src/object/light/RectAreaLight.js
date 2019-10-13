/**
 * 矩形光源
 * @param {*} color 颜色
 * @param {Number} intensity 强度
 * @param {Number} width 宽度
 * @param {Number} height 高度
 */
function RectAreaLight(color, intensity, width, height) {
    THREE.RectAreaLight.call(this, color, intensity, width, height);
}

RectAreaLight.prototype = Object.create(THREE.RectAreaLight.prototype);
RectAreaLight.prototype.constructor = RectAreaLight;

export default RectAreaLight;