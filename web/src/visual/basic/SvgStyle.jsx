/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import { SvgControl, SVG } from './third_party';

/**
 * Style
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Style(options = {}) {
    SvgControl.call(this, options);
}

Style.prototype = Object.create(SvgControl.prototype);
Style.prototype.constructor = Style;

Style.prototype.render = function () {
    this.renderDom(this.createElement('style'));
};

SVG.addXType('style', Style);

export default Style;