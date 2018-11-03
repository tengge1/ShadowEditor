import SvgControl from './SvgControl';

/**
 * SVG文本
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function SvgText(options = {}) {
    SvgControl.call(this, options);

    this.text = options.text || null;
}

SvgText.prototype = Object.create(SvgControl.prototype);
SvgText.prototype.constructor = SvgText;

SvgText.prototype.render = function () {
    this.dom = document.createElementNS('http://www.w3.org/2000/svg', 'text');

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

    if (this.text) {
        this.dom.innerHTML = this.text;
    }

    this.parent.appendChild(this.dom);
};

export default SvgText;