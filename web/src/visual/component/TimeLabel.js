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
 * 时间标签
 * @author tengge / https://github.com/tengge1
 */
function TimeLabel() {
    BaseComponent.call(this);
    this.type = 'TimeLabel';
    this.text = '14:21';
    this.transform = null;
}

TimeLabel.prototype = Object.create(BaseComponent.prototype);
TimeLabel.prototype.constructor = TimeLabel;

TimeLabel.prototype.setTranslate = function (dx, dy) {
    var xy = this.transform.split(',');

    this.transform = `${parseFloat(xy[0]) + dx},${parseFloat(xy[1]) + dy}`;

    this.dom.attr('transform', `translate(${this.transform})`);
};

TimeLabel.prototype.render = function (parent) {
    if (d3.select(`#${this.id}`).size() > 0) {
        return;
    }

    var padding = 2;

    var g = d3.select(parent)
        .append('g')
        .attr('id', this.id)
        .classed('Visual', true)
        .classed('TimeLabel', true)
        .style('pointer-events', 'all');

    var text = g.append('text')
        .attr('data-id', this.id)
        .text(this.text)
        .attr('fill', '#fff');

    var box = text.node().getBBox();

    var boxWidth = box.width + padding * 2;
    var boxHeight = box.height + padding * 2;

    text.attr('x', padding)
        .attr('y', padding - box.y);

    if (!this.transform) {
        var left = (parent.clientWidth - boxWidth) / 2;
        var top = (parent.clientHeight - boxHeight) / 2;
        this.transform = `${left},${top}`;
    }

    g.attr('transform', `translate(${this.transform})`);

    this.dom = g;
};

TimeLabel.prototype.toJSON = function () {
    var transform;
    if (this.transform) {
        transform = this.transform
            .replace('translate(', '')
            .replace(')', '');
    }

    return {
        id: this.id,
        type: this.type,
        text: this.text,
        transform
    };
};

TimeLabel.prototype.fromJSON = function (json) {
    this.id = json.id;
    this.type = json.type;
    this.text = json.text;
    this.transform = json.transform || null;
};

TimeLabel.prototype.clear = function () {
    this.text = '14:21';
    this.transform = null;

    delete this.dom;
};

export default TimeLabel;