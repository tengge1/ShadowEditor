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
 * 集群图
 * @author tengge / https://github.com/tengge1
 */
function ClusterDiagram() {
    BaseComponent.call(this);
    this.type = 'ClusterDiagram';

    this.width = 500;
    this.height = 500;
    this.title = 'ClusterDiagram';

    this.transform = null;
}

ClusterDiagram.prototype = Object.create(BaseComponent.prototype);
ClusterDiagram.prototype.constructor = ClusterDiagram;

ClusterDiagram.prototype.setTranslate = function (dx, dy) {
    var xy = this.transform.split(',');

    this.transform = `${parseFloat(xy[0]) + dx},${parseFloat(xy[1]) + dy}`;

    this.dom.attr('transform', `translate(${this.transform})`);
};

ClusterDiagram.prototype.render = function (parent) {
    if (d3.select(`#${this.id}`).size() > 0) {
        return;
    }

    var g = d3.select(parent)
        .append('g')
        .attr('id', this.id)
        .classed('Visual', true)
        .classed('ScatterPlot', true)
        .style('pointer-events', 'all');

    var root = {
        name: '中国',
        children: [{
            name: '浙江',
            children: [{
                name: '杭州'
            }, {
                name: '宁波'
            }, {
                name: '温州'
            }, {
                name: '绍兴'
            }]
        }, {
            name: '广西',
            children: [{
                name: '桂林',
                children: [{
                    name: '秀峰区'
                }, {
                    name: '叠彩区'
                }, {
                    name: '象山区'
                }, {
                    name: '七星区'
                }]
            }, {
                name: '南宁'
            }, {
                name: '柳州'
            }, {
                name: '防城港'
            }]
        }]
    };

    var width = 500;
    var height = 500;

    var tree = d3.cluster()
        .size([width, height - 200])
        .separation(function (a, b) {
            return a.parent === b.parent ? 1 : 2;
        });

    var hierachyData = d3.hierarchy(root)
        .sum(function (d) {
            return d.value;
        });

    var g1 = g.append('g')
        .attr('transform', 'translate(40, 40)');

    tree(hierachyData);

    var nodes = hierachyData.descendants();
    var links = hierachyData.links();

    g1.selectAll('.link')
        .data(links)
        .enter()
        .append('path')
        .attr('data-id', this.id)
        .attr('class', 'link')
        .attr('fill', 'none')
        .attr('stroke', '#000')
        .attr('d', function (d) {
            return `M${d.source.y},${d.source.x} L${d.target.y},${d.target.x}`;
        });

    g1.selectAll('.node')
        .data(nodes)
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', function (d) {              // 这样写是为了 让数据横向显示
            return `translate(${d.y}, ${d.x})`;
        });
    g1.selectAll('.node')
        .append('circle')
        .attr('data-id', this.id)
        .attr('r', 5)
        .attr('fill', 'green');

    // 绘制文字
    g1.selectAll('.node')
        .append('text')
        .attr('data-id', this.id)
        .attr('dy', 3)
        .attr('x', function (d) {
            return d.children ? -8 : 8;
        })
        .attr('text-anchor', function (d) {
            return d.children ? 'end' : 'start';
        })
        .text(function (d) {
            return d.data.name;
        })
        .style('font-size', '18px');

    if (!this.transform) {
        var left = (parent.clientWidth - this.width) / 2;
        var top = (parent.clientHeight - this.height) / 2;
        this.transform = `${left},${top}`;
    }

    g.attr('transform', `translate(${this.transform})`);

    this.dom = g;
};

ClusterDiagram.prototype.toJSON = function () {
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

ClusterDiagram.prototype.fromJSON = function (json) {
    this.id = json.id;
    this.type = json.type;
    this.title = json.title;
    this.transform = json.transform || null;
};

ClusterDiagram.prototype.clear = function () {
    this.title = 'ClusterDiagram';
    this.transform = null;

    delete this.dom;
};

export default ClusterDiagram;