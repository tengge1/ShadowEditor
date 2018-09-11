import UI from '../../ui/UI';
import Ajax from '../../utils/Ajax';
import AddObjectCommand from '../../command/AddObjectCommand';
import UploadUtils from '../../utils/UploadUtils';

var ID = -1;

/**
 * 音频窗口
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function AudioWindow(options) {
    UI.Control.call(this, options);
    this.app = options.app;
    this.audios = [];
    this.keyword = '';
}

AudioWindow.prototype = Object.create(UI.Control.prototype);
AudioWindow.prototype.constructor = AudioWindow;

AudioWindow.prototype.render = function () {
    var _this = this;

    var container = UI.create({
        xtype: 'window',
        id: 'audioWindow',
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
                id: 'audioWindowImages',
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
 * 显示音频文件列表
 */
AudioWindow.prototype.show = function () {
    UI.get('audioWindow').show();

    this.keyword = '';
    this.updateList();
};

AudioWindow.prototype.updateList = function () {
    var app = this.app;
    var server = app.options.server;

    Ajax.getJson(`${server}/api/Audio/List`, (obj) => {
        this.audios = obj.Data;
        this.onSearch(this.keyword);
    });
};

/**
 * 搜索音频文件
 * @param {*} name 
 */
AudioWindow.prototype.onSearch = function (name) {
    if (name.trim() === '') {
        this.renderImages(this.audios);
        return;
    }

    name = name.toLowerCase();

    var models = this.audios.filter((n) => {
        return n.Name.indexOf(name) > -1 ||
            n.FirstPinYin.indexOf(name) > -1 ||
            n.TotalPinYin.indexOf(name) > -1;
    });
    this.renderImages(models);
};

AudioWindow.prototype.renderImages = function (models) {
    var images = UI.get('audioWindowImages');
    images.clear();

    images.children = models.map((n) => {
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

AudioWindow.prototype.onAddFile = function () {
    var input = document.getElementById('audioWindowFileInput');
    if (input == null) {
        input = document.createElement('input');
        input.id = 'audioWindowFileInput';
        input.type = 'file';
        document.body.appendChild(input);
        input.onchange = this.onUploadFile.bind(this);
    }
    input.click();
};

AudioWindow.prototype.onUploadFile = function (event) {
    UploadUtils.upload('audioWindowFileInput', `${this.app.options.server}/api/Audio/Add`, (e) => {
        document.getElementById('audioWindowFileInput').value = null;
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

AudioWindow.prototype.onClickImage = function (imgs, index, btn) {
    var model = imgs.children[index].data;

    if (btn === 'edit') { // 编辑模型
        UI.msg('开始编辑音频');
        return;
    }

    if (btn === 'delete') { // 删除模型
        this.onDelete(model);
        return;
    }

    this.onLoad(model);
};

/**
 * 添加模型到场景
 * @param {*} model 
 */
AudioWindow.prototype.onLoad = function (model) {
    var listener = this.app.editor.audioListener;

    var sound = new THREE.Audio(listener);

    var loader = new THREE.AudioLoader();

    loader.load(this.app.options.server + model.Url, buffer => {
        sound.setBuffer(buffer);
        sound.setLoop(true);
        sound.setVolume(1.0);
        sound.play();
    });
};

/**
 * 删除音频
 * @param {*} model 
 */
AudioWindow.prototype.onDelete = function (model) {
    var app = this.app;
    var server = app.options.server;

    UI.confirm('询问', '是否删除该模型？', (event, btn) => {
        if (btn === 'ok') {
            Ajax.post(`${server}/api/Audio/Delete?ID=${model.ID}`, (json) => {
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