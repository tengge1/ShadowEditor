import UI from '../../ui/UI';

/**
 * 贴图面板
 * @author tengge / https://github.com/tengge1
 */
function MapPanel(options) {
    UI.Control.call(this, options);
    this.app = options.app;

    this.firstShow = true;
};

MapPanel.prototype = Object.create(UI.Control.prototype);
MapPanel.prototype.constructor = MapPanel;

MapPanel.prototype.render = function () {
    this.app.on(`showBottomPanel.${this.id}`, this.onShowPanel.bind(this));
};

MapPanel.prototype.onShowPanel = function (tabName) {
    if (tabName !== 'map') {
        return;
    }

    if (this.firstShow) {
        this.firstShow = false;
        this.initMapPanel();
    }
};

MapPanel.prototype.initMapPanel = function () {
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
                flex: 1
            }
        }]
    });

    control.render();
};

MapPanel.prototype.onSearch = function (name) {
    debugger
};

export default MapPanel;