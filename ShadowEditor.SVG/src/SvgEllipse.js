import SvgControl from './SvgControl';

/**
 * SVG椭圆
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function SvgEllipse(options = {}) {
    SvgControl.call(this, options);
}

SvgEllipse.prototype = Object.create(SvgControl.prototype);
SvgEllipse.prototype.constructor = SvgEllipse;

SvgEllipse.prototype.render = function () {
    this.dom = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');

    if (this.style) {
        Object.assign(this.dom.style, this.style);
    }

    if (this.listeners) {
        Object.assign(this.dom, this.listeners);
    }

    this.parent.appendChild(this.dom);
};

export default SvgEllipse;