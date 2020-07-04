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
 * 日期、周标签
 * @author tengge / https://github.com/tengge1
 */
function DateWeekLabel() {
    BaseComponent.call(this);
    this.type = 'DateWeekLabel';
    this.text = '14:21';
    this.transform = null;
}

DateWeekLabel.prototype = Object.create(BaseComponent.prototype);
DateWeekLabel.prototype.constructor = DateWeekLabel;

DateWeekLabel.prototype.setTranslate = function (dx, dy) {
    var xy = this.transform.split(',');

    this.transform = `${parseFloat(xy[0]) + dx},${parseFloat(xy[1]) + dy}`;

    this.dom.attr('transform', `translate(${this.transform})`);
};

DateWeekLabel.prototype.render = function (parent) {
    if (d3.select(`#${this.id}`).size() > 0) {
        return;
    }

    var padding = 2;

    var g = d3.select(parent)
        .append('g')
        .attr('id', this.id)
        .classed('Visual', true)
        .classed('DateWeekLabel', true)
        .style('pointer-events', 'all');

    // 星期
    var week = g.append('text')
        .attr('data-id', this.id)
        .text('星期日')
        .attr('x', padding)
        .attr('y', padding)
        .attr('font-size', 14)
        .attr('fill', '#fff');

    // 日期
    var date = g.append('text')
        .attr('data-id', this.id)
        .text('2019-04-21')
        .attr('x', padding)
        .attr('y', padding)
        .attr('font-size', 14)
        .attr('fill', '#fff');

    var weekBox = week.node().getBBox();
    var dateBox = date.node().getBBox();

    week.attr('y', padding - weekBox.y);
    date.attr('y', weekBox.height + padding * 2 - dateBox.y);

    if (!this.transform) {
        var boxWidth = Math.max(weekBox.width, dateBox.width) + padding * 2;
        var boxHeight = weekBox.height + dateBox.height + padding * 3;
        var left = (parent.clientWidth - boxWidth) / 2;
        var top = (parent.clientHeight - boxHeight) / 2;
        this.transform = `${left},${top}`;
    }

    g.attr('transform', `translate(${this.transform})`);

    this.dom = g;
};

DateWeekLabel.prototype.toJSON = function () {
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

DateWeekLabel.prototype.fromJSON = function (json) {
    this.id = json.id;
    this.type = json.type;
    this.text = json.text;
    this.transform = json.transform || null;
};

DateWeekLabel.prototype.clear = function () {
    this.text = '14:21';
    this.transform = null;

    delete this.dom;
};

export default DateWeekLabel;