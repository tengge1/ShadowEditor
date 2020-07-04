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
 * 柱状图
 * @author tengge / https://github.com/tengge1
 */
function Histogram() {
    BaseComponent.call(this);
    this.type = 'Histogram';

    this.width = 132.9;
    this.height = 123.38;
    this.title = 'Histogram';
    this.data = [27, 68, 44, 117, 60, 83, 101];

    this.transform = null;
}

Histogram.prototype = Object.create(BaseComponent.prototype);
Histogram.prototype.constructor = Histogram;

Histogram.prototype.setTranslate = function (dx, dy) {
    var xy = this.transform.split(',');

    this.transform = `${parseFloat(xy[0]) + dx},${parseFloat(xy[1]) + dy}`;

    this.dom.attr('transform', `translate(${this.transform})`);
};

Histogram.prototype.render = function (parent) {
    if (d3.select(`#${this.id}`).size() > 0) {
        return;
    }

    var g = d3.select(parent)
        .append('g')
        .attr('id', this.id)
        .classed('Visual', true)
        .classed('Histogram', true)
        .style('pointer-events', 'all');

    // 背景
    g.append('path')
        .attr('data-id', this.id)
        .attr('d', 'M16.5,0 L16.5,123.38 L0,132.9 L0,8.5 Z')
        .attr('fill', 'rgba(0,0,0,0.5)');

    g.append('path')
        .attr('data-id', this.id)
        .attr('d', 'M23.5,0 L238,0 L238,124 L23.5,124 Z')
        .attr('fill', 'rgba(0,0,0,0.5)');

    g.append('path')
        .attr('data-id', this.id)
        .attr('d', 'M22,127 L238,127 L225,139 L0,139 Z')
        .attr('fill', 'rgba(0,0,0,0.5)');

    // 数据
    g.selectAll('.column')
        .data(this.data)
        .enter()
        .append('rect')
        .attr('data-id', this.id)
        .classed('column', true)
        .attr('x', function (d, i) {
            return 30 * (i + 1) - 5;
        })
        .attr('y', function (d) {
            return 133.6 - d;
        })
        .attr('width', function () {
            return 10;
        })
        .attr('height', function (d) {
            return d;
        })
        .attr('fill', '#4ccdfc');

    // 标题
    g.append('path')
        .attr('data-id', this.id)
        .attr('d', 'M11,0 L72,0 L85,12 L72,24 L11,24 L0,12 Z')
        .attr('fill', 'rgba(23,29,48,0.5)')
        .attr('transform', 'translate(75,128)');

    g.append('text')
        .attr('data-id', this.id)
        .text(this.title)
        .attr('x', 0)
        .attr('y', 0)
        .attr('dy', 4)
        .attr('font-size', 14)
        .attr('text-anchor', 'middle')
        .attr('fill', '#fff')
        .attr('transform', 'translate(117,140)');

    if (!this.transform) {
        var left = (parent.clientWidth - this.width) / 2;
        var top = (parent.clientHeight - this.height) / 2;
        this.transform = `${left},${top}`;
    }

    g.attr('transform', `translate(${this.transform})`);

    this.dom = g;
};

Histogram.prototype.toJSON = function () {
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
        data: this.data,
        transform
    };
};

Histogram.prototype.fromJSON = function (json) {
    this.id = json.id;
    this.type = json.type;
    this.title = json.title;
    this.data = json.data || null;
    this.transform = json.transform || null;
};

Histogram.prototype.clear = function () {
    this.title = 'Histogram';
    this.transform = null;

    delete this.dom;
};

export default Histogram;