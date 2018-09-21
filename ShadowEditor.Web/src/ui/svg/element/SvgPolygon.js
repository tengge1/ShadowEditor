import { SvgElement } from './SvgElement';

/**
 * @author tengge / https://github.com/tengge1
 */

function SvgPolygon(options) {
    SvgElement.call(this, options);
    options = options || {};
    this.points = options.points || '0,0,100,0,100,100,0,100';
    this.stroke = options.stroke || 'red';
    this.strokeWidth = options.strokeWidth || 2;
    this.fill = options.fill || 'yellow';
}

SvgPolygon.prototype = Object.create(SvgElement.prototype);
SvgPolygon.prototype.constructor = SvgPolygon;

SvgPolygon.prototype.render = function() {
    this.parent.append('polygon')
        .attr('points', this.points)
        .call(this.renderStyle, this);
};

export { SvgPolygon };