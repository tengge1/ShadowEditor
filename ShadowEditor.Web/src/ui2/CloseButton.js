import Control from './Control';
import UI from './Manager';

/**
 * 关闭按钮
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function CloseButton(options) {
    Control.call(this, options);
    options = options || {};

    this.cls = options.cls || 'CloseButton';
    this.style = options.style || null;

    this.onClick = options.onClick || null;
}

CloseButton.prototype = Object.create(Control.prototype);
CloseButton.prototype.constructor = CloseButton;

CloseButton.prototype.render = function () {
    this.dom = document.createElement('div');

    this.dom.className = this.cls;

    // TODO: 由于按钮默认白色，在白色背景上按钮将不可见！
    if (this.style) {
        Object.assign(this.dom.style, this.style);
    }

    this.parent.appendChild(this.dom);

    if (this.onClick) {
        this.dom.addEventListener('click', this.onClick.bind(this));
    }

    this.icon = document.createElement('i');
    this.icon.className = 'iconfont icon-close';

    this.dom.appendChild(this.icon);
};

UI.addXType('closebutton', CloseButton);

export default CloseButton;