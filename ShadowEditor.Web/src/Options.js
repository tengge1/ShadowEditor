/**
 * 配置选项
 * @author tengge / https://github.com/tengge1
 * @param {*} options 配置选项
 */
function Options(options) {
    options = options || {};

    // 服务器配置
    this.server = options.server || location.origin; // 服务端地址

    // 外观配置
    this.theme = options.theme || 'assets/css/light.css'; // 皮肤

    // 帮助器配置
    this.showGrid = true; // 是否显示网格
    this.showCameraHelper = true; // 是否显示相机帮助器
    this.showPointLightHelper = false; // 是否显示点光源帮助器
    this.showDirectionalLightHelper = true; // 是否显示平行光帮助器
    this.showSpotLightHelper = true; // 是否显示聚光灯帮助器
    this.showHemisphereLightHelper = true; // 是否显示半球光帮助器
    this.showRectAreaLightHelper = true; // 是否显示矩形光帮助器
    this.showSkeletonHelper = false; // 是否显示骨骼帮助器
}

export default Options;