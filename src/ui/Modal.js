import Control from './Control';
import Container from './Container';
import XType from './XType';

/**
 * 模态框
 * @param {*} options 
 */
function Modal(options) {
    Container.call(this, options);
    options = options || {};

    this.id = options.id || null;
    this.width = options.width || 500;
    this.height = options.height || 300;
};

Modal.prototype = Object.create(Container.prototype);
Modal.prototype.constructor = Modal;

Modal.prototype.render = function () {
    this.dom = document.createElement('div');

    if (this.id) {
        this.dom.id = this.id;
    }

    this.dom.style = 'position: absolute; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); '
        + 'display: none; align-items: center; justify-content: center;';

    this.parent.appendChild(this.dom);

    this.dom.addEventListener('click', this.hide.bind(this));

    this.container = document.createElement('div');
    this.container.dom.style.width = this.width + 'px';
    this.container.dom.style.height = this.height + 'px';
    this.container.dom.style.padding = '8px';
    this.container.dom.style.backgroundColor = '#ffffff';
    this.container.dom.style.boxShadow = '0px 5px 10px rgba(0,0,0,0.5)';

    this.dom.appendChild(this.container);
};

Modal.prototype.show = function () {
    this.dom.style.display = 'block';
    return this;
};

Modal.prototype.hide = function () {
    this.dom.style.display = 'none';
    return this;
};

XType.add('modal', Modal);

export default Modal;