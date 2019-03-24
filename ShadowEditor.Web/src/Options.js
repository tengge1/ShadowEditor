/**
 * 配置选项
 * @author tengge / https://github.com/tengge1
 * @param {*} options 配置选项
 */
function Options(options = {}) {
    this.server = options.server === undefined ? location.origin : options.server; // 服务端地址
}

export default Options;