import UI from '../../ui/UI';
import Ajax from '../../utils/Ajax';
import UploadUtils from '../../utils/UploadUtils';

/**
 * 纹理窗口
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function TextureWindow(options) {
    UI.Control.call(this, options);
    this.app = options.app;
    this.data = [];
    this.keyword = '';
}

TextureWindow.prototype = Object.create(UI.Control.prototype);
TextureWindow.prototype.constructor = TextureWindow;

TextureWindow.prototype.render = function () {
    var _this = this;

    var container = UI.create({
        xtype: 'window',
        id: 'textureWindow',
        parent: this.app.container,
        title: '纹理列表',
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
                xtype: 'button',
                text: '上传纹理',
                onClick: this.onAddFile.bind(this)
            }, {
                xtype: 'button',
                text: '编辑分组'
            }, {
                xtype: 'toolbarfiller'
            }, {
                xtype: 'searchfield',
                showSearchButton: false,
                showResetButton: true,
                onInput: function () {
                    _this.onSearch(this.getValue());
                }
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'imagelist',
                id: 'textureWindowImages',
                style: {
                    width: '100%',
                    height: '100%',
                },
                onClick: function (event, index, btn) {
                    _this.onClickImage(this, index, btn);
                }
            }]
        }]
    });
    container.render();
};

/**
 * 显示模型文件列表
 */
TextureWindow.prototype.show = function () {
    UI.get('textureWindow').show();

    this.keyword = '';
    this.updateList();
};

TextureWindow.prototype.updateList = function () {
    var app = this.app;
    var server = app.options.server;

    Ajax.getJson(`${server}/api/Texture/List`, (obj) => {
        this.data = obj.Data;
        this.onSearch(this.keyword);
    });
};

/**
 * 搜索模型文件
 * @param {*} name 
 */
TextureWindow.prototype.onSearch = function (name) {
    if (name.trim() === '') {
        this.renderImages(this.data);
        return;
    }

    name = name.toLowerCase();

    var textures = this.data.filter((n) => {
        return n.Name.indexOf(name) > -1 ||
            n.FirstPinYin.indexOf(name) > -1 ||
            n.TotalPinYin.indexOf(name) > -1;
    });
    this.renderImages(textures);
};

TextureWindow.prototype.renderImages = function (textures) {
    var images = UI.get('textureWindowImages');
    images.clear();

    images.children = textures.map((n) => {
        return {
            xtype: 'image',
            src: n.Image == null ? null : (server + n.Image),
            title: n.Name,
            data: n,
            icon: 'icon-texture',
            cornerText: n.Type,
            style: {
                backgroundColor: '#eee'
            }
        };
    });;

    images.render();
};

TextureWindow.prototype.onAddFile = function () {
    var input = document.getElementById('textureWindowFileInput');
    if (input == null) {
        input = document.createElement('input');
        input.id = 'textureWindowFileInput';
        input.type = 'file';
        document.body.appendChild(input);
        input.onchange = this.onUploadFile.bind(this);
    }
    input.click();
};

TextureWindow.prototype.onUploadFile = function (event) {
    UploadUtils.upload('textureWindowFileInput', `${this.app.options.server}/api/Texture/Add`, (e) => {
        document.getElementById('textureWindowFileInput').value = null;
        if (e.target.status === 200) {
            var obj = JSON.parse(e.target.responseText);
            if (obj.Code === 200) {
                this.updateList();
            }
            UI.msg(obj.Msg);
        } else {
            UI.msg('服务器错误！');
        }
    });
};

TextureWindow.prototype.onClickImage = function (imgs, index, btn) {
    var model = imgs.children[index].data;

    if (btn === 'edit') { // 编辑模型
        UI.msg('开始编辑');
        return;
    }

    if (btn === 'delete') { // 删除模型
        this.onDelete(model);
        return;
    }

    this.onLoadTexture(model);
};

/**
 * 添加模型到场景
 * @param {*} texture 
 */
TextureWindow.prototype.onLoadTexture = function (texture) {

};

/**
 * 删除纹理
 * @param {*} texture 
 */
TextureWindow.prototype.onDelete = function (texture) {
    var app = this.app;
    var server = app.options.server;

    UI.confirm('询问', '是否删除该纹理？', (event, btn) => {
        if (btn === 'ok') {
            Ajax.post(`${server}/api/Texture/Delete?ID=${texture.ID}`, (json) => {
                var obj = JSON.parse(json);
                if (obj.Code === 200) {
                    this.updateList();
                }
                UI.msg(obj.Msg);
            });
        }
    });
};

export default TextureWindow;