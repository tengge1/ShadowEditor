import UI from '../../ui/UI';
import Ajax from '../../utils/Ajax';
import ModelLoader from '../../loader/ModelLoader';
import AddObjectCommand from '../../command/AddObjectCommand';
import ModelEditWindow from './ModelEditWindow';

/**
 * 模型窗口
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function ModelWindow(options) {
    UI.ImageListWindow.call(this, options);
    this.app = options.app;

    this.title = '模型列表';
    this.imageIcon = 'icon-model';
    this.cornerTextField = 'Type';
    this.uploadUrl = `${this.app.options.server}/api/Mesh/Add`;
    this.preImageUrl = this.app.options.server;
    this.showUploadButton = true;
}

ModelWindow.prototype = Object.create(UI.ImageListWindow.prototype);
ModelWindow.prototype.constructor = ModelWindow;

ModelWindow.prototype.beforeUpdateList = function () {
    var server = this.app.options.server;

    return new Promise(resolve => {
        Ajax.getJson(`${server}/api/Mesh/List`, obj => {
            resolve(obj.Data);
        });
    });
};

ModelWindow.prototype.onUpload = function (obj) {
    this.update();
    UI.msg(obj.Msg);
};

ModelWindow.prototype.onClick = function (model) {
    var loader = new ModelLoader(this.app);

    var url = model.Url;

    if (model.Url.indexOf(';') > -1) { // 包含多个入口文件
        url = url.split(';').map(n => this.app.options.server + n);
    } else {
        url = this.app.options.server + model.Url;
    }

    loader.load(url, model).then(obj => {
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

ModelWindow.prototype.onEdit = function (data) {
    if (this.editWindow === undefined) {
        this.editWindow = new ModelEditWindow({
            app: this.app,
            parent: this.parent,
            callback: this.update.bind(this)
        });
        this.editWindow.render();
    }
    this.editWindow.setData(data);
    this.editWindow.show();
};

ModelWindow.prototype.onDelete = function (data) {
    var server = this.app.options.server;

    UI.confirm('询问', `是否删除模型${data.Name}？`, (event, btn) => {
        if (btn === 'ok') {
            Ajax.post(`${server}/api/Mesh/Delete?ID=${data.ID}`, json => {
                var obj = JSON.parse(json);
                if (obj.Code === 200) {
                    this.update();
                }
                UI.msg(obj.Msg);
            });
        }
    });
};

export default ModelWindow;