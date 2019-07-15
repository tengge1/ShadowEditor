import Control from './Control';
import UI from './Manager';

/**
 * 图标
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Icon(options) {
    Control.call(this, options);

    this.icon = options.icon || null; // 对应assets/css/icon/iconfont.css中的css
    this.style = options.style || null;
}

Icon.prototype = Object.create(Control.prototype);
Icon.prototype.constructor = Icon;

Icon.prototype.render = function () {
    this.dom = document.createElement('i');
    this.parent.appendChild(this.dom);

    if (this.icon) {
        this.dom.className = `iconfont ${this.icon}`;
    }

    if (this.style) {
        Object.assign(this.dom.style, this.style);
    }
};

UI.addXType('icon', Icon);

export default Icon;