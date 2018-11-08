import Container from './Container';

/**
 * 表格身体
 * @author tengge / https://github.com/tengge1
 * @param {*} options 配置
 */
function TableBody(options) {
    Container.call(this, options);
    options = options || {};

    this.cls = options.cls || 'TableBody';
    this.style = options.style || {};
}

TableBody.prototype = Object.create(Container.prototype);
TableBody.prototype.constructor = TableBody;

TableBody.prototype.render = function () {
    this.dom = document.createElement('tbody');

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

export default TableBody;