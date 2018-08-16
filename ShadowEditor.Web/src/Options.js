/**
 * 配置选项
 * @param {*} options 配置选项
 */
function Options(options) {
    options = options || {};
    this.server = options.server || location.origin;
}

export default Options;