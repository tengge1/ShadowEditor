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
    this.showGrid = options.showGrid === undefined ? true : options.showGrid; // 是否显示网格
    this.showCameraHelper = options.showCameraHelper === undefined ? true : options.showCameraHelper; // 是否显示相机帮助器
    this.showPointLightHelper = options.showPointLightHelper === undefined ? true : options.showPointLightHelper; // 是否显示点光源帮助器
    this.showDirectionalLightHelper = options.showDirectionalLightHelper === undefined ? true : options.showDirectionalLightHelper; // 是否显示平行光帮助器
    this.showSpotLightHelper = options.showSpotLightHelper === undefined ? true : options.showSpotLightHelper; // 是否显示聚光灯帮助器
    this.showHemisphereLightHelper = options.showHemisphereLightHelper === undefined ? true : options.showHemisphereLightHelper; // 是否显示半球光帮助器
    this.showSkeletonHelper = options.showSkeletonHelper === undefined ? false : options.showSkeletonHelper; // 是否显示骨骼帮助器
}

export default Options;