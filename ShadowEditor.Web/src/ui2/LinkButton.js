import Control from './Control';
import UI from './Manager';

/**
 * 链接按钮
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function LinkButton(options) {
    Control.call(this, options);
    options = options || {};

    this.text = options.text || 'Button';
    this.cls = options.cls || null;
    this.style = options.style || null;
    this.title = options.title || null;

    this.onClick = options.onClick || null;
};

LinkButton.prototype = Object.create(Control.prototype);
LinkButton.prototype.constructor = LinkButton;

LinkButton.prototype.render = function () {
    this.dom = document.createElement('a');

    this.dom.href = 'javascript:;';

    this.dom.innerHTML = this.text;

    if (this.cls) {
        this.dom.className = this.cls;
    }

    if (this.style) {
        Object.assign(this.dom.style, this.style);
    }

    if (this.title) {
        this.dom.title = this.title;
    }

    this.parent.appendChild(this.dom);

    if (this.onClick) {
        this.dom.addEventListener('click', this.onClick.bind(this), false);
    }
};

LinkButton.prototype.setText = function (text) {
    this.text = text;
    this.dom.innerHTML = this.text;
};

UI.addXType('linkbutton', LinkButton);

export default LinkButton;