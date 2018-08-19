/**
 * 配置选项
 * @param {*} options 配置选项
 */
function Options(options) {
    options = options || {};
    this.server = options.server || location.origin; // 服务端地址
    this.theme = options.theme || 'assets/css/light.css'; // 皮肤
}

export default Options;