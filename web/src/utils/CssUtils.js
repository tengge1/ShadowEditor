/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
/**
 * CSS工具类
 */
var CssUtils = {
    /**
     * 序列化滤镜
     * @param {Object} filters 滤镜对象
     * @returns {String} CSS数据
     */
    serializeFilter: function (filters) {
        var _filters = Object.assign({}, {
            hueRotate: filters.hueRotate || 0,
            saturate: filters.saturate === undefined ? 1 : filters.saturate,
            brightness: filters.brightness === undefined ? 1 : filters.brightness,
            blur: filters.blur || 0,
            contrast: filters.contrast === undefined ? 1 : filters.contrast,
            grayscale: filters.grayscale || 0,
            invert: filters.invert || 0,
            sepia: filters.sepia || 0
        });

        return `hue-rotate(${_filters.hueRotate}deg) saturate(${_filters.saturate}) brightness(${_filters.brightness}) ` +
            `blur(${_filters.blur}px) contrast(${_filters.contrast}) grayscale(${_filters.grayscale}) invert(${_filters.invert}) sepia(${_filters.sepia})`;
    },

    /**
     * 反序列化滤镜
     * @param {String} str css滤镜字符串
     * @returns {Object} 滤镜对象
     */
    parseFilter: function (str) {
        var list = str.split(' ');

        var filters = {
            hueRotate: 0,
            saturate: 1,
            brightness: 1,
            blur: 0,
            contrast: 1,
            grayscale: 0,
            invert: 0,
            sepia: 0
        };

        list.forEach(n => {
            if (n.startsWith('hue-rotate')) { // 色调
                filters.hueRotate = parseFloat(n.substring(11, n.length - 4));
            } else if (n.startsWith('saturate')) { // 饱和度
                filters.saturate = parseFloat(n.substring(9, n.length - 1));
            } else if (n.startsWith('brightness')) { // 亮度
                filters.brightness = parseFloat(n.substring(11, n.length - 1));
            } else if (n.startsWith('blur')) { // 模糊
                filters.blur = parseFloat(n.substring(5, n.length - 3));
            } else if (n.startsWith('contrast')) { // 对比度
                filters.contrast = parseFloat(n.substring(9, n.length - 1));
            } else if (n.startsWith('grayscale')) {
                filters.grayscale = parseFloat(n.substring(10, n.length - 1));
            } else if (n.startsWith('invert')) { // 颜色反转
                filters.invert = parseFloat(n.substring(7, n.length - 1));
            } else if (n.startsWith('sepia')) { // 复古
                filters.sepia = parseFloat(n.substring(6, n.length - 1));
            }
        });

        return filters;
    }
};

export default CssUtils;