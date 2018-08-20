import UI from '../../ui/UI';

/**
 * 选项窗口
 * @param {*} options 
 */
function OptionsWindow(options) {
    UI.Control.call(this, options);
    this.app = options.app;
}

OptionsWindow.prototype = Object.create(UI.Control.prototype);
OptionsWindow.prototype.constructor = OptionsWindow;

OptionsWindow.prototype.render = function () {
    var _this = this;

    function changeTab(name) {
        if (name === '外观') {
            UI.get('surfaceTab').dom.classList.add('selected');
            UI.get('rendererTab').dom.classList.remove('selected');
            UI.get('surfacePanel').dom.style.display = '';
            UI.get('rendererPanel').dom.style.display = 'none';
        } else if (name === '渲染器') {
            UI.get('surfaceTab').dom.classList.remove('selected');
            UI.get('rendererTab').dom.classList.add('selected');
            UI.get('surfacePanel').dom.style.display = 'none';
            UI.get('rendererPanel').dom.style.display = '';
        }
    }

    var container = UI.create({
        xtype: 'window',
        id: 'optionsWindow',
        parent: this.app.container,
        title: '选项窗口',
        width: '700px',
        height: '500px',
        bodyStyle: {
            padding: 0
        },
        shade: false,
        children: [{
            xtype: 'div',
            cls: 'tabs',
            children: [{
                xtype: 'text',
                id: 'surfaceTab',
                text: '外观',
                cls: 'selected',
                onClick: () => {
                    changeTab('外观');
                }
            }, {
                xtype: 'text',
                id: 'rendererTab',
                text: '渲染器',
                onClick: () => {
                    changeTab('渲染器');
                }
            }]
        }, {
            xtype: 'div',
            id: 'surfacePanel',
            cls: 'TabPanel',
            children: [{
                xtype: 'row',
                id: 'themeRow',
                children: [{
                    xtype: 'label',
                    text: '主题'
                }, { // class
                    xtype: 'select',
                    options: {
                        'assets/css/light.css': '浅色',
                        'assets/css/dark.css': '深色'
                    },
                    // value: config.getKey('theme'),
                    style: {
                        width: '150px'
                    },
                    onChange: function () {

                    }
                }]
            }]
        }, {
            xtype: 'div',
            id: 'rendererPanel',
            cls: 'TabPanel',
            style: {
                display: 'none'
            },
            children: [

            ]
        }],
        buttons: [{
            xtype: 'button',
            text: '保存',
            onClick: () => {

            }
        }, {
            xtype: 'button',
            text: '取消',
            onClick: () => {

            }
        }]
    });
    container.render();
};

OptionsWindow.prototype.show = function () {
    UI.get('optionsWindow').show();
};

export default OptionsWindow;