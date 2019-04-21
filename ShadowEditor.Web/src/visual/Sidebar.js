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
    var width = this.parent.clientWidth;
    var height = this.parent.clientHeight;

    var group = d3.select(this.parent)
        .append('g');

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
        .attr('d', 'm180,11 l0,35 l-10,10 L9,56')
        .attr('stroke', '#3a6a84')
        .attr('stroke-width', 2)
        .attr('fill', 'none');
};

export default Sidebar;