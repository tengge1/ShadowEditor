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
 * 面板
 * @author tengge / https://github.com/tengge1
 */
function Panel() {
    BaseComponent.call(this);
    this.type = 'Panel';

    this.width = 302;
    this.height = 358;
    this.title = 'Panel';
    this.transform = null;
}

Panel.prototype = Object.create(BaseComponent.prototype);
Panel.prototype.constructor = Panel;

Panel.prototype.setTranslate = function (dx, dy) {
    var xy = this.transform.split(',');

    this.transform = `${parseFloat(xy[0]) + dx},${parseFloat(xy[1]) + dy}`;

    this.dom.attr('transform', `translate(${this.transform})`);
};

Panel.prototype.render = function (parent) {
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
    g.append('path')
        .attr('data-id', this.id)
        .attr('d', 'M0,0L256,0L302,41L302,358L16,358L0,350Z')
        .attr('fill', 'rgba(45,48,60,0.95)');

    // 左边界线
    g.append('path')
        .attr('data-id', this.id)
        .attr('d', 'M26,22L5,22L5,220L10,225L10,248L5,254L5,345L26,354L48,354')
        .attr('stroke', '#2d758f')
        .attr('stroke-width', 2)
        .attr('fill', 'none');

    // 右边界线
    g.append('path')
        .attr('data-id', this.id)
        .attr('d', 'M220,22L264,22L295,56L295,354L104,354')
        .attr('stroke', '#2d758f')
        .attr('stroke-width', 2)
        .attr('fill', 'none');

    // 标题
    g.append('text')
        .attr('data-id', this.id)
        .text(this.title)
        .attr('x', 38)
        .attr('y', 30)
        .attr('font-size', 22)
        .attr('font-weight', 'bold')
        .attr('fill', '#498e7b');

    if (!this.transform) {
        var left = (parent.clientWidth - this.width) / 2;
        var top = (parent.clientHeight - this.height) / 2;
        this.transform = `${left},${top}`;
    }

    g.attr('transform', `translate(${this.transform})`);

    this.dom = g;
};

Panel.prototype.toJSON = function () {
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

Panel.prototype.fromJSON = function (json) {
    this.id = json.id;
    this.type = json.type;
    this.title = json.title;
    this.transform = json.transform || null;
};

Panel.prototype.clear = function () {
    this.title = 'Panel';
    this.transform = null;

    delete this.dom;
};

export default Panel;