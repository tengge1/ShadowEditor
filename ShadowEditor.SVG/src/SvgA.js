import SvgControl from './SvgControl';

/**
 * SVG链接
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function SvgA(options = {}) {
    SvgControl.call(this, options);
}

SvgA.prototype = Object.create(SvgControl.prototype);
SvgA.prototype.constructor = SvgA;

SvgA.prototype.render = function () {
    this.dom = document.createElementNS('http://www.w3.org/2000/svg', 'a');

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

    this.children.forEach(n => {
        var obj = SVG.create(n);
        obj.parent = this.dom;
        obj.render();
    });

    this.parent.appendChild(this.dom);
};

export default SvgA;