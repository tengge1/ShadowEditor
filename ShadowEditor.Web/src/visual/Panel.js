import Component from './Component';

/**
 * 面板
 * @param {*} options 
 */
function Panel(options) {
    Component.call(this, options);
}

Panel.prototype = Object.create(Component.prototype);
Panel.prototype.constructor = Panel;

Panel.prototype.render = function () {
    d3.select(this.parent)
        .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 100)
        .attr('height', 200)
        .attr('fill', '#ff0');
};

export default Panel;