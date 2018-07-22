import Modal from './Modal';
import Button from './Button';

/**
 * 模态框
 * @param {*} options 
 */
function Window(options) {
    Modal.call(this, options);
    options = options || {};

    this.cls = options.cls || 'Modal Window';
    this.title = options.title || '';
    this.buttons = options.buttons || [];
};

Window.prototype = Object.create(Modal.prototype);
Window.prototype.constructor = Window;

Window.prototype.render = function () {
    this.header = UI.create({
        xtype: 'div',
        cls: 'header',
        html: this.title
    });
    this.children.splice(0, 0, this.header);

    this.bottomBar = UI.create({
        xtype: 'div',
        cls: 'bbar',
        children: this.buttons
    });
    this.children.push(this.bottomBar);

    Modal.prototype.render.call(this);
};

export default Window;