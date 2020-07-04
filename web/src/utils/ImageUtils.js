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
 * 产生一个单像素画布
 * @param {String} color 默认颜色
 * @returns {HTMLCanvasElement} 画布
 */
function onePixelCanvas(color = '#000000') {
    var canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    return canvas;
}

/**
 * 图片工具类
 */
const ImageUtils = {
    onePixelCanvas: onePixelCanvas
};

export default ImageUtils;