import Control from './Control';
import UI from './Manager';

/**
 * 树状控件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Tree(options = {}) {
    Control.call(this, options);

    this.data = options.data || []; // [{ value: '值', text: '文本', expand: 'true/false, 默认关闭', 其他属性 }, ...]

    this.onClick = options.onClick || null;
    this.onDblClick = options.onDblClick || null;

    this._selected = null;
    this._nodes = {}; // value: li
};

Tree.prototype = Object.create(Control.prototype);
Tree.prototype.constructor = Tree;

Tree.prototype.render = function () {
    if (this.dom === undefined) {
        this.dom = document.createElement('ul');
        this.parent.appendChild(this.dom);

        Object.assign(this.dom, {
            className: 'Tree'
        });
    }

    this._clearNode(this.dom);

    this.data.forEach(n => {
        this._createNode(n, this.dom);
    });
};

Tree.prototype._createNode = function (data, dom) {
    var li = document.createElement('li');
    dom.appendChild(li);

    if (data.value === undefined) {
        console.warn(`Tree: data.value is not defined. Something unwanted may happen.`);
    }

    var value = data.value || '';
    var leaf = !Array.isArray(data.children) || data.children.length === 0;
    var expand = data.expand || false;

    data.leaf = leaf;
    data.expand = expand;

    Object.assign(li, {
        className: 'Node',
        data: data
    });

    // 刷新前已经选中的节点仍然选中
    if (this._selected && value === this._selected.value) {
        li.classList.add('selected');
    }

    li.addEventListener('click', this._onClick.bind(this));
    li.addEventListener('dblclick', this._onDblClick.bind(this));

    this._nodes[value] = li;

    var icon = document.createElement('i');

    if (!leaf && expand) { // 非叶子节点展开
        icon.className = 'iconfont icon-down-triangle';
    } else if (!leaf && !expand) { // 非叶子节点关闭
        icon.className = 'iconfont icon-right-triangle';
    } else { // 叶子节点
        icon.className = 'iconfont icon-rect';
        icon.style.visibility = 'hidden';
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

Tree.prototype._clearNode = function (dom) {
    if (dom.classList.contains('Tree')) { // 树
        while (dom.children.length) {
            this._clearNode(dom.children[0]);
            dom.removeChild(dom.children[0]);
        }
    } else if (dom.classList.contains('SubTree')) { // 子树
        while (dom.children.length) {
            this._clearNode(dom.children[0]);
            dom.removeChild(dom.children[0]);
        }
    } else if (dom.classList.contains('Node')) { // 节点
        delete this._nodes[dom.data.value];
        dom.removeEventListener('click', this._onClick);
        dom.removeEventListener('dblclick', this._onDblClick);
        var icon = dom.children[0];
        icon.removeEventListener('click', this._toggleNode);
    } else {
        console.warn(`Tree: Unknown node type.`);
    }
};

Tree.prototype.getValue = function () {
    return this.data;
};

Tree.prototype.setValue = function (value) {
    this.data = value;
    this.render();
};

/**
 * 根据value获取节点数据
 * @param {*} value 
 */
Tree.prototype.getNode = function (value) {
    var li = this._nodes[value];
    if (!li) {
        return null;
    }

    return li;
};

/**
 * 展开节点
 * @param {*} value 
 */
Tree.prototype.expand = function (value) {
    var li = this.getNode(value);
    if (!li) {
        return;
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

/**
 * 折叠节点
 * @param {*} value 
 */
Tree.prototype.collapse = function (value) {
    var li = this.getNode(value);
    if (!li) {
        return;
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

Tree.prototype.getSelected = function () {
    return this._selected;
};

/**
 * 根据value选中节点
 * @param {*} value 
 */
Tree.prototype.select = function (value) {
    var li = this.getNode(value);
    if (!li) {
        return;
    }

    // 移除选中
    if (this._selected) {
        this.unselect(this._selected.value);
    }

    this._selected = li.data;
    li.classList.add('selected');
};

/**
 * 根据过滤器查找节点
 * @param {*} filter 
 */
Tree.prototype.find = function (filter) {
    return Object.values(this._nodes).map(n => n.data).filter(filter);
};

/**
 * 取消选中节点
 * @param {*} value 
 */
Tree.prototype.unselect = function (value) {
    var li = this.getNode(value);
    if (!li) {
        return;
    }

    this._selected = null;
    li.classList.remove('selected');
};

Tree.prototype._onClick = function (event) {
    var data = event.target.data;
    event.stopPropagation();

    this.select(data.value);

    if (typeof (this.onClick) === 'function') {
        this.onClick(data, event);
    }
};

Tree.prototype._onDblClick = function (event) {
    var data = event.target.data;
    event.stopPropagation();

    if (typeof (this.onDblClick) === 'function') {
        this.onDblClick(data, event);
    }
};

Tree.prototype._toggleNode = function (event) {
    var li = event.target.parentNode;
    var data = li.data;

    event.stopPropagation();

    if (data.leaf) {
        return;
    } else if (data.expand) {
        this.collapse(data.value);
    } else {
        this.expand(data.value);
    }
};

UI.addXType('tree', Tree);

export default Tree;