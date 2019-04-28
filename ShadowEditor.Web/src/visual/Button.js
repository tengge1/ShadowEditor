/**
 * 按钮
 * @param {SVGElement} parent 父要素
 * @param {Object} options 参数
 */
function Button(parent, options = {}) {
    var _text = options.text || 'Button';

    var paddingLeft = 8;
    var paddingTop = 4;

    var g = d3.select(parent)
        .append('g');

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

    rect.attr('width', box.width + paddingLeft * 2)
        .attr('height', box.height + paddingTop * 2);

    text.attr('x', paddingLeft)
        .attr('y', paddingTop - box.y);

    this.dom = g.node();
}

export default Button;