import Container from './Container';

/**
 * 表格一个单元格
 * @author tengge / https://github.com/tengge1
 * @param {*} options 配置
 */
function TableData(options) {
    Container.call(this, options);
    options = options || {};

    this.html = options.html || null;

    this.cls = options.cls || 'TableData';
    this.style = options.style || {};
}

TableData.prototype = Object.create(Container.prototype);
TableData.prototype.constructor = TableData;

TableData.prototype.render = function () {
    this.dom = document.createElement('td');

    if (this.cls) {
        this.dom.className = this.cls;
    }

    if (this.style) {
        Object.assign(this.dom.style, this.style);
    }

    this.parent.appendChild(this.dom);

    if (this.html) {
        this.dom.innerHTML = this.html;
    }

    this.children.forEach((n) => {
        var obj = UI.create(n);
        obj.parent = this.dom;
        obj.render();
    });
};

export default TableData;