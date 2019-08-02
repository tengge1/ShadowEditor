import UI from '../../ui/UI';
import CategoryListWindow from './category/CategoryListWindow';
import Ajax from '../../utils/Ajax';

/**
 * 编辑窗口
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function EditWindow(options = {}) {
    UI.Control.call(this, options);

    this.type = options.type || 'Scene'; // Scene, Mesh, Map, Texture, Material, Audio, Particle
    this.typeName = options.typeName || L_SCENE;
    this.saveUrl = options.saveUrl || `${app.options.server}/api/Scene/Edit`;
    this.callback = options.callback || null;
}

EditWindow.prototype = Object.create(UI.Control.prototype);
EditWindow.prototype.constructor = EditWindow;

EditWindow.prototype.render = function () {
    var container = UI.create({
        xtype: 'window',
        id: 'window',
        scope: this.id,
        parent: this.parent,
        title: `编辑${this.typeName}`,
        width: '320px',
        height: '280px',
        shade: true,
        children: [{
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_NAME
            }, {
                xtype: 'input',
                id: 'name',
                scope: this.id
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_TYPE
            }, {
                xtype: 'select',
                id: 'category',
                scope: this.id
            }, {
                xtype: 'button',
                id: 'btnEditType',
                scope: this.id,
                text: L_EDIT,
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
                text: L_THUMBNAIL
            }, {
                xtype: 'imageuploader',
                id: 'image',
                scope: this.id,
                server: app.options.server
            }]
        }, {
            xtype: 'row',
            style: {
                justifyContent: 'center',
                marginTop: '8px'
            },
            children: [{
                xtype: 'button',
                text: L_OK,
                style: {
                    margin: '0 8px'
                },
                onClick: this.save.bind(this)
            }, {
                xtype: 'button',
                text: L_CANCEL,
                style: {
                    margin: '0 8px'
                },
                onClick: this.hide.bind(this)
            }]
        }]
    });
    container.render();
};

EditWindow.prototype.show = function () {
    UI.get('window', this.id).show();
};

EditWindow.prototype.hide = function () {
    UI.get('window', this.id).hide();
};

EditWindow.prototype.setData = function (data) {
    this.data = data;
    this.updateUI();
};

EditWindow.prototype.updateUI = function () {
    if (this.data === undefined) {
        return;
    }

    var name = UI.get('name', this.id);
    var image = UI.get('image', this.id);
    name.setValue(this.data.Name);
    image.setValue(this.data.Thumbnail);

    var category = UI.get('category', this.id);
    category.clear();

    Ajax.getJson(`/api/Category/List?Type=${this.type}`, json => {
        var options = {
            '': L_NOT_SET
        };
        json.Data.forEach(n => {
            options[n.ID] = n.Name;
        });
        category.options = options;
        category.value = this.data.CategoryID;
        category.render();
    });
};

EditWindow.prototype.save = function () {
    if (!this.data) {
        return;
    }

    var name = UI.get('name', this.id);
    var category = UI.get('category', this.id);
    var image = UI.get('image', this.id);

    Ajax.post(this.saveUrl, {
        ID: this.data.ID,
        Name: name.getValue(),
        Category: category.getValue(),
        Image: image.getValue()
    }, json => {
        var obj = JSON.parse(json);
        UI.msg(obj.Msg);
        if (obj.Code === 200) {
            this.hide();
            this.callback && this.callback(obj);
        }
    });
};

// ----------------------------- 类别编辑 ----------------------------------------

EditWindow.prototype.onEditCategory = function () {
    if (this.categoryListWin === undefined) {
        this.categoryListWin = new CategoryListWindow({
            app: app,
            type: this.type,
            title: `${L_EDIT} ${this.typeName} ${L_CATEGORY}`,
        });
        this.categoryListWin.render();
    }

    this.categoryListWin.show();
};

export default EditWindow;