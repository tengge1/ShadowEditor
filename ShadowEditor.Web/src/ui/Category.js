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

    this.onChange = options.onChange || null;
}

Category.prototype = Object.create(Control.prototype);
Category.prototype.constructor = Category;

Category.prototype.render = function () {
    if (this.dom === undefined) {
        this.dom = document.createElement('div');
        this.parent.appendChild(this.dom);
    }

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
        checkbox.addEventListener('change', this._onChange.bind(this));
        item.appendChild(checkbox);

        var label = document.createElement('label');
        label.innerHTML = this.options[n];
        item.appendChild(label);
    });
};

Category.prototype._onChange = function (event) {
    var checked = this.getValue();
    this.onChange && this.onChange(checked);
};

Category.prototype.getValue = function () {
    var checked = [];

    for (var i = 0; i < this.dom.children.length; i++) {
        var checkbox = this.dom.children[i].children[0];
        if (checkbox.checked) {
            checked.push(checkbox.value);
        }
    }

    return checked;
};

Category.prototype.clear = function () {
    while (this.dom.children.length) {
        var child = this.dom.children[0];
        child.children[0].removeEventListener('change', this._onChange);
        this.dom.removeChild(child);
    }
};

export default Category;