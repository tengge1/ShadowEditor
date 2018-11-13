import { UI } from '../../third_party';
import Ajax from '../../utils/Ajax';

/**
 * 纹理编辑窗口
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function TextureEditWindow(options) {
    UI.Control.call(this, options);
    this.app = options.app;
    this.callback = options.callback || null;
}

TextureEditWindow.prototype = Object.create(UI.Control.prototype);
TextureEditWindow.prototype.constructor = TextureEditWindow;

TextureEditWindow.prototype.render = function () {
    var container = UI.create({
        xtype: 'window',
        id: 'window',
        scope: this.id,
        parent: this.parent,
        title: '编辑纹理',
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

TextureEditWindow.prototype.show = function () {
    UI.get('window', this.id).show();
};

TextureEditWindow.prototype.hide = function () {
    UI.get('window', this.id).hide();
};

TextureEditWindow.prototype.setData = function (data) {
    this.data = data;
    this.updateUI();
};

TextureEditWindow.prototype.updateUI = function () {
    if (this.data === undefined) {
        return;
    }

    var name = UI.get('name', this.id);
    name.setValue(this.data.Name);
};

TextureEditWindow.prototype.save = function () {
    var server = this.app.options.server;

    if (this.data === undefined) {
        return;
    }

    var name = UI.get('name', this.id);

    Ajax.post(`${server}/api/Texture/Edit`, {
        ID: this.data.ID,
        Name: name.getValue()
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

export default TextureEditWindow;