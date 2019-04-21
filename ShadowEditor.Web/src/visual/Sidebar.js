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
    var image = group.append('image')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 1920)
        .attr('height', 969)
        .attr('href', 'assets/panel1.png')
        .attr('opacity', '0.5');

    // 边框
    group.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 240)
        .attr('height', height)
        .attr('stroke', '#3a6a84')
        .attr('stroke-width', 2)
        .attr('fill', 'none');
};

export default Sidebar;