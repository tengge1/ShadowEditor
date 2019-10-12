/**
 * 点光源
 * @param {*} color 颜色
 * @param {Number} intensity 强度
 * @param {Number} distance 距离
 * @param {Number} decay 衰变
 */
function PointLight(color, intensity, distance, decay) {
    THREE.PointLight.call(this, color, intensity, distance, decay);
}

PointLight.prototype = Object.create(THREE.PointLight.prototype);
PointLight.prototype.constructor = PointLight;

export default PointLight;