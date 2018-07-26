var ID = -1;

/**
 * 所有控件基类
 * @param {*} options 选项
 */
function Control(options) {
    options = options || {};
    this.parent = options.parent || document.body;
    this.id = options.id || 'Control' + ID--;
}

/**
 * 渲染控件
 */
Control.prototype.render = function () {

};

/**
 * 清除该控件所有内容
 */
Control.prototype.clear = function () {
    // 移除所有子项引用
    (function remove(items) {
        if (items == null || items.length === 0) {
            return;
        }

        items.forEach((n) => {
            if (n.id) {
                UI.remove(n.id, n.scope == null ? 'global' : n.scope);
            }
            remove(n.children);
        });
    })(this.children);

    // 清空dom
    if (this.dom) {
        this.parent.removeChild(this.dom);
        this.dom = null;
    }

    // TODO: 未清除绑定在dom上的事件
};

export default Control;