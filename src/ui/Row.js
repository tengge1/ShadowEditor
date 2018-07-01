import Control from './Control';
import Container from './Container';

/**
 * Row
 * @param {*} options 
 */
function Row(options) {
    Container.call(this, options);
};

Row.prototype = Object.create(Container.prototype);
Row.prototype.constructor = Row;

Row.prototype.render = function () {
    this.dom = document.createElement('div');
    this.dom.className = 'Row';

    this.parent.appendChild(this.dom);

    var _this = this;
    this.children.forEach(function (n) {
        if (!(n instanceof Control)) {
            throw 'Row: n is not an instance of Control.';
        }
        n.parent = _this.dom;
        n.render();
    });
};

export default Row;