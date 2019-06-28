import UI from './Manager';
import Window from './Window';

/**
 * 提示框
 * @author tengge / https://github.com/tengge1
 * @param {*} options 选项
 */
function Alert(options = {}) {
    Window.call(this, options);

    this.title = options.title || L_MESSAGE;
    this.content = options.content || '';

    this.okText = options.okText || L_OK;

    this.width = options.width || '320px';
    this.height = options.height || '150px';

    this.callback = options.callback || null;
}

Alert.prototype = Object.create(Window.prototype);
Alert.prototype.constructor = Alert;

Alert.prototype.render = function () {
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

UI.addXType('alert', Alert);

export default Alert;