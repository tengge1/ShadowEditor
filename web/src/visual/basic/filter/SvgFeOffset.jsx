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
 * SVG偏移滤镜
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function feOffset(options = {}) {
    SvgControl.call(this, options);
}

feOffset.prototype = Object.create(SvgControl.prototype);
feOffset.prototype.constructor = feOffset;

feOffset.prototype.render = function () {
    this.renderDom(this.createElement('feOffset'));
};

SVG.addXType('feoffset', feOffset);

export default feOffset;