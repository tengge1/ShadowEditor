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
 * 分区图
 * @author tengge / https://github.com/tengge1
 */
function PartitionDiagram() {
    BaseComponent.call(this);
    this.type = 'PartitionDiagram';

    this.width = 800;
    this.height = 500;
    this.title = 'PartitionDiagram';

    this.transform = null;
}

PartitionDiagram.prototype = Object.create(BaseComponent.prototype);
PartitionDiagram.prototype.constructor = PartitionDiagram;

PartitionDiagram.prototype.setTranslate = function (dx, dy) {
    var xy = this.transform.split(',');

    this.transform = `${parseFloat(xy[0]) + dx},${parseFloat(xy[1]) + dy}`;

    this.dom.attr('transform', `translate(${this.transform})`);
};

PartitionDiagram.prototype.render = function (parent) {
    if (d3.select(`#${this.id}`).size() > 0) {
        return;
    }

    var g = d3.select(parent)
        .append('g')
        .attr('id', this.id)
        .classed('Visual', true)
        .classed('PartitionDiagram', true)
        .style('pointer-events', 'all');

    var city = {
        name: '中国',
        value: 1,
        children: [{
            name: '浙江',
            value: 1,
            children: [{
                name: '杭州',
                value: 1
            }, {
                name: '宁波',
                value: 1
            }, {
                name: '温州',
                value: 1
            }, {
                name: '绍兴',
                value: 1
            }]
        }, {
            name: '广西',
            value: 1,
            children: [{
                name: '桂林',
                value: 1,
                children: [{
                    name: '秀峰区',
                    value: 1
                }, {
                    name: '叠彩区',
                    value: 1
                }, {
                    name: '象山区',
                    value: 1
                }, {
                    name: '七星区',
                    value: 1
                }]
            }, {
                name: '南宁',
                value: 1
            }, {
                name: '柳州',
                value: 1
            }, {
                name: '防城港',
                value: 1
            }]
        }]
    };

    // var width = 800;
    // var height = 500;

    var hierarchy = d3.hierarchy(city);

    var partition = d3.partition();
    var partitionData = partition(hierarchy)
        .descendants();

    var colors = d3.schemeCategory10;

    g.selectAll('rect')
        .data(partitionData)
        .enter()
        .append('rect')
        .attr('data-id', this.id)
        .attr('x', function (d) {
            return d.x0 * 100;
        })
        .attr('y', function (d) {
            return d.y0 * 100;
        })
        .attr('width', function (d) {
            return d.x1 * 100 - d.x0 * 100;
        })
        .attr('height', function (d) {
            return d.y1 * 100 - d.y0 * 100;
        })
        .attr('fill', function (d, i) {
            return colors[i % 10];
        });

    if (!this.transform) {
        var left = (parent.clientWidth - this.width) / 2;
        var top = (parent.clientHeight - this.height) / 2;
        this.transform = `${left},${top}`;
    }

    g.attr('transform', `translate(${this.transform})`);

    this.dom = g;
};

PartitionDiagram.prototype.toJSON = function () {
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

PartitionDiagram.prototype.fromJSON = function (json) {
    this.id = json.id;
    this.type = json.type;
    this.title = json.title;
    this.data = json.data;
    this.transform = json.transform || null;
};

PartitionDiagram.prototype.clear = function () {
    this.title = 'PartitionDiagram';
    this.transform = null;

    delete this.dom;
};

export default PartitionDiagram;