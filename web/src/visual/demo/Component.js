/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
var ID = -1;

const svgNS = 'http://www.w3.org/2000/svg';

/**
 * 可视化组件
 * @param {*} options 配置
 * @param {SVGElement} options.parent SVG要素
 */
function Component(options = {}) {
    this.options = options;
    this.parent = options.parent;

    if (!this.parent) {
        console.warn(`Component: options.parent is undefined.`);
        this.parent = document.createElementNS(svgNS, 'svg');
    }

    this.id = `${this.constructor.name}${ID--}`;
}

Component.prototype.render = function () {

};

export default Component;