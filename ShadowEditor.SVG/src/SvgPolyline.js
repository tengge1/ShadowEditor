import SvgControl from './SvgControl';

/**
 * SVG曲线
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function SvgPolyline(options = {}) {
    SvgControl.call(this, options);
}

SvgPolyline.prototype = Object.create(SvgControl.prototype);
SvgPolyline.prototype.constructor = SvgPolyline;

SvgPolyline.prototype.render = function () {
    this.dom = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');

    if (this.attr) {
        Object.keys(this.attr).forEach(n => {
            this.dom.setAttribute(n, this.attr[n]);
        });
    }

    if (this.style) {
        Object.assign(this.dom.style, this.style);
    }

    if (this.listeners) {
        Object.assign(this.dom, this.listeners);
    }

    this.parent.appendChild(this.dom);
};

export default SvgPolyline;