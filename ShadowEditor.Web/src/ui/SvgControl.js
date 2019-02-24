import Control from './Control';

const svgNS = 'http://www.w3.org/2000/svg';
const xlinkNS = "http://www.w3.org/1999/xlink";

/**
 * SVG控件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 选项
 * @see https://github.com/tengge1/xtype.js
 * @see https://github.com/tengge1/xtype-svg
 */
function SvgControl(options = {}) {
    Control.call(this, options);
}

SvgControl.prototype = Object.create(Control.prototype);
SvgControl.prototype.constructor = SvgControl;

SvgControl.prototype.createElement = function (tag) {
    return document.createElementNS(svgNS, tag);
};

SvgControl.prototype.renderDom = function (dom) {
    this.dom = dom;
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

    if (this.listeners) {
        Object.keys(this.listeners).forEach(n => {
            this.dom['on' + n] = this.listeners[n];
        });
    }

    if (this.data) {
        this.dom.data = {};
        Object.assign(this.dom.data, this.data);
    }

    if (this.html) {
        this.dom.innerHTML = this.html;
    }

    this.children.forEach(n => {
        var control = this.manager.create(n);
        control.parent = this.dom;
        control.render();
    });
};

export default SvgControl;