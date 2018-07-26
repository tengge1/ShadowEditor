import Control from './Control';
import Container from './Container';

/**
 * 消息框
 * @param {*} options 
 */
function MessageBox(options) {
    Container.call(this, options);
    options = options || {};

    this.time = options.time || 5000;
};

MessageBox.prototype = Object.create(Container.prototype);
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

export default MessageBox;