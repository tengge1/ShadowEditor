import { SvgElement } from './SvgElement';

/**
 * @author tengge / https://github.com/tengge1
 */

function SvgPolyline(options) {
    SvgElement.call(this, options);
    options = options || {};
    this.points = options.points || '0,0,100,100,150,100,150,150';
    this.stroke = options.stroke === undefined ? 'red' : options.stroke;
    this.strokeWidth = options.strokeWidth || 2;
    this.fill = options.fill || 'none';
}

SvgPolyline.prototype = Object.create(SvgElement.prototype);
SvgPolyline.prototype.constructor = SvgPolyline;

SvgPolyline.prototype.render = function() {
    this.parent.append('polyline')
        .attr('points', this.points)
        .call(this.renderStyle, this);
};

export { SvgPolyline };