import Container from './Container';
import UI from './Manager';

/**
 * 文本块
 * @author tengge / https://github.com/tengge1
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
        var obj = UI.create(n);
        obj.parent = _this.dom;
        obj.render();
    });
};

UI.addXType('span', Span);

export default Span;