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
 * 画布工具类
 */
const CanvasUtils = {
    /**
     * 扩大到2的整数倍
     * @param {Number} num 数字
     * @returns {Number} 数字
     */
    makePowerOfTwo: function (num) {
        let result = 1;
        while (result < num) {
            result *= 2;
        }
        return result;
    }
};

export default CanvasUtils;