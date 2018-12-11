import UI from '../../ui/UI';
import Ajax from '../../utils/Ajax';
import MaterialsSerializer from '../../serialization/material/MaterialsSerializer';

/**
 * 材质面板
 * @author tengge / https://github.com/tengge1
 */
function MaterialPanel(options) {
    UI.Control.call(this, options);
    this.app = options.app;

    this.firstShow = true;

    this.keywords = '';
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
                    options: {
                        category1: '分类1',
                        category2: '分类2',
                        category3: '分类3',
                        category4: '分类4',
                        category5: '分类5',
                        category6: '分类6',
                        category7: '分类7',
                        category8: '分类8',
                    }
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
                    height: '100%',
                },
                onClick: this.onClick.bind(this)
            }]
        }]
    });

    control.render();
};

MaterialPanel.prototype.update = function () {
    var server = this.app.options.server;

    this.keywords = '';

    Ajax.getJson(`${server}/api/Material/List`, obj => {
        this.data = obj.Data;
        this.onSearch('');
    });
};

MaterialPanel.prototype.onSearch = function (name) {
    if (name.trim() === '') {
        this.renderList(this.data);
        return;
    }

    name = name.toLowerCase();

    var list = this.data.filter(n => {
        return n.Name.indexOf(name) > -1 ||
            n.FirstPinYin.indexOf(name) > -1 ||
            n.TotalPinYin.indexOf(name) > -1;
    });

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
        this.onEdit(data);
    } else if (btn === 'delete') {
        this.onDelete(data);
    } else {
        this.onSelect(data);
    }
};

MaterialPanel.prototype.onSelect = function (data) {
    Ajax.get(`/api/Material/Get?ID=${data.ID}`, result => {
        var obj = JSON.parse(result);
        if (obj.Code === 200) {
            var material = (new MaterialsSerializer()).fromJSON(obj.Data.Data);
            this.app.call(`selectMaterial`, this, material);
        }
    });
};

MaterialPanel.prototype.onEdit = function (data) {
    UI.msg('编辑材质');
};

MaterialPanel.prototype.onDelete = function (data) {
    UI.msg('删除材质');
};

export default MaterialPanel;