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
 * feMergeNode
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function feMergeNode(options = {}) {
    SvgControl.call(this, options);
}

feMergeNode.prototype = Object.create(SvgControl.prototype);
feMergeNode.prototype.constructor = feMergeNode;

feMergeNode.prototype.render = function () {
    this.renderDom(this.createElement('feMergeNode'));
};

SVG.addXType('femergenode', feMergeNode);

export default feMergeNode;