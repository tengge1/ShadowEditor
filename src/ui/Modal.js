import Control from './Control';
import Container from './Container';
import XType from './XType';

/**
 * 模态框
 * @param {*} options 
 */
function Modal(options) {
    Container.call(this, options);
};

Modal.prototype = Object.create(Container.prototype);
Modal.prototype.constructor = Modal;

Modal.prototype.render = function () {
    this.dom = document.createElement('div');

    this.dom.style = 'position: absolute; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); '
        + 'display: none; align-items: center; justify-content: center;';

    this.parent.appendChild(this.dom);

    this.dom.addEventListener('click', this.hide.bind(this));

    this.container = document.createElement('div');
    this.container.dom.style.width = '200px';
    this.container.dom.style.padding = '20px';
    this.container.dom.style.backgroundColor = '#ffffff';
    this.container.dom.style.boxShadow = '0px 5px 10px rgba(0,0,0,0.5)';

    this.dom.appendChild(this.container);
};

Modal.prototype.show = function (content) {
    this.container.innerHTML = content;
    this.dom.style.display = 'flex';
    return this;
};

Modal.prototype.hide = function () {
    this.dom.style.display = 'none';
    return this;
};

XType.add('modal', Modal);

export default Modal;