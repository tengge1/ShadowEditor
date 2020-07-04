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
 * 侧边栏
 * @param {*} options 配置
 */
function Sidebar(options) {
    Component.call(this, options);

    this.margin = 2;
    this.padding = 4;
}

Sidebar.prototype = Object.create(Component.prototype);
Sidebar.prototype.constructor = Sidebar;

Sidebar.prototype.render = function () {
    var svg = d3.select(this.parent);
    var defs = svg.select('defs');

    var group = svg.append('g');

    // 背景
    group.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 270)
        .attr('height', 969)
        .attr('fill', 'rgba(0,0,0,0.5)');

    // 时间
    group.append('text')
        .text('14:21')
        .attr('x', 25)
        .attr('y', 38)
        .attr('font-size', 22)
        .attr('text-anchor', 'start') // start, middle, end; see: https://segmentfault.com/a/1190000009293590?utm_source=tag-newest
        .attr('fill', '#fff');

    // 时间、日期分割竖线
    group.append('line')
        .attr('x1', 87)
        .attr('y1', 21)
        .attr('x2', 87)
        .attr('y2', 42)
        .attr('stroke', '#4d88a7')
        .attr('stroke-width', 2);

    // 星期
    group.append('text')
        .text('星期日')
        .attr('x', 95)
        .attr('y', 28)
        .attr('font-size', 14)
        .attr('fill', '#fff');

    // 日期
    group.append('text')
        .text('2019-04-21')
        .attr('x', 95)
        .attr('y', 45)
        .attr('font-size', 14)
        .attr('fill', '#fff');

    // 边框
    group.append('path')
        .attr('d', 'm180,11 l0,35 l-10,10 L9,56 l0,183 l40,30 l0,193 M32,472 l0,18 l-23,20 l0,310')
        .attr('stroke', '#3a6a84')
        .attr('stroke-width', 2)
        .attr('fill', 'none');

    // 选项卡
    defs.append('path')
        .attr('id', 'tabDef')
        .attr('d', 'M0,0 L32,22 L32,60 L0,38 Z')
        .attr('fill', '#6c6f6e');

    defs.append('path')
        .attr('id', 'tabSelectDef')
        .attr('d', 'M0,0 L32,22 L32,60 L0,38 Z')
        .attr('fill', '#356899');

    var tab1 = group.append('g')
        .attr('transform', 'translate(14,58)');

    tab1.append('use')
        .attr('href', '#tabSelectDef');

    tab1.append('image')
        .attr('x', 5)
        .attr('y', 20)
        .attr('width', 24)
        .attr('height', 24)
        .attr('href', 'assets/svg/home.svg');

    var tab2 = group.append('g')
        .attr('transform', 'translate(14,104)');

    tab2.append('use')
        .attr('href', '#tabDef');

    tab2.append('image')
        .attr('x', 5)
        .attr('y', 20)
        .attr('width', 24)
        .attr('height', 24)
        .attr('href', 'assets/svg/plane.svg');

    var tab3 = group.append('g')
        .attr('transform', 'translate(14,150)');

    tab3.append('use')
        .attr('href', '#tabDef');

    tab3.append('image')
        .attr('x', 5)
        .attr('y', 20)
        .attr('width', 24)
        .attr('height', 24)
        .attr('href', 'assets/svg/water.svg');

    var tab4 = group.append('g')
        .attr('transform', 'translate(14,196)');

    tab4.append('use')
        .attr('href', '#tabDef');

    tab4.append('image')
        .attr('x', 5)
        .attr('y', 20)
        .attr('width', 24)
        .attr('height', 24)
        .attr('href', 'assets/svg/guard.svg');

    var header = group.append('g')
        .attr('transform', 'translate(15,276)');

    header.append('path')
        .attr('d', 'M0,0 L12,0 L25,10 L25,185 L12,195 L0,195 Z')
        .attr('fill', '#185185');

    header.append('text')
        .text('首都机场')
        .attr('x', 12)
        .attr('y', 85)
        .attr('text-anchor', 'middle')
        .attr('writing-mode', 'tb')
        .attr('textlength', '90px')
        .attr('lengthAdjust', 'spacing') // spacing, spacingAndGlyphs; see: https://blog.csdn.net/huanhuanq1209/article/details/71438629
        .attr('fill', '#fff');

    // 圆圈
    var circle = group.append('g')
        .attr('transform', 'translate(125,140)');

    circle.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 68)
        .attr('fill', 'rgba(0,0,0,0.5)');

    circle.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 48)
        .attr('stroke', '#517496')
        .attr('stroke-width', 2)
        .attr('fill', 'none');

    circle.append('circle')
        .attr('cx', 48)
        .attr('cy', 0)
        .attr('r', 14)
        .attr('fill', '#376899');

    circle.append('circle')
        .attr('cx', 48)
        .attr('cy', 0)
        .attr('r', 14)
        .attr('stroke', '#3399ff')
        .attr('stroke-width', 2)
        .attr('fill', 'none');

    circle.append('image')
        .attr('x', 0)
        .attr('y', -48)
        .attr('transform', 'translate(-12,-12)')
        .attr('href', 'assets/svg/sunrise.svg');

    circle.append('image')
        .attr('x', 48)
        .attr('y', 0)
        .attr('transform', 'translate(-12,-12)')
        .attr('href', 'assets/svg/sun.svg');

    circle.append('image')
        .attr('x', 0)
        .attr('y', 48)
        .attr('transform', 'translate(-12,-12)')
        .attr('href', 'assets/svg/sunset.svg');

    circle.append('image')
        .attr('x', -48)
        .attr('y', 0)
        .attr('transform', 'translate(-12,-12)')
        .attr('href', 'assets/svg/moon.svg');

    circle.append('text')
        .text('Time')
        .attr('x', 0)
        .attr('y', 0)
        .attr('dy', 10)
        .attr('font-size', 20)
        .attr('text-anchor', 'middle')
        .attr('fill', '#fff');

    // 横线
    group.append('path')
        .attr('d', 'M90,222 L160,222')
        .attr('stroke', '#3e7390')
        .attr('stroke-width', 2);

    // 小面板
    defs.append('path')
        .attr('id', 'smallPanel')
        .attr('d', 'M0,0 L135,0 L142,8 L142,24 L12,24 L0,17 Z')
        .attr('fill', 'rgba(0,0,0,0.5)');

    var smallPanel1 = group.append('g')
        .attr('transform', 'translate(60,240)');

    smallPanel1.append('use')
        .attr('href', '#smallPanel');
    smallPanel1.append('text')
        .text('正常停泊')
        .attr('x', 18)
        .attr('y', 17)
        .attr('fill', '#fff')
        .attr('font-size', 14);
    smallPanel1.append('text')
        .text('22')
        .attr('x', 90)
        .attr('y', 17)
        .attr('fill', '#fff')
        .attr('font-size', 14);

    var smallPanel2 = group.append('g')
        .attr('transform', 'translate(60,268)');

    smallPanel2.append('use')
        .attr('href', '#smallPanel');
    smallPanel2.append('text')
        .text('晚点起飞')
        .attr('x', 18)
        .attr('y', 17)
        .attr('fill', '#fff')
        .attr('font-size', 14);
    smallPanel2.append('text')
        .text('02')
        .attr('x', 90)
        .attr('y', 17)
        .attr('fill', '#e4a74a')
        .attr('font-size', 14);

    var smallPanel3 = group.append('g')
        .attr('transform', 'translate(60,301)');

    smallPanel3.append('use')
        .attr('href', '#smallPanel');
    smallPanel3.append('text')
        .text('计划停泊')
        .attr('x', 18)
        .attr('y', 17)
        .attr('fill', '#fff')
        .attr('font-size', 14);
    smallPanel3.append('text')
        .text('46')
        .attr('x', 90)
        .attr('y', 17)
        .attr('fill', '#fff')
        .attr('font-size', 14);

    var smallPanel4 = group.append('g')
        .attr('transform', 'translate(60,333)');

    smallPanel4.append('use')
        .attr('href', '#smallPanel');
    smallPanel4.append('text')
        .text('晚点到达')
        .attr('x', 18)
        .attr('y', 17)
        .attr('fill', '#fff')
        .attr('font-size', 14);
    smallPanel4.append('text')
        .text('02')
        .attr('x', 90)
        .attr('y', 17)
        .attr('fill', '#d60c0c')
        .attr('font-size', 14);

    // 中等面板
    defs.append('path')
        .attr('id', 'mediumPanelDef')
        .attr('d', 'M5,0 L160,0 L166,6 L166,33 L158,38 L158,91 L166,96 L166,125 L158,130 L5,130 L0,125 L0,96 L5,91 L5,36 L0,33 L0,6 Z')
        .attr('fill', 'rgba(0,0,0,0.5)');

    var mediumPanel = group.append('g')
        .attr('transform', 'translate(54,363)');

    mediumPanel.append('use')
        .attr('href', '#mediumPanelDef');

    mediumPanel.append('text')
        .text('长途停车场')
        .attr('x', 17)
        .attr('y', 26)
        .attr('fill', '#fff')
        .attr('font-size', 14);

    mediumPanel.append('text')
        .text('56/90')
        .attr('x', 140)
        .attr('y', 26)
        .attr('fill', '#fff')
        .attr('font-size', 14)
        .attr('text-anchor', 'end');

    mediumPanel.append('line')
        .attr('x1', 15)
        .attr('y1', 36)
        .attr('x2', 150)
        .attr('y2', 36)
        .attr('stroke', 'rgba(0,0,0,0.7)')
        .attr('stroke-width', 2);

    mediumPanel.append('text')
        .text('公交停车场')
        .attr('x', 17)
        .attr('y', 58)
        .attr('fill', '#fff')
        .attr('font-size', 14);

    mediumPanel.append('text')
        .text('34/126')
        .attr('x', 140)
        .attr('y', 58)
        .attr('fill', '#fff')
        .attr('font-size', 14)
        .attr('text-anchor', 'end');

    mediumPanel.append('line')
        .attr('x1', 15)
        .attr('y1', 67)
        .attr('x2', 150)
        .attr('y2', 67)
        .attr('stroke', 'rgba(0,0,0,0.7)')
        .attr('stroke-width', 2);

    mediumPanel.append('text')
        .text('地上停车场')
        .attr('x', 17)
        .attr('y', 90)
        .attr('fill', '#fff')
        .attr('font-size', 14);

    mediumPanel.append('text')
        .text('256/560')
        .attr('x', 140)
        .attr('y', 90)
        .attr('fill', '#fff')
        .attr('font-size', 14)
        .attr('text-anchor', 'end');

    mediumPanel.append('line')
        .attr('x1', 15)
        .attr('y1', 100)
        .attr('x2', 150)
        .attr('y2', 100)
        .attr('stroke', 'rgba(0,0,0,0.7)')
        .attr('stroke-width', 2);

    mediumPanel.append('text')
        .text('地下停车场')
        .attr('x', 17)
        .attr('y', 122)
        .attr('fill', '#fff')
        .attr('font-size', 14);

    mediumPanel.append('text')
        .text('389/560')
        .attr('x', 140)
        .attr('y', 122)
        .attr('fill', '#fff')
        .attr('font-size', 14)
        .attr('text-anchor', 'end');

    // 仪表盘
    var gaugeDef = defs.append('g')
        .attr('id', 'gaugeDef');

    gaugeDef.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 37)
        .attr('fill', 'rgba(0,0,0,0.5)');

    gaugeDef.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 32)
        .attr('stroke', '#6da2ee')
        .attr('stroke-width', 2)
        .attr('fill', 'none');

    var gauge1 = group.append('g')
        .attr('transform', 'translate(50,550)');

    gauge1.append('use')
        .attr('href', '#gaugeDef');

    gauge1.append('text')
        .text('66%')
        .attr('y', -10)
        .attr('font-size', 22)
        .attr('text-anchor', 'middle')
        .attr('fill', '#4bc8f5');

    gauge1.append('text')
        .text('设备')
        .attr('y', 10)
        .attr('font-size', 14)
        .attr('text-anchor', 'middle')
        .attr('fill', '#fff');

    gauge1.append('text')
        .text('在线率')
        .attr('y', 26)
        .attr('font-size', 14)
        .attr('text-anchor', 'middle')
        .attr('fill', '#fff');

    var gauge2 = group.append('g')
        .attr('transform', 'translate(131,550)');

    gauge2.append('use')
        .attr('href', '#gaugeDef');

    gauge2.append('text')
        .text('67')
        .attr('y', -10)
        .attr('font-size', 22)
        .attr('text-anchor', 'middle')
        .attr('fill', '#4bc8f5');

    gauge2.append('text')
        .text('修复')
        .attr('y', 10)
        .attr('font-size', 14)
        .attr('text-anchor', 'middle')
        .attr('fill', '#fff');

    gauge2.append('text')
        .text('故障数')
        .attr('y', 26)
        .attr('font-size', 14)
        .attr('text-anchor', 'middle')
        .attr('fill', '#fff');

    var gauge3 = group.append('g')
        .attr('transform', 'translate(220,550)');

    gauge3.append('use')
        .attr('href', '#gaugeDef');

    gauge3.append('text')
        .text('23')
        .attr('y', -10)
        .attr('font-size', 22)
        .attr('text-anchor', 'middle')
        .attr('fill', '#4bc8f5');

    gauge3.append('text')
        .text('剩余')
        .attr('y', 10)
        .attr('font-size', 14)
        .attr('text-anchor', 'middle')
        .attr('fill', '#fff');

    gauge3.append('text')
        .text('故障数')
        .attr('y', 26)
        .attr('font-size', 14)
        .attr('text-anchor', 'middle')
        .attr('fill', '#fff');

    // 图表背景
    var diagramBgDefs = defs.append('g')
        .attr('id', 'diagramBg');

    diagramBgDefs.append('path')
        .attr('d', 'M16.5,0 L16.5,123.38 L0,132.9 L0,8.5 Z')
        .attr('fill', 'rgba(0,0,0,0.5)');

    diagramBgDefs.append('path')
        .attr('d', 'M23.5,0 L238,0 L238,124 L23.5,124 Z')
        .attr('fill', 'rgba(0,0,0,0.5)');

    diagramBgDefs.append('path')
        .attr('d', 'M22,127 L238,127 L225,139 L0,139 Z')
        .attr('fill', 'rgba(0,0,0,0.5)');

    // 标签
    defs.append('path')
        .attr('id', 'labelDef')
        .attr('d', 'M11,0 L72,0 L85,12 L72,24 L11,24 L0,12 Z')
        .attr('fill', 'rgba(23,29,48,0.5)');

    // 柱状图
    var histogram = group.append('g')
        .attr('transform', 'translate(14,610)');

    histogram.append('use')
        .attr('href', '#diagramBg');

    var data = [27, 68, 44, 117, 60, 83, 101];

    histogram.selectAll('.column')
        .data(data)
        .enter()
        .append('rect')
        .classed('column', true)
        .attr('x', function (d, i) {
            return 30 * (i + 1) - 5;
        })
        .attr('y', function (d) {
            return 133.6 - d;
        })
        .attr('width', function () {
            return 10;
        })
        .attr('height', function (d) {
            return d;
        })
        .attr('fill', '#4ccdfc');

    var label = histogram.append('g')
        .attr('transform', 'translate(117,140)');

    label.append('use')
        .attr('href', '#labelDef')
        .attr('transform', 'translate(-42,-12)');

    label.append('text')
        .text('时段航班')
        .attr('x', 0)
        .attr('y', 0)
        .attr('dy', 4)
        .attr('font-size', 14)
        .attr('text-anchor', 'middle')
        .attr('fill', '#fff');

    // 折线图
    var linechart = group.append('g')
        .attr('transform', 'translate(14,769)');

    linechart.append('use')
        .attr('href', '#diagramBg');

    var data1 = [];
    var data2 = [];

    var ran1 = d3.randomNormal(29, 8);
    var ran2 = d3.randomNormal(72, 20);

    for (var i = 0; i <= 210; i += 10) {
        data1.push([8 + i, ran1()]);
        data2.push([8 + i, ran2()]);
    }

    var line = d3.line();
    var lineData1 = line(data1);
    var lineData2 = line(data2);

    linechart.append('path')
        .attr('d', lineData1 + 'L218,133.6L8,133.6Z')
        .attr('stroke', '#458dab')
        .attr('fill', 'rgba(76,205,252,0.2)');
    linechart.append('path')
        .attr('d', lineData1)
        .attr('stroke', '#458dab')
        .attr('stroke-width', 2)
        .attr('fill', 'none');

    linechart.append('path')
        .attr('d', lineData2 + 'L218,133.6L8,133.6Z')
        .attr('fill', 'rgba(182,152,132,0.2)')
        .attr('stroke-width', 2);
    linechart.append('path')
        .attr('d', lineData2)
        .attr('stroke', '#b59784')
        .attr('stroke-width', 2)
        .attr('fill', 'none');

    label = linechart.append('g')
        .attr('transform', 'translate(117,140)');

    label.append('use')
        .attr('href', '#labelDef')
        .attr('transform', 'translate(-42,-12)');

    label.append('text')
        .text('客流量')
        .attr('x', 0)
        .attr('y', 0)
        .attr('dy', 4)
        .attr('font-size', 14)
        .attr('text-anchor', 'middle')
        .attr('fill', '#fff');
};

export default Sidebar;