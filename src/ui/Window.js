import Modal from './Modal';

function Window() {
    Modal.call(this);
}

Window.prototype = Object.create(Modal.prototype);
Window.prototype.constructor = Window;

export default Window;