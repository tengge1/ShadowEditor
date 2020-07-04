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
 * feSpecularLighting
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function feSpecularLighting(options = {}) {
    SvgControl.call(this, options);
}

feSpecularLighting.prototype = Object.create(SvgControl.prototype);
feSpecularLighting.prototype.constructor = feSpecularLighting;

feSpecularLighting.prototype.render = function () {
    this.renderDom(this.createElement('feSpecularLighting'));
};

SVG.addXType('fespecularlighting', feSpecularLighting);

export default feSpecularLighting;