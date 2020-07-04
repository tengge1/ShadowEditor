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
 * 水平线
 * @author tengge / https://github.com/tengge1
 */
function HorizontalLine() {
    BaseComponent.call(this);

    this.type = 'HorizontalLine';

    this.width = 240;
    this.height = 0;
    this.transform = null;
}

HorizontalLine.prototype = Object.create(BaseComponent.prototype);
HorizontalLine.prototype.constructor = HorizontalLine;

HorizontalLine.prototype.setTranslate = function (dx, dy) {
    var xy = this.transform.split(',');

    this.transform = `${parseFloat(xy[0]) + dx},${parseFloat(xy[1]) + dy}`;

    this.dom.attr('transform', `translate(${this.transform})`);
};

HorizontalLine.prototype.render = function (parent) {
    if (d3.select(`#${this.id}`).size() > 0) {
        return;
    }

    var g = d3.select(parent)
        .append('g')
        .attr('id', this.id)
        .classed('Visual', true)
        .classed('HorizontalLine', true)
        .style('pointer-events', 'all');

    // 可拖拽区域
    g.append('path')
        .attr('data-id', this.id)
        .attr('d', 'M-4,-4L244,-4L244,4L-4,4Z')
        .attr('stroke', '0')
        .attr('fill', 'none');

    g.append('line')
        .attr('data-id', this.id)
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 240)
        .attr('y2', 0)
        .attr('stroke', 'rgba(0,0,0,0.4)')
        .attr('stroke-width', 2);

    if (!this.transform) {
        var left = (parent.clientWidth - this.width) / 2;
        var top = (parent.clientHeight - this.height) / 2;
        this.transform = `${left},${top}`;
    }

    g.attr('transform', `translate(${this.transform})`);

    this.dom = g;
};

HorizontalLine.prototype.toJSON = function () {
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
        transform
    };
};

HorizontalLine.prototype.fromJSON = function (json) {
    this.id = json.id;
    this.type = json.type;
    this.width = json.width;
    this.height = json.height;
    this.transform = json.transform || null;
};

HorizontalLine.prototype.clear = function () {
    this.width = 240;
    this.height = 0;
    this.transform = null;

    delete this.dom;
};

export default HorizontalLine;