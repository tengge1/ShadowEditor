import Control from './Control';

/**
 * 图片
 * @author tengge / https://github.com/tengge1
 * @param {*} options 选项
 */
function Image(options) {
    Control.call(this, options);
    options = options || {};

    // 背景图片
    this.src = options.src || null;
    this.title = options.title || null;
    this.alt = options.alt || null;
    this.cls = options.cls || 'Item';
    this.style = options.style || null;

    // 字体图标
    this.icon = options.icon || null;

    // 左上角文本
    this.cornerText = options.cornerText || null;

    this.onClick = options.onClick || null;
}

Image.prototype = Object.create(Control.prototype);
Image.prototype.constructor = Image;

Image.prototype.render = function () {
    this.dom = document.createElement('div');
    this.parent.appendChild(this.dom);

    if (this.cls) {
        this.dom.className = this.cls;
    }

    if (this.style) {
        Object.assign(this.dom.style, this.style);
    }

    // 背景图片
    if (this.src) {
        this.img = document.createElement('img');

        this.img.src = this.src;

        if (this.title) {
            this.img.title = this.title;
        }

        if (this.alt) {
            this.img.alt = this.alt;
        }

        this.dom.appendChild(this.img);
    }

    // 字体图标
    if (this.icon) {
        this.i = document.createElement('i');
        this.i.className = `iconfont ${this.icon}`;
        this.dom.appendChild(this.i);
    }

    // 左上角文本
    if (this.cornerText) {
        this.corner = document.createElement('span');
        this.corner.className = 'cornerText';
        this.corner.innerHTML = this.cornerText;
        this.dom.appendChild(this.corner);
    }

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
};

export default Image;