import Control from './Control';
import UI from './Manager';

/**
 * Div元素
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Div(options) {
    Control.call(this, options);
    options = options || {};

    this.html = options.html || null;
    this.cls = options.cls || null;
    this.style = options.style || null;

    this.onClick = options.onClick || null;
};

Div.prototype = Object.create(Control.prototype);
Div.prototype.constructor = Div;

Div.prototype.render = function () {
    this.dom = document.createElement('div');

    if (this.cls) {
        this.dom.className = this.cls;
    }

    if (this.style) {
        Object.assign(this.dom.style, this.style);
    }

    this.parent.appendChild(this.dom);

    if (this.onClick) {
        this.dom.onclick = this.onClick.bind(this);
    }

    var _this = this;

    if (this.html) {
        this.dom.innerHTML = this.html;
    } else {
        this.children.forEach(function (n) {
            var obj = UI.create(n);
            obj.parent = _this.dom;
            obj.render();
        });
    }
};

UI.addXType('div', Div);

export default Div;