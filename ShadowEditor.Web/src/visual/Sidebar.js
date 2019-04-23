import Component from './Component';

/**
 * 侧边栏
 * @param {*} options 
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

    // 背景参考图
    group.append('image')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 1920)
        .attr('height', 969)
        .attr('href', 'assets/panel1.png')
        .attr('opacity', '0.5');

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
    var tabDef = defs.append('path')
        .attr('id', 'tabDef')
        .attr('d', 'M0,0 L32,22 L32,60 L0,38 Z')
        .attr('fill', '#6c6f6e');

    var tabSelectDef = defs.append('path')
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
        .attr('href', 'assets/svg/home.svg');

    var tab3 = group.append('g')
        .attr('transform', 'translate(14,150)');

    tab3.append('use')
        .attr('href', '#tabDef');

    tab3.append('image')
        .attr('x', 5)
        .attr('y', 20)
        .attr('width', 24)
        .attr('height', 24)
        .attr('href', 'assets/svg/home.svg');

    var tab4 = group.append('g')
        .attr('transform', 'translate(14,196)');

    tab4.append('use')
        .attr('href', '#tabDef');

    tab4.append('image')
        .attr('x', 5)
        .attr('y', 20)
        .attr('width', 24)
        .attr('height', 24)
        .attr('href', 'assets/svg/home.svg');
};

export default Sidebar;