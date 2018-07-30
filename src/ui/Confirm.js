import Window from './Window';

/**
 * 询问对话框
 * @param {*} options 选项
 */
function Confirm(options) {
    Window.call(this, options);
    options = options || {};

    this.title = options.title || '询问';
    this.content = options.content || '';

    this.okText = options.okText || '确认';
    this.cancelText = options.cancelText || '取消';

    this.width = options.width || '320px';
    this.height = options.height || '150px';

    this.callback = options.callback || null;
}

Confirm.prototype = Object.create(Window.prototype);
Confirm.prototype.constructor = Confirm;

Confirm.prototype.render = function () {
    this.children = [{
        xtype: 'html',
        html: this.content
    }];

    var _this = this;

    function onClick(event, btn) {
        if (_this.callback) {
            if (_this.callback.call(_this, event, btn) !== false) {
                _this.hide();
            }
        }
    }

    this.buttons = [{
        xtype: 'button',
        text: this.okText,
        onClick: (event) => {
            onClick(event, 'ok');
        }
    }, {
        xtype: 'button',
        text: this.cancelText,
        onClick: (event) => {
            onClick(event, 'cancel');
        }
    }];

    Window.prototype.render.call(this);
};

export default Confirm;