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
 * 弦图
 * @author tengge / https://github.com/tengge1
 */
function ChordGraph() {
    BaseComponent.call(this);
    this.type = 'ChordGraph';

    this.width = 400;
    this.height = 400;
    this.title = 'ChordGraph';

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

ChordGraph.prototype = Object.create(BaseComponent.prototype);
ChordGraph.prototype.constructor = ChordGraph;

ChordGraph.prototype.setTranslate = function (dx, dy) {
    var xy = this.transform.split(',');

    this.transform = `${parseFloat(xy[0]) + dx},${parseFloat(xy[1]) + dy}`;

    this.dom.attr('transform', `translate(${this.transform})`);
};

ChordGraph.prototype.render = function (parent) {
    if (d3.select(`#${this.id}`).size() > 0) {
        return;
    }

    var g = d3.select(parent)
        .append('g')
        .attr('id', this.id)
        .classed('Visual', true)
        .classed('ScatterPlot', true)
        .style('pointer-events', 'all');

    var continent = [
        '亚洲', '欧洲', '非洲', '美洲', '大洋洲'
    ];
    var population = [
        [9000, 870, 3000, 1000, 5200],
        [3400, 8000, 2300, 4922, 374],
        [2000, 2000, 7700, 4881, 1050],
        [3000, 8012, 5531, 500, 400],
        [3540, 4310, 1500, 1900, 300]
    ];

    var chord = d3.chord()
        .padAngle(0.03)
        .sortSubgroups(d3.ascending);

    var chordData = chord(population);

    var width = 500;
    var height = 500;

    // 弦图的<g>元素
    var gChord = g.append('g')
        .attr('transform', 'translate(' + width / 2 +
            ',' + height / 2 + ')');

    // 节点的<g>元素
    var gOuter = gChord.append('g');

    // 弦的<g>元素
    var gInner = gChord.append('g');

    // 颜色比例器
    var color = d3.schemeCategory10;

    var innerRadius = width / 2 * 0.7;
    var outerRadius = innerRadius * 1.1;

    // 弦生成器
    var arcOuter = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

    gOuter.selectAll('.outerPath')
        .data(chordData.groups)
        .enter()
        .append('path')
        .attr('data-id', this.id)
        .attr('class', 'outerPath')
        .style('fill', function (d, i) {
            return color[i];
        })
        .attr('d', arcOuter);

    gOuter.selectAll('.outerText')
        .data(chordData.groups)
        .enter()
        .append('text')
        .attr('data-id', this.id)
        .each(function (d, i) {
            d.angle = (d.startAngle + d.endAngle) / 2;
            d.name = continent[i];
        })
        .attr('class', 'outerText')
        .attr('dy', '.35em')
        .attr('transform', function (d) {
            var result = 'rotate(' +
                d.angle * 180 / Math.PI + ')';

            result += ' translate(0,'
                + - 1.0 * (outerRadius + 10) + ')';

            if (d.angle > Math.PI * 3 / 4 &&
                d.angle < Math.PI * 5 / 4) {
                result += ' rotate(180)';
            }

            return result;
        })
        .text(function (d) {
            return d.name;
        });

    var ribbon = d3.ribbon()
        .radius(innerRadius);

    gInner.selectAll('.innerPath')
        .data(chordData)
        .enter()
        .append('path')
        .attr('data-id', this.id)
        .attr('class', 'innerPath')
        .attr('d', ribbon)
        .style('fill', function (d) {
            return color[d.source.index];
        });

    gOuter.selectAll('.outerPath')
        .on('mouseover', fade(0.0))
        .on('mouseout', fade(1.0));

    function fade(opacity) {
        return function (g, i) {
            gInner.selectAll('.innerPath')
                .filter(function (d) {
                    return d.source.index !== i &&
                        d.target.index !== i;
                })
                .transition()
                .style('opacity', opacity);
        };
    }

    if (!this.transform) {
        var left = (parent.clientWidth - this.width) / 2;
        var top = (parent.clientHeight - this.height) / 2;
        this.transform = `${left},${top}`;
    }

    g.attr('transform', `translate(${this.transform})`);

    this.dom = g;
};

ChordGraph.prototype.toJSON = function () {
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

ChordGraph.prototype.fromJSON = function (json) {
    this.id = json.id;
    this.type = json.type;
    this.title = json.title;
    this.data = json.data;
    this.transform = json.transform || null;
};

ChordGraph.prototype.clear = function () {
    this.title = 'ChordGraph';
    this.transform = null;

    delete this.dom;
};

export default ChordGraph;