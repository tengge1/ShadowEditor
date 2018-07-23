import Control from './Control';

/**
 * 关闭按钮
 * @param {*} options 
 */
function CloseButton(options) {
    Control.call(this, options);
    options = options || {};

    this.style = options.style || null;

    this.onClick = options.onClick || null;
}

CloseButton.prototype = Object.create(Control.prototype);
CloseButton.prototype.constructor = CloseButton;

CloseButton.prototype.render = function () {
    this.dom = document.createElement('div');

    // TODO: 由于按钮默认白色，在白色背景上按钮将不可见！
    if (this.style) {
        this.dom.style = this.style;
    }

    this.dom.style.width = '32px';
    this.dom.style.height = '32px';
    this.dom.style.display = 'flex';
    this.dom.style.alignItems = 'center';
    this.dom.style.justifyContent = 'center';

    this.parent.appendChild(this.dom);

    if (this.onClick) {
        this.dom.addEventListener('click', this.onClick.bind(this));
    }

    this.icon = document.createElement('i');
    this.icon.className = 'iconfont icon-close';
    this.icon.style.fontSize = '24px';
    this.icon.style.color = '#fff';

    this.dom.appendChild(this.icon);
};

export default CloseButton;