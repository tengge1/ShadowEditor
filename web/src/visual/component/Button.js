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
 * 按钮
 * @author tengge / https://github.com/tengge1
 */
function Button() {
    BaseComponent.call(this);
    this.type = 'Button';
    this.text = 'Button';
    this.transform = null;
}

Button.prototype = Object.create(BaseComponent.prototype);
Button.prototype.constructor = Button;

Button.prototype.setTranslate = function (dx, dy) {
    var xy = this.transform.split(',');

    this.transform = `${parseFloat(xy[0]) + dx},${parseFloat(xy[1]) + dy}`;

    this.dom.attr('transform', `translate(${this.transform})`);
};

Button.prototype.render = function (parent) {
    if (d3.select(`#${this.id}`).size() > 0) {
        return;
    }

    var paddingLeft = 8;
    var paddingTop = 4;

    var g = d3.select(parent)
        .append('g')
        .attr('id', this.id)
        .classed('Visual', true)
        .classed('Button', true)
        .style('pointer-events', 'all')
        .style('cursor', 'pointer');

    var rect = g.append('rect')
        .attr('data-id', this.id)
        .attr('x', 0)
        .attr('y', 0)
        .attr('stroke', '#3399ff')
        .attr('stroke-width', 2)
        .attr('fill', 'rgba(51,153,255,0.5)');

    var text = g.append('text')
        .attr('data-id', this.id)
        .text(this.text)
        .attr('fill', '#fff');

    var box = text.node().getBBox();

    var boxWidth = box.width + paddingLeft * 2;
    var boxHeight = box.height + paddingTop * 2;

    rect.attr('width', boxWidth)
        .attr('height', boxHeight);

    text.attr('x', paddingLeft)
        .attr('y', paddingTop - box.y);

    if (!this.transform) {
        var left = (parent.clientWidth - boxWidth) / 2;
        var top = (parent.clientHeight - boxHeight) / 2;
        this.transform = `${left},${top}`;
    }

    g.attr('transform', `translate(${this.transform})`);

    g.on(`mouseenter.${this.id}`, this.onMouseEnter.bind(this));
    g.on(`mouseleave.${this.id}`, this.onMouseLeave.bind(this));

    this.dom = g;
};

Button.prototype.onMouseEnter = function () {
    if (this.dom) {
        this.dom.select('rect')
            .attr('fill', 'rgba(51,153,255,0.8)');
    }
};

Button.prototype.onMouseLeave = function () {
    if (this.dom) {
        this.dom.select('rect')
            .attr('fill', 'rgba(51,153,255,0.5)');
    }
};

Button.prototype.toJSON = function () {
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

Button.prototype.fromJSON = function (json) {
    this.id = json.id;
    this.type = json.type;
    this.text = json.text;
    this.transform = json.transform || null;
};

Button.prototype.clear = function () {
    this.text = 'Button';
    this.transform = null;

    this.dom.on(`mouseover.${this.id}`, null);
    this.dom.on(`mouseleave.${this.id}`, null);
    delete this.dom;
};

export default Button;