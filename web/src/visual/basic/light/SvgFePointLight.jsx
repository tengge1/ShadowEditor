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
 * fePointLight
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function fePointLight(options = {}) {
    SvgControl.call(this, options);
}

fePointLight.prototype = Object.create(SvgControl.prototype);
fePointLight.prototype.constructor = fePointLight;

fePointLight.prototype.render = function () {
    this.renderDom(this.createElement('fePointLight'));
};

SVG.addXType('fepointlight', fePointLight);

export default fePointLight;