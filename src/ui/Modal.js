import Control from './Control';
import Container from './Container';

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
    this.shadeClose = options.shadeClose || false;
};

Modal.prototype = Object.create(Container.prototype);
Modal.prototype.constructor = Modal;

Modal.prototype.render = function () {
    this.dom = document.createElement('div');

    if (this.cls) {
        this.dom.className = this.cls;
    }

    if (this.style) {
        Object.assign(this.dom.style, this.style);
    }

    this.parent.appendChild(this.dom);

    this.container = document.createElement('div');

    this.container.className = 'Container';

    this.container.style.width = this.width;
    this.container.style.height = this.height;

    this.dom.appendChild(this.container);

    this.container.addEventListener('mousedown', function (event) {
        event.stopPropagation();
    });

    if (this.shadeClose) {
        this.dom.addEventListener('mousedown', this.hide.bind(this));
    }

    var _this = this;

    this.children.forEach(function (n) {
        var obj = UI.create(n);
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

export default Modal;