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

    this.app = options.app;
    this.type = options.type || 'scene'; // 类型类型：scene, model, map, texture, audio, particle
    this.title = options.title || '类别列表';
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
                text: '添加',
                onClick: this.addCategory.bind(this)
            }, {
                xtype: 'button',
                text: '编辑',
                onClick: this.editCategory.bind(this)
            }, {
                xtype: 'button',
                text: '删除',
                onClick: this.deleteCategory.bind(this)
            }]
        }, {
            xtype: 'datatable',
            id: 'list',
            scope: this.id,
            cols: [{
                field: 'Name',
                title: '名称'
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

    if (this.type === 'scene') {
        fetch(`/api/Category/List?Type=${this.type}`).then(response => {
            if (response.ok) {
                response.json().then(json => {
                    list.rows = json.Data;
                    list.reload();
                });
            }
        });
    }
};

CategoryListWindow.prototype.addCategory = function () {
    if (this.editWin === undefined) {
        this.editWin = new CategoryEditWindow({
            app: this.app,
            type: this.type,
            callback: this.update.bind(this)
        });
        this.editWin.render();
    }

    this.editWin.setData({
        ID: '',
        Name: ''
    });

    this.editWin.show();
};

CategoryListWindow.prototype.editCategory = function () {

};

CategoryListWindow.prototype.deleteCategory = function () {
    var list = UI.get('list', this.id);
    var selected = list.getSelected();

    if (selected == null) {
        UI.msg('请选择类别！');
        return;
    }

    UI.confirm('询问', '是否删除该类别？', (event, btn) => {
        if (btn === 'ok') {
            Ajax.post(`/api/Category/Delete?ID=${selected.ID}`, result => {
                var obj = JSON.parse(result);
                if (obj.Code === 200) {
                    this.update();
                }
                UI.msg('删除成功！');
            });
        }
    });
};

export default CategoryListWindow;