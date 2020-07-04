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
function Histogram2() {
    BaseComponent.call(this);
    this.type = 'Histogram2';

    this.width = 132.9;
    this.height = 123.38;
    this.title = 'Histogram2';
    this.data = [27, 68, 44, 117, 60, 83, 101];

    this.transform = null;
}

Histogram2.prototype = Object.create(BaseComponent.prototype);
Histogram2.prototype.constructor = Histogram2;

Histogram2.prototype.setTranslate = function (dx, dy) {
    var xy = this.transform.split(',');

    this.transform = `${parseFloat(xy[0]) + dx},${parseFloat(xy[1]) + dy}`;

    this.dom.attr('transform', `translate(${this.transform})`);
};

Histogram2.prototype.render = function (parent) {
    if (d3.select(`#${this.id}`).size() > 0) {
        return;
    }

    var g = d3.select(parent)
        .append('g')
        .attr('id', this.id)
        .classed('Visual', true)
        .classed('Histogram2', true)
        .style('pointer-events', 'all');

    var dataset = [
        50, 43, 120, 87, 99, 167, 142
    ];

    var xAxisWidth = 300;
    var yAxisWidth = 300;

    var padding = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 30
    };

    var xScale = d3.scaleBand()
        .domain(d3.range(dataset.length))
        .range([0, xAxisWidth]);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset)])
        .range([0, yAxisWidth]);

    g.selectAll('rect')
        .data(dataset)
        .enter()
        .append('rect')
        .attr('data-id', this.id)
        .attr('fill', 'steelblue')
        .attr('x', function (d, i) {
            return padding.left + xScale(i);
        })
        .attr('y', function (d) {
            return padding.top + yAxisWidth - yScale(d);
        })
        .attr('width', xScale.bandwidth() - 2)
        .attr('height', function (d) {
            return yScale(d);
        });

    g.selectAll('text')
        .data(dataset)
        .enter()
        .append('text')
        .attr('data-id', this.id)
        .attr('fill', 'white')
        .attr('font-size', '14px')
        .attr('text-anchor', 'middle')
        .attr('x', function (d, i) {
            return padding.left + xScale(i);
        })
        .attr('y', function (d) {
            return padding.top + yAxisWidth - yScale(d);
        })
        .attr('dx', xScale.bandwidth() / 2)
        .attr('dy', '1em')
        .text(function (d) {
            return d;
        });

    var xAxis = d3.axisBottom()
        .scale(xScale)
        .tickFormat(function (d) {
            return d + 1;
        });

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

Histogram2.prototype.toJSON = function () {
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

Histogram2.prototype.fromJSON = function (json) {
    this.id = json.id;
    this.type = json.type;
    this.title = json.title;
    this.data = json.data;
    this.transform = json.transform || null;
};

Histogram2.prototype.clear = function () {
    this.title = 'Histogram2';
    this.transform = null;

    delete this.dom;
};

export default Histogram2;