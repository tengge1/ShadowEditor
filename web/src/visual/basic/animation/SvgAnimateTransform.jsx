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
 * AnimateTransform
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function AnimateTransform(options = {}) {
    SvgControl.call(this, options);
}

AnimateTransform.prototype = Object.create(SvgControl.prototype);
AnimateTransform.prototype.constructor = AnimateTransform;

AnimateTransform.prototype.render = function () {
    this.renderDom(this.createElement('animateTransform'));
};

SVG.addXType('animatetransform', AnimateTransform);

export default AnimateTransform;