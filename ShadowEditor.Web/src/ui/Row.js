import Control from './Control';
import UI from './Manager';

/**
 * 行控件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Row(options) {
    Control.call(this, options);
    options = options || {};

    this.cls = options.cls || 'Row';
    this.style = options.style || null;
};

Row.prototype = Object.create(Control.prototype);
Row.prototype.constructor = Row;

Row.prototype.render = function () {
    this.dom = document.createElement('div');

    this.dom.className = this.cls;

    if (this.style) {
        Object.assign(this.dom.style, this.style);
    }

    this.parent.appendChild(this.dom);

    var _this = this;

    this.children.forEach(function (n) {
        var obj = UI.create(n);
        obj.parent = _this.dom;
        obj.render();
    });
};

UI.addXType('row', Row);

export default Row;