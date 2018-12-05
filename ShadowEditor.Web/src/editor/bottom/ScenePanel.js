import UI from '../../ui/UI';
import Ajax from '../../utils/Ajax';

/**
 * 场景面板
 * @author tengge / https://github.com/tengge1
 */
function ScenePanel(options) {
    UI.Control.call(this, options);
    this.app = options.app;

    this.firstShow = true;

    this.keywords = '';
    this.data = [];
};

ScenePanel.prototype = Object.create(UI.Control.prototype);
ScenePanel.prototype.constructor = ScenePanel;

ScenePanel.prototype.render = function () {
    this.app.on(`showBottomPanel.${this.id}`, this.onShowPanel.bind(this));
};

ScenePanel.prototype.onShowPanel = function (tabName) {
    if (tabName !== 'scene') {
        return;
    }

    if (this.firstShow) {
        this.firstShow = false;
        this.renderUI();
        this.update();
    }
};

ScenePanel.prototype.renderUI = function () {
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
                    xtype: 'iconbutton',
                    icon: 'icon-save',
                    style: {
                        padding: '2px'
                    },
                    onClick: this.onSave.bind(this)
                }, {
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

ScenePanel.prototype.update = function () {
    var server = this.app.options.server;

    this.keywords = '';

    Ajax.getJson(`${server}/api/Scene/List`, obj => {
        this.data = obj.Data;
        this.onSearch('');
    });
};

ScenePanel.prototype.onSearch = function (name) {
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

ScenePanel.prototype.renderList = function (list) {
    var images = UI.get('images', this.id);
    images.clear();

    images.children = list.map(n => {
        return {
            xtype: 'image',
            src: n.Thumbnail ? n.Thumbnail : null,
            title: n.Name,
            data: n,
            icon: 'icon-scenes',
            style: {
                backgroundColor: '#eee'
            }
        };
    });;

    images.render();
};

ScenePanel.prototype.onClick = function (data) {
    // if (typeof (this.onSelect) === 'function') {
    //     this.onSelect(data);
    // } else {
    //     UI.msg('请在材质控件中修改纹理。');
    // }
};

// ------------------------------- 保存场景 --------------------------------------

ScenePanel.prototype.onSave = function () {
    UI.msg('场景保存成功！');
};

export default ScenePanel;