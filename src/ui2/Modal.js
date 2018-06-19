import Control from './Control';

/**
 * 模态框
 * @param {*} options 
 */
function Modal(options) {
    Control.call(this, options);
};

Modal.prototype = Object.create(Control.prototype);
Modal.prototype.constructor = Modal;

Modal.prototype.render = function () {
    var scope = this;

    var dom = document.createElement('div');

    dom.style.position = 'absolute';
    dom.style.width = '100%';
    dom.style.height = '100%';
    dom.style.backgroundColor = 'rgba(0,0,0,0.5)';
    dom.style.display = 'none';
    dom.style.alignItems = 'center';
    dom.style.justifyContent = 'center';
    dom.addEventListener('click', function (event) {

        scope.hide();

    });

    this.dom = dom;

    this.container = new Panel();
    this.container.dom.style.width = '200px';
    this.container.dom.style.padding = '20px';
    this.container.dom.style.backgroundColor = '#ffffff';
    this.container.dom.style.boxShadow = '0px 5px 10px rgba(0,0,0,0.5)';

    this.add(this.container);
};

export default Modal;