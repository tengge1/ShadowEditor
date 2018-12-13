import UI from '../../ui/UI';
import Ajax from '../../utils/Ajax';

/**
 * 类别编辑窗口
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function CategoryEditWindow(options = {}) {
    UI.Control.call(this, options);

    this.app = options.app;
    this.type = options.type || 'scene'; // 类型类型：scene, model, map, texture, audio, particle
}

CategoryEditWindow.prototype = Object.create(UI.Control.prototype);
CategoryEditWindow.prototype.constructor = CategoryEditWindow;

CategoryEditWindow.prototype.render = function () {
    var container = UI.create({
        xtype: 'window',
        id: 'window',
        scope: this.id,
        parent: this.parent,
        title: '编辑类别',
        width: '400px',
        height: '320px',
        shade: true,
        bodyStyle: {
            padding: 0
        },
        children: [{
            xtype: 'row',
            style: {
                padding: '2px',
                boxSizing: 'border-box'
            },
            children: [{
                xtype: 'button',
                text: '添加'
            }, {
                xtype: 'button',
                text: '编辑'
            }, {
                xtype: 'button',
                text: '删除'
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
                padding: '4px',
                boxSizing: 'border-box'
            }
        }]
    });
    container.render();
};

CategoryEditWindow.prototype.show = function () {
    UI.get('window', this.id).show();

    this.renderData();
};

CategoryEditWindow.prototype.hide = function () {
    UI.get('window', this.id).hide();
};

CategoryEditWindow.prototype.renderData = function () {
    var list = UI.get('list', this.id);

    list.clear();

    if (this.type === 'scene') {
        fetch(`/api/SceneCategory/List`).then(response => {
            if (response.ok) {
                response.json().then(json => {
                    list.rows = json.Data;
                    list.reload();
                });
            }
        });
    }
};

export default CategoryEditWindow;