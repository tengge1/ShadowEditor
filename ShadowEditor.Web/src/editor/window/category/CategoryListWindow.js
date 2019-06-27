import UI from '../../../ui/UI';
import CategoryEditWindow from './CategoryEditWindow';
import Ajax from '../../../utils/Ajax';

/**
 * 类别列表窗口
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function CategoryListWindow(options = {}) {
    UI.Control.call(this, options);

    app = options.app;
    this.type = options.type || 'Scene'; // 类型类型：Scene, Model, Map, Texture, Audio, Particle
    this.title = options.title || L_CATEGORY_LIST;
}

CategoryListWindow.prototype = Object.create(UI.Control.prototype);
CategoryListWindow.prototype.constructor = CategoryListWindow;

CategoryListWindow.prototype.render = function () {
    var container = UI.create({
        xtype: 'window',
        id: 'window',
        scope: this.id,
        parent: this.parent,
        title: this.title,
        width: '500px',
        height: '400px',
        shade: true,
        bodyStyle: {
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            border: 'none'
        },
        children: [{
            xtype: 'row',
            style: {
                position: 'sticky',
                top: 0,
                padding: '2px',
                boxSizing: 'border-box',
                backgroundColor: '#eee',
                zIndex: 500
            },
            children: [{
                xtype: 'button',
                text: L_ADD,
                onClick: this.addCategory.bind(this)
            }, {
                xtype: 'button',
                text: L_EDIT,
                onClick: this.editCategory.bind(this)
            }, {
                xtype: 'button',
                text: L_DELETE,
                onClick: this.deleteCategory.bind(this)
            }]
        }, {
            xtype: 'datatable',
            id: 'list',
            scope: this.id,
            cols: [{
                field: 'Name',
                title: L_NAME
            }],
            style: {
                width: '100%',
                height: 'calc(100% - 35px)',
                padding: '0',
                boxSizing: 'border-box'
            }
        }]
    });
    container.render();
};

CategoryListWindow.prototype.show = function () {
    UI.get('window', this.id).show();

    this.update();
};

CategoryListWindow.prototype.hide = function () {
    UI.get('window', this.id).hide();
};

CategoryListWindow.prototype.update = function () {
    var list = UI.get('list', this.id);

    list.clear();

    Ajax.getJson(`/api/Category/List?Type=${this.type}`, json => {
        list.rows = json.Data;
        list.reload();
    });
};

CategoryListWindow.prototype.createEditWin = function () {
    if (this.editWin === undefined) {
        this.editWin = new CategoryEditWindow({
            app: app,
            type: this.type,
            callback: this.update.bind(this)
        });
        this.editWin.render();
    }
};

CategoryListWindow.prototype.addCategory = function () {
    this.createEditWin();

    this.editWin.setData({
        ID: '',
        Name: ''
    });

    this.editWin.show();
};

CategoryListWindow.prototype.editCategory = function () {
    this.createEditWin();

    var list = UI.get('list', this.id);
    var selected = list.getSelected();

    if (selected == null) {
        UI.msg(L_PLEASE_SELECT_CATEGORY);
        return;
    }

    this.editWin.setData({
        ID: selected.ID,
        Name: selected.Name
    });

    this.editWin.show();
};

CategoryListWindow.prototype.deleteCategory = function () {
    var list = UI.get('list', this.id);
    var selected = list.getSelected();

    if (selected == null) {
        UI.msg(L_PLEASE_SELECT_CATEGORY);
        return;
    }

    UI.confirm(L_CONFIRM, `${L_DELETE} ${selected.Name}?`, (event, btn) => {
        if (btn === 'ok') {
            Ajax.post(`/api/Category/Delete?ID=${selected.ID}`, result => {
                var obj = JSON.parse(result);
                if (obj.Code === 200) {
                    this.update();
                }
                UI.msg(L_DELETE_SUCCESS);
            });
        }
    });
};

export default CategoryListWindow;