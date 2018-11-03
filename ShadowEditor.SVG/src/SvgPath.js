import SvgControl from './SvgControl';

/**
 * SVG线
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function SvgPath(options = {}) {
    SvgControl.call(this, options);
}

SvgPath.prototype = Object.create(SvgControl.prototype);
SvgPath.prototype.constructor = SvgPath;

SvgPath.prototype.render = function () {
    this.dom = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    if (this.attr) { // d: M, L, H, V, C, S, Q, T, A, Z
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

export default SvgPath;