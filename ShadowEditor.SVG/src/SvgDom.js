import SvgContainer from './SvgContainer';

/**
 * SVG文档
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function SvgDom(options = {}) {
    SvgContainer.call(this, options);
}

SvgDom.prototype = Object.create(SvgContainer.prototype);
SvgDom.prototype.constructor = SvgDom;

SvgDom.prototype.render = function () {
    this.dom = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

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

export default SvgDom;