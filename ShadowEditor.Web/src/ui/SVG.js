import Control from './Control';
import UI from './Manager';

const svgNS = 'http://www.w3.org/2000/svg';
const xlinkNS = "http://www.w3.org/1999/xlink";

/**
 * SVG
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function SVG(options) {
    Control.call(this, options);
};

SVG.prototype = Object.create(Control.prototype);
SVG.prototype.constructor = SVG;

SVG.prototype.render = function () {
    this.dom = document.createElementNS(svgNS, 'svg');
    this.parent.appendChild(this.dom);

    if (this.attr) {
        Object.keys(this.attr).forEach(n => {
            if (n.startsWith('xlink')) {
                this.dom.setAttributeNS(xlinkNS, n, this.attr[n]);
            } else {
                this.dom.setAttribute(n, this.attr[n]);
            }
        });
    }

    if (this.prop) {
        Object.assign(this.dom, this.prop);
    }

    if (this.cls) {
        this.dom.className = this.cls;
    }

    if (this.style) {
        Object.assign(this.dom.style, this.style);
    }
};

UI.addXType('svg', SVG);

export default SVG;