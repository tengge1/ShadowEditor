import Window from './Window';

/**
 * 询问输入框
 * @param {*} options 选项
 */
function Prompt(options) {
    Window.call(this, options);
    options = options || {};

    this.title = options.title || '消息';
    this.content = options.content || '';

    this.okText = options.okText || '确认';

    this.width = options.width || '320px';
    this.height = options.height || '150px';

    this.callback = options.callback || null;
}

Prompt.prototype = Object.create(Window.prototype);
Prompt.prototype.constructor = Prompt;

Prompt.prototype.render = function () {
    this.children = [{
        xtype: 'html',
        html: this.content
    }];

    this.buttons = [{
        xtype: 'button',
        text: this.okText,
        onClick: (event) => {
            var result = true;

            if (this.callback) {
                result = this.callback.call(this, event);
            }

            if (result !== false) {
                this.hide();
            }
        }
    }];

    Window.prototype.render.call(this);
};

export default Prompt;