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
 * SVG曲线
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Polyline(options = {}) {
    SvgControl.call(this, options);
}

Polyline.prototype = Object.create(SvgControl.prototype);
Polyline.prototype.constructor = Polyline;

Polyline.prototype.render = function () {
    this.renderDom(this.createElement('polyline'));
};

SVG.addXType('polyline', Polyline);

export default Polyline;