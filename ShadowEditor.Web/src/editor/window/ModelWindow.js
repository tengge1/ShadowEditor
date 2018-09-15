import UI from '../../ui/UI';
import Ajax from '../../utils/Ajax';
import ModelLoader from '../../loader/ModelLoader';
import AddObjectCommand from '../../command/AddObjectCommand';
import UploadUtils from '../../utils/UploadUtils';

/**
 * 模型窗口
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function ModelWindow(options) {
    UI.Control.call(this, options);
    this.app = options.app;
    this.models = [];
    this.keyword = '';
}

ModelWindow.prototype = Object.create(UI.Control.prototype);
ModelWindow.prototype.constructor = ModelWindow;

ModelWindow.prototype.render = function () {
    var _this = this;

    var container = UI.create({
        xtype: 'window',
        id: 'modelWindow',
        parent: this.app.container,
        title: '模型列表',
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
                text: '上传模型',
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
                id: 'modelWindowImages',
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
ModelWindow.prototype.show = function () {
    UI.get('modelWindow').show();

    this.keyword = '';
    this.updateModelList();
};

ModelWindow.prototype.updateModelList = function () {
    var app = this.app;
    var server = app.options.server;

    Ajax.getJson(`${server}/api/Mesh/List`, (obj) => {
        this.models = obj.Data;
        this.onSearch(this.keyword);
    });
};

/**
 * 搜索模型文件
 * @param {*} name 
 */
ModelWindow.prototype.onSearch = function (name) {
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

ModelWindow.prototype.renderImages = function (models) {
    var images = UI.get('modelWindowImages');
    images.clear();

    images.children = models.map((n) => {
        return {
            xtype: 'image',
            src: n.Image == null ? null : (server + n.Image),
            title: n.Name,
            data: n,
            icon: 'icon-model',
            cornerText: n.Type,
            style: {
                backgroundColor: '#eee'
            }
        };
    });;

    images.render();
};

ModelWindow.prototype.onAddFile = function () {
    var input = document.getElementById('modelWindowFileInput');
    if (input == null) {
        input = document.createElement('input');
        input.id = 'modelWindowFileInput';
        input.type = 'file';
        document.body.appendChild(input);
        input.onchange = this.onUploadFile.bind(this);
    }
    input.click();
};

ModelWindow.prototype.onUploadFile = function (event) {
    UploadUtils.upload('modelWindowFileInput', `${this.app.options.server}/api/Mesh/Add`, (e) => {
        document.getElementById('modelWindowFileInput').value = null;
        if (e.target.status === 200) {
            var obj = JSON.parse(e.target.responseText);
            if (obj.Code === 200) {
                this.updateModelList();
            }
            UI.msg(obj.Msg);
        } else {
            UI.msg('服务器错误！');
        }
    });
};

ModelWindow.prototype.onClickImage = function (imgs, index, btn) {
    var model = imgs.children[index].data;

    if (btn === 'edit') { // 编辑模型
        UI.msg('开始编辑模型');
        return;
    }

    if (btn === 'delete') { // 删除模型
        this.onDeleteModel(model);
        return;
    }

    this.onLoadModel(model);
};

/**
 * 添加模型到场景
 * @param {*} model 
 */
ModelWindow.prototype.onLoadModel = function (model) {
    var loader = new ModelLoader(this.app);

    loader.load(this.app.options.server + model.Url, {
        name: model.Name,
        type: model.Type
    }).then(obj => {
        if (!obj) {
            return;
        }
        obj.name = model.Name;

        Object.assign(obj.userData, model, {
            Server: true
        });

        var cmd = new AddObjectCommand(obj);
        cmd.execute();

        if (obj.userData.scripts) {
            obj.userData.scripts.forEach(n => {
                this.app.editor.scripts[n.uuid] = n;
            });
            this.app.call('scriptChanged', this);
        }
    });
};

/**
 * 删除模型
 * @param {*} model 
 */
ModelWindow.prototype.onDeleteModel = function (model) {
    var app = this.app;
    var server = app.options.server;

    UI.confirm('询问', '是否删除该模型？', (event, btn) => {
        if (btn === 'ok') {
            Ajax.post(`${server}/api/Mesh/Delete?ID=${model.ID}`, (json) => {
                var obj = JSON.parse(json);
                if (obj.Code === 200) {
                    this.updateModelList();
                }
                UI.msg(obj.Msg);
            });
        }
    });
};

export default ModelWindow;