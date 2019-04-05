/**
 * 配置选项
 * @author tengge / https://github.com/tengge1
 * @param {*} options 配置选项
 */
function Options(options = {}) {
    // 服务端配置
    this.server = options.server === undefined ? location.origin : options.server; // 服务端地址

    // 阴影配置
    this.shadowMapType = THREE.PCFSoftShadowMap;

    // gamma校正
    this.gammaInput = false;
    this.gammaOutput = false;
    this.gammaFactor = 2.0;

    // 滤镜
    this.hueRotate = 0;
    this.saturate = 1;
    this.brightness = 1;
    this.blur = 0;
    this.contrast = 1;
    this.grayscale = 0;
    this.invert = 0;
    this.sepia = 0;

    // GIS配置
    this.proxy = options.proxy || false;
}

export default Options;