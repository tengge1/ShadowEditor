import UI from '../../ui/UI';
import Ajax from '../../utils/Ajax';
import AddObjectCommand from '../../command/AddObjectCommand';
import UploadUtils from '../../utils/UploadUtils';

/**
 * 场景窗口
 * @param {*} options 
 */
function SceneWindow(options) {
    UI.Control.call(this, options);
    this.app = options.app;
    this.models = [];
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
                onClick: this.onClickImage.bind(this)
            }]
        }]
    });
    container.render();
};

/**
 * 显示模型文件列表
 */
SceneWindow.prototype.show = function () {
    var app = this.app;
    var server = app.options.server;

    UI.get('sceneWindow').show();

    // 刷新模型列表
    Ajax.getJson(`${server}/api/Scene/List`, (obj) => {
        this.models = obj.Data;
        this.renderImages(this.models);
    });
};

SceneWindow.prototype.renderImages = function (models) {
    var images = UI.get('sceneWindowImages');
    images.clear();

    images.children = models.map((n) => {
        return {
            xtype: 'image',
            src: n.Image == null ? 'test/image/girl.jpg' : (server + n.Image),
            title: n.Name
        };
    });;

    images.render();
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

    var models = this.models.filter((n) => {
        return n.Name.indexOf(name) > -1;
    });
    this.renderImages(models);
};

SceneWindow.prototype.onClickImage = function (event, index, type) {
    var model = this.models[index];

    if (type === 'edit') { // 编辑模型
        UI.msg('开始编辑模型');
    } else if (type === 'delete') { // 删除模型
        UI.msg('开始删除模型');
    } else { // 加载模型
        var loader = new THREE.BinaryLoader();

        loader.load(this.app.options.server + model.Model, (geometry, materials) => {
            var mesh = new THREE.Mesh(geometry, materials);
            mesh.name = model.Name;
            mesh.rotation.x = -Math.PI / 2;
            var cmd = new AddObjectCommand(mesh);
            cmd.execute();
        });
    }
};

export default SceneWindow;