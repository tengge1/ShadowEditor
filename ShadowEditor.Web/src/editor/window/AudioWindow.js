import UI from '../../ui/UI';
import Ajax from '../../utils/Ajax';
import AddObjectCommand from '../../command/AddObjectCommand';
import UploadUtils from '../../utils/UploadUtils';

/**
 * 音频窗口
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function AudioWindow(options) {
    UI.Control.call(this, options);
    this.app = options.app;
    this.onSelect = options.onSelect;

    this.list = [];
    this.keyword = '';
}

AudioWindow.prototype = Object.create(UI.Control.prototype);
AudioWindow.prototype.constructor = AudioWindow;

AudioWindow.prototype.render = function () {
    var container = UI.create({
        xtype: 'window',
        id: 'window',
        scope: this.id,
        parent: this.app.container,
        title: '音频列表',
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
                text: '上传音频',
                onClick: this.onAddFile.bind(this)
            }, {
                xtype: 'button',
                text: '编辑分组'
            }, {
                xtype: 'toolbarfiller'
            }, {
                xtype: 'searchfield',
                id: 'searchName',
                scope: this.id,
                showSearchButton: false,
                showResetButton: true,
                onInput: this.onClickSearchButton.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'imagelist',
                id: 'images',
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

/**
 * 显示窗口
 */
AudioWindow.prototype.show = function () {
    UI.get('window', this.id).show();

    this.keyword = '';
    this.updateList();
};

/**
 * 隐藏窗口
 */
AudioWindow.prototype.hide = function () {
    UI.get('window', this.id).hide();
};

AudioWindow.prototype.updateList = function () {
    var app = this.app;
    var server = app.options.server;

    Ajax.getJson(`${server}/api/Audio/List`, obj => {
        this.list = obj.Data;
        this.onSearch(this.keyword);
    });
};

/**
 * 搜索文件
 * @param {*} name 
 */
AudioWindow.prototype.onSearch = function (name) {
    if (name.trim() === '') {
        this.renderList(this.list);
        return;
    }

    name = name.toLowerCase();

    var list = this.list.filter(n => {
        return n.Name.indexOf(name) > -1 ||
            n.FirstPinYin.indexOf(name) > -1 ||
            n.TotalPinYin.indexOf(name) > -1;
    });
    this.renderList(list);
};

AudioWindow.prototype.renderList = function (list) {
    var images = UI.get('images', this.id);
    images.clear();

    images.children = list.map(n => {
        return {
            xtype: 'image',
            title: n.Name,
            data: n,
            icon: 'icon-audio',
            cornerText: n.Type,
            style: {
                backgroundColor: '#eee'
            }
        };
    });;

    images.render();
};

/**
 * 点击上传按钮
 */
AudioWindow.prototype.onAddFile = function () {
    var input = document.getElementById(`${this.id}-fileInput`);
    if (input == null) {
        input = document.createElement('input');
        input.id = `${this.id}-fileInput`;
        input.type = 'file';
        document.body.appendChild(input);
        input.onchange = this.onUploadFile.bind(this);
    }
    input.click();
};

AudioWindow.prototype.onUploadFile = function (event) {
    UploadUtils.upload(`${this.id}-fileInput`, `${this.app.options.server}/api/Audio/Add`, e => {
        document.getElementById(`${this.id}-fileInput`).value = null;
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

/**
 * 点击搜索按钮
 */
AudioWindow.prototype.onClickSearchButton = function () {
    var name = UI.get('searchName', this.id);
    this.onSearch(name.getValue());
};

/**
 * 点击图片列表
 * @param {*} event 
 * @param {*} index 
 * @param {*} btn 
 * @param {*} imgs 
 */
AudioWindow.prototype.onClickImage = function (event, index, btn, imgs) {
    event.preventDefault();
    event.stopPropagation();

    var data = imgs.children[index].data;

    if (btn === 'edit') {
        UI.msg('开始编辑');
    } else if (btn === 'delete') {
        this.onDelete(data);
    } else if (typeof (this.onSelect) === 'function') {
        this.onSelect(data);
    } else {
        UI.msg('请在属性窗口添加音频！');
    }
};

/**
 * 删除
 * @param {*} model 
 */
AudioWindow.prototype.onDelete = function (model) {
    var app = this.app;
    var server = app.options.server;

    UI.confirm('询问', '是否删除？', (event, btn) => {
        if (btn === 'ok') {
            Ajax.post(`${server}/api/Audio/Delete?ID=${model.ID}`, json => {
                var obj = JSON.parse(json);
                if (obj.Code === 200) {
                    this.updateList();
                }
                UI.msg(obj.Msg);
            });
        }
    });
};

export default AudioWindow;