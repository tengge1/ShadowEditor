import Control from './Control';
import UI from './Manager';

/**
 * 消息框
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function MessageBox(options) {
    Control.call(this, options);
    options = options || {};

    this.time = options.time || 3000;
};

MessageBox.prototype = Object.create(Control.prototype);
MessageBox.prototype.constructor = MessageBox;

MessageBox.prototype.render = function () {
    this.dom = document.createElement('div');
    this.dom.className = 'MessageBox';
    this.parent.appendChild(this.dom);
};

MessageBox.prototype.show = function (html) {
    this.dom.innerHTML = html;
    this.dom.display = 'block';

    // 设置居中
    this.dom.style.left = (this.parent.clientWidth - this.dom.clientWidth) / 2 + 'px';
    this.dom.style.top = (this.parent.clientHeight - this.dom.clientHeight) / 2 + 'px';

    if (this.time > 0) {
        setTimeout(() => {
            this.destroy();
        }, this.time);
    }
};

MessageBox.prototype.hide = function () {
    this.dom.display = 'none';
};

UI.addXType('msg', MessageBox);

export default MessageBox;