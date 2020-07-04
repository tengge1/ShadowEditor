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
 * 散点图
 * @author tengge / https://github.com/tengge1
 */
function ScatterPlot() {
    BaseComponent.call(this);
    this.type = 'ScatterPlot';

    this.width = 400;
    this.height = 400;
    this.title = 'ScatterPlot';

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

ScatterPlot.prototype = Object.create(BaseComponent.prototype);
ScatterPlot.prototype.constructor = ScatterPlot;

ScatterPlot.prototype.setTranslate = function (dx, dy) {
    var xy = this.transform.split(',');

    this.transform = `${parseFloat(xy[0]) + dx},${parseFloat(xy[1]) + dy}`;

    this.dom.attr('transform', `translate(${this.transform})`);
};

ScatterPlot.prototype.render = function (parent) {
    if (d3.select(`#${this.id}`).size() > 0) {
        return;
    }

    var g = d3.select(parent)
        .append('g')
        .attr('id', this.id)
        .classed('Visual', true)
        .classed('ScatterPlot', true)
        .style('pointer-events', 'all');

    var center = [
        [0.5, 0.5],
        [0.7, 0.8],
        [0.4, 0.9],
        [0.11, 0.32],
        [0.88, 0.25],
        [0.75, 0.12],
        [0.5, 0.1],
        [0.2, 0.3],
        [0.4, 0.1],
        [0.6, 0.7]
    ];

    var xAxisWidth = 400;
    var yAxisWidth = 400;

    var xScale = d3.scaleLinear()
        .domain([0, 1.2 * d3.max(center, function (d) {
            return d[0];
        })])
        .range([0, xAxisWidth]);

    var yScale = d3.scaleLinear()
        .domain([0, 1.2 * d3.max(center, function (d) {
            return d[1];
        })])
        .range([0, yAxisWidth]);

    var padding = {
        top: 30,
        right: 30,
        bottom: 30,
        left: 40
    };

    // var width = xAxisWidth + padding.left + padding.right;
    var height = yAxisWidth + padding.top + padding.bottom;

    g.selectAll('circle')
        .data(center)
        .enter()
        .append('circle')
        .attr('data-id', this.id)
        .attr('fill', 'black')
        .attr('cx', function (d) {
            return padding.left + xScale(d[0]);
        })
        .attr('cy', function (d) {
            return height - padding.bottom - yScale(d[1]);
        })
        .attr('r', 5);

    var xAxis = d3.axisBottom()
        .scale(xScale);

    g.append('g')
        .attr('transform',
            `translate(${padding.left}, ${padding.top + yAxisWidth})`)
        .call(xAxis);

    yScale.range([yAxisWidth, 0]);

    var yAxis = d3.axisLeft()
        .scale(yScale);

    g.append('g')
        .attr('transform',
            `translate(${padding.left},${padding.top})`)
        .call(yAxis);

    if (!this.transform) {
        var left = (parent.clientWidth - this.width) / 2;
        var top = (parent.clientHeight - this.height) / 2;
        this.transform = `${left},${top}`;
    }

    g.attr('transform', `translate(${this.transform})`);

    this.dom = g;
};

ScatterPlot.prototype.toJSON = function () {
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

ScatterPlot.prototype.fromJSON = function (json) {
    this.id = json.id;
    this.type = json.type;
    this.title = json.title;
    this.data = json.data;
    this.transform = json.transform || null;
};

ScatterPlot.prototype.clear = function () {
    this.title = 'ScatterPlot';
    this.transform = null;

    delete this.dom;
};

export default ScatterPlot;