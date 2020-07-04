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
 * 条形图
 * @author tengge / https://github.com/tengge1
 */
function BarChart() {
    BaseComponent.call(this);
    this.type = 'BarChart';

    this.width = 180;
    this.height = 212;
    this.title = 'BarChart';

    this.data = [{
        text: '桌椅松动',
        value: 100 / 105
    }, {
        text: '启动活门',
        value: 100 / 105
    }, {
        text: '雷达系统',
        value: 73 / 105
    }, {
        text: '引气系统',
        value: 72 / 105
    }, {
        text: '防冰活门',
        value: 69 / 105
    }, {
        text: '引擎',
        value: 46 / 105
    }, {
        text: '起落架',
        value: 42 / 105
    }];

    this.transform = null;
}

BarChart.prototype = Object.create(BaseComponent.prototype);
BarChart.prototype.constructor = BarChart;

BarChart.prototype.setTranslate = function (dx, dy) {
    var xy = this.transform.split(',');

    this.transform = `${parseFloat(xy[0]) + dx},${parseFloat(xy[1]) + dy}`;

    this.dom.attr('transform', `translate(${this.transform})`);
};

BarChart.prototype.render = function (parent) {
    if (d3.select(`#${this.id}`).size() > 0) {
        return;
    }

    var g = d3.select(parent)
        .append('g')
        .attr('id', this.id)
        .classed('Visual', true)
        .classed('BarChart', true)
        .style('pointer-events', 'all');

    // 面板背景
    g.append('rect')
        .attr('data-id', this.id)
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 180)
        .attr('height', 212)
        .attr('fill', 'rgba(0,0,0,0.2)');

    // 底部标题
    g.append('path')
        .attr('data-id', this.id)
        .attr('d', 'M11,0 L72,0 L85,12 L72,24 L11,24 L0,12 Z')
        .attr('transform', 'translate(50,200)')
        .attr('fill', '#2d232c');

    g.append('text')
        .attr('data-id', this.id)
        .text(this.title)
        .attr('transform', 'translate(88,217)')
        .attr('fill', '#4ccdfc')
        .attr('font-size', 14)
        .attr('text-anchor', 'middle');

    // 面板
    var bar = g.selectAll('.bar')
        .data(this.data);

    bar.exit()
        .remove();

    // 条
    var group = bar.enter()
        .append('g')
        .attr('data-id', this.id)
        .classed('bar', true)
        .append('g');

    group.append('text')
        .attr('data-id', this.id)
        .text(function (d) {
            return d.text;
        })
        .attr('x', 10)
        .attr('y', function (d, i) {
            return (i + 1) * 25;
        })
        .attr('fill', '#4ccdfc');

    group.append('rect')
        .attr('data-id', this.id)
        .attr('x', 68)
        .attr('y', function (d, i) {
            return (i + 1) * 25 - 10;
        })
        .attr('width', 105)
        .attr('height', 10)
        .attr('fill', '#0c6887');

    group.append('rect')
        .attr('data-id', this.id)
        .attr('x', 68)
        .attr('y', function (d, i) {
            return (i + 1) * 25 - 10;
        })
        .attr('width', function (d) {
            return d.value * 105;
        })
        .attr('height', 10)
        .attr('fill', '#4ccdfc');

    if (!this.transform) {
        var left = (parent.clientWidth - this.width) / 2;
        var top = (parent.clientHeight - this.height) / 2;
        this.transform = `${left},${top}`;
    }

    g.attr('transform', `translate(${this.transform})`);

    this.dom = g;
};

BarChart.prototype.toJSON = function () {
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

BarChart.prototype.fromJSON = function (json) {
    this.id = json.id;
    this.type = json.type;
    this.title = json.title;
    this.transform = json.transform || null;
};

BarChart.prototype.clear = function () {
    this.title = 'BarChart';
    this.transform = null;

    delete this.dom;
};

export default BarChart;