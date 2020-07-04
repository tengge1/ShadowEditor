/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import BaseComponent from '../BaseComponent';

/**
 * 侧边栏
 * @author tengge / https://github.com/tengge1
 */
function SideBar() {
    BaseComponent.call(this);
    this.type = 'SideBar';

    this.width = 270;
    this.height = 969;
    this.title = 'SideBar';
    this.transform = null;
}

SideBar.prototype = Object.create(BaseComponent.prototype);
SideBar.prototype.constructor = SideBar;

SideBar.prototype.setTranslate = function (dx, dy) {
    var xy = this.transform.split(',');

    this.transform = `${parseFloat(xy[0]) + dx},${parseFloat(xy[1]) + dy}`;

    this.dom.attr('transform', `translate(${this.transform})`);
};

SideBar.prototype.render = function (parent) {
    if (d3.select(`#${this.id}`).size() > 0) {
        return;
    }

    var g = d3.select(parent)
        .append('g')
        .attr('id', this.id)
        .classed('Visual', true)
        .classed('Panel', true)
        .style('pointer-events', 'all');

    // 背景
    g.append('rect')
        .attr('data-id', this.id)
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 270)
        .attr('height', 969)
        .attr('fill', 'rgba(0,0,0,0.5)');

    // 边框
    g.append('path')
        .attr('data-id', this.id)
        .attr('d', 'm180,11 l0,35 l-10,10 L9,56 l0,183 l40,30 l0,193 M32,472 l0,18 l-23,20 l0,310')
        .attr('stroke', '#3a6a84')
        .attr('stroke-width', 2)
        .attr('fill', 'none');

    // 选项卡
    var defs = d3.select('defs');

    defs.append('path')
        .attr('id', 'tabDef')
        .attr('d', 'M0,0 L32,22 L32,60 L0,38 Z')
        .attr('fill', '#6c6f6e');

    defs.append('path')
        .attr('id', 'tabSelectDef')
        .attr('d', 'M0,0 L32,22 L32,60 L0,38 Z')
        .attr('fill', '#356899');

    var tab1 = g.append('g')
        .attr('data-id', this.id)
        .attr('transform', 'translate(14,58)');

    tab1.append('use')
        .attr('data-id', this.id)
        .attr('href', '#tabSelectDef');

    tab1.append('image')
        .attr('data-id', this.id)
        .attr('x', 5)
        .attr('y', 20)
        .attr('width', 24)
        .attr('height', 24)
        .attr('href', 'assets/svg/home.svg');

    var tab2 = g.append('g')
        .attr('data-id', this.id)
        .attr('transform', 'translate(14,104)');

    tab2.append('use')
        .attr('data-id', this.id)
        .attr('href', '#tabDef');

    tab2.append('image')
        .attr('data-id', this.id)
        .attr('x', 5)
        .attr('y', 20)
        .attr('width', 24)
        .attr('height', 24)
        .attr('href', 'assets/svg/plane.svg');

    var tab3 = g.append('g')
        .attr('data-id', this.id)
        .attr('transform', 'translate(14,150)');

    tab3.append('use')
        .attr('data-id', this.id)
        .attr('href', '#tabDef');

    tab3.append('image')
        .attr('data-id', this.id)
        .attr('x', 5)
        .attr('y', 20)
        .attr('width', 24)
        .attr('height', 24)
        .attr('href', 'assets/svg/water.svg');

    var tab4 = g.append('g')
        .attr('data-id', this.id)
        .attr('transform', 'translate(14,196)');

    tab4.append('use')
        .attr('data-id', this.id)
        .attr('href', '#tabDef');

    tab4.append('image')
        .attr('data-id', this.id)
        .attr('x', 5)
        .attr('y', 20)
        .attr('width', 24)
        .attr('height', 24)
        .attr('href', 'assets/svg/guard.svg');

    var header = g.append('g')
        .attr('data-id', this.id)
        .attr('transform', 'translate(15,276)');

    header.append('path')
        .attr('data-id', this.id)
        .attr('d', 'M0,0 L12,0 L25,10 L25,185 L12,195 L0,195 Z')
        .attr('fill', '#185185');

    header.append('text')
        .attr('data-id', this.id)
        .text(this.title)
        .attr('x', 12)
        .attr('y', 85)
        .attr('text-anchor', 'middle')
        .attr('writing-mode', 'tb')
        .attr('textlength', '90px')
        .attr('lengthAdjust', 'spacing') // spacing, spacingAndGlyphs; see: https://blog.csdn.net/huanhuanq1209/article/details/71438629
        .attr('fill', '#fff');


    if (!this.transform) {
        var left = (parent.clientWidth - this.width) / 2;
        var top = (parent.clientHeight - this.height) / 2;
        this.transform = `${left},${top}`;
    }

    g.attr('transform', `translate(${this.transform})`);

    this.dom = g;
};

SideBar.prototype.toJSON = function () {
    var transform;
    if (this.transform) {
        transform = this.transform
            .replace('translate(', '')
            .replace(')', '');
    }

    return {
        id: this.id,
        type: this.type,
        title: this.title,
        transform
    };
};

SideBar.prototype.fromJSON = function (json) {
    this.id = json.id;
    this.type = json.type;
    this.title = json.title;
    this.transform = json.transform || null;
};

SideBar.prototype.clear = function () {
    this.title = 'SideBar';
    this.transform = null;

    delete this.dom;
};

export default SideBar;