import UI from '../../ui/UI';
import Ajax from '../../utils/Ajax';
import AddObjectCommand from '../../command/AddObjectCommand';
import UploadUtils from '../../utils/UploadUtils';

/**
 * 模型窗口
 * @param {*} options 
 */
function ModelWindow(options) {
    UI.Control.call(this, options);
    this.app = options.app;
    this.models = [];
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
    var app = this.app;
    var server = app.options.server;

    UI.get('modelWindow').show();

    // 刷新模型列表
    Ajax.getJson(`${server}/api/Mesh/List`, (obj) => {
        this.models = obj.Data;
        this.renderImages(this.models);
    });
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
            style: {
                backgroundColor: '#eee'
            }
        };
    });;

    images.render();
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

    var models = this.models.filter((n) => {
        return n.Name.indexOf(name) > -1;
    });
    this.renderImages(models);
};

ModelWindow.prototype.onAddFile = function () {
    var input = document.getElementById('modelWindowInput');
    if (input == null) {
        input = document.createElement('input');
        input.id = 'modelWindowInput';
        input.type = 'file';
        document.body.appendChild(input);
        input.onchange = this.onUploadFile.bind(this);
    }
    input.click();
};

ModelWindow.prototype.onUploadFile = function (event) {
    UploadUtils.upload('modelWindowInput', `${this.app.options.server}/api/Model/Add`, function () {
        UI.msg('上传成功！');
    });
};

ModelWindow.prototype.onClickImage = function (imgs, index, btn) {
    var model = imgs.children[index].data;

    if (btn === 'edit') { // 编辑模型
        UI.msg('开始编辑模型');
    } else if (btn === 'delete') { // 删除模型
        UI.msg('开始删除模型');
    } else { // 加载模型
        var loader = new THREE.BinaryLoader();

        loader.load(this.app.options.server + model.Model, (geometry, materials) => {
            var mesh = new THREE.Mesh(geometry, materials);
            mesh.name = model.Name;
            mesh.rotation.x = -Math.PI / 2;

            // 写入基础信息，便于保存在mongo中
            Object.assign(mesh.userData, model, {
                Type: 'Model',
                Format: 'Binary'
            });

            var cmd = new AddObjectCommand(mesh);
            cmd.execute();
        });
    }
};

export default ModelWindow;