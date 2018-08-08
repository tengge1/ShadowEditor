import UI from '../../ui/UI';
import Ajax from '../../utils/Ajax';
import AddObjectCommand from '../../command/AddObjectCommand';
import UploadUtils from '../../utils/UploadUtils';
import Converter from '../../serialization/Converter';

/**
 * 场景窗口
 * @param {*} options 
 */
function SceneWindow(options) {
    UI.Control.call(this, options);
    this.app = options.app;
    this.models = [];
    this.keyword = '';
}

SceneWindow.prototype = Object.create(UI.Control.prototype);
SceneWindow.prototype.constructor = SceneWindow;

SceneWindow.prototype.render = function () {
    var _this = this;

    var container = UI.create({
        xtype: 'window',
        id: 'sceneWindow',
        parent: this.app.container,
        title: '场景列表',
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
                showSearchButton: false,
                showResetButton: true,
                onInput: function () {
                    _this.keyword = this.getValue();
                    _this.onSearch(this.getValue());
                }
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'imagelist',
                id: 'sceneWindowImages',
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
SceneWindow.prototype.show = function () {
    UI.get('sceneWindow').show();

    this.keyword = '';
    this.updateSceneList();
};

SceneWindow.prototype.updateSceneList = function () {
    var app = this.app;
    var server = app.options.server;

    Ajax.getJson(`${server}/api/Scene/List`, (obj) => {
        this.models = obj.Data;
        this.onSearch(this.keyword);
    });
};

/**
 * 搜索模型文件
 * @param {*} name 
 */
SceneWindow.prototype.onSearch = function (name) {
    if (name.trim() === '') {
        this.renderImages(this.models);
        return;
    }

    name = name.toLowerCase();

    var models = this.models.filter((n) => {
        return n.Name.indexOf(name) > -1 ||
            n.FirstPinYin.indexOf(name) > -1 ||
            n.TotalPinYin.indexOf(name) > -1;
    });
    this.renderImages(models);
};

SceneWindow.prototype.renderImages = function (models) {
    var images = UI.get('sceneWindowImages');
    images.clear();

    images.children = models.map((n) => {
        return {
            xtype: 'image',
            src: n.Image == null ? null : (server + n.Image),
            title: n.Name,
            data: n,
            icon: 'icon-scenes',
            style: {
                backgroundColor: '#eee'
            }
        };
    });;

    images.render();
};

SceneWindow.prototype.onClickImage = function (imgs, index, btn) {
    var data = imgs.children[index].data;

    if (btn === 'edit') {
        this.editScene(data);
    } else if (btn === 'delete') {
        this.deleteScene(data);
    } else {
        this.loadScene(data);
    }
};

/**
 * 编辑场景
 * @param {*} data 
 */
SceneWindow.prototype.editScene = function (data) {
    UI.msg('开发中...');
};

/**
 * 删除场景
 * @param {*} data 
 */
SceneWindow.prototype.deleteScene = function (data) {
    var app = this.app;
    var server = app.options.server;

    UI.confirm('询问', `是否删除场景${data.Name}？`, (event, btn) => {
        if (btn === 'ok') {
            Ajax.post(`${server}/api/Scene/Delete?ID=${data.ID}`, (json) => {
                var obj = JSON.parse(json);
                if (obj.Code === 200) {
                    this.updateSceneList();
                }
                UI.msg(obj.Msg);
            });
        }
    });
};

/**
 * 加载场景
 * @param {*} data 
 */
SceneWindow.prototype.loadScene = function (data) {
    var app = this.app;
    var editor = app.editor;
    var server = app.options.server;
    document.title = data.Name;

    Ajax.get(`${server}/api/Scene/Load?ID=${data.ID}`, (json) => {
        var obj = JSON.parse(json);
        if (obj.Code === 200) {
            UI.get('sceneWindow').hide();
        }

        editor.clear();
        (new Converter()).fromJson(this.app, obj.Data);

        editor.sceneID = data.ID;
        editor.sceneName = data.Name;
        document.title = data.Name;

        UI.msg('载入成功！');
    });
};

export default SceneWindow;