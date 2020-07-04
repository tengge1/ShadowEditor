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
 * SVG融合滤镜
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function feBlend(options = {}) {
    SvgControl.call(this, options);
}

feBlend.prototype = Object.create(SvgControl.prototype);
feBlend.prototype.constructor = feBlend;

feBlend.prototype.render = function () {
    this.renderDom(this.createElement('feBlend'));
};

SVG.addXType('feblend', feBlend);

export default feBlend;