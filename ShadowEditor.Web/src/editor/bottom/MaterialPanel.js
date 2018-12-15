import UI from '../../ui/UI';
import Ajax from '../../utils/Ajax';
import EditWindow from '../window/EditWindow';
import MaterialsSerializer from '../../serialization/material/MaterialsSerializer';

/**
 * 材质面板
 * @author tengge / https://github.com/tengge1
 */
function MaterialPanel(options) {
    UI.Control.call(this, options);
    this.app = options.app;

    this.firstShow = true;

    this.data = [];
};

MaterialPanel.prototype = Object.create(UI.Control.prototype);
MaterialPanel.prototype.constructor = MaterialPanel;

MaterialPanel.prototype.render = function () {
    this.app.on(`showBottomPanel.${this.id}`, this.onShowPanel.bind(this));
};

MaterialPanel.prototype.onShowPanel = function (tabName) {
    if (tabName !== 'material') {
        return;
    }

    if (this.firstShow) {
        this.firstShow = false;
        this.renderUI();
        this.update();
    }
};

MaterialPanel.prototype.renderUI = function () {
    var control = UI.create({
        xtype: 'div',
        parent: this.parent,
        style: {
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'row',
        },
        children: [{
            xtype: 'div',
            style: {
                width: '200px',
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box',
                borderRight: '1px solid #ddd',
            },
            children: [{
                xtype: 'div',
                style: {
                    display: 'flex'
                },
                children: [{
                    xtype: 'searchfield',
                    id: 'search',
                    scope: this.id,
                    showSearchButton: false,
                    showResetButton: true,
                    onInput: this.onSearch.bind(this)
                }]
            }, {
                xtype: 'div',
                style: {
                    height: 'calc(100% - 30px)'
                },
                children: [{
                    xtype: 'category',
                    id: 'category',
                    scope: this.id,
                    onChange: this.onSearch.bind(this)
                }]
            }]
        }, {
            xtype: 'div',
            style: {
                width: '100%',
                height: '100%',
                flex: 1,
                overflow: 'auto'
            },
            children: [{
                xtype: 'imagelist',
                id: 'images',
                scope: this.id,
                style: {
                    width: '100%',
                    maxHeight: '100%',
                },
                onClick: this.onClick.bind(this)
            }]
        }]
    });

    control.render();
};

MaterialPanel.prototype.update = function () {
    this.updateCategory();
    this.updateList();
};

MaterialPanel.prototype.updateCategory = function () {
    var category = UI.get('category', this.id);
    category.clear();

    Ajax.getJson(`/api/Category/List?type=Material`, obj => {
        category.options = {};
        obj.Data.forEach(n => {
            category.options[n.ID] = n.Name;
        });
        category.render();
    });
};

MaterialPanel.prototype.updateList = function () {
    var search = UI.get('search', this.id);

    Ajax.getJson(`/api/Material/List`, obj => {
        this.data = obj.Data;
        search.setValue('');
        this.onSearch();
    });
};

MaterialPanel.prototype.onSearch = function () {
    var search = UI.get('search', this.id);
    var category = UI.get('category', this.id);

    var name = search.getValue();
    var categories = category.getValue();

    var list = this.data;

    if (name.trim() !== '') {
        name = name.toLowerCase();

        list = list.filter(n => {
            return n.Name.indexOf(name) > -1 ||
                n.FirstPinYin.indexOf(name) > -1 ||
                n.TotalPinYin.indexOf(name) > -1;
        });
    }

    if (categories.length > 0) {
        list = list.filter(n => {
            return categories.indexOf(n.CategoryID) > -1;
        });
    }

    this.renderList(list);
};

MaterialPanel.prototype.renderList = function (list) {
    var images = UI.get('images', this.id);
    images.clear();

    images.children = list.map(n => {
        return {
            xtype: 'image',
            src: n.Thumbnail ? n.Thumbnail : null,
            title: n.Name,
            data: n,
            icon: 'icon-model',
            cornerText: n.Type,
            style: {
                backgroundColor: '#eee'
            }
        };
    });;

    images.render();
};

MaterialPanel.prototype.onClick = function (event, index, btn, control) {
    var data = control.children[index].data;

    if (btn === 'edit') {
        if (typeof (this.onEdit) === 'function') {
            this.onEdit(data);
        }
    } else if (btn === 'delete') {
        if (typeof (this.onDelete) === 'function') {
            this.onDelete(data);
        }
    } else {
        if (typeof (this.onClick) === 'function') {
            this.onSelectMaterial(data);
        }
    }
};

// ------------------------------------- 选择 ------------------------------------

MaterialPanel.prototype.onSelectMaterial = function (data) {
    Ajax.get(`/api/Material/Get?ID=${data.ID}`, result => {
        var obj = JSON.parse(result);
        if (obj.Code === 200) {
            var material = (new MaterialsSerializer()).fromJSON(obj.Data.Data);
            this.app.call(`selectMaterial`, this, material);
        }
    });
};


// ------------------------------- 编辑 ---------------------------------------

MaterialPanel.prototype.onEdit = function (data) {
    if (this.editWindow === undefined) {
        this.editWindow = new EditWindow({
            app: this.app,
            parent: document.body,
            type: 'Material',
            typeName: '材质',
            saveUrl: '/api/Material/Edit',
            callback: this.update.bind(this)
        });
        this.editWindow.render();
    }
    this.editWindow.setData(data);
    this.editWindow.show();
};

// -------------------------------- 删除 ----------------------------------------

MaterialPanel.prototype.onDelete = function (data) {
    UI.confirm('询问', `是否删除${data.Name}？`, (event, btn) => {
        if (btn === 'ok') {
            Ajax.post(`/api/Material/Delete?ID=${data.ID}`, json => {
                var obj = JSON.parse(json);
                if (obj.Code === 200) {
                    this.update();
                }
                UI.msg(obj.Msg);
            });
        }
    });
};

export default MaterialPanel;