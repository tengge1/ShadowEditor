import SvgControl from './SvgControl';

/**
 * SVG矩形
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function SvgRect(options = {}) {
    SvgControl.call(this, options);
}

SvgRect.prototype = Object.create(SvgControl.prototype);
SvgRect.prototype.constructor = SvgRect;

SvgRect.prototype.render = function () {
    this.dom = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

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

export default SvgRect;