import { SvgElement } from './SvgElement';

/**
 * @author tengge / https://github.com/tengge1
 */

function SvgCircle(options) {
    SvgElement.call(this, options);
    options = options || {};
    this.cx = options.cx || null;
    this.cy = options.cy || null;
    this.r = options.r || 50;
}

SvgCircle.prototype = Object.create(SvgElement.prototype);
SvgCircle.prototype.constructor = SvgCircle;

SvgCircle.prototype.render = function() {
    this.parent.append('circle')
        .attr('cx', this.cx)
        .attr('cy', this.cy)
        .attr('r', this.r)
        .call(this.renderStyle, this);
};

export { SvgCircle };