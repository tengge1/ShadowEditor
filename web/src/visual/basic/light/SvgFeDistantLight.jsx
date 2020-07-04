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
 * feDistantLight
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function feDistantLight(options = {}) {
    SvgControl.call(this, options);
}

feDistantLight.prototype = Object.create(SvgControl.prototype);
feDistantLight.prototype.constructor = feDistantLight;

feDistantLight.prototype.render = function () {
    this.renderDom(this.createElement('feDistantLight'));
};

SVG.addXType('fedistantlight', feDistantLight);

export default feDistantLight;