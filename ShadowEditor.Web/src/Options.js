/**
 * 配置选项
 * @param {*} options 配置选项
 */
function Options(options) {
    options = options || {};
    this.server = options.server || location.origin;

    this.gravityConstant = -9.8; // 重力加速度
}

export default Options;