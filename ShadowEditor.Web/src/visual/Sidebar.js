import Component from './Component';

/**
 * 侧边栏
 * @param {*} options 
 */
function Sidebar(options) {
    Component.call(this, options);
}

Sidebar.prototype = Object.create(Component.prototype);
Sidebar.prototype.constructor = Sidebar;

Sidebar.prototype.render = function () {
    d3.select(this.parent)
        .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 100)
        .attr('height', 200)
        .attr('fill', '#ff0');
};

export default Sidebar;