import Container from './Container';

/**
 * 表格
 * @param {*} options 配置
 */
function Table(options) {
    Container.call(this, options);
    options = options || {};

    this.cls = options.cls || 'Table';
    this.style = options.style || {};
}

Table.prototype = Object.create(Container.prototype);
Table.prototype.constructor = Table;

Table.prototype.render = function () {
    this.dom = document.createElement('table');

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

export default Table;