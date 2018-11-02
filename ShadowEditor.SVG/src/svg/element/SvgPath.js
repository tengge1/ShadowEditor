import { SvgElement } from './SvgElement';

/**
 * @author tengge / https://github.com/tengge1
 */

function SvgPath(options) {
    SvgElement.call(this, options);
    options = options || {};
    this.d = options.d || 'M0 0 L100 0 L100 100 Z'; // M, L, H, V, C, S, Q, T, A, Z
    this.stroke = options.stroke || 'red';
    this.strokeWidth = options.strokeWidth || 2;
    this.fill = options.fill || 'none';
}

SvgPath.prototype = Object.create(SvgElement.prototype);
SvgPath.prototype.constructor = SvgPath;

SvgPath.prototype.render = function() {
    this.parent.append('path')
        .attr('d', this.d)
        .call(this.renderStyle, this);
};

export { SvgPath };