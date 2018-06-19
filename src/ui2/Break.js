import Control from './Control';
import Container from './Container';

/**
 * 换行符
 * @param {*} options 
 */
function Break(options) {
    Container.call(this, options);
};

Break.prototype = Object.create(Container.prototype);
Break.prototype.constructor = Break;

Break.prototype.render = function () {
    this.dom = document.createElement('br');
    this.dom.className = 'Break';
    this.parent.appendChild(this.dom);
};

export default Break;