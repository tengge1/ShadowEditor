import Container from './Container';

/**
 * 表格头部
 * @author tengge / https://github.com/tengge1
 * @param {*} options 配置
 */
function TableHead(options) {
    Container.call(this, options);
    options = options || {};

    this.cls = options.cls || 'TableHead';
    this.style = options.style || {};
}

TableHead.prototype = Object.create(Container.prototype);
TableHead.prototype.constructor = TableHead;

TableHead.prototype.render = function () {
    this.dom = document.createElement('thead');

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

export default TableHead;