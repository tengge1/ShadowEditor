import BaseComponent from '../BaseComponent';

/**
 * 按钮
 * @author tengge / https://github.com/tengge1
 */
function Button() {
    BaseComponent.call(this);
    this.type = 'Button';
    this.text = 'Button';
}

Button.prototype = Object.create(BaseComponent.prototype);
Button.prototype.constructor = Button;

Button.prototype.render = function (parent) {
    var paddingLeft = 8;
    var paddingTop = 4;

    var g = d3.select(parent)
        .append('g')
        .attr('id', this.id)
        .classed('Control', true)
        .classed('Button', true)
        .classed('Draggable', true)
        .style('pointer-events', 'all');

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

    var width = (parent.clientWidth - boxWidth) / 2;
    var height = (parent.clientHeight - boxHeight) / 2;

    g.attr('transform', `translate(${width},${height})`);
};

Button.prototype.toJSON = function () {
    return {
        id: this.id,
        type: this.type,
        text: this.text,
    };
};

Button.prototype.fromJSON = function (json) {
    this.id = json.id;
    this.type = json.type;
    this.text = json.text;
};

Button.prototype.clear = function () {
    this.text = 'Button';
};

export default Button;