import UI from '../../ui/UI';
import Ajax from '../../utils/Ajax';

/**
 * 模型编辑窗口
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function ModelEditWindow(options) {
    UI.Control.call(this, options);
    this.app = options.app;
    this.callback = options.callback || null;
}

ModelEditWindow.prototype = Object.create(UI.Control.prototype);
ModelEditWindow.prototype.constructor = ModelEditWindow;

ModelEditWindow.prototype.render = function () {
    var container = UI.create({
        xtype: 'window',
        id: 'window',
        scope: this.id,
        parent: this.parent,
        title: '编辑模型',
        width: '320px',
        height: '280px',
        shade: true,
        children: [{
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '名称'
            }, {
                xtype: 'input',
                id: 'name',
                scope: this.id
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '缩略图'
            }, {
                xtype: 'imageuploader',
                id: 'image',
                scope: this.id,
                server: this.app.options.server
            }]
        }, {
            xtype: 'row',
            style: {
                justifyContent: 'center',
                marginTop: '8px'
            },
            children: [{
                xtype: 'button',
                text: '确定',
                style: {
                    margin: '0 8px'
                },
                onClick: this.save.bind(this)
            }, {
                xtype: 'button',
                text: '取消',
                style: {
                    margin: '0 8px'
                },
                onClick: this.hide.bind(this)
            }]
        }]
    });
    container.render();
};

ModelEditWindow.prototype.show = function () {
    UI.get('window', this.id).show();
};

ModelEditWindow.prototype.hide = function () {
    UI.get('window', this.id).hide();
};

ModelEditWindow.prototype.setData = function (data) {
    this.data = data;
    this.updateUI();
};

ModelEditWindow.prototype.updateUI = function () {
    if (this.data === undefined) {
        return;
    }

    var name = UI.get('name', this.id);
    var image = UI.get('image', this.id);
    name.setValue(this.data.Name);
    image.setValue(this.data.Thumbnail);
};

ModelEditWindow.prototype.save = function () {
    var server = this.app.options.server;

    if (this.data === undefined) {
        return;
    }

    var name = UI.get('name', this.id);
    var image = UI.get('image', this.id);

    Ajax.post(`${server}/api/Mesh/Edit`, {
        ID: this.data.ID,
        Name: name.getValue(),
        Image: image.getValue()
    }, json => {
        var obj = JSON.parse(json);
        UI.msg(obj.Msg);
        if (obj.Code === 200) {
            this.hide();
            if (typeof (this.callback) === 'function') {
                this.callback(obj);
            }
        }
    });
};

export default ModelEditWindow;