import Modal from './Modal';
import Button from './Button';
import CloseButton from './CloseButton';

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

    // 标题
    this.caption = UI.create({
        xtype: 'container',
        children: [{
            xtype: 'div',
            cls: 'caption',
            html: this.title
        }]
    });

    // 关闭按钮
    this.closeBtn = UI.create({
        xtype: 'closebutton',
        onClick: () => {
            this.hide();
        }
    });

    // 标题栏
    this.header = UI.create({
        xtype: 'div',
        cls: 'header',
        children: [
            this.caption,
            this.closeBtn
        ]
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

    // 拖动标题栏
    var isDown = false;
    var offsetX = 0;
    var offsetY = 0;

    var _this = this;

    function mouseDown(event) {
        isDown = true;
        var left = _this.container.style.left === '' ? 0 : parseInt(_this.container.style.left.replace('px', ''));
        var top = _this.container.style.top === '' ? 0 : parseInt(_this.container.style.top.replace('px', ''));
        offsetX = event.clientX - left;
        offsetY = event.clientY - top;
    }

    function mouseMove(event) {
        if (!isDown) {
            return;
        }
        var dx = event.clientX - offsetX;
        var dy = event.clientY - offsetY;

        _this.container.style.left = dx + 'px';
        _this.container.style.top = dy + 'px';
    }

    function mouseUp(event) {
        isDown = false;
        offsetX = 0;
        offsetY = 0;
    }

    this.header.dom.addEventListener('mousedown', mouseDown);
    document.body.addEventListener('mousemove', mouseMove);
    document.body.addEventListener('mouseup', mouseUp);
};

export default Window;