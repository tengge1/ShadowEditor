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
    // 移除引用
    (function remove(control) {
        if (control.id) {
            UI.remove(control.id, control.scope == null ? 'global' : control.scope);
        }
        if (control.children) {
            control.children.forEach((n) => {
                remove(n);
            });
        }
    })(this);

    // 清空dom
    if (this.dom) {
        this.parent.removeChild(this.dom);
        this.dom = null;
    }

    // TODO: 未清除绑定在dom上的事件
};

export default Control;