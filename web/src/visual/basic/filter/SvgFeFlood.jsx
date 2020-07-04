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
 * feFlood
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function feFlood(options = {}) {
    SvgControl.call(this, options);
}

feFlood.prototype = Object.create(SvgControl.prototype);
feFlood.prototype.constructor = feFlood;

feFlood.prototype.render = function () {
    this.renderDom(this.createElement('feFlood'));
};

SVG.addXType('feflood', feFlood);

export default feFlood;