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

    var container = UI.create({
        xtype: 'window',
        id: 'optionsWindow',
        parent: this.app.container,
        title: '选项窗口',
        width: '700px',
        height: '500px',
        bodyStyle: {
            paddingTop: 0
        },
        shade: false,
        children: [{
            xtype: 'div',
            cls: 'tabs',
            children: [{
                xtype: 'text',
                id: 'objectTab',
                text: '外观',
                cls: 'selected',
                onClick: () => {

                }
            }, {
                xtype: 'text',
                id: 'geometryTab',
                text: '渲染器',
                onClick: () => {

                }
            }]
        }, {
            xtype: 'div',
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
            children: [

            ]
        }]
    });
    container.render();
};

OptionsWindow.prototype.show = function () {
    UI.get('optionsWindow').show();
};

export default OptionsWindow;