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
 * 键值标签
 * @author tengge / https://github.com/tengge1
 */
function Gauge() {
    BaseComponent.call(this);
    this.type = 'Gauge';
    this.width = 74;
    this.height = 74;
    this.label = '标签';
    this.value = '值';
    this.unit = '单位';
    this.transform = null;
}

Gauge.prototype = Object.create(BaseComponent.prototype);
Gauge.prototype.constructor = Gauge;

Gauge.prototype.setTranslate = function (dx, dy) {
    var xy = this.transform.split(',');

    this.transform = `${parseFloat(xy[0]) + dx},${parseFloat(xy[1]) + dy}`;

    this.dom.attr('transform', `translate(${this.transform})`);
};

Gauge.prototype.render = function (parent) {
    if (d3.select(`#${this.id}`).size() > 0) {
        return;
    }

    var g = d3.select(parent)
        .append('g')
        .attr('id', this.id)
        .classed('Visual', true)
        .classed('Gauge', true)
        .style('pointer-events', 'all');

    // 背景
    g.append('circle')
        .attr('data-id', this.id)
        .attr('cx', 18.5)
        .attr('cy', 18.5)
        .attr('r', 37)
        .attr('fill', 'rgba(0,0,0,0.5)');

    // 圆圈
    g.append('circle')
        .attr('data-id', this.id)
        .attr('cx', 18.5)
        .attr('cy', 18.5)
        .attr('r', 32)
        .attr('stroke', '#6da2ee')
        .attr('stroke-width', 2)
        .attr('fill', 'none');

    // 值
    g.append('text')
        .attr('data-id', this.id)
        .text(this.value)
        .attr('x', 18.5)
        .attr('y', 8.5)
        .attr('font-size', 22)
        .attr('text-anchor', 'middle')
        .attr('fill', '#4bc8f5');

    // 标签
    g.append('text')
        .attr('data-id', this.id)
        .text(this.label)
        .attr('x', 18.5)
        .attr('y', 28.5)
        .attr('font-size', 14)
        .attr('text-anchor', 'middle')
        .attr('fill', '#fff');

    // 单位
    g.append('text')
        .attr('data-id', this.id)
        .text(this.unit)
        .attr('x', 18.5)
        .attr('y', 44.5)
        .attr('font-size', 14)
        .attr('text-anchor', 'middle')
        .attr('fill', '#fff');

    if (!this.transform) {
        var left = (parent.clientWidth - this.width) / 2;
        var top = (parent.clientHeight - this.height) / 2;
        this.transform = `${left},${top}`;
    }

    g.attr('transform', `translate(${this.transform})`);

    this.dom = g;
};

Gauge.prototype.toJSON = function () {
    var transform;
    if (this.transform) {
        transform = this.transform
            .replace('translate(', '')
            .replace(')', '');
    }

    return {
        id: this.id,
        type: this.type,
        key: this.key,
        value: this.value,
        transform
    };
};

Gauge.prototype.fromJSON = function (json) {
    this.id = json.id;
    this.type = json.type;
    this.key = json.key;
    this.value = json.value;
    this.transform = json.transform || null;
};

Gauge.prototype.clear = function () {
    this.key = '键';
    this.value = '值';
    this.transform = null;

    delete this.dom;
};

export default Gauge;