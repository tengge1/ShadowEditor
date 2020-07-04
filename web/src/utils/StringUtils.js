/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
var link = document.createElement('a');
link.style.display = 'none';
document.body.appendChild(link); // Firefox workaround, see #6594

var NUMBER_PRECISION = 6;

/**
 * 将浮点数转为JSON时，截取数字
 * @param {String} key 键
 * @param {Number} value 值
 * @returns {Number} 截取后的数字 
 */
function parseNumber(key, value) {
    return typeof value === 'number' ? parseFloat(value.toFixed(NUMBER_PRECISION)) : value;
}

/**
 * 将数字凑成2的指数次幂
 * @author mrdoob / http://mrdoob.com/
 * @author tengge / https://github.com/tengge1
 * @param {*} num 数字
 * @returns {Number} 二的幂
 */
function makePowOfTwo(num) {
    var result = 1;
    while (result < num) {
        result = result * 2;
    }
    return result;
}

function save(blob, filename) {
    link.href = URL.createObjectURL(blob);
    link.download = filename || 'data.json';
    link.click();
    // URL.revokeObjectURL( url ); breaks Firefox...
}

/**
 * 下载字符串文件
 * @param {*} text 字符串
 * @param {*} filename 下载文件名称
 */
function saveString(text, filename) {
    save(new Blob([text], { type: 'text/plain' }), filename);
}

const StringUtils = {
    parseNumber: parseNumber,
    makePowOfTwo: makePowOfTwo,
    save: save,
    saveString: saveString
};

export default StringUtils;