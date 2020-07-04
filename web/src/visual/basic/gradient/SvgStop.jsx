/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import { SvgControl, SVG } from '../third_party';

/**
 * 停止渐变
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Stop(options = {}) {
    SvgControl.call(this, options);
}

Stop.prototype = Object.create(SvgControl.prototype);
Stop.prototype.constructor = Stop;

Stop.prototype.render = function () {
    this.renderDom(this.createElement('stop'));
};

SVG.addXType('stop', Stop);

export default Stop;