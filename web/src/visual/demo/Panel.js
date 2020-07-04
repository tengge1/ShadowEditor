/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import Component from './Component';

/**
 * 面板
 * @param {*} options 配置
 */
function Panel(options) {
    Component.call(this, options);
}

Panel.prototype = Object.create(Component.prototype);
Panel.prototype.constructor = Panel;

Panel.prototype.render = function () {
    var svg = d3.select(this.parent);
    var defs = svg.select('defs');

    // svg文本垂直居中：dominant-baseline, see: https://cloud.tencent.com/developer/section/1423913

    // 面板背景
    var panelDef = defs.append('g')
        .attr('id', 'panelDef');

    panelDef.append('path')
        .attr('d', 'M0,0L256,0L302,41L302,358L16,358L0,350Z')
        .attr('fill', 'rgba(45,48,60,0.95)');

    panelDef.append('path')
        .attr('d', 'M26,22L5,22L5,220L10,225L10,248L5,254L5,345L26,354L48,354')
        .attr('stroke', '#2d758f')
        .attr('stroke-width', 2)
        .attr('fill', 'none');

    panelDef.append('path')
        .attr('d', 'M220,22L264,22L295,56L295,354L104,354')
        .attr('stroke', '#2d758f')
        .attr('stroke-width', 2)
        .attr('fill', 'none');

    // 面板
    var panel = svg.append('g')
        .attr('transform', 'translate(500,200)');

    panel.append('use')
        .attr('href', '#panelDef');

    panel.append('text')
        .text('春秋航空9C8804')
        .attr('x', 38)
        .attr('y', 30)
        .attr('font-size', 22)
        .attr('font-weight', 'bold')
        .attr('fill', '#498e7b');

    panel.append('text')
        .text('空客A320')
        .attr('x', 31)
        .attr('y', 68)
        .attr('font-size', 18)
        .attr('fill', '#4087a2');

    panel.append('text')
        .text('首都机场 ———— 厦门高琦')
        .attr('x', 31)
        .attr('y', 107)
        .attr('font-size', 18)
        .attr('fill', '#4087a2');

    panel.append('line')
        .attr('x1', 30)
        .attr('y1', 132)
        .attr('x2', 270)
        .attr('y2', 132)
        .attr('stroke', 'rgba(0,0,0,0.4)')
        .attr('stroke-width', 2);

    panel.append('text')
        .text('到达时间：0907 - 17:50')
        .attr('x', 31)
        .attr('y', 178)
        .attr('font-size', 18)
        .attr('fill', '#4087a2');

    panel.append('text')
        .text('计划出发：0907 - 15:50')
        .attr('x', 31)
        .attr('y', 215)
        .attr('font-size', 18)
        .attr('fill', '#4087a2');

    panel.append('text')
        .text('实际出发：0907 - 16:00')
        .attr('x', 31)
        .attr('y', 254)
        .attr('font-size', 18)
        .attr('fill', '#4087a2');

    panel.append('line')
        .attr('x1', 30)
        .attr('y1', 273)
        .attr('x2', 270)
        .attr('y2', 273)
        .attr('stroke', 'rgba(0,0,0,0.4)')
        .attr('stroke-width', 2);

    panel.append('text')
        .text('落座率：88%')
        .attr('x', 31)
        .attr('y', 304)
        .attr('font-size', 18)
        .attr('fill', '#4087a2');

    panel.append('text')
        .text('旅客人数：287')
        .attr('x', 31)
        .attr('y', 338)
        .attr('font-size', 18)
        .attr('fill', '#4087a2');
};

export default Panel;