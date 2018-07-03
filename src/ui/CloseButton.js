import Control from './Control';
import XType from './XType';

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
    this.dom = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.dom.setAttribute('width', 32);
    this.dom.setAttribute('height', 32);

    // TODO: 由于按钮默认白色，在白色背景上按钮将不可见！
    if (this.style) {
        this.dom.style = this.style;
    }

    this.parent.appendChild(this.dom);

    if (this.onClick) {
        this.dom.addEventListener('click', this.onClick.bind(this));
    }

    this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.path.setAttribute('d', 'M 12,12 L 22,22 M 22,12 12,22');
    this.path.setAttribute('stroke', '#fff');

    this.dom.appendChild(this.path);
};

XType.add('closebutton', CloseButton);

export default CloseButton;