import { SvgElement } from './SvgElement';

/**
 * @author tengge / https://github.com/tengge1
 */

function SvgRect(options) {
    SvgElement.call(this, options);
    options = options || {};
    this.x = options.x || null;
    this.y = options.y || null;
    this.width = options.width || 100;
    this.height = options.height || 60;
    this.rx = options.rx || null;
    this.ry = options.ry || null;
}

SvgRect.prototype = Object.create(SvgElement.prototype);
SvgRect.prototype.constructor = SvgRect;

SvgRect.prototype.render = function() {
    this.parent.append('rect')
        .attr('x', this.x)
        .attr('y', this.y)
        .attr('width', this.width)
        .attr('height', this.height)
        .attr('rx', this.rx)
        .attr('ry', this.ry)
        .call(this.renderStyle, this);
};

export { SvgRect };