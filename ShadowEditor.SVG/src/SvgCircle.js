import SvgControl from './SvgControl';

/**
 * SVG圆
 * @param {*} options 
 */
function SvgCircle(options = {}) {
    SvgControl.call(this, options);
}

SvgCircle.prototype = Object.create(SvgControl.prototype);
SvgCircle.prototype.constructor = SvgCircle;

SvgCircle.prototype.render = function () {
    this.dom = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

    if (this.style) {
        Object.assign(this.dom.style, this.style);
    }

    if (this.listeners) {
        Object.assign(this.dom, this.listeners);
    }

    this.parent.appendChild(this.dom);
};

export default SvgCircle;