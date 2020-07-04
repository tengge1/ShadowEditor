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
 * 垂直线
 * @author tengge / https://github.com/tengge1
 */
function VerticalLine() {
    BaseComponent.call(this);

    this.type = 'VerticalLine';

    this.width = 0;
    this.height = 20;
    this.transform = null;
}

VerticalLine.prototype = Object.create(BaseComponent.prototype);
VerticalLine.prototype.constructor = VerticalLine;

VerticalLine.prototype.setTranslate = function (dx, dy) {
    var xy = this.transform.split(',');

    this.transform = `${parseFloat(xy[0]) + dx},${parseFloat(xy[1]) + dy}`;

    this.dom.attr('transform', `translate(${this.transform})`);
};

VerticalLine.prototype.render = function (parent) {
    if (d3.select(`#${this.id}`).size() > 0) {
        return;
    }

    var g = d3.select(parent)
        .append('g')
        .attr('id', this.id)
        .classed('Visual', true)
        .classed('VerticalLine', true)
        .style('pointer-events', 'all');

    // 可拖拽区域
    g.append('path')
        .attr('data-id', this.id)
        .attr('d', 'M-4,-4L4,-4L4,24L-4,24Z')
        .attr('stroke', '0')
        .attr('fill', 'none');

    g.append('line')
        .attr('data-id', this.id)
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 0)
        .attr('y2', 20)
        .attr('stroke', '#4d88a7')
        .attr('stroke-width', 2);

    if (!this.transform) {
        var left = (parent.clientWidth - this.width) / 2;
        var top = (parent.clientHeight - this.height) / 2;
        this.transform = `${left},${top}`;
    }

    g.attr('transform', `translate(${this.transform})`);

    this.dom = g;
};

VerticalLine.prototype.toJSON = function () {
    var transform;
    if (this.transform) {
        transform = this.transform
            .replace('translate(', '')
            .replace(')', '');
    }

    return {
        id: this.id,
        type: this.type,
        width: this.width,
        height: this.height,
        transform
    };
};

VerticalLine.prototype.fromJSON = function (json) {
    this.id = json.id;
    this.type = json.type;
    this.width = json.width;
    this.height = json.height;
    this.transform = json.transform || null;
};

VerticalLine.prototype.clear = function () {
    this.width = 0;
    this.height = 20;
    this.transform = null;

    delete this.dom;
};

export default VerticalLine;