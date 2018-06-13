import Element from './Element';
import Panel from './Panel';

// Modal

function Modal(value) {

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

    return this;

};

Modal.prototype = Object.create(Element.prototype);
Modal.prototype.constructor = Modal;

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