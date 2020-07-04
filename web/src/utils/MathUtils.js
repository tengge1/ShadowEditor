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
 * 精度
 * @author mrdoob / http://mrdoob.com/
 */
var NUMBER_PRECISION = 6;

/**
 * 打包数字
 * @param {String} key 键
 * @param {Number} value 数值
 * @returns {Number} 数值的六位有效数字
 */
function parseNumber(key, value) {
    return typeof value === 'number' ? parseFloat(value.toFixed(NUMBER_PRECISION)) : value;
}

/**
 * 数学工具
 */
const GeoUtils = {
    NUMBER_PRECISION: NUMBER_PRECISION,
    parseNumber: parseNumber
};

export default GeoUtils;