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
 * 饼状图
 * @author tengge / https://github.com/tengge1
 */
function PieChart() {
    BaseComponent.call(this);
    this.type = 'PieChart';

    this.width = 500;
    this.height = 500;
    this.title = 'PieChart';

    this.transform = null;
}

PieChart.prototype = Object.create(BaseComponent.prototype);
PieChart.prototype.constructor = PieChart;

PieChart.prototype.setTranslate = function (dx, dy) {
    var xy = this.transform.split(',');

    this.transform = `${parseFloat(xy[0]) + dx},${parseFloat(xy[1]) + dy}`;

    this.dom.attr('transform', `translate(${this.transform})`);
};

PieChart.prototype.render = function (parent) {
    if (d3.select(`#${this.id}`).size() > 0) {
        return;
    }

    var g = d3.select(parent)
        .append('g')
        .attr('id', this.id)
        .classed('Visual', true)
        .classed('ScatterPlot', true)
        .style('pointer-events', 'all');

    var dataset = [
        ['小米', 60.8],
        ['三星', 58.4],
        ['联想', 47.3],
        ['苹果', 46.6],
        ['华为', 41.3],
        ['酷派', 40.1],
        ['其他', 111.5]
    ];

    var pie = d3.pie()
        .value(function (d) {
            return d[1];
        });

    var width = 500;
    var height = 500;

    var piedata = pie(dataset);

    var outerRadius = width / 3;
    var innerRadius = 0;

    var arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

    var color = d3.schemeCategory10;

    var arcs = g.selectAll('g')
        .data(piedata)
        .enter()
        .append('g')
        .attr('transform',
            'translate(' + width / 2 + ',' + height / 2 + ')');

    arcs.append('path')
        .attr('data-id', this.id)
        .attr('fill', function (d, i) {
            return color[i];
        })
        .attr('d', function (d) {
            return arc(d);
        });

    arcs.append('text')
        .attr('data-id', this.id)
        .attr('transform', function (d) {
            var x = arc.centroid(d)[0] * 1.4;
            var y = arc.centroid(d)[1] * 1.4;
            return 'translate(' + x + ',' + y + ')';
        })
        .attr('text-anchor', 'middle')
        .text(function (d) {
            var percent = Number(d.value) /
                d3.sum(dataset, function (d) {
                    return d[1];
                }) * 100;
            return percent.toFixed(1) + '%';
        });

    arcs.append('line')
        .attr('data-id', this.id)
        .attr('stroke', 'black')
        .attr('x1', function (d) {
            return arc.centroid(d)[0] * 2;
        })
        .attr('y1', function (d) {
            return arc.centroid(d)[1] * 2;
        })
        .attr('x2', function (d) {
            return arc.centroid(d)[0] * 2.2;
        })
        .attr('y2', function (d) {
            return arc.centroid(d)[1] * 2.2;
        });

    arcs.append('text')
        .attr('data-id', this.id)
        .attr('transform', function (d) {
            var x = arc.centroid(d)[0] * 2.5;
            var y = arc.centroid(d)[1] * 2.5;
            return 'translate(' + x + ',' + y + ')';
        })
        .attr('text-anchor', 'middle')
        .text(function (d) {
            return d.data[0];
        });

    if (!this.transform) {
        var left = (parent.clientWidth - this.width) / 2;
        var top = (parent.clientHeight - this.height) / 2;
        this.transform = `${left},${top}`;
    }

    g.attr('transform', `translate(${this.transform})`);

    this.dom = g;
};

PieChart.prototype.toJSON = function () {
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

PieChart.prototype.fromJSON = function (json) {
    this.id = json.id;
    this.type = json.type;
    this.title = json.title;
    this.transform = json.transform || null;
};

PieChart.prototype.clear = function () {
    this.title = 'PieChart';
    this.transform = null;

    delete this.dom;
};

export default PieChart;