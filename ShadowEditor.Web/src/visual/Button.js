import Drag from './event/Drag';

/**
 * 按钮
 * @param {SVGElement} parent 父要素
 * @param {Object} options 参数
 */
function Button(parent, options = {}) {
    var _edit = options.edit || false;
    var _text = options.text || 'Button';

    var paddingLeft = 8;
    var paddingTop = 4;

    var g = d3.select(parent)
        .append('g')
        .classed('Button', true)
        .classed('Draggable', true)
        .style('pointer-events', 'all');

    var rect = g.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('stroke', '#3399ff')
        .attr('stroke-width', 2)
        .attr('fill', 'rgba(51,153,255,0.5)');

    var text = g.append('text')
        .text(_text)
        .attr('fill', '#fff');

    var box = text.node().getBBox();

    var boxWidth = box.width + paddingLeft * 2;
    var boxHeight = box.height + paddingTop * 2;

    rect.attr('width', boxWidth)
        .attr('height', boxHeight);

    text.attr('x', paddingLeft)
        .attr('y', paddingTop - box.y);

    var width = (parent.clientWidth - boxWidth) / 2;
    var height = (parent.clientHeight - boxHeight) / 2;

    g.attr('transform', `translate(${width},${height})`);

    if (_edit) {
        g.call(Drag());
    }

    this.dom = g.node();
}

export default Button;