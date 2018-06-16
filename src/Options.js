/**
 * 配置选项
 * @param {*} options 配置选项
 */
function Options(options) {
    options = options || {};
    this.server = options.server || 'http://127.0.0.1:1050';
}

export default Options;