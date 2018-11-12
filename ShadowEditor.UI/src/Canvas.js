import Control from './Control';

/**
 * Canvas元素
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Canvas(options) {
    Control.call(this, options);
    options = options || {};

    this.cls = options.cls || null;
    this.style = options.style || null;
};

Canvas.prototype = Object.create(Control.prototype);
Canvas.prototype.constructor = Canvas;

Canvas.prototype.render = function () {
    this.dom = document.createElement('canvas');

    if (this.cls) {
        this.dom.className = this.cls;
    }

    if (this.style) {
        Object.assign(this.dom.style, this.style);
    }

    this.parent.appendChild(this.dom);
};

export default Canvas;