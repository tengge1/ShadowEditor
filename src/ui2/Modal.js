import Control from './Control';
import Container from './Container';
import Panel from './Panel';

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

    this.dom.style.position = 'absolute';
    this.dom.style.width = '100%';
    this.dom.style.height = '100%';
    this.dom.style.backgroundColor = 'rgba(0,0,0,0.5)';
    this.dom.style.display = 'none';
    this.dom.style.alignItems = 'center';
    this.dom.style.justifyContent = 'center';

    this.parent.appendChild(this.dom);

    var _this = this;
    this.dom.addEventListener('click', function (event) {
        _this.hide();
    });

    this.container = new Panel();
    this.container.dom.style.width = '200px';
    this.container.dom.style.padding = '20px';
    this.container.dom.style.backgroundColor = '#ffffff';
    this.container.dom.style.boxShadow = '0px 5px 10px rgba(0,0,0,0.5)';

    this.dom.appendChild(this.container);
};

Modal.prototype.show = function (content) {
    this.container.clear();
    this.container.add(content);

    this.dom.style.display = 'flex';

    return this;
};

Modal.prototype.hide = function () {
    this.dom.style.display = 'none';
    return this;
};

export default Modal;