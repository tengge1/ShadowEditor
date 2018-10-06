import Control from './Control';

/**
 * 图片列表窗口
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function ImageListWindow(options) {
    Control.call(this, options);

    this.title = options.title || '图片列表';
    this.imageIcon = options.imageIcon || null; // 图片列表默认图标
    this.nameField = options.nameField || 'Name'; // 名称字段，用于显示图片标题，按文字搜索
    this.firstPinYinField = options.firstPinYinField || 'FirstPinYin'; // 拼音首字母字段，用于搜索
    this.totalPinYinField = options.totalPinYinField || 'TotalPinYin'; // 全拼字段，用于搜索
    this.cornerTextField = options.cornerTextField || null; // 显示在左上角文字字段
    this.imageField = options.imageField || 'Thumbnail'; // 图片字段，用于显示缩略图
    this.preImageUrl = options.preImageUrl || '/'; // 缩略图url前缀，一般是服务端url

    this.beforeUpdateList = options.beforeUpdateList || null; // 图片列表刷新前调用，返回Promise，resolve(data)。
    this.onClick = options.onClick || null; // 点击图片列表
    this.onEdit = options.onEdit || null; // 编辑图片列表
    this.onDelete = options.onDelete || null; // 删除图片列表

    this.data = [];
    this.keyword = '';
}

ImageListWindow.prototype = Object.create(Control.prototype);
ImageListWindow.prototype.constructor = ImageListWindow;

ImageListWindow.prototype.render = function () {
    var container = UI.create({
        xtype: 'window',
        id: 'window',
        scope: this.id,
        parent: this.parent,
        title: this.title,
        width: '700px',
        height: '500px',
        bodyStyle: {
            paddingTop: 0
        },
        shade: false,
        children: [{
            xtype: 'row',
            style: {
                position: 'sticky',
                top: '0',
                padding: '2px',
                backgroundColor: '#eee',
                borderBottom: '1px solid #ddd',
                zIndex: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start'
            },
            children: [{
                xtype: 'searchfield',
                id: 'search',
                scope: this.id,
                showSearchButton: false,
                showResetButton: true,
                onInput: this.onInputSearchField.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'imagelist',
                id: 'windowImages',
                scope: this.id,
                style: {
                    width: '100%',
                    height: '100%',
                },
                onClick: this.onClickImage.bind(this)
            }]
        }]
    });
    container.render();
};

ImageListWindow.prototype.show = function () {
    UI.get('window', this.id).show();
    this.update();
};

ImageListWindow.prototype.hide = function () {
    UI.get('window', this.id).hide();
};

ImageListWindow.prototype.update = function () {
    this.keyword = '';

    if (typeof (this.beforeUpdateList) === 'function') {
        this.beforeUpdateList().then((data) => {
            this.data = data;
            this.onSearch(this.keyword);
        });
    }
};

ImageListWindow.prototype.onSearch = function (name) {
    if (name.trim() === '') {
        this.renderImages(this.data);
        return;
    }

    name = name.toLowerCase();

    var models = this.data.filter((n) => {
        return n[this.nameField].indexOf(name) > -1 ||
            n[this.firstPinYinField].indexOf(name) > -1 ||
            n[this.totalPinYinField].indexOf(name) > -1;
    });
    this.renderImages(models);
};

ImageListWindow.prototype.onInputSearchField = function () {
    var search = UI.get('search', this.id);
    this.onSearch(search.getValue());
};

ImageListWindow.prototype.renderImages = function (models) {
    var images = UI.get('windowImages', this.id);
    images.clear();

    images.children = models.map(n => {
        return {
            xtype: 'image',
            src: n[this.imageField] == null ? null : (this.preImageUrl + n[this.imageField]),
            title: n[this.nameField],
            data: n,
            icon: this.imageIcon,
            cornerText: this.cornerTextField === null ? null : n[this.cornerTextField],
            style: {
                backgroundColor: '#eee'
            }
        };
    });;

    images.render();
};

ImageListWindow.prototype.onClickImage = function (event, index, btn, control) {
    var data = control.children[index].data;

    if (btn === 'edit') {
        if (typeof (this.onEdit) === 'function') {
            this.onEdit(data);
        }
    } else if (btn === 'delete') {
        if (typeof (this.onDelete) === 'function') {
            this.onDelete(data);
        }
    } else {
        if (typeof (this.onClick) === 'function') {
            this.onClick(data);
        }
    }
};

export default ImageListWindow;