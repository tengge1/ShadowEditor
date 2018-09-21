import { SvgElement } from './SvgElement';

/**
 * @author tengge / https://github.com/tengge1
 */

function SvgLine(options) {
    SvgElement.call(this, options);
    options = options || {};
    this.x1 = options.x1 || 0;
    this.y1 = options.y1 || 0;
    this.x2 = options.x2 || 100;
    this.y2 = options.y2 || 100;
    this.stroke = options.stroke === undefined ? 'red' : options.stroke;
    this.strokeWidth = options.strokeWidth || 2;
}

SvgLine.prototype = Object.create(SvgElement.prototype);
SvgLine.prototype.constructor = SvgLine;

SvgLine.prototype.render = function() {
    this.parent.append('line')
        .attr('x1', this.x1)
        .attr('y1', this.y1)
        .attr('x2', this.x2)
        .attr('y2', this.y2)
        .call(this.renderStyle, this);
};

export { SvgLine };