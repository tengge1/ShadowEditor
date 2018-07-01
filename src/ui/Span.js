import Control from './Control';
import Container from './Container';

/**
 * Span
 * @param {*} options 
 */
function Span(options) {
    Container.call(this, options);
};

Span.prototype = Object.create(Container.prototype);
Span.prototype.constructor = Span;

Span.prototype.render = function () {
    this.dom = document.createElement('span');
    this.parent.appendChild(this.dom);

    var _this = this;
    this.children.forEach(function (n) {
        if (!(n instanceof Control)) {
            throw 'Container: n is not an instance of Control.';
        }
        n.parent = _this.dom;
        n.render();
    });
};

export default Span;