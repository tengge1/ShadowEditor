import Container from './Container';
import Image from './Image';

/**
 * 图片列表
 * @param {*} options 选项
 */
function ImageList(options = {}) {
    Container.call(this, options);

    this.width = options.width || '800px';
    this.height = options.height || '500px';
    this.columnWidth = options.columnWidth || 0.25;

    this.cls = options.cls || 'ImageList';
    this.style = options.style || null;

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
        this.dom.style = this.style;
    }

    this.dom.style.width = this.width;
    this.dom.style.height = this.height;

    this.dom.style.flex = this.flex;

    this.parent.appendChild(this.dom);

    function onClick(event) {
        var index = event.target.dataIndex;
        if (this.onClick) {
            this.onClick(event, index);
        }
    };

    this.children.forEach((n, i) => {
        var obj = UI.create(n);
        if (!(obj instanceof Image)) {
            console.warn(`ImageList: obj is not an instance of Image.`);
        }

        // 容器
        var container = document.createElement('div');
        container.className = 'Container';
        container.style.width = this.columnWidth * 100 + '%';
        this.dom.appendChild(container);

        obj.parent = container;
        obj.onClick = onClick.bind(this);
        obj.render();
        obj.dom.dataIndex = i; // 序号
    });
};

export default ImageList;