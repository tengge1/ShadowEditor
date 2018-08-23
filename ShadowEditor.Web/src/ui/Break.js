import Control from './Control';

/**
 * 换行符
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Break(options) {
    Control.call(this, options);
    options = options || {};

    this.cls = options.cls || null;
};

Break.prototype = Object.create(Control.prototype);
Break.prototype.constructor = Break;

Break.prototype.render = function () {
    this.dom = document.createElement('br');

    if (this.cls) {
        this.dom.className = this.cls;
    }

    this.parent.appendChild(this.dom);
};

export default Break;