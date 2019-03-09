import Control from './Control';
import UI from './Manager';

/**
 * 树状控件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Tree(options = {}) {
    Control.call(this, options);

    this.data = options.data || [];
};

Tree.prototype = Object.create(Control.prototype);
Tree.prototype.constructor = Tree;

Tree.prototype.render = function () {
    this.dom = document.createElement('ul');
    this.parent.appendChild(this.dom);

    Object.assign(this.dom, {
        className: 'Tree'
    });

    this.data.forEach(n => {
        this._createNode(n, this.dom);
    });
};

Tree.prototype._createNode = function (data, dom) {
    var li = document.createElement('li');
    dom.appendChild(li);

    Object.assign(li, {
        className: 'Node',
        value: data.value,
    });

    // 图标
    var icon = document.createElement('i');
    icon.className = 'iconfont icon-right-triangle';
    li.appendChild(icon);

    // 链接
    var a = document.createElement('a');
    a.setAttribute('href', 'javascript:;');
    a.innerHTML = data.text || '';
    li.appendChild(a);

    if (Array.isArray(data.children) && data.children.length > 0) {
        var ul = document.createElement('ul');
        ul.className = 'SubTree';
        li.appendChild(ul);

        data.children.forEach(n => {
            this._createNode(n, ul);
        });
    }
};

UI.addXType('tree', Tree);

export default Tree;