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
 * 包图
 * @author tengge / https://github.com/tengge1
 */
function PackDiagram() {
    BaseComponent.call(this);
    this.type = 'PackDiagram';

    this.width = 500;
    this.height = 500;
    this.title = 'PackDiagram';

    this.transform = null;
}

PackDiagram.prototype = Object.create(BaseComponent.prototype);
PackDiagram.prototype.constructor = PackDiagram;

PackDiagram.prototype.setTranslate = function (dx, dy) {
    var xy = this.transform.split(',');

    this.transform = `${parseFloat(xy[0]) + dx},${parseFloat(xy[1]) + dy}`;

    this.dom.attr('transform', `translate(${this.transform})`);
};

PackDiagram.prototype.render = function (parent) {
    if (d3.select(`#${this.id}`).size() > 0) {
        return;
    }

    var g = d3.select(parent)
        .append('g')
        .attr('id', this.id)
        .classed('Visual', true)
        .classed('PackDiagram', true)
        .style('pointer-events', 'all');

    var city = {
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

    var pack = d3.pack()
        .size([width, height])
        .radius(function () {
            return 30;
        })
        .padding(5);

    var hierachy = d3.hierarchy(city);
    var packData = pack(hierachy);

    var colors = d3.schemeCategory10;

    g.selectAll('circle')
        .data(packData.descendants())
        .enter()
        .append('circle')
        .attr('data-id', this.id)
        .attr('cx', function (d) {
            return d.x;
        })
        .attr('cy', function (d) {
            return d.y;
        })
        .attr('r', function (d) {
            return d.r;
        })
        .attr('class', function (d) {
            return d.children ? 'node' : 'leafnode';
        })
        .attr('fill', function (d, i) {
            return colors[i];
        });

    if (!this.transform) {
        var left = (parent.clientWidth - this.width) / 2;
        var top = (parent.clientHeight - this.height) / 2;
        this.transform = `${left},${top}`;
    }

    g.attr('transform', `translate(${this.transform})`);

    this.dom = g;
};

PackDiagram.prototype.toJSON = function () {
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

PackDiagram.prototype.fromJSON = function (json) {
    this.id = json.id;
    this.type = json.type;
    this.title = json.title;
    this.data = json.data;
    this.transform = json.transform || null;
};

PackDiagram.prototype.clear = function () {
    this.title = 'PackDiagram';
    this.transform = null;

    delete this.dom;
};

export default PackDiagram;