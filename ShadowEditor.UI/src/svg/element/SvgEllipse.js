import { SvgElement } from './SvgElement';

/**
 * @author tengge / https://github.com/tengge1
 */

function SvgEllipse(options) {
    SvgElement.call(this, options);
    options = options || {};
    this.cx = options.cx || null;
    this.cy = options.cy || null;
    this.rx = options.rx || 100;
    this.ry = options.ry || 60;
}

SvgEllipse.prototype = Object.create(SvgElement.prototype);
SvgEllipse.prototype.constructor = SvgEllipse;

SvgEllipse.prototype.render = function() {
    this.parent.append('ellipse')
        .attr('cx', this.cx)
        .attr('cy', this.cy)
        .attr('rx', this.rx)
        .attr('ry', this.ry)
        .call(this.renderStyle, this);
};

export { SvgEllipse };