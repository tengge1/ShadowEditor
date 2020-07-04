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
 * 键值标签
 * @author tengge / https://github.com/tengge1
 */
function KeyValueLabel() {
    BaseComponent.call(this);
    this.type = 'KeyValueLabel';
    this.width = 142;
    this.height = 24;
    this.key = '标签';
    this.value = '值';
    this.transform = null;
}

KeyValueLabel.prototype = Object.create(BaseComponent.prototype);
KeyValueLabel.prototype.constructor = KeyValueLabel;

KeyValueLabel.prototype.setTranslate = function (dx, dy) {
    var xy = this.transform.split(',');

    this.transform = `${parseFloat(xy[0]) + dx},${parseFloat(xy[1]) + dy}`;

    this.dom.attr('transform', `translate(${this.transform})`);
};

KeyValueLabel.prototype.render = function (parent) {
    if (d3.select(`#${this.id}`).size() > 0) {
        return;
    }

    var g = d3.select(parent)
        .append('g')
        .attr('id', this.id)
        .classed('Visual', true)
        .classed('TimeLabel', true)
        .style('pointer-events', 'all');

    g.append('path')
        .attr('data-id', this.id)
        .attr('d', 'M0,0 L135,0 L142,8 L142,24 L12,24 L0,17 Z')
        .attr('fill', 'rgba(0,0,0,0.5)');

    g.append('text')
        .attr('data-id', this.id)
        .text(this.key)
        .attr('x', 18)
        .attr('y', 17)
        .attr('fill', '#fff')
        .attr('font-size', 14);

    g.append('text')
        .attr('data-id', this.id)
        .text(this.value)
        .attr('x', 90)
        .attr('y', 17)
        .attr('fill', '#fff')
        .attr('font-size', 14);

    if (!this.transform) {
        var left = (parent.clientWidth - this.width) / 2;
        var top = (parent.clientHeight - this.height) / 2;
        this.transform = `${left},${top}`;
    }

    g.attr('transform', `translate(${this.transform})`);

    this.dom = g;
};

KeyValueLabel.prototype.toJSON = function () {
    var transform;
    if (this.transform) {
        transform = this.transform
            .replace('translate(', '')
            .replace(')', '');
    }

    return {
        id: this.id,
        type: this.type,
        key: this.key,
        value: this.value,
        transform
    };
};

KeyValueLabel.prototype.fromJSON = function (json) {
    this.id = json.id;
    this.type = json.type;
    this.key = json.key;
    this.value = json.value;
    this.transform = json.transform || null;
};

KeyValueLabel.prototype.clear = function () {
    this.key = '键';
    this.value = '值';
    this.transform = null;

    delete this.dom;
};

export default KeyValueLabel;