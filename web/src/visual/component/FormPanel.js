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
 * 表单面板
 * @author tengge / https://github.com/tengge1
 */
function FormPanel() {
    BaseComponent.call(this);
    this.type = 'FormPanel';
    this.width = 166;
    this.height = 130;
    this.data = [{
        key: '键1',
        value: '值1'
    }, {
        key: '键2',
        value: '值2'
    }, {
        key: '键3',
        value: '值3'
    }, {
        key: '键4',
        value: '值4'
    }];
    this.transform = null;
}

FormPanel.prototype = Object.create(BaseComponent.prototype);
FormPanel.prototype.constructor = FormPanel;

FormPanel.prototype.setTranslate = function (dx, dy) {
    var xy = this.transform.split(',');

    this.transform = `${parseFloat(xy[0]) + dx},${parseFloat(xy[1]) + dy}`;

    this.dom.attr('transform', `translate(${this.transform})`);
};

FormPanel.prototype.render = function (parent) {
    if (d3.select(`#${this.id}`).size() > 0) {
        return;
    }

    var g = d3.select(parent)
        .append('g')
        .attr('id', this.id)
        .classed('Visual', true)
        .classed('FormPanel', true)
        .style('pointer-events', 'all');

    g.append('path')
        .attr('data-id', this.id)
        .attr('d', 'M5,0 L160,0 L166,6 L166,33 L158,38 L158,91 L166,96 L166,125 L158,130 L5,130 L0,125 L0,96 L5,91 L5,36 L0,33 L0,6 Z')
        .attr('fill', 'rgba(0,0,0,0.5)');

    var update = g.selectAll('.item')
        .data(this.data);

    update.exit()
        .remove();

    var item = update.enter()
        .append('g')
        .attr('data-id', this.id)
        .classed('item', true);

    item.append('text')
        .attr('data-id', this.id)
        .text(function (d) {
            return d.key;
        })
        .attr('x', 17)
        .attr('y', function (d, i) {
            return 26 + 26 * i;
        })
        .attr('fill', '#fff')
        .attr('font-size', 14);

    item.append('text')
        .attr('data-id', this.id)
        .text(function (d) {
            return d.value;
        })
        .attr('x', 140)
        .attr('y', function (d, i) {
            return 26 + 26 * i;
        })
        .attr('fill', '#fff')
        .attr('font-size', 14)
        .attr('text-anchor', 'end');

    if (!this.transform) {
        var left = (parent.clientWidth - this.width) / 2;
        var top = (parent.clientHeight - this.height) / 2;
        this.transform = `${left},${top}`;
    }

    g.attr('transform', `translate(${this.transform})`);

    this.dom = g;
};

FormPanel.prototype.toJSON = function () {
    var transform;
    if (this.transform) {
        transform = this.transform
            .replace('translate(', '')
            .replace(')', '');
    }

    return {
        id: this.id,
        type: this.type,
        data: this.data,
        transform
    };
};

FormPanel.prototype.fromJSON = function (json) {
    this.id = json.id;
    this.type = json.type;
    this.data = json.data;
    this.transform = json.transform || null;
};

FormPanel.prototype.clear = function () {
    this.data = [];
    this.transform = null;

    delete this.dom;
};

export default FormPanel;