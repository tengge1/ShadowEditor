import Control from './Control';

/**
 * 颜色选择器
 * @param {*} options 
 */
function Color(options) {
    Control.call(this, options);
};

Color.prototype = Object.create(Control.prototype);
Color.prototype.constructor = Color;

Color.prototype.render = function () {
    this.dom = document.createElement('input');
    this.dom.className = 'Color';
    this.dom.style.width = '64px';
    this.dom.style.height = '17px';
    this.dom.style.border = '0px';
    this.dom.style.padding = '2px';
    this.dom.style.backgroundColor = 'transparent';

    try {
        this.dom.type = 'color';
        this.dom.value = '#ffffff';
    } catch (exception) {

    }
    this.parent.appendChild(this.dom);
};

export default Color;