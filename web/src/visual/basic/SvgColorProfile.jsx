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
 * ColorProfile
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function ColorProfile(options = {}) {
    SvgControl.call(this, options);
}

ColorProfile.prototype = Object.create(SvgControl.prototype);
ColorProfile.prototype.constructor = ColorProfile;

ColorProfile.prototype.render = function () {
    this.renderDom(this.createElement('color-profile'));
};

SVG.addXType('colorprofile', ColorProfile);

export default ColorProfile;