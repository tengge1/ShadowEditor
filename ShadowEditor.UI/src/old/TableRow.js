import Container from './Container';

/**
 * 表格一行
 * @author tengge / https://github.com/tengge1
 * @param {*} options 配置
 */
function TableRow(options) {
    Container.call(this, options);
    options = options || {};

    this.cls = options.cls || 'TableRow';
    this.style = options.style || {};
}

TableRow.prototype = Object.create(Container.prototype);
TableRow.prototype.constructor = TableRow;

TableRow.prototype.render = function () {
    this.dom = document.createElement('tr');

    if (this.cls) {
        this.dom.className = this.cls;
    }

    if (this.style) {
        Object.assign(this.dom.style, this.style);
    }

    this.parent.appendChild(this.dom);

    this.children.forEach((n) => {
        var obj = UI.create(n);
        obj.parent = this.dom;
        obj.render();
    });
};

export default TableRow;