import UI from '../../ui/UI';
import CategoryListWindow from './category/CategoryListWindow';
import Ajax from '../../utils/Ajax';

/**
 * 场景编辑窗口
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function SceneEditWindow(options) {
    UI.Control.call(this, options);
    this.app = options.app;
    this.callback = options.callback || null;
}

SceneEditWindow.prototype = Object.create(UI.Control.prototype);
SceneEditWindow.prototype.constructor = SceneEditWindow;

SceneEditWindow.prototype.render = function () {
    var container = UI.create({
        xtype: 'window',
        id: 'window',
        scope: this.id,
        parent: this.parent,
        title: '编辑场景',
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
                text: '类别'
            }, {
                xtype: 'select',
                id: 'category',
                scope: this.id
            }, {
                xtype: 'button',
                id: 'btnEditType',
                scope: this.id,
                text: '编辑',
                style: {
                    position: 'absolute',
                    right: 0,
                    marginRight: '24px'
                },
                onClick: this.onEditCategory.bind(this)
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

SceneEditWindow.prototype.show = function () {
    UI.get('window', this.id).show();
};

SceneEditWindow.prototype.hide = function () {
    UI.get('window', this.id).hide();
};

SceneEditWindow.prototype.setData = function (data) {
    this.data = data;
    this.updateUI();
};

SceneEditWindow.prototype.updateUI = function () {
    if (this.data === undefined) {
        return;
    }

    var name = UI.get('name', this.id);
    var image = UI.get('image', this.id);
    name.setValue(this.data.Name);
    image.setValue(this.data.Thumbnail);

    // 更新场景类型
    var category = UI.get('category', this.id);

    category.clear();

    fetch(`/api/SceneCategory/List`).then(response => {
        if (response.ok) {
            response.json().then(json => {
                var options = {
                    '': '未设置'
                };
                json.Data.forEach(n => {
                    options[n.ID] = n.Name;
                });
                category.options = options;
                category.value = this.data.CategoryID;
                category.render();
            });
        }
    });
};

SceneEditWindow.prototype.save = function () {
    var server = this.app.options.server;

    if (this.data === undefined) {
        return;
    }

    var name = UI.get('name', this.id);
    var category = UI.get('category', this.id);
    var image = UI.get('image', this.id);

    Ajax.post(`${server}/api/Scene/Edit`, {
        ID: this.data.ID,
        Name: name.getValue(),
        Category: category.getValue(),
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

// ----------------------------- 类别编辑 ----------------------------------------

SceneEditWindow.prototype.onEditCategory = function () {
    if (this.categoryListWin === undefined) {
        this.categoryListWin = new CategoryListWindow({
            app: this.app,
            type: 'scene'
        });
        this.categoryListWin.render();
    }

    this.categoryListWin.show();
};

export default SceneEditWindow;