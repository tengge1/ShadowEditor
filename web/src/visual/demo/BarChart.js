/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import Component from './Component';

/**
 * 条形图
 * @param {*} options 配置
 */
function BarChart(options) {
    Component.call(this, options);
}

BarChart.prototype = Object.create(Component.prototype);
BarChart.prototype.constructor = BarChart;

BarChart.prototype.render = function () {
    var svg = d3.select(this.parent);
    var defs = svg.select('defs');

    // 面板背景
    var barChartDef = defs.append('g')
        .attr('id', 'barChartDef');

    barChartDef.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 180)
        .attr('height', 212)
        .attr('fill', 'rgba(0,0,0,0.2)');

    barChartDef.append('path')
        .attr('d', 'M11,0 L72,0 L85,12 L72,24 L11,24 L0,12 Z')
        .attr('transform', 'translate(50,200)')
        .attr('fill', '#2d232c');

    // 面板
    var chart = svg.append('g')
        .attr('transform', 'translate(850,200)');

    chart.append('use')
        .attr('href', '#barChartDef');

    var data = [{
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

    var group = chart.selectAll('.bar')
        .data(data)
        .enter()
        .append('g')
        .classed('bar', true);

    group.append('text')
        .text(function (d) {
            return d.text;
        })
        .attr('x', 10)
        .attr('y', function (d, i) {
            return (i + 1) * 25;
        })
        .attr('fill', '#4ccdfc');

    group.append('rect')
        .attr('x', 68)
        .attr('y', function (d, i) {
            return (i + 1) * 25 - 10;
        })
        .attr('width', 105)
        .attr('height', 10)
        .attr('fill', '#0c6887');

    group.append('rect')
        .attr('x', 68)
        .attr('y', function (d, i) {
            return (i + 1) * 25 - 10;
        })
        .attr('width', function (d) {
            return d.value * 105;
        })
        .attr('height', 10)
        .attr('fill', '#4ccdfc');

    group.append('text')
        .text('检修耗时')
        .attr('transform', 'translate(88,217)')
        .attr('fill', '#4ccdfc')
        .attr('font-size', 14)
        .attr('text-anchor', 'middle');
};

export default BarChart;