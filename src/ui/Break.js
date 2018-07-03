import Control from './Control';
import XType from './XType';

/**
 * 换行符
 * @param {*} options 
 */
function Break(options) {
    Control.call(this, options);
    options = options || {};

    this.cls = options.cls || null; // Break
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

XType.add('br', Break);

export default Break;