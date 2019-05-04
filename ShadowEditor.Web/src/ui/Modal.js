import Control from './Control';
import UI from './Manager';

/**
 * 模态框
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Modal(options) {
    Control.call(this, options);
    options = options || {};

    this.cls = options.cls || 'Modal';
    this.style = options.style || null;
    this.containerStyle = options.containerStyle || null;
    this.width = options.width || '500px';
    this.height = options.height || '300px';
    this.shade = options.shade === false ? false : true;
    this.shadeClose = options.shadeClose || false;
};

Modal.prototype = Object.create(Control.prototype);
Modal.prototype.constructor = Modal;

Modal.prototype.render = function () {
    this.dom = document.createElement('div');

    if (this.cls) {
        this.dom.className = this.cls;
    }

    if (this.shade === false) {
        this.dom.classList.add('NoShade');
    }

    if (this.style) {
        Object.assign(this.dom.style, this.style);
    }

    this.parent.appendChild(this.dom);

    this.container = document.createElement('div');

    this.container.className = 'Container';

    if (this.containerStyle) {
        Object.assign(this.container.style, this.containerStyle);
    }

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
    if (this.dom) {
        this.dom.style.display = 'flex';
    }
    return this;
};

Modal.prototype.hide = function () {
    if (this.dom) {
        this.dom.style.display = 'none';
    }
    return this;
};

UI.addXType('modal', Modal);

export default Modal;