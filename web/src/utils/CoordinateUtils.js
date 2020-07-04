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
 * 坐标工具
 */
const CoordinateUtils = {
    /**
     * 屏幕坐标转设备坐标
     * @param {Number} x 屏幕坐标X
     * @param {Number} y 屏幕坐标Y
     * @param {Number} clientWidth 工作区宽度
     * @param {Number} clientHeight 工作区高度
     * @param {THREE.Vector2} target 设备坐标
     * @returns {THREE.Vector2} 设备坐标
     */
    screenToDevice: function (x, y, clientWidth, clientHeight, target) {
        if (target === undefined) {
            target = new THREE.Vector2();
        }
        return target.set(
            x / clientWidth * 2 - 1,
            -(y / clientHeight) * 2 + 1
        );
    },

    /**
     * 设备坐标转屏幕坐标
     * @param {Number} x 设备坐标X
     * @param {Number} y 设备坐标Y
     * @param {Number} clientWidth 工作区宽度
     * @param {Number} clientHeight 工作区高度
     * @param {THREE.Vector2} target 屏幕坐标
     * @returns {THREE.Vector2} 屏幕坐标
     */
    deviceToScreen: function (x, y, clientWidth, clientHeight, target) {
        if (target === undefined) {
            target = new THREE.Vector2();
        }
        return target.set(
            (x + 1) / 2 * clientWidth,
            (1 - y) / 2 * clientHeight
        );
    }
};

export default CoordinateUtils;