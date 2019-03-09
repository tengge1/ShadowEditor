import Control from './Control';
import UI from './Manager';

var ID = -1;

/**
 * 树状控件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Tree(options = {}) {
    Control.call(this, options);

    this.data = options.data || []; // [{ id: '可选', value: '值', text: '文本', expand: 'true/false, 默认关闭', 其他属性 }, ...]

    this.onClick = options.onClick || null;
    this.onDblClick = options.onDblClick || null;

    this._nodes = {}; // id: li
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

    var id = data.id || `tr${ID--}`;
    var leaf = !Array.isArray(data.children) || data.children.length === 0;
    var expand = data.expand || false;

    data.id = id;
    data.leaf = leaf;
    data.expand = expand;

    Object.assign(li, {
        className: 'Node',
        data: data
    });

    this._nodes[id] = li;

    var icon = document.createElement('i');

    if (!leaf && expand) { // 非叶子节点展开
        icon.className = 'iconfont icon-down-triangle';
    } else if (!leaf && !expand) { // 非叶子节点关闭
        icon.className = 'iconfont icon-right-triangle';
    } else { // 叶子节点
        icon.className = 'iconfont icon-rect';
    }

    icon.addEventListener('click', this._toggleNode.bind(this));

    li.appendChild(icon);

    // 链接
    var a = document.createElement('a');
    a.setAttribute('href', 'javascript:;');
    a.innerHTML = data.text || '';
    li.appendChild(a);

    if (!leaf) {
        var ul = document.createElement('ul');
        ul.className = 'SubTree';
        ul.style.display = expand ? '' : 'none';
        li.appendChild(ul);

        data.children.forEach(n => {
            this._createNode(n, ul);
        });
    }
};

Tree.prototype.getNode = function (id) {
    var li = this._nodes[id];
    if (!li) {
        return null;
    }

    return li.data;
};

Tree.prototype.expand = function (id) {
    var li = this._nodes[id];
    if (!li) {
        return null;
    }

    var data = li.data;
    if (data.leaf || data.expand) {
        return;
    }

    data.expand = true;

    for (var i = 0; i < li.children.length; i++) {
        var node = li.children[i];
        if (node.classList.contains('iconfont')) {
            node.classList.remove('icon-right-triangle');
            node.classList.add('icon-down-triangle');
        }
        if (node.classList.contains('SubTree')) {
            node.style.display = '';
        }
    }
};

Tree.prototype.collapse = function (id) {
    var li = this._nodes[id];
    if (!li) {
        return null;
    }

    var data = li.data;
    if (data.leaf || !data.expand) {
        return;
    }

    data.expand = false;

    for (var i = 0; i < li.children.length; i++) {
        var node = li.children[i];
        if (node.classList.contains('iconfont')) {
            node.classList.remove('icon-down-triangle');
            node.classList.add('icon-right-triangle');
        }
        if (node.classList.contains('SubTree')) {
            node.style.display = 'none';
        }
    }
};

Tree.prototype._toggleNode = function (event) {
    var li = event.target.parentNode;
    var data = li.data;

    if (data.leaf) {
        return;
    } else if (data.expand) {
        this.collapse(data.id);
    } else {
        this.expand(data.id);
    }
};

UI.addXType('tree', Tree);

export default Tree;