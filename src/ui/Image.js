import Control from './Control';

/**
 * 图片
 * @param {*} options 选项
 */
function Image(options) {
    Control.call(this, options);
    options = options || {};

    this.src = options.src || '';
    this.title = options.title || null;
    this.alt = options.alt || null;
    this.cls = options.cls || 'Item';
    this.style = options.style || null;

    this.onClick = options.onClick || null;
}

Image.prototype = Object.create(Control.prototype);
Image.prototype.constructor = Image;

Image.prototype.render = function () {
    this.dom = document.createElement('div');

    if (this.cls) {
        this.dom.className = this.cls;
    }

    if (this.style) {
        Object.assign(this.dom.style, this.style);
    }

    // 图片
    this.img = document.createElement('img');

    this.img.src = this.src;

    if (this.title) {
        this.img.title = this.title;
    }

    if (this.alt) {
        this.img.alt = this.alt;
    }

    this.dom.appendChild(this.img);

    // 事件
    var _this = this;

    function onClick(event, type) {
        event.stopPropagation();
        event.preventDefault();
        if (_this.onClick) {
            _this.onClick.call(_this, event, type);
        }
    };

    this.dom.addEventListener('click', (event) => onClick(event, 'default'));

    // 操作按钮
    this.editBtn = UI.create({
        xtype: 'iconbutton',
        icon: 'icon-edit',
        cls: 'Button IconButton EditButton',
        title: '编辑',
        onClick: (event) => onClick(event, 'edit')
    });
    this.editBtn.render();

    this.dom.appendChild(this.editBtn.dom);

    this.deleteBtn = UI.create({
        xtype: 'iconbutton',
        icon: 'icon-delete',
        cls: 'Button IconButton DeleteButton',
        title: '删除',
        onClick: (event) => onClick(event, 'delete')
    });
    this.deleteBtn.render();

    this.dom.appendChild(this.deleteBtn.dom);

    this.parent.appendChild(this.dom);
};

export default Image;