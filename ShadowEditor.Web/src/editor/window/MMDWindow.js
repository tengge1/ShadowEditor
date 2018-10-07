import UI from '../../ui/UI';
import Ajax from '../../utils/Ajax';
import ModelLoader from '../../loader/ModelLoader';
import AddObjectCommand from '../../command/AddObjectCommand';
import MMDEditWindow from './MMDEditWindow';

/**
 * MMD窗口
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function MMDWindow(options) {
    UI.ImageListWindow.call(this, options);
    this.app = options.app;

    this.title = 'MMD资源列表';
    this.imageIcon = 'icon-model';
    this.cornerTextField = 'Type';
    this.uploadUrl = `${this.app.options.server}/api/MMD/Add`;
    this.preImageUrl = this.app.options.server;
    this.showUploadButton = true;

    this.beforeUpdateList = this.beforeUpdateMMDList;
    this.onUpload = this.onUploadMMD;
    this.onClick = this.onClickMMD;
    this.onEdit = this.onEditMMD;
    this.onDelete = this.onDeleteMMD;

    this.onSelect = options.onSelect || null;
}

MMDWindow.prototype = Object.create(UI.ImageListWindow.prototype);
MMDWindow.prototype.constructor = MMDWindow;

MMDWindow.prototype.beforeUpdateMMDList = function () {
    var server = this.app.options.server;

    return new Promise(resolve => {
        Ajax.getJson(`${server}/api/MMD/List`, obj => {
            resolve(obj.Data);
        });
    });
};

MMDWindow.prototype.onUploadMMD = function (obj) {
    this.update();
    UI.msg(obj.Msg);
};

MMDWindow.prototype.onClickMMD = function (model) {
    if (model.Type === 'vmd') {
        if (this.onSelect) {
            this.onSelect(model);
        } else {
            UI.msg(`无法将动画文件添加到场景。`);
        }
        return;
    }

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

        this.hide();
    });
};

MMDWindow.prototype.onEditMMD = function (data) {
    if (this.editWindow === undefined) {
        this.editWindow = new MMDEditWindow({
            app: this.app,
            parent: this.parent,
            callback: this.update.bind(this)
        });
        this.editWindow.render();
    }
    this.editWindow.setData(data);
    this.editWindow.show();
};

MMDWindow.prototype.onDeleteMMD = function (data) {
    var server = this.app.options.server;

    UI.confirm('询问', `是否删除MMD资源${data.Name}？`, (event, btn) => {
        if (btn === 'ok') {
            Ajax.post(`${server}/api/MMD/Delete?ID=${data.ID}`, json => {
                var obj = JSON.parse(json);
                if (obj.Code === 200) {
                    this.update();
                }
                UI.msg(obj.Msg);
            });
        }
    });
};

export default MMDWindow;