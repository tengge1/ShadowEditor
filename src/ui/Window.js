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
    this.content = this.children; // 内容
    this.children = []; // 标题栏、内容区域、按钮工具栏

    // 标题栏
    this.header = UI.create({
        xtype: 'div',
        cls: 'header',
        html: this.title
    });
    this.children.push(this.header);

    // 内容区域
    this.body = UI.create({
        xtype: 'div',
        cls: 'body',
        children: this.content
    });
    this.children.push(this.body);

    // 按钮区域
    this.footer = UI.create({
        xtype: 'div',
        cls: 'footer',
        children: this.buttons
    });
    this.children.push(this.footer);

    Modal.prototype.render.call(this);
};

export default Window;