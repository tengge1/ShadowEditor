import Control from './Control';
import Image from './Image';
import UI from './Manager';

/**
 * 菜单
 * @author tengge / https://github.com/tengge1
 * @param {*} options 选项
 */
function Menu(options = {}) {
    Control.call(this, options);

    this.cls = options.cls || 'Menu';
    this.style = options.style || {
        width: '800px',
        height: '500px'
    };

    this.onClick = options.onClick || null;
}

Menu.prototype = Object.create(Control.prototype);
Menu.prototype.constructor = Menu;

Menu.prototype.render = function () {
    this.dom = document.createElement('div');

    if (this.cls) {
        this.dom.className = this.cls;
    }

    if (this.style) {
        Object.assign(this.dom.style, this.style);
    }

    this.dom.style.width = this.width;
    this.dom.style.height = this.height;

    this.dom.style.flex = this.flex;

    this.parent.appendChild(this.dom);

    function onClick(event, type) {
        var index;
        if (type === 'edit' || type === 'delete') {
            index = event.target.parentNode.dataIndex;
        } else {
            index = event.target.dataIndex;
        }

        if (this.onClick) {
            this.onClick(event, index, type, this);
        }
    };

    this.children.forEach((n, i) => {
        // 容器
        var container = document.createElement('div');
        container.className = 'Container';
        this.dom.appendChild(container);

        // 图片
        var title = n.title;
        n.title = null;
        var obj = UI.create(n);
        if (!(obj instanceof Image)) {
            console.warn(`ImageList: obj is not an instance of Image.`);
        }

        obj.parent = container;
        obj.onClick = onClick.bind(this);
        obj.render();
        obj.dom.dataIndex = i; // 序号
        obj.editBtn.dom.dataIndex = i;
        obj.deleteBtn.dom.dataIndex = i;

        // 说明
        var description = document.createElement('div');
        description.className = 'title';
        description.innerHTML = title;
        container.appendChild(description);
    });
};

UI.addXType('menu', Menu);

export default Menu;