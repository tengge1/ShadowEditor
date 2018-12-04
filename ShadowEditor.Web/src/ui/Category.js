import Control from './Control';

/**
 * 类别组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 选项
 */
function Category(options = {}) {
    Control.call(this, options);

    this.options = options.options || {}; // { [value1]: label1, [value2]: label2, ... }

    this.cls = options.cls || 'Category';
    this.style = options.style || null;
}

Category.prototype = Object.create(Control.prototype);
Category.prototype.constructor = Category;

Category.prototype.render = function () {
    this.dom = document.createElement('div');
    this.parent.appendChild(this.dom);

    if (this.cls) {
        this.dom.className = this.cls;
    }

    if (this.style) {
        Object.assign(this.dom.style, this.style);
    }

    Object.keys(this.options).forEach(n => {
        var item = document.createElement('div');
        item.className = 'item';
        this.dom.appendChild(item);

        var checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('value', n);
        item.appendChild(checkbox);

        var label = document.createElement('label');
        label.innerHTML = this.options[n];
        item.appendChild(label);
    });
};

export default Category;