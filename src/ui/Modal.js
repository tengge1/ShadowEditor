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
    this.cls = options.cls || 'Modal';
    this.style = options.style || null;

    this.width = options.width || '500px';
    this.height = options.height || '300px';
};

Modal.prototype = Object.create(Container.prototype);
Modal.prototype.constructor = Modal;

Modal.prototype.render = function () {
    this.dom = document.createElement('div');

    if (this.id) {
        this.dom.id = this.id;
    }

    if (this.cls) {
        this.dom.className = this.cls;
    }

    if (this.style) {
        this.dom.style = this.style;
    }

    this.parent.appendChild(this.dom);

    this.container = document.createElement('div');

    this.container.className = 'Container';

    this.container.style.width = this.width;
    this.container.style.height = this.height;

    this.dom.appendChild(this.container);

    var _this = this;

    this.children.forEach(function (n) {
        var obj = XType.create(n);
        obj.parent = _this.container;
        obj.render();
    });
};

Modal.prototype.show = function () {
    this.dom.style.display = 'flex';
    return this;
};

Modal.prototype.hide = function () {
    this.dom.style.display = 'none';
    return this;
};

XType.add('modal', Modal);

export default Modal;