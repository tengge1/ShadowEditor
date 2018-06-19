import Control from './Control';

/**
 * 换行符
 * @param {*} options 
 */
function Break(options) {
    Control.call(this, options);
};

Break.prototype = Object.create(Control.prototype);
Break.prototype.constructor = Break;

Break.prototype.render = function () {
    this.dom = document.createElement('br');
    this.dom.className = 'Break';
    this.parent.appendChild(this.dom);
};

export default Break;