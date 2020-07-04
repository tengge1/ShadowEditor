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
 * 时间圆盘
 * @author tengge / https://github.com/tengge1
 */
function TimeDisk() {
    BaseComponent.call(this);
    this.type = 'TimeDisk';

    this.width = 136;
    this.height = 136;
    this.title = 'Time';
    this.transform = null;
}

TimeDisk.prototype = Object.create(BaseComponent.prototype);
TimeDisk.prototype.constructor = TimeDisk;

TimeDisk.prototype.setTranslate = function (dx, dy) {
    var xy = this.transform.split(',');

    this.transform = `${parseFloat(xy[0]) + dx},${parseFloat(xy[1]) + dy}`;

    this.dom.attr('transform', `translate(${this.transform})`);
};

TimeDisk.prototype.render = function (parent) {
    if (d3.select(`#${this.id}`).size() > 0) {
        return;
    }

    var g = d3.select(parent)
        .append('g')
        .attr('id', this.id)
        .classed('Visual', true)
        .classed('TimeDisk', true)
        .style('pointer-events', 'all');

    g.append('circle')
        .attr('data-id', this.id)
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 68)
        .attr('fill', 'rgba(0,0,0,0.5)');

    g.append('circle')
        .attr('data-id', this.id)
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 48)
        .attr('stroke', '#517496')
        .attr('stroke-width', 2)
        .attr('fill', 'none');

    g.append('circle')
        .attr('data-id', this.id)
        .attr('cx', 48)
        .attr('cy', 0)
        .attr('r', 14)
        .attr('fill', '#376899');

    g.append('circle')
        .attr('data-id', this.id)
        .attr('cx', 48)
        .attr('cy', 0)
        .attr('r', 14)
        .attr('stroke', '#3399ff')
        .attr('stroke-width', 2)
        .attr('fill', 'none');

    g.append('image')
        .attr('data-id', this.id)
        .attr('x', 0)
        .attr('y', -48)
        .attr('transform', 'translate(-12,-12)')
        .attr('href', 'assets/svg/sunrise.svg');

    g.append('image')
        .attr('data-id', this.id)
        .attr('x', 48)
        .attr('y', 0)
        .attr('transform', 'translate(-12,-12)')
        .attr('href', 'assets/svg/sun.svg');

    g.append('image')
        .attr('data-id', this.id)
        .attr('x', 0)
        .attr('y', 48)
        .attr('transform', 'translate(-12,-12)')
        .attr('href', 'assets/svg/sunset.svg');

    g.append('image')
        .attr('data-id', this.id)
        .attr('x', -48)
        .attr('y', 0)
        .attr('transform', 'translate(-12,-12)')
        .attr('href', 'assets/svg/moon.svg');

    g.append('text')
        .attr('data-id', this.id)
        .text(this.title)
        .attr('x', 0)
        .attr('y', 0)
        .attr('dy', 10)
        .attr('font-size', 20)
        .attr('text-anchor', 'middle')
        .attr('fill', '#fff');

    if (!this.transform) {
        var left = (parent.clientWidth - this.width) / 2;
        var top = (parent.clientHeight - this.height) / 2;
        this.transform = `${left},${top}`;
    }

    g.attr('transform', `translate(${this.transform})`);

    this.dom = g;
};

TimeDisk.prototype.toJSON = function () {
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

TimeDisk.prototype.fromJSON = function (json) {
    this.id = json.id;
    this.type = json.type;
    this.title = json.title;
    this.transform = json.transform || null;
};

TimeDisk.prototype.clear = function () {
    this.title = 'Time';
    this.transform = null;

    delete this.dom;
};

export default TimeDisk;