import Control from './Control';
import Container from './Container';

/**
 * Div元素
 * @param {*} options 
 */
function Div(options) {
    Container.call(this, options);
    options = options || {};
    this.id = options.id || null;
    this.html = options.html || null;
    this.cls = options.cls || 'Panel';
    this.style = options.style || null;
    this.onClick = options.onClick || null;
};

Div.prototype = Object.create(Container.prototype);
Div.prototype.constructor = Div;

Div.prototype.render = function () {
    this.dom = document.createElement('div');

    if (this.id) {
        this.dom.id = this.id;
    }

    if (this.cls) {
        this.dom.className = this.cls;
    }

    if (this.style) {
        this.dom.style = this.style;
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
            if (!(n instanceof Control)) {
                throw 'Div: n is not an instance of Control.';
            }
            n.parent = _this.dom;
            n.render();
        });
    }
};

export default Div;