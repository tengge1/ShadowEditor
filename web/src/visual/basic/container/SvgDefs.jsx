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
 * SVG定义
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Defs(options = {}) {
    SvgControl.call(this, options);
}

Defs.prototype = Object.create(SvgControl.prototype);
Defs.prototype.constructor = Defs;

Defs.prototype.render = function () {
    this.renderDom(this.createElement('defs'));
};

SVG.addXType('defs', Defs);

export default Defs;