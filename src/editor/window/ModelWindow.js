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
    var container = UI.create({
        xtype: 'window',
        id: 'modelWindow',
        parent: this.app.container,
        title: '模型列表',
        width: '800px',
        height: '500px',
        children: [{
            xtype: 'row',
            children: [{
                xtype: 'button',
                text: '添加',
                onClick: this.onAddFile.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'imagelist',
                id: 'modelWindowImages',
                onClick: this.onLoadModel.bind(this)
            }]
        }]
    });
    container.render();
};

ModelWindow.prototype.show = function () {
    var app = this.app;
    var server = app.options.server;

    UI.get('modelWindow').show();

    // 刷新模型列表
    Ajax.getJson(`${server}/api/Model/List`, (obj) => {
        this.models = obj.Data;

        var images = UI.get('modelWindowImages');
        images.clear();

        images.children = obj.Data.map((n) => {
            return {
                xtype: 'image',
                src: n.Image == null ? 'test/image/girl.jpg' : (server + n.Image),
                title: n.Name
            };
        });;

        images.render();
    });
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
        alert('上传成功！');
    });
};

ModelWindow.prototype.onLoadModel = function (event, index) {
    var model = this.models[index];

    var loader = new THREE.BinaryLoader();

    loader.load(this.app.options.server + model.Model, (geometry, materials) => {
        var mesh = new THREE.Mesh(geometry, materials);
        mesh.rotation.x = -Math.PI / 2;
        var cmd = new AddObjectCommand(mesh);
        cmd.execute();
    });
};

export default ModelWindow;