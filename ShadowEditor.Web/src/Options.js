/**
 * 配置选项
 * @author tengge / https://github.com/tengge1
 * @param {*} options 配置选项
 */
function Options(options) {
    options = options || {};
    this.server = options.server || location.origin; // 服务端地址
    this.theme = options.theme || 'assets/css/light.css'; // 皮肤
    this.outline = options.outline || false; // 是否渲染边框
}

export default Options;