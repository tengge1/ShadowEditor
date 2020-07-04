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
 * 折线图
 * @author tengge / https://github.com/tengge1
 */
function LineChart() {
    BaseComponent.call(this);
    this.type = 'LineChart';

    this.width = 132.9;
    this.height = 123.38;
    this.title = 'LineChart';

    var data1 = [];
    var data2 = [];

    var ran1 = d3.randomNormal(29, 8);
    var ran2 = d3.randomNormal(72, 20);

    for (var i = 0; i <= 210; i += 10) {
        data1.push([8 + i, ran1()]);
        data2.push([8 + i, ran2()]);
    }

    this.data = [data1, data2];

    this.transform = null;
}

LineChart.prototype = Object.create(BaseComponent.prototype);
LineChart.prototype.constructor = LineChart;

LineChart.prototype.setTranslate = function (dx, dy) {
    var xy = this.transform.split(',');

    this.transform = `${parseFloat(xy[0]) + dx},${parseFloat(xy[1]) + dy}`;

    this.dom.attr('transform', `translate(${this.transform})`);
};

LineChart.prototype.render = function (parent) {
    if (d3.select(`#${this.id}`).size() > 0) {
        return;
    }

    var g = d3.select(parent)
        .append('g')
        .attr('id', this.id)
        .classed('Visual', true)
        .classed('LineChart', true)
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
    var line = d3.line();

    var lineData1 = line(this.data[0]);
    var lineData2 = line(this.data[1]);

    g.append('path')
        .attr('data-id', this.id)
        .attr('d', lineData1 + 'L218,133.6L8,133.6Z')
        .attr('stroke', '#458dab')
        .attr('fill', 'rgba(76,205,252,0.2)');
    g.append('path')
        .attr('data-id', this.id)
        .attr('d', lineData1)
        .attr('stroke', '#458dab')
        .attr('stroke-width', 2)
        .attr('fill', 'none');

    g.append('path')
        .attr('data-id', this.id)
        .attr('d', lineData2 + 'L218,133.6L8,133.6Z')
        .attr('fill', 'rgba(182,152,132,0.2)')
        .attr('stroke-width', 2);
    g.append('path')
        .attr('data-id', this.id)
        .attr('d', lineData2)
        .attr('stroke', '#b59784')
        .attr('stroke-width', 2)
        .attr('fill', 'none');

    // 标签
    var label = g.append('g')
        .attr('transform', 'translate(117,135)');

    label.append('path')
        .attr('data-id', this.id)
        .attr('d', 'M11,0 L72,0 L85,12 L72,24 L11,24 L0,12 Z')
        .attr('fill', 'rgba(23,29,48,0.8)')
        .attr('transform', 'translate(-42,-12)');

    label.append('text')
        .attr('data-id', this.id)
        .text(this.title)
        .attr('x', 0)
        .attr('y', 0)
        .attr('dy', 4)
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

LineChart.prototype.toJSON = function () {
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

LineChart.prototype.fromJSON = function (json) {
    this.id = json.id;
    this.type = json.type;
    this.title = json.title;
    this.data = json.data;
    this.transform = json.transform || null;
};

LineChart.prototype.clear = function () {
    this.title = 'LineChart';
    this.transform = null;

    delete this.dom;
};

export default LineChart;