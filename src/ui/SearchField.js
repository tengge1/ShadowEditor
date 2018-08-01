import Control from './Control';

/**
 * 搜索框
 * @param {*} options 搜索框
 */
function SearchField(options) {
    Control.call(this, options);
    options = options || {};

    this.cls = options.cls || 'SearchField';
    this.style = options.style || {};

    this.onClick = options.onClick || null;
}

SearchField.prototype = Object.create(Control.prototype);
SearchField.prototype.constructor = SearchField;

SearchField.prototype.render = function () {
    this.children = [{
        xtype: 'div',
        parent: this.parent,
        cls: this.cls,
        style: this.style,
        children: [{
            xtype: 'input',
            id: `${this.id}-input`
        }, {
            xtype: 'iconbutton',
            icon: 'icon-search',
            onClick: this.onClick.bind(this)
        }]
    }];

    var control = UI.create(this.children[0]);
    control.render();

    this.dom = control.dom;
};

SearchField.prototype.getValue = function () {
    return UI.get(`${this.id}-input`).dom.value;
};

SearchField.prototype.setValue = function (value) {
    UI.get(`${this.id}-input`).dom.value = value;
};

SearchField.prototype.reset = function () {
    this.setValue('');
};

export default SearchField;