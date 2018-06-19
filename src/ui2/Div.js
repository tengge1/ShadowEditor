import Control from './Control';
import Container from './Container';

/**
 * Div
 * @param {*} options 
 */
function Div(options) {
    Container.call(this, options);
};

Div.prototype = Object.create(Container.prototype);
Div.prototype.constructor = Div;

Div.prototype.render = function () {
    this.dom = document.createElement('div');
    this.parent.appendChild(this.dom);

    var _this = this;
    this.children.forEach(function (n) {
        if (!(n instanceof Control)) {
            throw 'Div: n is not an instance of Control.';
        }
        n.parent = _this.dom;
        n.render();
    });
};

export default Div;