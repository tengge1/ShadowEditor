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
 * feFuncR
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function feFuncR(options = {}) {
    SvgControl.call(this, options);
}

feFuncR.prototype = Object.create(SvgControl.prototype);
feFuncR.prototype.constructor = feFuncR;

feFuncR.prototype.render = function () {
    this.renderDom(this.createElement('feFuncR'));
};

SVG.addXType('fefuncr', feFuncR);

export default feFuncR;