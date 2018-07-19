import Container from './Container';

/**
 * 行控件
 * @param {*} options 
 */
function Row(options) {
    Container.call(this, options);
    options = options || {};

    this.cls = options.cls || 'Row';
    this.style = options.style || null;
};

Row.prototype = Object.create(Container.prototype);
Row.prototype.constructor = Row;

Row.prototype.render = function () {
    this.dom = document.createElement('div');

    this.dom.className = this.cls;

    if (this.style) {
        this.dom.style = this.style;
    }

    this.parent.appendChild(this.dom);

    var _this = this;

    this.children.forEach(function (n) {
        var obj = UI.create(n);
        obj.parent = _this.dom;
        obj.render();
    });
};

export default Row;