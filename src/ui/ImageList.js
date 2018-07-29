import Container from './Container';
import Image from './Image';

/**
 * 图片列表
 * @param {*} options 选项
 */
function ImageList(options = {}) {
    Container.call(this, options);

    this.cls = options.cls || 'ImageList';
    this.style = options.style || {
        width: '800px',
        height: '500px'
    };

    this.onClick = options.onClick || null;
}

ImageList.prototype = Object.create(Container.prototype);
ImageList.prototype.constructor = ImageList;

ImageList.prototype.render = function () {
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
        var index = event.target.dataIndex;
        if (this.onClick) {
            this.onClick(event, index, type);
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

        // 说明
        var description = document.createElement('div');
        description.className = 'title';
        description.innerHTML = title;
        container.appendChild(description);
    });
};

export default ImageList;