import Modal from './Modal';

function Window() {
    Modal.call(this);
}

Window.prototype = Object.create(Modal.prototype);
Window.prototype.constructor = Window;

Window.prototype.show = function () {

};

Window.prototype.hide = function () {

};

export default Window;