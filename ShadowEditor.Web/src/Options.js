/**
 * 配置选项
 * @author tengge / https://github.com/tengge1
 * @param {*} options 配置选项
 */
function Options(options = {}) {
    // 服务端配置
    this.server = options.server === undefined ? location.origin : options.server; // 服务端地址

    if (!this.server.startsWith('http')) {
        this.server = `http://${this.server}`;
    }

    this.sceneType = options.sceneType === undefined ? 'Empty' : options.sceneType; // 场景类型：Empty, GIS

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
}

export default Options;